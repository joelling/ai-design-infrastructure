#!/usr/bin/env node

/**
 * sync-retirement — Validates retirement-pointer integrity.
 *
 * Every retired artifact should declare why via one of:
 *   - superseded_by: NEW-ID                 (on retired artifact)
 *   - superseded_by: [NEW-A, NEW-B]         (split — one becomes many)
 *   - merged_into: SURVIVOR-ID              (merge — this one folded in)
 *   - supersedes: OLD-ID                    (on the new artifact, optional reverse)
 *
 * Validates:
 *   1. Every retired artifact carries at least one pointer (warn if missing)
 *   2. Every pointer target ID exists somewhere in the corpus (error if not)
 *   3. Reverse pointers are consistent — if A.supersedes = B, then
 *      B.superseded_by should include A (warn if missing)
 *
 * Read-only. Exit 0 if no errors, 1 if any pointer is broken.
 *
 * Usage:
 *   node design/scripts/sync-retirement.js
 */

import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '../..');
const DESIGN_DIR = path.join(projectRoot, 'design');

// Framework / infrastructure subtrees that contain docs and templates
// rather than project artifacts. Retirement markers in these are illustrative,
// not real, so they are excluded from validation.
const EXCLUDE_DIRS = ['design/process', 'design/templates', 'design/scripts', 'design/viewer'];

const STABLE_ID = /\b([A-Z]+-\d+)\b/g;
const STABLE_ID_PREFIXES = new Set(['DS', 'BR', 'GP', 'P', 'OV', 'DE', 'PER', 'RF', 'PA']);
const RETIRED_HEADING = /\[retired\]\s*$/i;
const RETIRED_ROW = /\b(retired|deprecated)\b/i;
const POINTER_KEYS = ['superseded_by', 'merged_into', 'supersedes'];
// Inline form: `superseded_by: NEW-ID` or `superseded_by: [A, B]` or `superseded_by:` (YAML list follows)
const POINTER_LINE = new RegExp(
  String.raw`(?:^|\s)(${POINTER_KEYS.join('|')}):\s*(\[[^\]]*\]|[A-Z][A-Z0-9_-]*-\d+(?:\s*,\s*[A-Z][A-Z0-9_-]*-\d+)*)?`,
);

let errorCount = 0;
let warningCount = 0;

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
  const relDir = path.relative(projectRoot, dir);
  if (EXCLUDE_DIRS.some(excluded => relDir === excluded || relDir.startsWith(excluded + path.sep))) {
    return out;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkMd(full, out);
    else if (entry.name.endsWith('.md') && entry.name !== '_upstream.md') out.push(full);
  }
  return out;
}

function isStableId(id) {
  const prefix = id.split('-')[0];
  return STABLE_ID_PREFIXES.has(prefix);
}

function extractIdsFrom(str) {
  if (!str) return [];
  const ids = [];
  for (const m of str.matchAll(STABLE_ID)) {
    if (isStableId(m[1])) ids.push(m[1]);
  }
  return ids;
}

function getFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('\n---', 3);
  if (end < 0) return null;
  return content.slice(4, end);
}

/**
 * Scan a block of text for pointer declarations. Returns a map
 * { superseded_by: [ids], merged_into: [ids], supersedes: [ids] }.
 * Handles inline form and YAML continuation lists (`- ID` on subsequent lines).
 */
function extractPointers(block) {
  const result = { superseded_by: [], merged_into: [], supersedes: [] };
  if (!block) return result;
  const lines = block.split('\n');
  let currentKey = null;
  let currentKeyIndent = -1;

  for (const line of lines) {
    const m = line.match(/^(\s*)(superseded_by|merged_into|supersedes):\s*(.*)$/);
    if (m) {
      currentKey = m[2];
      currentKeyIndent = m[1].length;
      const value = m[3].trim();
      if (value) {
        const ids = extractIdsFrom(value);
        result[currentKey].push(...ids);
        // If it's a bracketed list or a single inline ID, the key declaration is complete
        currentKey = null;
      }
      continue;
    }
    if (currentKey) {
      const bullet = line.match(/^(\s*)-\s*([A-Z][A-Z0-9_-]*-\d+)/);
      if (bullet && bullet[1].length > currentKeyIndent) {
        result[currentKey].push(bullet[2]);
        continue;
      }
      // Anything else terminates the YAML list
      currentKey = null;
    }
  }
  return result;
}

// --- Pass 1: scan corpus, collect all known IDs and all pointer declarations ---

const allKnownIds = new Set();
const allArtifacts = []; // { id, location, retired, pointers, scope }

function recordArtifact(entry) {
  if (entry.id) allKnownIds.add(entry.id);
  allArtifacts.push(entry);
}

const files = walkMd(DESIGN_DIR);

for (const filePath of files) {
  const rel = path.relative(projectRoot, filePath);
  const content = readFile(filePath);
  if (!content) continue;
  const fm = getFrontmatter(content);
  const fmRetired = fm && /^status:\s*retired\b/m.test(fm);
  const fmPointers = extractPointers(fm);

  // 1a. File-level: try to derive a primary ID from the filename
  const filenameIdMatch = path.basename(rel).match(/^([A-Z][A-Z0-9_-]*-\d+)_/);
  const filenameId = filenameIdMatch && isStableId(filenameIdMatch[1]) ? filenameIdMatch[1] : null;

  if (fmRetired) {
    recordArtifact({
      id: filenameId,
      location: rel,
      retired: true,
      kind: 'file',
      pointers: fmPointers,
    });
  } else if (fm && (fmPointers.supersedes.length || fmPointers.superseded_by.length || fmPointers.merged_into.length)) {
    // Active file declaring pointers (e.g. a successor with `supersedes:`)
    recordArtifact({
      id: filenameId,
      location: rel,
      retired: false,
      kind: 'file',
      pointers: fmPointers,
    });
  } else if (filenameId) {
    allKnownIds.add(filenameId);
  }

  // 1b. Heading-level retirement scan + heading-block pointers
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const headingMatch = line.match(/^(#{1,6})\s+([A-Z][A-Z0-9_-]*-\d+)\b/);
    if (!headingMatch) continue;
    const headingLevel = headingMatch[1].length;
    const headingId = headingMatch[2];
    if (!isStableId(headingId)) continue;
    allKnownIds.add(headingId);

    // Capture the block until the next heading at same or higher level
    const blockLines = [];
    for (let j = i + 1; j < lines.length; j++) {
      const next = lines[j].match(/^(#{1,6})\s/);
      if (next && next[1].length <= headingLevel) break;
      blockLines.push(lines[j]);
    }
    const blockText = blockLines.join('\n');
    const headingRetired = RETIRED_HEADING.test(line);
    const blockPointers = extractPointers(blockText);
    const hasAnyPointer = POINTER_KEYS.some(k => blockPointers[k].length > 0);

    if (headingRetired || hasAnyPointer) {
      recordArtifact({
        id: headingId,
        location: `${rel}:${i + 1}`,
        retired: headingRetired,
        kind: 'heading',
        pointers: blockPointers,
      });
    }
  }

  // 1c. Row-level retirement scan (one table row per entry)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith('|')) continue;
    const ids = extractIdsFrom(line);
    if (ids.length === 0) continue;
    // Always register the leading ID as known
    allKnownIds.add(ids[0]);
    if (!RETIRED_ROW.test(line)) continue;
    // Skip header-ish rows that just describe the convention
    if (/Artifact|Convention|Example/i.test(line) && line.split('|').length > 4) continue;
    const rowPointers = extractPointers(line);
    recordArtifact({
      id: ids[0],
      location: `${rel}:${i + 1}`,
      retired: true,
      kind: 'row',
      pointers: rowPointers,
    });
  }
}

// --- Pass 2: validate ---

console.log('=== Retirement Pointer Validation ===');

// 2a. Every retired artifact should have a pointer
const retired = allArtifacts.filter(a => a.retired);
const missingPointer = [];
const brokenPointers = [];
const reverseIssues = [];

// Build a reverse-lookup: for every (key, source) pointer declaration,
// remember the targets. Then check that the target artifact lists the
// source under the appropriate reverse key.
const declaredBy = {}; // targetId -> [{ kind, sourceId, sourceLocation }]

for (const art of allArtifacts) {
  for (const key of POINTER_KEYS) {
    for (const target of art.pointers[key]) {
      if (!declaredBy[target]) declaredBy[target] = [];
      declaredBy[target].push({ key, sourceId: art.id, sourceLocation: art.location });
    }
  }
}

for (const art of retired) {
  const pointerCount = POINTER_KEYS.reduce((n, k) => n + art.pointers[k].length, 0);
  if (pointerCount === 0) {
    missingPointer.push(art);
    continue;
  }
  for (const key of POINTER_KEYS) {
    for (const target of art.pointers[key]) {
      if (!allKnownIds.has(target)) {
        brokenPointers.push({ source: art, key, target });
      }
    }
  }
}

// 2c. Reverse pointer consistency
//   superseded_by on A → target should declare supersedes back to A
//   merged_into on A → target should not need to declare anything (informational)
//   supersedes on B → each old ID should declare superseded_by back to B
for (const art of allArtifacts) {
  if (art.id === null) continue;

  for (const target of art.pointers.superseded_by) {
    const inverse = allArtifacts.find(a => a.id === target && a.pointers.supersedes.includes(art.id));
    if (!inverse) {
      reverseIssues.push({
        source: art, key: 'superseded_by', target,
        expectedReverse: 'supersedes',
      });
    }
  }
  for (const target of art.pointers.supersedes) {
    const inverse = allArtifacts.find(a => a.id === target && a.pointers.superseded_by.includes(art.id));
    if (!inverse) {
      reverseIssues.push({
        source: art, key: 'supersedes', target,
        expectedReverse: 'superseded_by',
      });
    }
  }
}

// --- Report ---

console.log(`\nCorpus: ${files.length} markdown files | ${allKnownIds.size} known IDs | ${allArtifacts.length} retirement-relevant artifacts`);
console.log(`Retired artifacts: ${retired.length}`);

console.log('\n--- 1. Pointer presence ---');
if (missingPointer.length === 0) {
  console.log('✓ Every retired artifact declares at least one pointer');
} else {
  for (const art of missingPointer) {
    console.log(`⚠ ${art.id ?? '(unidentified)'} @ ${art.location} — retired but no superseded_by / merged_into pointer`);
    warningCount++;
  }
}

console.log('\n--- 2. Pointer resolution ---');
if (brokenPointers.length === 0) {
  console.log('✓ All pointer targets resolve to known IDs');
} else {
  for (const { source, key, target } of brokenPointers) {
    console.log(`✗ ${source.id ?? '(unidentified)'} @ ${source.location} — ${key}: ${target} not found in corpus`);
    errorCount++;
  }
}

console.log('\n--- 3. Reverse pointer consistency ---');
if (reverseIssues.length === 0) {
  console.log('✓ All bidirectional pointers are consistent');
} else {
  for (const { source, key, target, expectedReverse } of reverseIssues) {
    console.log(`⚠ ${source.id ?? '(unidentified)'} @ ${source.location} — declares ${key}: ${target}, but ${target} does not declare ${expectedReverse}: ${source.id}`);
    warningCount++;
  }
}

if (retired.length > 0) {
  console.log('\n--- 4. Retired artifact summary ---');
  const grouped = {};
  for (const art of retired) {
    const id = art.id ?? '(unidentified)';
    if (!grouped[id]) grouped[id] = [];
    grouped[id].push(art);
  }
  for (const id of Object.keys(grouped).sort()) {
    const arts = grouped[id];
    const pointerSummary = arts
      .flatMap(a => POINTER_KEYS.flatMap(k => a.pointers[k].map(t => `${k}: ${t}`)))
      .filter((v, i, all) => all.indexOf(v) === i);
    const ptrStr = pointerSummary.length ? pointerSummary.join('; ') : '(no pointer)';
    const locs = arts.map(a => a.location).join(', ');
    console.log(`  ${id.padEnd(8)} → ${ptrStr.padEnd(40)} [${locs}]`);
  }
}

console.log(`\n=== Summary: ${errorCount} errors, ${warningCount} warnings ===`);
process.exit(errorCount > 0 ? 1 : 0);
