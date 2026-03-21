#!/usr/bin/env node

/**
 * sync-version — Artifact version header helper
 *
 * Usage:
 *   node design/scripts/sync-version.js read  <file>              Print current version
 *   node design/scripts/sync-version.js init  <file> <mode-name>  Add header (version 1)
 *   node design/scripts/sync-version.js bump  <file>              Increment version
 */

import fs from 'fs';
import path from 'path';
import { parseVersionHeader, buildVersionHeader } from './modes.js';

const [,, command, filePath, modeName] = process.argv;

if (!command || !filePath) {
  console.error('Usage: sync-version.js <read|init|bump> <file> [mode-name]');
  process.exit(1);
}

const resolved = path.resolve(filePath);
if (!fs.existsSync(resolved)) {
  console.error(`File not found: ${resolved}`);
  process.exit(1);
}

const content = fs.readFileSync(resolved, 'utf-8');
const lines = content.split('\n');
const firstLine = lines[0];
const parsed = parseVersionHeader(firstLine);
const today = new Date().toISOString().slice(0, 10);

// Compute a relative path from the project root for the artifact path field
const projectRoot = path.resolve(import.meta.dirname, '../..');
const relativePath = path.relative(projectRoot, resolved);

switch (command) {
  case 'read': {
    if (!parsed) {
      console.log(`${relativePath}: no version header`);
    } else {
      console.log(`${parsed.path}: v${parsed.version} (${parsed.updated})`);
    }
    break;
  }

  case 'init': {
    if (parsed) {
      console.log(`${relativePath}: already has version header (v${parsed.version})`);
      process.exit(0);
    }
    if (!modeName) {
      console.error('init requires a mode name: sync-version.js init <file> <mode-name>');
      process.exit(1);
    }
    const header = buildVersionHeader({
      path: relativePath,
      version: 1,
      mode: modeName,
      updated: today,
    });
    fs.writeFileSync(resolved, header + '\n' + content);
    console.log(`${relativePath}: initialized at v1`);
    break;
  }

  case 'bump': {
    if (!parsed) {
      console.error(`${relativePath}: no version header to bump. Use 'init' first.`);
      process.exit(1);
    }
    const newVersion = parsed.version + 1;
    const newHeader = buildVersionHeader({
      ...parsed,
      version: newVersion,
      updated: today,
    });
    lines[0] = newHeader;
    fs.writeFileSync(resolved, lines.join('\n'));
    console.log(`${relativePath}: v${parsed.version} → v${newVersion}`);
    break;
  }

  default:
    console.error(`Unknown command: ${command}. Use read, init, or bump.`);
    process.exit(1);
}
