#!/usr/bin/env node

/**
 * sync-wiki — Wiki staleness check + backlink index generator
 *
 * Two jobs:
 *   1. Staleness: parse the `evidence: path@vN, ...` field on every
 *      design/WIKI/**.md header and compare against the current version
 *      of each source artifact. Report wiki pages whose source has advanced.
 *   2. Backlinks: scan all markdown files under design/ for [[wikilinks]]
 *      and stable ID references (DS-NNN, BR-NN, GP-NNN, P-/OV-/DE-, persona
 *      IDs). Emit design/WIKI/.backlinks.json keyed by target.
 *
 * Read-only for artifacts. Writes only design/WIKI/.backlinks.json.
 *
 * Exit codes: 0 if no stale wiki pages, 1 if stale pages found.
 *
 * Usage:
 *   node design/scripts/sync-wiki.js
 */

import fs from 'fs';
import path from 'path';
import { parseVersionHeader } from './modes.js';

const projectRoot = path.resolve(import.meta.dirname, '../..');
const WIKI_DIR = path.join(projectRoot, 'design/WIKI');
const DESIGN_DIR = path.join(projectRoot, 'design');
const BACKLINKS_PATH = path.join(WIKI_DIR, '.backlinks.json');

const STABLE_ID_PATTERN = /\b(DS-\d+|BR-\d+|GP-\d+|P-\d+|OV-\d+|DE-\d+|PER-\d+|RF-\d+|PA-\d+)\b/g;
const WIKILINK_PATTERN = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
// Match only explicit retirement markers:
//   - YAML frontmatter `status: retired` (first block at top of file)
//   - Headings ending with a `[retired]` bracket
const HEADING_RETIRED = /^#{1,6}\s.*\[retired\]\s*$/m;

function hasRetiredFrontmatter(content) {
  if (!content.startsWith('---')) return false;
  const end = content.indexOf('\n---', 3);
  if (end < 0) return false;
  const block = content.slice(0, end);
  return /\bstatus:\s*retired\b/.test(block);
}

let staleCount = 0;

// --- Helpers ---

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function walkMd(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkMd(full, out);
    } else if (entry.name.endsWith('.md') && entry.name !== '_upstream.md') {
      out.push(full);
    }
  }
  return out;
}

function getFileVersion(filePath) {
  const content = readFile(filePath);
  if (!content) return null;
  const header = parseVersionHeader(content.split('\n')[0]);
  return header?.version ?? null;
}

/**
 * Parse the evidence field of a version header into { path, version } pairs.
 * Evidence format: "path@v2, other-path@v1" or "path@v2".
 */
function parseEvidence(evidenceStr) {
  if (!evidenceStr) return [];
  return evidenceStr.split(',').map(entry => {
    const trimmed = entry.trim();
    const match = trimmed.match(/^(.+?)@v(\d+)$/);
    if (!match) return null;
    return { path: match[1].trim(), version: parseInt(match[2], 10) };
  }).filter(Boolean);
}

// --- Pass 1: wiki staleness ---

function checkWikiStaleness() {
  console.log('\n=== Wiki staleness check ===');

  if (!fs.existsSync(WIKI_DIR)) {
    console.log('· No design/WIKI/ directory yet — run design-query Phase A to bootstrap');
    return;
  }

  const wikiFiles = walkMd(WIKI_DIR);
  if (wikiFiles.length === 0) {
    console.log('· design/WIKI/ exists but has no pages — run design-query Phase A to bootstrap');
    return;
  }

  const stalePages = [];
  const untrackedPages = [];

  for (const wikiFile of wikiFiles) {
    const rel = path.relative(projectRoot, wikiFile);
    const content = readFile(wikiFile);
    if (!content) continue;

    const header = parseVersionHeader(content.split('\n')[0]);
    if (!header) {
      untrackedPages.push(rel);
      continue;
    }

    const evidence = parseEvidence(header.evidence);
    if (evidence.length === 0) {
      // Wiki page has a version header but no evidence field — can't check
      continue;
    }

    const stale = [];
    for (const { path: srcRel, version: recorded } of evidence) {
      const srcAbs = path.resolve(projectRoot, srcRel);
      const current = getFileVersion(srcAbs);
      if (current !== null && current > recorded) {
        stale.push({ source: srcRel, recorded, current });
      }
    }
    if (stale.length > 0) {
      stalePages.push({ wiki: rel, stale });
    }
  }

  if (untrackedPages.length > 0) {
    for (const p of untrackedPages) {
      console.log(`· ${p} — no version header (cannot check staleness)`);
    }
  }

  if (stalePages.length === 0) {
    console.log(`✓ All ${wikiFiles.length} wiki pages are current with their source artifacts`);
    return;
  }

  for (const { wiki, stale } of stalePages) {
    const detail = stale
      .map(s => `${s.source}: wiki@v${s.recorded}, source@v${s.current}`)
      .join('; ');
    console.log(`⚠ ${wiki} STALE (${detail})`);
    staleCount++;
  }
}

// --- Pass 2: backlink index ---

function buildBacklinks() {
  console.log('\n=== Building backlink index ===');

  const allFiles = walkMd(DESIGN_DIR);
  // Index: target → [{ source: relPath, kind: 'wikilink'|'id' }]
  const backlinks = {};
  const retired = new Set();

  function addLink(target, source, kind) {
    if (!backlinks[target]) backlinks[target] = [];
    // Dedupe
    if (!backlinks[target].some(b => b.source === source && b.kind === kind)) {
      backlinks[target].push({ source, kind });
    }
  }

  for (const file of allFiles) {
    const rel = path.relative(projectRoot, file);
    const content = readFile(file);
    if (!content) continue;

    // Note retirement status only when marked explicitly (frontmatter or heading)
    if (hasRetiredFrontmatter(content) || HEADING_RETIRED.test(content)) {
      retired.add(rel);
    }

    // Wikilinks
    let m;
    WIKILINK_PATTERN.lastIndex = 0;
    while ((m = WIKILINK_PATTERN.exec(content)) !== null) {
      addLink(m[1].trim(), rel, 'wikilink');
    }

    // Stable IDs
    STABLE_ID_PATTERN.lastIndex = 0;
    while ((m = STABLE_ID_PATTERN.exec(content)) !== null) {
      addLink(m[1], rel, 'id');
    }
  }

  // Sort backlinks deterministically per target
  for (const target of Object.keys(backlinks)) {
    backlinks[target].sort((a, b) => a.source.localeCompare(b.source) || a.kind.localeCompare(b.kind));
  }

  const payload = {
    generated: new Date().toISOString(),
    generator: 'design/scripts/sync-wiki.js',
    targets: Object.keys(backlinks).length,
    retired: [...retired].sort(),
    backlinks,
  };

  if (!fs.existsSync(WIKI_DIR)) {
    fs.mkdirSync(WIKI_DIR, { recursive: true });
  }
  fs.writeFileSync(BACKLINKS_PATH, JSON.stringify(payload, null, 2) + '\n');
  const relOut = path.relative(projectRoot, BACKLINKS_PATH);
  console.log(`✓ Wrote ${relOut} — ${payload.targets} targets, ${retired.size} retired artifacts`);
}

// --- Main ---

console.log(`Wiki Sync Report (${new Date().toISOString().slice(0, 10)})`);
console.log('─'.repeat(60));

checkWikiStaleness();
buildBacklinks();

console.log('');
if (staleCount > 0) {
  console.log(`${staleCount} stale wiki page(s). Run design-query to refresh.`);
  process.exit(1);
}
console.log('Wiki in sync.');
process.exit(0);
