#!/usr/bin/env node

/**
 * migrate-artifact-dirs — one-shot rename of two Tier 4 artifact directories
 *
 * v2.2 aligns the artifact directory names with the new Tier 4 chapter titles:
 *   - design/13_CANVAS    → design/13_CANVAS_BRIEFS
 *   - design/14_WIREFRAME → design/14_WIREFRAMES
 *
 * Two phases run in sequence:
 *
 *   Phase 1 — Directory renames
 *     fs.renameSync each legacy dir to its new name. If both legacy and new
 *     exist, abort with a clear manual-reconciliation message (no destructive
 *     auto-merge).
 *
 *   Phase 2 — In-content path rewrites
 *     Walk every .md / .json / .css under design/ (excluding the framework
 *     subtrees: process/, scripts/, templates/, viewer/) and rewrite any
 *     `design/13_CANVAS` or `design/14_WIREFRAME` reference to the new path.
 *
 *     The regex uses a `\b` word boundary on the right side, which makes it
 *     idempotent: `_` is a word character, so `design/13_CANVAS_BRIEFS` does
 *     NOT match `design/13_CANVAS\b` (the `_` after `CANVAS` blocks the
 *     boundary). Re-running the script after a successful migration is a
 *     no-op.
 *
 * Usage:
 *   node design/scripts/migrate-artifact-dirs.js            # apply changes
 *   node design/scripts/migrate-artifact-dirs.js --dry-run  # preview only
 *   node design/scripts/migrate-artifact-dirs.js --help     # show this help
 *
 * Safety:
 *   - Idempotent — safe to re-run after success (no-op on the second run)
 *   - Aborts if both legacy and new directories coexist (manual decision)
 *   - Skips framework subtrees so the toolchain itself is never touched
 *   - Dry-run prints exactly what would change without writing anything
 */

import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '../..');
const designRoot = path.resolve(projectRoot, 'design');

const RENAMES = [
  { from: 'design/13_CANVAS',    to: 'design/13_CANVAS_BRIEFS' },
  { from: 'design/14_WIREFRAME', to: 'design/14_WIREFRAMES' },
];

const REWRITES = [
  { pattern: /\bdesign\/13_CANVAS\b/g,    replacement: 'design/13_CANVAS_BRIEFS' },
  { pattern: /\bdesign\/14_WIREFRAME\b/g, replacement: 'design/14_WIREFRAMES' },
];

const EXCLUDED_SUBTREES = new Set([
  path.resolve(projectRoot, 'design/process'),
  path.resolve(projectRoot, 'design/scripts'),
  path.resolve(projectRoot, 'design/templates'),
  path.resolve(projectRoot, 'design/viewer'),
]);

const REWRITE_EXTENSIONS = new Set(['.md', '.json', '.css', '.txt']);

function parseArgs(argv) {
  const args = argv.slice(2);
  return {
    dryRun: args.includes('--dry-run'),
    help: args.includes('--help') || args.includes('-h'),
  };
}

function printHelp() {
  console.log(`
migrate-artifact-dirs — Rename design/13_CANVAS → design/13_CANVAS_BRIEFS and
                        design/14_WIREFRAME → design/14_WIREFRAMES.

What it does:
  1. Renames the two directories (Phase 1).
  2. Rewrites every \`design/13_CANVAS\` / \`design/14_WIREFRAME\` reference
     inside .md / .json / .css / .txt files under design/ (Phase 2).

What it skips:
  - design/process/, design/scripts/, design/templates/, design/viewer/
    (framework subtrees — already on the new names at toolchain level).

Safety:
  - Idempotent: re-running after success is a no-op.
  - Aborts if both legacy and new directory exist (manual reconciliation).

Usage:
  node design/scripts/migrate-artifact-dirs.js            # apply
  node design/scripts/migrate-artifact-dirs.js --dry-run  # preview
  node design/scripts/migrate-artifact-dirs.js --help     # this message
`);
}

function dirExists(absPath) {
  return fs.existsSync(absPath) && fs.statSync(absPath).isDirectory();
}

function isExcluded(absPath) {
  for (const root of EXCLUDED_SUBTREES) {
    if (absPath === root || absPath.startsWith(root + path.sep)) return true;
  }
  return false;
}

function walkFiles(rootDir, callback) {
  if (!fs.existsSync(rootDir)) return;
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  for (const entry of entries) {
    const absPath = path.join(rootDir, entry.name);
    if (isExcluded(absPath)) continue;
    if (entry.isDirectory()) {
      walkFiles(absPath, callback);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (REWRITE_EXTENSIONS.has(ext)) callback(absPath);
    }
  }
}

function rewriteFile(absPath, dryRun) {
  const original = fs.readFileSync(absPath, 'utf-8');
  let updated = original;
  let totalReplacements = 0;
  for (const { pattern, replacement } of REWRITES) {
    const matches = updated.match(pattern);
    if (matches) {
      totalReplacements += matches.length;
      updated = updated.replace(pattern, replacement);
    }
  }
  if (totalReplacements === 0) return 0;
  if (!dryRun) fs.writeFileSync(absPath, updated, 'utf-8');
  return totalReplacements;
}

function phase1Renames(dryRun) {
  console.log(`Phase 1 — Directory renames`);
  let renamed = 0;

  for (const { from, to } of RENAMES) {
    const fromAbs = path.resolve(projectRoot, from);
    const toAbs = path.resolve(projectRoot, to);
    const fromExists = dirExists(fromAbs);
    const toExists = dirExists(toAbs);

    if (!fromExists && !toExists) {
      console.log(`  ○ ${from} — not present, skipping`);
      continue;
    }
    if (!fromExists && toExists) {
      console.log(`  ✓ ${to} — already renamed`);
      continue;
    }
    if (fromExists && toExists) {
      console.error(``);
      console.error(`  ✗ Both ${from}/ and ${to}/ exist.`);
      console.error(`    Manual reconciliation required:`);
      console.error(`      1. Move contents of ${from}/ into ${to}/`);
      console.error(`      2. Remove the empty ${from}/ directory`);
      console.error(`      3. Re-run this script`);
      console.error(``);
      process.exit(1);
    }
    // fromExists && !toExists — safe to rename
    console.log(`  → ${from} → ${to}`);
    if (!dryRun) fs.renameSync(fromAbs, toAbs);
    renamed += 1;
  }

  return renamed;
}

function phase2Rewrites(dryRun) {
  console.log(``);
  console.log(`Phase 2 — Update in-content path references`);
  let totalRefs = 0;
  let totalFiles = 0;

  walkFiles(designRoot, (absPath) => {
    const refsInFile = rewriteFile(absPath, dryRun);
    if (refsInFile > 0) {
      const relPath = path.relative(projectRoot, absPath);
      const noun = refsInFile === 1 ? 'ref' : 'refs';
      console.log(`  ↓ ${relPath} (${refsInFile} ${noun})`);
      totalRefs += refsInFile;
      totalFiles += 1;
    }
  });

  if (totalRefs === 0) {
    console.log(`  ○ no path references to rewrite`);
  }

  return { totalRefs, totalFiles };
}

function run() {
  const { dryRun, help } = parseArgs(process.argv);
  if (help) {
    printHelp();
    process.exit(0);
  }

  const banner = dryRun
    ? `[dry-run] Artifact directory rename — 13_CANVAS → 13_CANVAS_BRIEFS, 14_WIREFRAME → 14_WIREFRAMES`
    : `Artifact directory rename — 13_CANVAS → 13_CANVAS_BRIEFS, 14_WIREFRAME → 14_WIREFRAMES`;
  console.log(``);
  console.log(banner);
  console.log(``);

  const renamed = phase1Renames(dryRun);
  const { totalRefs, totalFiles } = phase2Rewrites(dryRun);

  console.log(``);
  console.log(`Summary:`);
  console.log(`  Renamed: ${renamed} director${renamed === 1 ? 'y' : 'ies'}`);
  console.log(`  Rewrote: ${totalRefs} reference${totalRefs === 1 ? '' : 's'} across ${totalFiles} file${totalFiles === 1 ? '' : 's'}`);

  if (dryRun) {
    console.log(``);
    console.log(`(dry run — no changes written. Re-run without --dry-run to apply.)`);
  } else if (renamed === 0 && totalRefs === 0) {
    console.log(``);
    console.log(`Nothing to do — project is already on the new names.`);
  } else {
    console.log(``);
    console.log(`Review with \`git diff\` and commit when ready:`);
    console.log(`  git add -A && git commit -m "Migrate canvas + wireframe artifact dirs to new names"`);
  }

  process.exit(0);
}

run();
