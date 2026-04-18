#!/usr/bin/env node

/**
 * migrate — toolchain migration detection
 *
 * Scans for new capabilities not yet bootstrapped in this project.
 * Writes design/.migration-status.md with pending bootstraps.
 * Fast, read-only — no LLM calls.
 *
 * Usage:
 *   node design/scripts/migrate.js
 *
 * Intended to run as a git post-merge hook. Install:
 *   cp design/scripts/post-merge-hook.sh .git/hooks/post-merge
 *   chmod +x .git/hooks/post-merge
 */

import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '../..');
const migrationStatusPath = path.resolve(projectRoot, 'design/.migration-status.md');

/** Current toolchain version — bump when new bootstrap-requiring features are added */
const TOOLCHAIN_VERSION = '2.1.0';

function fileExists(relativePath) {
  return fs.existsSync(path.resolve(projectRoot, relativePath));
}

function dirExists(relativePath) {
  const p = path.resolve(projectRoot, relativePath);
  return fs.existsSync(p) && fs.statSync(p).isDirectory();
}

function readFile(relativePath) {
  const p = path.resolve(projectRoot, relativePath);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, 'utf-8');
}

function listFiles(relativePath, extension) {
  const p = path.resolve(projectRoot, relativePath);
  if (!fs.existsSync(p)) return [];
  return fs.readdirSync(p)
    .filter(f => !extension || f.endsWith(extension))
    .map(f => path.join(relativePath, f));
}

/**
 * Check whether the WIKI has non-wikilink markdown links.
 * v2.0 wikis may contain `[text](path.md)` style; v2.1 standardizes on `[[wikilink]]`.
 * Returns true if all links are wikilinks (or the wiki doesn't exist yet); false if
 * regular markdown links are found and need rewriting.
 */
function wikiUsesWikilinks() {
  if (!dirExists('design/WIKI')) return true; // no wiki = nothing to migrate
  const mdFiles = listFiles('design/WIKI', '.md');
  if (mdFiles.length === 0) return true;

  // Regex for markdown links that are NOT image links and NOT external URLs.
  // Matches: [text](something.md) or [text](./local/path)
  const localLinkPattern = /(?<!\!)\[[^\]]+\]\((?!https?:\/\/|mailto:|#)[^)]+\)/;

  for (const file of mdFiles) {
    const content = readFile(file);
    if (content && localLinkPattern.test(content)) return false;
  }
  return true;
}

/**
 * Check whether the BRD xlsx has a Manifest sheet.
 * We can't parse xlsx from pure Node without a dep, so we use a heuristic:
 * if design/BRD_manifest.md still exists, the migration hasn't happened yet.
 */
function brdManifestConsolidated() {
  return !fileExists('design/BRD_manifest.md');
}

/**
 * Check whether design/thinking/ has been cleaned up.
 */
function thinkingCleanedUp() {
  return !dirExists('design/thinking');
}

/**
 * Capabilities that require a one-time bootstrap after the toolchain updates.
 *
 * Each entry defines:
 *   - id, name, description, addedInVersion
 *   - check(): () => boolean — returns true if already complete
 *   - instructions: user-facing how-to
 *   - infoOnly: (optional) true = always complete, just surfaces the feature
 */
const CAPABILITIES = [
  {
    id: 'wiki',
    name: 'Project Wiki',
    description: 'Cross-referenced entity wiki synthesized from all tier artifacts (design-query Phase A)',
    check: () => fileExists('design/WIKI/index.md'),
    instructions: 'Run design-query and say "bootstrap the project wiki"',
    addedInVersion: '2.0.0',
  },
  {
    id: 'decision-log',
    name: 'Decision Log',
    description: 'Append-only log of key design decisions with evidence and trade-offs (design/DECISION_LOG.md)',
    check: () => fileExists('design/DECISION_LOG.md'),
    instructions: 'Run design-query and say "set up the decision log"',
    addedInVersion: '2.0.0',
  },
  {
    id: 'wiki-wikilink-format',
    name: 'WIKI wikilink format',
    description: 'v2.1 standardizes WIKI internal links on Obsidian `[[wikilink]]` syntax. Existing v2.0 wikis with `[text](path.md)` links need a one-shot rewrite.',
    check: wikiUsesWikilinks,
    instructions: 'Run `node design/scripts/migrate-wiki-format.js` to rewrite links (or re-run design-query to regenerate the wiki from scratch).',
    addedInVersion: '2.1.0',
  },
  {
    id: 'brd-manifest-sheet',
    name: 'BRD Manifest consolidation',
    description: 'The standalone design/BRD_manifest.md is merged into design/BRD.xlsx as a "Manifest" sheet. Single-file BRD going forward.',
    check: brdManifestConsolidated,
    instructions: 'Run `python design/scripts/sync-brd.py --migrate-manifest` to move contents into the xlsx and delete the md.',
    addedInVersion: '2.1.0',
  },
  {
    id: 'thinking-cleanup',
    name: 'Thinking directory cleanup',
    description: 'design/thinking/ contains legacy essays and the agentic-design narrative. v2.1 migrates the narrative to WIKI/about.md, folds the infrastructure summary into README, and removes the remaining essays.',
    check: thinkingCleanedUp,
    instructions: 'Run `node design/scripts/migrate-thinking.js` to perform the migration.',
    addedInVersion: '2.1.0',
  },
  {
    id: 'ingest-batch-available',
    name: 'Batch ingest orchestrator',
    description: 'design/scripts/ingest-batch.js lets you run design-discovery once over a backlog of raw inputs, then re-runs affected downstream modes in dependency order. Opt-in.',
    check: () => true,
    infoOnly: true,
    instructions: 'Run `node design/scripts/ingest-batch.js <directory-or-file-list>`. Skip if you prefer per-mode human gates.',
    addedInVersion: '2.1.0',
  },
  {
    id: 'figma-audit-nielsen-removed',
    name: 'Audit skill split',
    description: 'figma-audit now covers Figma-mechanical checks only. Nielsen 10 heuristic evaluation lives in design-validation; cross-tier semantic health lives in design-lint. No artifact impact — informational only.',
    check: () => true,
    infoOnly: true,
    instructions: 'No action required. Use design-validation for heuristic evaluation going forward.',
    addedInVersion: '2.1.0',
  },
];

function readMigrationStatus() {
  if (!fs.existsSync(migrationStatusPath)) return null;
  return fs.readFileSync(migrationStatusPath, 'utf-8');
}

function getRecordedVersion(statusContent) {
  if (!statusContent) return null;
  const match = statusContent.match(/\*\*Toolchain version:\*\* (.+)/);
  return match ? match[1].trim() : null;
}

function getCapabilityStatus(statusContent, capabilityId) {
  if (!statusContent) return 'unknown';
  const match = statusContent.match(new RegExp(`\\| ${capabilityId} \\| [^|]+\\| (\\w+) \\|`));
  return match ? match[1] : 'unknown';
}

function run() {
  const now = new Date().toISOString().split('T')[0];
  const existingStatus = readMigrationStatus();
  const recordedVersion = getRecordedVersion(existingStatus);

  const pending = [];
  const complete = [];

  for (const cap of CAPABILITIES) {
    const alreadyRecordedComplete = getCapabilityStatus(existingStatus, cap.id) === 'complete';
    const currentlyComplete = cap.check();

    if (cap.infoOnly || alreadyRecordedComplete || currentlyComplete) {
      complete.push(cap);
    } else {
      pending.push(cap);
    }
  }

  const versionChanged = recordedVersion !== TOOLCHAIN_VERSION;
  const hasPending = pending.length > 0;

  const lines = [
    `# Migration Status`,
    ``,
    `**Toolchain version:** ${TOOLCHAIN_VERSION}`,
    `**Last checked:** ${now}`,
    ``,
    `## Capabilities`,
    ``,
    `| ID | Name | Status | Added in |`,
    `|---|---|---|---|`,
  ];

  for (const cap of CAPABILITIES) {
    const isPending = pending.includes(cap);
    const status = cap.infoOnly ? 'info' : (isPending ? 'pending' : 'complete');
    lines.push(`| ${cap.id} | ${cap.name} | ${status} | v${cap.addedInVersion} |`);
  }

  lines.push('');

  if (hasPending) {
    lines.push('## Pending bootstraps');
    lines.push('');
    lines.push('The following capabilities are available but not yet set up for this project:');
    lines.push('');

    for (const cap of pending) {
      lines.push(`### ${cap.name}`);
      lines.push(`${cap.description}`);
      lines.push(``);
      lines.push(`**How to set up:** ${cap.instructions}`);
      lines.push('');
    }
  }

  const infoItems = complete.filter(c => c.infoOnly);
  if (infoItems.length > 0) {
    lines.push('## Feature notes');
    lines.push('');
    for (const cap of infoItems) {
      lines.push(`### ${cap.name}`);
      lines.push(`${cap.description}`);
      lines.push(``);
      lines.push(`${cap.instructions}`);
      lines.push('');
    }
  }

  const completeItems = complete.filter(c => !c.infoOnly);
  if (completeItems.length > 0) {
    lines.push('## Complete');
    lines.push('');
    for (const cap of completeItems) {
      lines.push(`- **${cap.name}** ✓`);
    }
    lines.push('');
  }

  fs.writeFileSync(migrationStatusPath, lines.join('\n'));

  if (hasPending || versionChanged) {
    console.log(`\n╔══════════════════════════════════════════╗`);
    console.log(`║  Design toolchain updated — v${TOOLCHAIN_VERSION}       ║`);
    console.log(`╚══════════════════════════════════════════╝\n`);

    if (hasPending) {
      console.log(`${pending.length} new capability(ies) available for this project:\n`);
      for (const cap of pending) {
        console.log(`  ○ ${cap.name}`);
        console.log(`    ${cap.description}`);
        console.log(`    → ${cap.instructions}\n`);
      }
      console.log('Next time you open Claude Code, it will offer to run these bootstraps.');
      console.log(`Status file: design/.migration-status.md\n`);
    } else {
      console.log('All capabilities are already set up. No action needed.\n');
    }
  } else {
    console.log(`✓ Migration status: up to date (toolchain v${TOOLCHAIN_VERSION})`);
  }

  process.exit(0);
}

run();
