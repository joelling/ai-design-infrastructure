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
const TOOLCHAIN_VERSION = '2.2.0';

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
 * v2.2 — Detect whether the project has the new IA SSOT artifacts that drive
 * the BRD aggregation pipeline.
 */
function dataDictionaryExists() {
  return fileExists('design/06_INFORMATION_ARCHITECTURE/data-dictionary.md');
}

function rbacSplitOut() {
  // rbac.md should exist as a standalone artifact; the role-feature matrix
  // previously lived inside navigation-model.md.
  return fileExists('design/06_INFORMATION_ARCHITECTURE/rbac.md');
}

function notificationsCatalogExists() {
  return fileExists('design/06_INFORMATION_ARCHITECTURE/notifications.md');
}

/**
 * v2.2 — Detect whether the per-sprint design has been started but the
 * continuous design-system pipeline has not been bootstrapped.
 *
 * Foundation Library Phase A produces a manifest in design/15_FIGMA/ — if any
 * canvas brief exists but the Foundation Library manifest does not, the
 * project is in a state where screen-compose cannot run cleanly.
 */
function foundationLibraryBootstrapped() {
  // Bootstrap not pending if no canvas briefs exist (project hasn't reached Tier 4 yet).
  // Check both new and legacy dir names — until artifact-dirs-renamed migration runs,
  // a project may still have design/13_CANVAS/.
  const canvasDir = dirExists('design/13_CANVAS_BRIEFS')
    ? 'design/13_CANVAS_BRIEFS'
    : (dirExists('design/13_CANVAS') ? 'design/13_CANVAS' : null);
  if (!canvasDir) return true;
  const briefs = listFiles(canvasDir, '.md');
  if (briefs.length === 0) return true;
  return fileExists('design/15_FIGMA/manifest.md');
}

/**
 * v2.2 — Detect whether the code-side Component Library has been scaffolded.
 * Optional bootstrap (prototype falls back to ad-hoc HTML/CSS if absent),
 * but flag it once Foundation Library is in place.
 */
function componentLibraryScaffolded() {
  // Not pending until foundation-library is published.
  if (!fileExists('design/15_FIGMA/manifest.md')) return true;
  return dirExists('design/15_COMPONENT_LIBRARY');
}

/**
 * v2.2 — Detect legacy chapter filenames after the Tier 4 reframe.
 * Old names: 15-ui-compose.md, 17-design-system-figma.md, 18-design-system-code.md
 * New names: 15-screen-compose.md, 17-foundation-library.md, 18-component-library.md
 */
function chapterFilesRenamed() {
  const legacyChapters = [
    'design/process/15-ui-compose.md',
    'design/process/17-design-system-figma.md',
    'design/process/18-design-system-code.md',
  ];
  return !legacyChapters.some(fileExists);
}

/**
 * v2.2 — Detect whether the artifact directories `design/13_CANVAS/` and
 * `design/14_WIREFRAME/` have been renamed to match the new chapter titles
 * ("Canvas Briefs", "Wireframes"). Returns true when neither legacy directory
 * exists (already migrated, or fresh project that scaffolds with new names).
 */
function artifactDirsRenamed() {
  return !dirExists('design/13_CANVAS') && !dirExists('design/14_WIREFRAME');
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
  {
    id: 'tier4-chapter-renames',
    name: 'Tier 4 chapter renames',
    description: 'v2.2 renames 15-ui-compose.md → 15-screen-compose.md, 17-design-system-figma.md → 17-foundation-library.md, 18-design-system-code.md → 18-component-library.md. Legacy chapter files should not coexist with the new ones.',
    check: chapterFilesRenamed,
    instructions: 'Delete the legacy files (`rm design/process/15-ui-compose.md design/process/17-design-system-figma.md design/process/18-design-system-code.md`) once you have confirmed the new chapters exist.',
    addedInVersion: '2.2.0',
  },
  {
    id: 'artifact-dirs-renamed',
    name: 'Artifact directory naming alignment',
    description:
      'Tier 4 chapter titles now use plural deliverable noun-phrases ("Canvas Briefs", "Wireframes"). ' +
      'Two artifact directories need to be renamed to match: design/13_CANVAS → design/13_CANVAS_BRIEFS ' +
      'and design/14_WIREFRAME → design/14_WIREFRAMES. A migration script handles the rename plus all ' +
      'in-content path references in your project artifacts.',
    check: artifactDirsRenamed,
    instructions:
      'Preview with `node design/scripts/migrate-artifact-dirs.js --dry-run`, then apply with ' +
      '`node design/scripts/migrate-artifact-dirs.js`. Review with `git diff` and commit.',
    addedInVersion: '2.2.0',
  },
  {
    id: 'data-dictionary',
    name: 'IA Data Dictionary',
    description: 'v2.2 introduces design/06_INFORMATION_ARCHITECTURE/data-dictionary.md as the canonical field catalog. sync-brd.py reads it to regenerate the BRD Data Fields sheet.',
    check: dataDictionaryExists,
    instructions: 'Run design-ia and say "build the data dictionary" — it scaffolds from `design/templates/data-dictionary.tpl.md` and back-references screen-inventory.md.',
    addedInVersion: '2.2.0',
  },
  {
    id: 'rbac-split',
    name: 'IA RBAC split',
    description: 'v2.2 splits the role-feature matrix out of navigation-model.md into design/06_INFORMATION_ARCHITECTURE/rbac.md. sync-brd.py reads rbac.md (and warns if navigation-model.md still has a duplicate matrix).',
    check: rbacSplitOut,
    instructions: 'Run design-ia and say "split out the rbac matrix" — it moves the role-feature table to rbac.md and leaves a back-reference in navigation-model.md.',
    addedInVersion: '2.2.0',
  },
  {
    id: 'notifications-catalog',
    name: 'IA Notifications catalog',
    description: 'v2.2 introduces design/06_INFORMATION_ARCHITECTURE/notifications.md as the canonical message catalog. Interaction artifacts reference NOTIF-NNN ids; sync-brd.py reads notifications.md to regenerate the BRD Notification Mapping sheet.',
    check: notificationsCatalogExists,
    instructions: 'Run design-ia and say "build the notifications catalog" — it scaffolds from `design/templates/notifications.tpl.md` and replaces inline message text in error-strategy.md / behavioral-spec.md with NOTIF-NNN references.',
    addedInVersion: '2.2.0',
  },
  {
    id: 'foundation-library-bootstrap',
    name: 'Foundation Library (Phase A)',
    description: 'v2.2 makes the Foundation Library a continuous Tier 4 mode bootstrapped after Tier 3 stabilises. Phase A sets up the 3-file DLS (Foundation, Icons & Illustrations, Components), seeds tokens, and publishes the first foundational components. Required before design-screen-compose can place any published-library instance.',
    check: foundationLibraryBootstrapped,
    instructions: 'Run design-foundation-library and say "Phase A bootstrap" — orchestrates figma-connect → figma-file-setup → figma-tokens → figma-component (seed) → figma-docs → figma-inventory.',
    addedInVersion: '2.2.0',
  },
  {
    id: 'component-library-scaffold',
    name: 'Component Library (Phase A)',
    description: 'v2.2 introduces design/15_COMPONENT_LIBRARY/ as the code-side mirror of the Figma Foundation Library. Phase A scaffolds framework choice, Style Dictionary token build, component skeletons, and figma-mapping.json. Optional but recommended — design-prototype falls back to ad-hoc HTML/CSS if absent.',
    check: componentLibraryScaffolded,
    instructions: 'Run design-component-library and say "Phase A bootstrap" — choose framework, initialise Style Dictionary, generate component skeletons.',
    addedInVersion: '2.2.0',
  },
  {
    id: 'sync-wiki-script',
    name: 'Wiki sync script',
    description: 'v2.2 adds design/scripts/sync-wiki.js — checks WIKI page staleness against source artifact versions and regenerates design/WIKI/.backlinks.json (reverse index of wikilinks + stable IDs).',
    check: () => fileExists('design/scripts/sync-wiki.js'),
    infoOnly: true,
    instructions: 'Run `node design/scripts/sync-wiki.js` after any source artifact version bump. Pulled in via `git pull` — no project-side bootstrap required.',
    addedInVersion: '2.2.0',
  },
  {
    id: 'sync-retirement-script',
    name: 'Retirement-pointer sync script',
    description: 'v2.2 adds design/scripts/sync-retirement.js — validates that retired artifacts declare superseded_by / merged_into / supersedes pointers and that targets resolve to known IDs.',
    check: () => fileExists('design/scripts/sync-retirement.js'),
    infoOnly: true,
    instructions: 'Run `node design/scripts/sync-retirement.js` after any artifact is retired or replaced. Pulled in via `git pull` — no project-side bootstrap required.',
    addedInVersion: '2.2.0',
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
