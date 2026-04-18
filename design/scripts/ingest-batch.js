#!/usr/bin/env node

/**
 * ingest-batch — batch ingest orchestrator
 *
 * Thin wrapper around design-discovery + sync-status + design-lint.
 * Intended for projects with a backlog of raw inputs that would otherwise
 * require per-mode human gates.
 *
 * Flow:
 *   1. Accept a directory or list of raw input files
 *   2. Stage them into design/01_DISCOVERY/raw/ (non-destructive — preserves existing files)
 *   3. Print a prompt for the user to run design-discovery over the batch in one pass
 *   4. After discovery completes, run sync-status to report downstream staleness
 *   5. Prompt the user to re-run affected modes in dependency order
 *   6. End with a design-lint summary prompt
 *
 * This script does NOT invoke Claude directly. It prepares state and prints the
 * minimal set of prompts the user should paste into Claude Code.
 *
 * Usage:
 *   node design/scripts/ingest-batch.js <directory>
 *   node design/scripts/ingest-batch.js <file1> <file2> ...
 *   node design/scripts/ingest-batch.js --dry-run <directory>
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const projectRoot = path.resolve(import.meta.dirname, '../..');
const rawInputDir = path.resolve(projectRoot, 'design/01_DISCOVERY/raw');

function printUsage() {
  console.log(`Usage: node design/scripts/ingest-batch.js [--dry-run] <directory|file...>`);
  console.log(``);
  console.log(`Examples:`);
  console.log(`  node design/scripts/ingest-batch.js ./incoming-interviews/`);
  console.log(`  node design/scripts/ingest-batch.js interview1.md survey.csv notes.txt`);
  console.log(`  node design/scripts/ingest-batch.js --dry-run ./backlog/`);
}

function parseArgs(argv) {
  const args = argv.slice(2);
  let dryRun = false;
  const inputs = [];
  for (const a of args) {
    if (a === '--dry-run') dryRun = true;
    else if (a === '--help' || a === '-h') { printUsage(); process.exit(0); }
    else inputs.push(a);
  }
  return { dryRun, inputs };
}

function collectInputs(paths) {
  const files = [];
  for (const p of paths) {
    const abs = path.resolve(p);
    if (!fs.existsSync(abs)) {
      console.error(`✗ Not found: ${p}`);
      continue;
    }
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(abs)) {
        const entryPath = path.join(abs, entry);
        if (fs.statSync(entryPath).isFile()) files.push(entryPath);
      }
    } else {
      files.push(abs);
    }
  }
  return files;
}

function stageFiles(files, dryRun) {
  if (!dryRun && !fs.existsSync(rawInputDir)) {
    fs.mkdirSync(rawInputDir, { recursive: true });
  }

  const staged = [];
  const skipped = [];

  for (const src of files) {
    const basename = path.basename(src);
    const dest = path.join(rawInputDir, basename);

    if (fs.existsSync(dest)) {
      skipped.push({ src, dest, reason: 'destination exists' });
      continue;
    }

    if (!dryRun) fs.copyFileSync(src, dest);
    staged.push({ src, dest });
  }

  return { staged, skipped };
}

function runSyncStatus() {
  try {
    const out = execSync(`node ${path.resolve(projectRoot, 'design/scripts/sync-status.js')}`, {
      cwd: projectRoot,
      encoding: 'utf-8',
    });
    return out;
  } catch (e) {
    return `(sync-status.js errored: ${e.message})`;
  }
}

function main() {
  const { dryRun, inputs } = parseArgs(process.argv);

  if (inputs.length === 0) {
    printUsage();
    process.exit(1);
  }

  console.log(`\n═══ Batch Ingest ═══`);
  console.log(dryRun ? `(dry run — no files will be copied)\n` : ``);

  const files = collectInputs(inputs);
  if (files.length === 0) {
    console.error(`No files to ingest.`);
    process.exit(1);
  }

  console.log(`Found ${files.length} input file(s):\n`);
  for (const f of files) console.log(`  • ${path.relative(projectRoot, f)}`);
  console.log(``);

  const { staged, skipped } = stageFiles(files, dryRun);

  if (skipped.length > 0) {
    console.log(`Skipped ${skipped.length} (already present in design/01_DISCOVERY/raw/):`);
    for (const s of skipped) console.log(`  • ${path.basename(s.src)}`);
    console.log(``);
  }

  if (staged.length > 0) {
    console.log(`${dryRun ? 'Would stage' : 'Staged'} ${staged.length} file(s) → design/01_DISCOVERY/raw/\n`);
  }

  if (dryRun) {
    console.log(`(dry run complete — re-run without --dry-run to stage and proceed)\n`);
    process.exit(0);
  }

  console.log(`─── Next steps ───\n`);
  console.log(`Paste this into Claude Code to process the batch:\n`);
  console.log(`  > Run design-discovery over the new inputs in design/01_DISCOVERY/raw/.`);
  console.log(`    Process all of them in one pass — do not stop between files.\n`);
  console.log(`When discovery finishes, run:\n`);
  console.log(`  $ node design/scripts/sync-status.js\n`);
  console.log(`That will report downstream modes that are now stale. Re-run them in`);
  console.log(`dependency order (the report lists them). Finish with:\n`);
  console.log(`  > Run design-lint and summarize the corpus health.\n`);

  // Soft preview of current downstream staleness (helpful baseline)
  console.log(`─── Current downstream staleness (pre-discovery baseline) ───\n`);
  console.log(runSyncStatus());
}

main();
