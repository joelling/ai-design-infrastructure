#!/usr/bin/env node

/**
 * sync-status — Pipeline sweep: scan all manifests and report staleness
 *
 * Usage:
 *   node design/scripts/sync-status.js
 */

import fs from 'fs';
import path from 'path';
import { MODES, TIER_LABELS, parseVersionHeader } from './modes.js';

const projectRoot = path.resolve(import.meta.dirname, '../..');

/**
 * Read a file's version header. Returns version number or null.
 */
function getFileVersion(filePath) {
  const resolved = path.resolve(projectRoot, filePath);
  if (!fs.existsSync(resolved) || fs.statSync(resolved).isDirectory()) return null;
  const firstLine = fs.readFileSync(resolved, 'utf-8').split('\n')[0];
  const parsed = parseVersionHeader(firstLine);
  return parsed?.version ?? null;
}

/**
 * Scan a directory for the highest version among its .md files.
 * Used for directory-level inputs (e.g., 'design/user-models/personas/').
 */
function getDirectoryMaxVersion(dirPath) {
  const resolved = path.resolve(projectRoot, dirPath);
  if (!fs.existsSync(resolved)) return null;
  let maxVersion = null;
  const entries = fs.readdirSync(resolved, { recursive: true });
  for (const entry of entries) {
    const full = path.join(resolved, entry);
    if (!full.endsWith('.md') || full.includes('_upstream.md')) continue;
    if (fs.statSync(full).isDirectory()) continue;
    const rel = path.relative(projectRoot, full);
    const v = getFileVersion(rel);
    if (v !== null && (maxVersion === null || v > maxVersion)) {
      maxVersion = v;
    }
  }
  return maxVersion;
}

/**
 * Parse a manifest's consumed artifacts table.
 * Returns array of { path, version }.
 */
function parseManifest(manifestPath) {
  const resolved = path.resolve(projectRoot, manifestPath);
  if (!fs.existsSync(resolved)) return null;

  const content = fs.readFileSync(resolved, 'utf-8');
  const lines = content.split('\n');
  const consumed = [];
  let inConsumedTable = false;
  let headerSkipped = false;

  for (const line of lines) {
    if (line.startsWith('## Consumed artifacts')) {
      inConsumedTable = true;
      headerSkipped = false;
      continue;
    }
    if (line.startsWith('## ') && inConsumedTable) break;
    if (!inConsumedTable) continue;
    if (!line.startsWith('|')) continue;

    // Skip header and separator rows
    if (!headerSkipped) {
      if (line.includes('Artifact') || line.includes('---')) continue;
      headerSkipped = true;
    }

    // Actually, let's be more robust — skip if it contains header keywords
    if (line.includes('Artifact') || line.match(/^\|\s*-+/)) continue;

    const cells = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cells.length < 2) continue;

    const artifactPath = cells[0];
    const versionStr = cells[1];
    const version = versionStr.startsWith('v') ? parseInt(versionStr.slice(1)) : null;
    consumed.push({ path: artifactPath, version });
  }

  return consumed;
}

/**
 * Get the current version of an input (file or directory).
 */
function getCurrentVersion(inputPath) {
  if (inputPath.endsWith('/')) {
    return getDirectoryMaxVersion(inputPath);
  }
  return getFileVersion(inputPath);
}

// --- Pipeline sweep ---

const modeNames = Object.keys(MODES);
const results = [];
const staleSet = new Set();

for (const modeName of modeNames) {
  const mode = MODES[modeName];
  const manifestPath = path.join(mode.outputDir, '_upstream.md');
  const manifest = parseManifest(manifestPath);

  if (!manifest) {
    results.push({ modeName, mode, status: 'no-manifest', details: null });
    continue;
  }

  // Check each consumed artifact for staleness
  const staleInputs = [];
  for (const consumed of manifest) {
    if (consumed.version === null) continue; // untracked
    const currentVersion = getCurrentVersion(consumed.path);
    if (currentVersion !== null && currentVersion > consumed.version) {
      staleInputs.push({
        path: consumed.path,
        consumed: consumed.version,
        current: currentVersion,
      });
    }
  }

  if (staleInputs.length > 0) {
    results.push({ modeName, mode, status: 'stale', details: staleInputs });
    staleSet.add(modeName);
  } else {
    results.push({ modeName, mode, status: 'current', details: null });
  }
}

// Second pass: detect transitive staleness
for (const result of results) {
  if (result.status !== 'current') continue;
  const mode = result.mode;
  // Check if any input mode is stale
  for (const inputPath of mode.inputs) {
    // Find which mode owns this input path
    for (const [otherName, otherMode] of Object.entries(MODES)) {
      if (inputPath.startsWith(otherMode.outputDir) && staleSet.has(otherName)) {
        result.status = 'transitive';
        result.details = [{ via: otherName }];
        break;
      }
    }
    if (result.status === 'transitive') break;
  }
}

// --- Output ---

const today = new Date().toISOString().slice(0, 10);
console.log(`\nPipeline Status (${today})`);
console.log('─'.repeat(60));

let currentTier = 0;
for (const result of results) {
  const { modeName, mode, status, details } = result;

  // Print tier header
  if (mode.tier !== currentTier) {
    currentTier = mode.tier;
    console.log(`\n  Tier ${currentTier} — ${TIER_LABELS[currentTier]}`);
  }

  const pad = modeName.padEnd(18);
  switch (status) {
    case 'current':
      console.log(`  ✓ ${pad} current`);
      break;
    case 'stale':
      const staleDesc = details
        .map(d => `${d.path}: consumed v${d.consumed}, current v${d.current}`)
        .join('; ');
      console.log(`  ⚠ ${pad} STALE (${staleDesc})`);
      break;
    case 'transitive':
      console.log(`  ⚠ ${pad} STALE (transitive: ${details[0].via} is stale)`);
      break;
    case 'no-manifest':
      console.log(`  · ${pad} no manifest`);
      break;
  }
}

console.log('');

// Summary
const staleCount = results.filter(r => r.status === 'stale' || r.status === 'transitive').length;
const currentCount = results.filter(r => r.status === 'current').length;
const noManifestCount = results.filter(r => r.status === 'no-manifest').length;

if (staleCount > 0) {
  console.log(`${staleCount} stale, ${currentCount} current, ${noManifestCount} untracked`);
} else if (noManifestCount === results.length) {
  console.log('No manifests found. Run sync-manifest.js for each mode after its first execution.');
} else {
  console.log('All tracked modes are current.');
}
