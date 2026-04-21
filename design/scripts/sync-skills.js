#!/usr/bin/env node
//
// sync-skills.js — Mirror-parity enforcement across AI-assistant harnesses.
//
// Reads design/process/_propagation.yaml and validates that every skill
// enumerated by the spec exists in every registered harness (with matching
// frontmatter name) and — for non-Claude harnesses — carries an SSOT pointer
// comment that resolves to an existing chapter file.
//
// The authoritative skill inventory is derived from _propagation.yaml as the
// union of:
//   - chapters.map values that are plain mode names (not __index__/__umbrella__)
//   - umbrellas[*].sub_skills
//   - harness_infra_skills
//
// Invocation
//   node design/scripts/sync-skills.js                # full report
//   node design/scripts/sync-skills.js --strict       # fail on missing mirrors
//   node design/scripts/sync-skills.js --harness bob  # single harness
//
// Exit codes
//   0 — in sync (or mirrors missing but --strict not set)
//   1 — drift detected
//   2 — usage or config error
//

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..', '..');
const PROPAGATION_FILE = join(REPO_ROOT, 'design', 'process', '_propagation.yaml');

const args = process.argv.slice(2);
const STRICT = args.includes('--strict');
const HARNESS_FILTER = ((i) => (i >= 0 ? args[i + 1] : null))(args.indexOf('--harness'));

// ---------- minimal YAML reader ----------
// Handles only the shape of _propagation.yaml: top-level keys, one-level nesting
// for `chapters.map` and `umbrellas.*.sub_skills`, and array-of-object for
// `harnesses`. No anchors, flow scalars, multi-doc, etc.
function parsePropagationYaml(text) {
  const lines = text.split(/\r?\n/);
  const out = {
    harnesses: [],
    chapters: { map: {} },
    umbrellas: {},
    harness_infra_skills: [],
  };
  let section = null;
  let umbrellaKey = null;
  let umbrellaSubListActive = false;
  let pendingHarness = null;

  for (let raw of lines) {
    const noCommentTail = raw.replace(/\s+#.*$/, '');
    const line = noCommentTail.replace(/\r$/, '');
    if (!line.trim() || line.trim().startsWith('#')) continue;

    // section headers
    if (/^harnesses:\s*$/.test(line)) { flushHarness(); section = 'harnesses'; continue; }
    if (/^chapters:\s*$/.test(line)) { flushHarness(); section = 'chapters'; continue; }
    if (/^umbrellas:\s*$/.test(line)) { flushHarness(); section = 'umbrellas'; umbrellaKey = null; umbrellaSubListActive = false; continue; }
    if (/^harness_infra_skills:\s*$/.test(line)) { flushHarness(); section = 'harness_infra_skills'; continue; }
    if (/^targets:\s*$/.test(line) || /^sync_script:\s*$/.test(line) || /^version:\s*/.test(line)) {
      flushHarness(); section = null; umbrellaKey = null; umbrellaSubListActive = false; continue;
    }

    if (section === 'harnesses') {
      const dash = line.match(/^\s{2}-\s+name:\s+(.+)$/);
      if (dash) { flushHarness(); pendingHarness = { name: dash[1].trim() }; continue; }
      const kv = line.match(/^\s{4}(\w+):\s+(.+)$/);
      if (kv && pendingHarness) pendingHarness[kv[1]] = kv[2].trim();
      continue;
    }

    if (section === 'chapters') {
      const dir = line.match(/^\s{2}dir:\s+(.+)$/);
      if (dir) out.chapters.dir = dir[1].trim().replace(/['"]/g, '');
      if (/^\s{2}map:\s*$/.test(line)) { section = 'chaptersMap'; continue; }
      continue;
    }
    if (section === 'chaptersMap') {
      const m = line.match(/^\s{4}["']?(.+?)["']?:\s+(\S+)\s*$/);
      if (m) { out.chapters.map[m[1]] = m[2]; continue; }
      section = null; // fall through
    }

    if (section === 'umbrellas') {
      const key = line.match(/^\s{2}([\w\-]+):\s*$/);
      if (key) { umbrellaKey = key[1]; out.umbrellas[umbrellaKey] = { sub_skills: [] }; umbrellaSubListActive = false; continue; }
      if (umbrellaKey) {
        const chapterKv = line.match(/^\s{4}chapter:\s+(.+)$/);
        if (chapterKv) { out.umbrellas[umbrellaKey].chapter = chapterKv[1].trim(); continue; }
        if (/^\s{4}sub_skills:\s*$/.test(line)) { umbrellaSubListActive = true; continue; }
        const item = line.match(/^\s{6}-\s+(\S+)\s*$/);
        if (umbrellaSubListActive && item) { out.umbrellas[umbrellaKey].sub_skills.push(item[1]); continue; }
      }
      continue;
    }

    if (section === 'harness_infra_skills') {
      const item = line.match(/^\s{2}-\s+(\S+)\s*$/);
      if (item) out.harness_infra_skills.push(item[1]);
      continue;
    }
  }

  flushHarness();
  return out;

  function flushHarness() {
    if (pendingHarness) { out.harnesses.push(pendingHarness); pendingHarness = null; }
  }
}

// ---------- helpers ----------
function readFrontmatter(filePath) {
  const text = readFileSync(filePath, 'utf8');
  if (!text.startsWith('---')) return { name: null, raw: text };
  const end = text.indexOf('\n---', 3);
  if (end < 0) return { name: null, raw: text };
  const fm = text.slice(3, end);
  const nameMatch = fm.match(/^\s*name:\s*(.+?)\s*$/m);
  return { name: nameMatch ? nameMatch[1].trim() : null, raw: text };
}

function readSsotPointer(text) {
  const tail = text.split(/\n---\s*\n/).slice(1).join('\n---\n').slice(0, 800);
  const m = tail.match(/<!--\s*mirror:\s*([^\s|]+)\s*\|\s*SSOT:\s*([^\s|]+)\s*-->/);
  if (!m) return null;
  return { mirror: m[1], ssot: m[2] };
}

function listSkillDirs(absDir) {
  if (!existsSync(absDir)) return [];
  return readdirSync(absDir)
    .filter((n) => !n.startsWith('_') && !n.startsWith('.'))
    .filter((n) => statSync(join(absDir, n)).isDirectory())
    .map((n) => ({ name: n, path: join(absDir, n, 'SKILL.md') }))
    .filter((s) => existsSync(s.path));
}

// ---------- main ----------
function main() {
  if (!existsSync(PROPAGATION_FILE)) {
    console.error(`✖ missing ${relative(REPO_ROOT, PROPAGATION_FILE)}`);
    process.exit(2);
  }

  const spec = parsePropagationYaml(readFileSync(PROPAGATION_FILE, 'utf8'));
  if (!spec.harnesses.length) {
    console.error('✖ _propagation.yaml: no harnesses defined');
    process.exit(2);
  }

  // Build the authoritative skill inventory.
  const inventory = new Set();
  for (const v of Object.values(spec.chapters.map || {})) {
    if (v === '__index__' || v.startsWith('__umbrella__')) continue;
    inventory.add(v);
  }
  for (const u of Object.values(spec.umbrellas || {})) {
    for (const s of u.sub_skills || []) inventory.add(s);
  }
  for (const s of spec.harness_infra_skills || []) inventory.add(s);

  // Map each skill back to its SSOT chapter (if any) for pointer validation.
  const skillToChapter = new Map();
  for (const [chapter, mode] of Object.entries(spec.chapters.map || {})) {
    if (mode === '__index__') continue;
    if (mode.startsWith('__umbrella__')) {
      const umbName = mode.split(':')[1];
      const u = spec.umbrellas[umbName];
      if (!u) continue;
      for (const s of u.sub_skills) {
        skillToChapter.set(s, join(spec.chapters.dir, chapter));
      }
      continue;
    }
    skillToChapter.set(mode, join(spec.chapters.dir, chapter));
  }

  const harnesses = spec.harnesses.filter((h) => !HARNESS_FILTER || h.name === HARNESS_FILTER);

  let errors = 0;
  let warnings = 0;
  const lines = [];

  // Claude harness as the mirror-of-truth reference for name-parity.
  const claude = spec.harnesses.find((h) => h.name === 'claude');
  const claudeDir = claude ? join(REPO_ROOT, claude.skills_dir) : null;

  for (const h of harnesses) {
    const absDir = join(REPO_ROOT, h.skills_dir);
    const found = listSkillDirs(absDir);
    const foundNames = new Set(found.map((s) => s.name));

    lines.push(`\n== harness: ${h.name} (${h.skills_dir}) ==`);
    lines.push(`   skill dirs found: ${found.length} / inventory: ${inventory.size}`);

    // missing from harness vs. inventory
    for (const mode of inventory) {
      if (foundNames.has(mode)) continue;
      const msg = `   • ${mode} — not yet mirrored`;
      if (STRICT) { errors++; lines.push(`✖${msg}`); } else { warnings++; lines.push(`⚠${msg}`); }
    }

    // per-skill validation
    for (const s of found) {
      if (!inventory.has(s.name)) {
        errors++;
        lines.push(`✖   • ${s.name} — dir not in inventory (update _propagation.yaml)`);
        continue;
      }
      const fm = readFrontmatter(s.path);
      if (!fm.name) {
        errors++;
        lines.push(`✖   • ${s.name} — missing frontmatter name:`);
      } else if (fm.name !== s.name) {
        errors++;
        lines.push(`✖   • ${s.name} — frontmatter name:"${fm.name}" ≠ dir name`);
      }

      // SSOT pointer check (non-Claude harnesses)
      if (h.name !== 'claude') {
        const ptr = readSsotPointer(fm.raw);
        if (!ptr) {
          warnings++;
          lines.push(`⚠   • ${s.name} — no <!-- mirror: … | SSOT: … --> pointer`);
        } else {
          const ssotAbs = join(REPO_ROOT, ptr.ssot);
          if (!existsSync(ssotAbs)) {
            errors++;
            lines.push(`✖   • ${s.name} — SSOT pointer does not resolve: ${ptr.ssot}`);
          }
          const expected = skillToChapter.get(s.name);
          if (expected && ptr.ssot !== expected) {
            warnings++;
            lines.push(`⚠   • ${s.name} — SSOT pointer ${ptr.ssot} ≠ expected ${expected}`);
          }
        }

        // name parity with claude twin
        if (claudeDir) {
          const twin = join(claudeDir, s.name, 'SKILL.md');
          if (!existsSync(twin)) {
            warnings++;
            lines.push(`⚠   • ${s.name} — no twin in claude harness`);
          } else {
            const twinName = readFrontmatter(twin).name;
            if (twinName && fm.name && twinName !== fm.name) {
              errors++;
              lines.push(`✖   • ${s.name} — name mismatch ${h.name}:"${fm.name}" vs claude:"${twinName}"`);
            }
          }
        }
      }
    }
  }

  console.log(`sync-skills — ${harnesses.length} harness(es), inventory=${inventory.size}`);
  console.log(lines.join('\n'));
  console.log(`\nsummary: ${errors} error(s), ${warnings} warning(s)`);
  process.exit(errors > 0 ? 1 : 0);
}

main();
