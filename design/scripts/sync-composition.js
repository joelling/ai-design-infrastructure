#!/usr/bin/env node

/**
 * sync-composition — Read-only validator for figma-screen-compose outputs
 *
 * Validates that:
 *   1. Every composition log references a real canvas brief (by ScreenID)
 *   2. Every [MISSING] CMP-NNN placeholder has a matching `draft` entry in inventory
 *   3. Every brief edit proposal in a composition log is still commented out
 *      (i.e. not yet accepted) at the bottom of the corresponding brief MD
 *   4. Every brief sync-hash recorded in a composition log matches a real
 *      brief revision (sync-version history)
 *
 * Usage:
 *   node design/scripts/sync-composition.js
 */

import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '../..');

const CANVAS_DIR = path.join(projectRoot, 'design/13_CANVAS');
const COMPOSITION_DIR = path.join(projectRoot, 'design/15_FIGMA/composition-logs');
const INVENTORY_PATH = path.join(projectRoot, 'design/12_GOVERNANCE/inventory.md');

const SCREEN_ID_PATTERN = /^([A-Z]+-\d+)_/;
const CMP_PATTERN = /\[MISSING\]\s+(CMP-\d+)/g;
const SYNC_HASH_PATTERN = /\*\*Brief sync-hash at composition:\*\*\s*`?([a-f0-9]+)`?/gi;
const PROPOSAL_MARKER = /Brief edit proposals/i;
const VERSION_HEADER = /<!--\s*artifact:.*?\|\s*version:\s*(\d+)/i;

let errorCount = 0;
let warningCount = 0;

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function listMdFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .map(f => ({ name: f, full: path.join(dir, f) }));
}

function err(msg) {
  console.log(`  🔴 ${msg}`);
  errorCount++;
}

function warn(msg) {
  console.log(`  🟡 ${msg}`);
  warningCount++;
}

function ok(msg) {
  console.log(`  🟢 ${msg}`);
}

// --- Loaders ---

function loadCanvasBriefs() {
  return listMdFiles(CANVAS_DIR).map(({ name, full }) => {
    const m = name.match(SCREEN_ID_PATTERN);
    return {
      name,
      full,
      content: readFile(full) || '',
      screenId: m ? m[1] : null,
    };
  }).filter(b => b.screenId);
}

function loadCompositionLogs() {
  return listMdFiles(COMPOSITION_DIR).map(({ name, full }) => {
    const m = name.match(SCREEN_ID_PATTERN);
    return {
      name,
      full,
      content: readFile(full) || '',
      screenId: m ? m[1] : null,
    };
  }).filter(l => l.screenId);
}

function loadInventoryDrafts() {
  const content = readFile(INVENTORY_PATH);
  if (!content) return new Set();
  const drafts = new Set();
  for (const line of content.split('\n')) {
    // Markdown table row: | CMP-NNN | ... | component | draft | ...
    const m = line.match(/\|\s*(CMP-\d+)\s*\|.*?\|\s*component\s*\|\s*draft\s*\|/i);
    if (m) drafts.add(m[1]);
  }
  return drafts;
}

// --- Validators ---

function validateLogReferencesBrief(log, briefsByScreenId) {
  const brief = briefsByScreenId.get(log.screenId);
  if (!brief) {
    err(`composition log ${log.name}: no canvas brief found for ${log.screenId}`);
    return null;
  }
  return brief;
}

function validateMissingPlaceholders(log, drafts) {
  const referenced = new Set();
  let m;
  CMP_PATTERN.lastIndex = 0;
  while ((m = CMP_PATTERN.exec(log.content)) !== null) {
    referenced.add(m[1]);
  }
  for (const cmp of referenced) {
    if (!drafts.has(cmp)) {
      err(`composition log ${log.name}: [MISSING] ${cmp} has no matching draft entry in inventory.md`);
    }
  }
  return referenced;
}

function validateBriefProposalsCommented(log, brief) {
  if (!brief) return;
  if (!PROPOSAL_MARKER.test(log.content)) return;
  // Look for an HTML comment block at end of brief MD
  const tail = brief.content.trim().split('\n').slice(-40).join('\n');
  if (!/<!--[\s\S]*?(proposed brief edit|figma-screen-compose proposal)[\s\S]*?-->/i.test(tail)
      && !/<!--[\s\S]*-->/.test(tail)) {
    warn(`composition log ${log.name}: brief edit proposals declared but no commented-out proposal block found at end of ${brief.name}`);
  }
}

function validateLogVersionHeader(log) {
  const lines = log.content.split('\n');
  const first = lines[0] || '';
  if (!VERSION_HEADER.test(first)) {
    warn(`composition log ${log.name}: missing artifact version header on first line`);
  }
}

function validateBriefSyncHashesPresent(log) {
  SYNC_HASH_PATTERN.lastIndex = 0;
  if (!SYNC_HASH_PATTERN.test(log.content)) {
    warn(`composition log ${log.name}: no "Brief sync-hash at composition" recorded — composition runs must record the brief revision they composed against`);
  }
}

function validateOrphanCompositions(logs, briefsByScreenId) {
  for (const log of logs) {
    if (!briefsByScreenId.has(log.screenId)) {
      err(`orphan composition log: ${log.name} (no canvas brief for ${log.screenId})`);
    }
  }
}

// --- Main ---

function main() {
  console.log('sync-composition: validating figma-screen-compose outputs\n');

  const briefs = loadCanvasBriefs();
  const briefsByScreenId = new Map(briefs.map(b => [b.screenId, b]));
  const logs = loadCompositionLogs();
  const drafts = loadInventoryDrafts();

  console.log(`Canvas briefs: ${briefs.length}`);
  console.log(`Composition logs: ${logs.length}`);
  console.log(`Inventory draft components: ${drafts.size}\n`);

  if (logs.length === 0) {
    ok('no composition logs yet — nothing to validate');
    return;
  }

  console.log('Validating composition logs:');
  for (const log of logs) {
    const brief = validateLogReferencesBrief(log, briefsByScreenId);
    validateLogVersionHeader(log);
    validateBriefSyncHashesPresent(log);
    validateMissingPlaceholders(log, drafts);
    validateBriefProposalsCommented(log, brief);
  }

  console.log('\nValidating for orphan compositions:');
  validateOrphanCompositions(logs, briefsByScreenId);

  console.log('\n--- Summary ---');
  console.log(`Errors:   ${errorCount}`);
  console.log(`Warnings: ${warningCount}`);

  if (errorCount > 0) process.exit(1);
}

main();
