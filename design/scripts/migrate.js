#!/usr/bin/env node

/**
 * migrate — v2 migration detection script
 *
 * Scans for new v2 capabilities not yet bootstrapped in this project.
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
const TOOLCHAIN_VERSION = '2.0.0';

/**
 * Capabilities that require a one-time bootstrap after the toolchain updates.
 * Each entry defines: what to check, what to report if not found.
 */
const CAPABILITIES = [
  {
    id: 'wiki',
    name: 'Project Wiki',
    description: 'Cross-referenced entity wiki synthesized from all tier artifacts (design-query Phase A)',
    checkFile: 'design/WIKI/index.md',
    instructions: 'Run design-query and say "bootstrap the project wiki"',
    addedInVersion: '2.0.0',
  },
  {
    id: 'decision-log',
    name: 'Decision Log',
    description: 'Append-only log of key design decisions with evidence and trade-offs (design/DECISION_LOG.md)',
    checkFile: 'design/DECISION_LOG.md',
    instructions: 'Run design-query and say "set up the decision log"',
    addedInVersion: '2.0.0',
  },
];

function fileExists(relativePath) {
  return fs.existsSync(path.resolve(projectRoot, relativePath));
}

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
  const match = statusContent.match(new RegExp(`\\| ${capabilityId} \\| (\\w+) \\|`));
  return match ? match[1] : 'unknown';
}

function run() {
  const now = new Date().toISOString().split('T')[0];
  const existingStatus = readMigrationStatus();
  const recordedVersion = getRecordedVersion(existingStatus);

  const pending = [];
  const complete = [];

  for (const cap of CAPABILITIES) {
    const alreadyComplete = getCapabilityStatus(existingStatus, cap.id) === 'complete';
    const filePresent = fileExists(cap.checkFile);

    if (alreadyComplete || filePresent) {
      complete.push(cap);
    } else {
      pending.push(cap);
    }
  }

  const versionChanged = recordedVersion !== TOOLCHAIN_VERSION;
  const hasPending = pending.length > 0;

  // Write migration status file
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
    const status = isPending ? 'pending' : 'complete';
    lines.push(`| ${cap.id} | ${cap.name} | ${status} | v${cap.addedInVersion} |`);
  }

  lines.push('');

  if (hasPending) {
    lines.push('## Pending bootstraps');
    lines.push('');
    lines.push('The following v2 capabilities are available but not yet set up for this project:');
    lines.push('');

    for (const cap of pending) {
      lines.push(`### ${cap.name}`);
      lines.push(`${cap.description}`);
      lines.push(`**How to set up:** ${cap.instructions}`);
      lines.push('');
    }
  }

  if (complete.length > 0) {
    lines.push('## Complete');
    lines.push('');
    for (const cap of complete) {
      lines.push(`- **${cap.name}** ✓`);
    }
    lines.push('');
  }

  fs.writeFileSync(migrationStatusPath, lines.join('\n'));

  // Print summary to stdout
  if (hasPending || versionChanged) {
    console.log('\n╔══════════════════════════════════════════╗');
    console.log('║  Design toolchain updated — v2.0.0       ║');
    console.log('╚══════════════════════════════════════════╝\n');

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
      console.log('All v2 capabilities are already set up. No action needed.\n');
    }
  } else {
    console.log(`✓ Migration status: up to date (toolchain v${TOOLCHAIN_VERSION})`);
  }

  process.exit(0);
}

run();
