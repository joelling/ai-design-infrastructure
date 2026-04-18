#!/usr/bin/env node

/**
 * migrate-thinking — one-shot migration of design/thinking/ contents
 *
 * v2.1 retires the design/thinking/ directory:
 *   - agentic-design-narrative.md       → design/WIKI/about.md (moved, preserved)
 *   - ai-design-infrastructure-summary.md → merged into WIKI/index.md intro (if present) or kept for README folding
 *   - intentionality-led-design.md       → deleted (essay, not load-bearing)
 *   - signal-and-contact.md              → deleted (essay, not load-bearing)
 *   - the-designers-new-discipline.md    → deleted (essay, not load-bearing)
 *
 * After all moves/deletes, the empty thinking/ directory is removed.
 *
 * Usage:
 *   node design/scripts/migrate-thinking.js            # perform migration
 *   node design/scripts/migrate-thinking.js --dry-run  # preview actions only
 */

import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '../..');
const thinkingDir = path.resolve(projectRoot, 'design/thinking');
const wikiDir = path.resolve(projectRoot, 'design/WIKI');

function parseArgs(argv) {
  const args = argv.slice(2);
  return { dryRun: args.includes('--dry-run') };
}

const ACTIONS = [
  {
    file: 'agentic-design-narrative.md',
    action: 'move',
    dest: 'design/WIKI/about.md',
    description: 'Move agentic design narrative to WIKI as an "about" entry',
  },
  {
    file: 'ai-design-infrastructure-summary.md',
    action: 'archive-for-readme',
    dest: 'design/thinking/_archive/ai-design-infrastructure-summary.md',
    description: 'Preserve summary for manual fold into README (not auto-merged — README is hand-written)',
  },
  {
    file: 'intentionality-led-design.md',
    action: 'delete',
    description: 'Delete legacy essay',
  },
  {
    file: 'signal-and-contact.md',
    action: 'delete',
    description: 'Delete legacy essay',
  },
  {
    file: 'the-designers-new-discipline.md',
    action: 'delete',
    description: 'Delete legacy essay',
  },
];

function run() {
  const { dryRun } = parseArgs(process.argv);

  if (!fs.existsSync(thinkingDir)) {
    console.log(`design/thinking/ does not exist — nothing to migrate.`);
    process.exit(0);
  }

  console.log(`\n═══ Thinking directory cleanup ═══`);
  console.log(dryRun ? `(dry run — no changes will be made)\n` : ``);

  // Guard: refuse to overwrite an existing WIKI/about.md
  const aboutDest = path.resolve(projectRoot, 'design/WIKI/about.md');
  if (fs.existsSync(aboutDest)) {
    console.error(`✗ design/WIKI/about.md already exists. Aborting to avoid overwrite.`);
    console.error(`  Resolve manually: review both files and merge/rename as needed.`);
    process.exit(1);
  }

  if (!dryRun && !fs.existsSync(wikiDir)) {
    fs.mkdirSync(wikiDir, { recursive: true });
  }

  const performed = [];

  for (const step of ACTIONS) {
    const src = path.join(thinkingDir, step.file);
    if (!fs.existsSync(src)) {
      console.log(`  ○ ${step.file}: skipped (already absent)`);
      continue;
    }

    if (step.action === 'move') {
      const dest = path.resolve(projectRoot, step.dest);
      console.log(`  → ${step.file} → ${step.dest}`);
      if (!dryRun) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.renameSync(src, dest);
      }
      performed.push(step);
    } else if (step.action === 'archive-for-readme') {
      const dest = path.resolve(projectRoot, step.dest);
      console.log(`  ↓ ${step.file} → ${step.dest} (archive for manual README fold)`);
      if (!dryRun) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.renameSync(src, dest);
      }
      performed.push(step);
    } else if (step.action === 'delete') {
      console.log(`  ✗ ${step.file} (delete: ${step.description})`);
      if (!dryRun) fs.unlinkSync(src);
      performed.push(step);
    }
  }

  // Attempt to remove thinking/ if empty (archive subdir still counts as non-empty)
  if (!dryRun) {
    const remaining = fs.existsSync(thinkingDir) ? fs.readdirSync(thinkingDir) : [];
    const onlyArchive = remaining.length === 1 && remaining[0] === '_archive';
    if (remaining.length === 0) {
      fs.rmdirSync(thinkingDir);
      console.log(`\n  ✓ Removed empty design/thinking/`);
    } else if (onlyArchive) {
      console.log(`\n  ℹ design/thinking/_archive/ retained — contains the infrastructure summary for manual README fold.`);
      console.log(`    After you've folded it into README.md, delete design/thinking/ manually.`);
    } else {
      console.log(`\n  ℹ design/thinking/ retained — contains unexpected additional files:`);
      for (const f of remaining) console.log(`    • ${f}`);
    }
  }

  console.log(``);
  if (dryRun) {
    console.log(`(dry run complete — re-run without --dry-run to apply changes)`);
  } else {
    console.log(`Migration complete. Review with \`git status\` and commit when ready.`);
  }
}

run();
