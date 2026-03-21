#!/usr/bin/env node

/**
 * sync-manifest — Generate or update a mode's _upstream.md manifest
 *
 * Usage:
 *   node design/scripts/sync-manifest.js <mode-name>
 *
 * Example:
 *   node design/scripts/sync-manifest.js user-models
 */

import fs from 'fs';
import path from 'path';
import { MODES, parseVersionHeader } from './modes.js';

const [,, modeName] = process.argv;

if (!modeName) {
  console.error('Usage: sync-manifest.js <mode-name>');
  console.error(`Available modes: ${Object.keys(MODES).join(', ')}`);
  process.exit(1);
}

const mode = MODES[modeName];
if (!mode) {
  console.error(`Unknown mode: ${modeName}`);
  console.error(`Available modes: ${Object.keys(MODES).join(', ')}`);
  process.exit(1);
}

const projectRoot = path.resolve(import.meta.dirname, '../..');
const today = new Date().toISOString().slice(0, 10);

/**
 * Scan a file for its version header. Returns { path, version, updated } or null.
 */
function readFileVersion(filePath) {
  const resolved = path.resolve(projectRoot, filePath);
  if (!fs.existsSync(resolved)) return null;
  const stat = fs.statSync(resolved);
  if (stat.isDirectory()) return null;
  const firstLine = fs.readFileSync(resolved, 'utf-8').split('\n')[0];
  return parseVersionHeader(firstLine);
}

/**
 * Scan a directory (non-recursive) for files with version headers.
 * If input path ends with '/', treat as directory glob.
 */
function scanInputPath(inputPath) {
  const resolved = path.resolve(projectRoot, inputPath);

  // Directory input — scan all .md files inside
  if (inputPath.endsWith('/') || (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory())) {
    if (!fs.existsSync(resolved)) return [];
    const results = [];
    const entries = fs.readdirSync(resolved, { recursive: true });
    for (const entry of entries) {
      const full = path.join(resolved, entry);
      if (!full.endsWith('.md') || full.includes('_upstream.md')) continue;
      if (fs.statSync(full).isDirectory()) continue;
      const rel = path.relative(projectRoot, full);
      const ver = readFileVersion(rel);
      results.push({ path: rel, version: ver?.version ?? null, exists: true });
    }
    return results;
  }

  // Single file input
  if (!fs.existsSync(resolved)) {
    return [{ path: inputPath, version: null, exists: false }];
  }
  const ver = readFileVersion(inputPath);
  return [{ path: inputPath, version: ver?.version ?? null, exists: true }];
}

/**
 * Scan the mode's output directory for versioned artifacts.
 */
function scanOutputDir(outputDir) {
  const resolved = path.resolve(projectRoot, outputDir);
  if (!fs.existsSync(resolved)) return [];

  const results = [];
  const entries = fs.readdirSync(resolved, { recursive: true });
  for (const entry of entries) {
    const full = path.join(resolved, entry);
    if (!full.endsWith('.md') || full.includes('_upstream.md')) continue;
    if (fs.statSync(full).isDirectory()) continue;
    const rel = path.relative(projectRoot, full);
    const ver = readFileVersion(rel);
    if (ver) {
      results.push({ path: rel, version: ver.version, updated: ver.updated });
    }
  }
  return results;
}

// --- Build the manifest ---

const consumedArtifacts = [];
for (const inputPath of mode.inputs) {
  const scanned = scanInputPath(inputPath);
  consumedArtifacts.push(...scanned);
}

const producedArtifacts = scanOutputDir(mode.outputDir);

// Build markdown
let md = `# Upstream Manifest — ${modeName}\n`;
md += `<!-- last-run: ${today} -->\n\n`;

md += `## Consumed artifacts\n\n`;
if (consumedArtifacts.length === 0) {
  md += `_No upstream inputs (origin mode)._\n\n`;
} else {
  md += `| Artifact | Version | Status |\n`;
  md += `|----------|---------|--------|\n`;
  for (const a of consumedArtifacts) {
    const status = !a.exists ? 'missing' : a.version === null ? 'no header' : 'tracked';
    const ver = a.version !== null ? `v${a.version}` : '—';
    md += `| ${a.path} | ${ver} | ${status} |\n`;
  }
  md += `\n`;
}

md += `## Produced artifacts\n\n`;
if (producedArtifacts.length === 0) {
  md += `_No versioned artifacts found in ${mode.outputDir}/._\n\n`;
} else {
  md += `| Artifact | Version | Updated | Downstream consumers |\n`;
  md += `|----------|---------|---------|---------------------|\n`;
  for (const a of producedArtifacts) {
    md += `| ${a.path} | v${a.version} | ${a.updated} | ${mode.downstream.join(', ') || '—'} |\n`;
  }
  md += `\n`;
}

// Write manifest
const manifestPath = path.join(projectRoot, mode.outputDir, '_upstream.md');
const manifestDir = path.dirname(manifestPath);
if (!fs.existsSync(manifestDir)) {
  fs.mkdirSync(manifestDir, { recursive: true });
}
fs.writeFileSync(manifestPath, md);

const relManifest = path.relative(projectRoot, manifestPath);
console.log(`✓ Wrote ${relManifest}`);
console.log(`  Consumed: ${consumedArtifacts.length} artifact(s)`);
console.log(`  Produced: ${producedArtifacts.length} artifact(s)`);
