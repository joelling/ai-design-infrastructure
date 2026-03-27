#!/usr/bin/env node

/**
 * sync-traceability — Read-only validator for cross-artifact traceability
 *
 * Checks referential integrity between canvas briefs, story maps,
 * screen inventory, interaction specs, and business rules.
 *
 * Usage:
 *   node design/scripts/sync-traceability.js
 */

import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '../..');

const CANVAS_DIR = path.join(projectRoot, 'design/13_CANVAS');
const STORIES_DIR = path.join(projectRoot, 'design/05_STORIES');
const IA_DIR = path.join(projectRoot, 'design/06_INFORMATION_ARCHITECTURE');
const INTERACTION_DIR = path.join(projectRoot, 'design/07_INTERACTION');

const SCREEN_ID_PATTERN = /^(P-\d+|OV-\d+|DE-\d+)_/;
const STORY_ID_PATTERN = /DS-\d+/g;
const BR_PATTERN = /BR-\d+/g;
const HOST_PATTERN = /\*\*Host:\*\*.*?(P-\d+|OV-\d+|DE-\d+)/g;

let errorCount = 0;
let warningCount = 0;

// --- Helpers ---

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
    .filter(f => f.endsWith('.md') && f !== '_upstream.md')
    .map(f => ({ name: f, full: path.join(dir, f) }));
}

function extractStoryIds(text) {
  const ids = new Set();
  // Expand range notation: DS-009–026 or DS-033–DS-039
  const rangeRe = /DS-(\d+)[–\-](?:DS-)?(\d+)/g;
  let rangeMatch;
  while ((rangeMatch = rangeRe.exec(text)) !== null) {
    const start = parseInt(rangeMatch[1], 10);
    const end = parseInt(rangeMatch[2], 10);
    if (end > start && end - start < 100) {
      for (let i = start; i <= end; i++) {
        ids.add(`DS-${String(i).padStart(3, '0')}`);
      }
    }
  }
  // Individual IDs
  const matches = text.match(STORY_ID_PATTERN);
  if (matches) matches.forEach(id => ids.add(id));
  return [...ids];
}

function extractBrIds(text) {
  const matches = text.match(BR_PATTERN);
  return matches ? [...new Set(matches)] : [];
}

/**
 * Extract the full traceability section (## 2.) from a canvas brief.
 * Captures all subsections (2a, 2b, 2c) until the next top-level ## heading.
 */
function extractTraceabilitySection(content) {
  const lines = content.split('\n');
  let depth = 0; // heading level that triggered capture
  let capture = false;
  const sectionLines = [];
  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,4})\s/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      if (!capture && /traceability/i.test(line)) {
        // Start capturing at this heading level
        capture = true;
        depth = level;
        continue;
      }
      if (capture && level <= depth) {
        // A heading at the same or higher level ends the section
        break;
      }
    }
    if (capture) sectionLines.push(line);
  }
  return sectionLines.join('\n');
}

// --- Data loading ---

function loadStoryMapIds() {
  const storyFiles = listMdFiles(STORIES_DIR)
    .filter(f => /story.?map/i.test(f.name));
  const allIds = new Set();
  const reservedIds = new Set();
  for (const { full } of storyFiles) {
    const content = readFile(full);
    if (!content) continue;
    for (const line of content.split('\n')) {
      // Skip lines that explicitly declare IDs as reserved, retired, or not assigned
      if (/\breserved\b|\bretired\b|not assigned in this map/i.test(line)) {
        for (const id of extractStoryIds(line)) reservedIds.add(id);
        continue;
      }
      for (const id of extractStoryIds(line)) {
        if (!reservedIds.has(id)) allIds.add(id);
      }
    }
  }
  // Remove any reserved IDs that snuck in before the reserved line was encountered
  for (const id of reservedIds) allIds.delete(id);
  return { ids: allIds, files: storyFiles.map(f => f.name) };
}

function loadCanvasBriefs() {
  return listMdFiles(CANVAS_DIR).map(({ name, full }) => {
    const content = readFile(full) || '';
    const traceSection = extractTraceabilitySection(content);
    const screenIdMatch = name.match(SCREEN_ID_PATTERN);
    return {
      name,
      full,
      content,
      traceSection,
      screenId: screenIdMatch ? screenIdMatch[1] : null,
      storyIds: extractStoryIds(traceSection),
      brIds: extractBrIds(traceSection),
    };
  });
}

function loadScreenInventory() {
  const invPath = path.join(IA_DIR, 'screen-inventory.md');
  const content = readFile(invPath);
  if (!content) return [];

  const lines = content.split('\n');
  const screens = [];
  let currentScreenId = null;

  for (const line of lines) {
    // Detect screen heading: ### P-01 — ... or ### OV-02 — ...
    const headingMatch = line.match(/^#{1,4}\s+(P-\d+|OV-\d+|DE-\d+)\s*[—-]/);
    if (headingMatch) {
      currentScreenId = headingMatch[1];
      if (!screens.find(s => s.screenId === currentScreenId)) {
        screens.push({ screenId: currentScreenId, storyIds: [] });
      }
      continue;
    }

    // Detect "Stories served:" line under the current screen
    if (currentScreenId && /\*\*Stories served:\*\*/i.test(line)) {
      const screen = screens.find(s => s.screenId === currentScreenId);
      if (screen) {
        const ids = extractStoryIds(line);
        screen.storyIds.push(...ids.filter(id => !screen.storyIds.includes(id)));
      }
      continue;
    }

    // Also handle legacy table rows with a screen ID in column 1
    if (line.startsWith('|') && !/^\|\s*-+/.test(line) && !/Screen\s*ID/i.test(line)) {
      const cells = line.split('|').map(c => c.trim()).filter(Boolean);
      if (cells.length < 2) continue;
      const idMatch = cells[0].match(/(P-\d+|OV-\d+|DE-\d+)/);
      if (!idMatch) continue;
      const screenId = idMatch[1];
      const storyIds = extractStoryIds(line);
      const existing = screens.find(s => s.screenId === screenId);
      if (existing) {
        existing.storyIds.push(...storyIds.filter(id => !existing.storyIds.includes(id)));
      } else {
        screens.push({ screenId, storyIds, raw: line });
      }
    }
  }

  return screens;
}

function loadInteractionSpecs() {
  return listMdFiles(INTERACTION_DIR).map(({ name, full }) => {
    const content = readFile(full) || '';
    // Extract all host screen IDs
    const hostIds = new Set();
    let match;
    const hostRe = /\*\*Host:\*\*.*?(P-\d+|OV-\d+|DE-\d+)/g;
    while ((match = hostRe.exec(content)) !== null) {
      hostIds.add(match[1]);
    }
    return { name, full, content, hostIds: [...hostIds], brIds: extractBrIds(content) };
  });
}

// --- Checks ---

function check1_canvasToStory(briefs, storyMapIds) {
  console.log('\n--- 1. Canvas \u2192 Story ---');
  const orphans = [];
  for (const brief of briefs) {
    for (const sid of brief.storyIds) {
      if (!storyMapIds.has(sid)) {
        orphans.push({ brief: brief.name, storyId: sid });
      }
    }
  }
  if (orphans.length === 0) {
    console.log('\u2713 All story IDs in canvas briefs exist in story maps');
  } else {
    for (const { brief, storyId } of orphans) {
      console.log(`\u2717 ${brief}: ${storyId} not found in any story map`);
      errorCount++;
    }
  }
}

function check2_screenInventoryToCanvas(screens, briefs) {
  console.log('\n--- 2. Screen Inventory \u2192 Canvas ---');
  const canvasScreenIds = new Set(briefs.map(b => b.screenId).filter(Boolean));
  const missing = [];
  for (const screen of screens) {
    if (screen.storyIds.length > 0 && !canvasScreenIds.has(screen.screenId)) {
      missing.push(screen.screenId);
    }
  }
  if (missing.length === 0) {
    console.log('\u2713 All screens with stories have canvas briefs');
  } else {
    for (const sid of missing) {
      console.log(`\u2717 ${sid} has stories in screen inventory but no canvas brief`);
      errorCount++;
    }
  }
}

function check3_screenInventoryToStory(screens, storyMapIds) {
  console.log('\n--- 3. Screen Inventory \u2192 Story ---');
  const phantoms = [];
  for (const screen of screens) {
    for (const sid of screen.storyIds) {
      if (!storyMapIds.has(sid)) {
        phantoms.push({ screenId: screen.screenId, storyId: sid });
      }
    }
  }
  if (phantoms.length === 0) {
    console.log('\u2713 All story IDs in screen inventory exist in story maps');
  } else {
    for (const { screenId, storyId } of phantoms) {
      console.log(`\u2717 ${screenId}: ${storyId} not found in any story map`);
      errorCount++;
    }
  }
}

function check4_storyToScreen(storyMapIds, screens) {
  console.log('\n--- 4. Story \u2192 Screen (reverse) ---');
  const screensByStory = new Map();
  for (const screen of screens) {
    for (const sid of screen.storyIds) {
      if (!screensByStory.has(sid)) screensByStory.set(sid, []);
      screensByStory.get(sid).push(screen.screenId);
    }
  }
  const unassigned = [];
  for (const sid of [...storyMapIds].sort()) {
    if (!screensByStory.has(sid)) {
      unassigned.push(sid);
    }
  }
  if (unassigned.length === 0) {
    console.log('\u2713 All stories are assigned to at least one screen');
  } else {
    for (const sid of unassigned) {
      console.log(`\u26a0 ${sid} \u2014 not assigned to any screen`);
      warningCount++;
    }
  }
}

function check5_canvasToInteractionSpecs(briefs, specs) {
  console.log('\n--- 5. Canvas \u2192 Interaction Specs ---');
  let allGood = true;
  for (const brief of briefs) {
    if (!brief.screenId) continue;
    // Find specs that host this screen
    const hostingSpecs = specs.filter(s => s.hostIds.includes(brief.screenId));
    for (const spec of hostingSpecs) {
      // Check if the canvas traceability section mentions this spec file
      if (!brief.traceSection.includes(spec.name)) {
        console.log(`\u2717 ${brief.name}: missing reference to interaction spec "${spec.name}" (hosts ${brief.screenId})`);
        errorCount++;
        allGood = false;
      }
    }
  }
  if (allGood) {
    console.log('\u2713 All canvas briefs reference their hosting interaction specs');
  }
}

function check6_canvasToBusinessRules(briefs, storyMapContent, specs) {
  console.log('\n--- 6. Canvas \u2192 Business Rules ---');
  let allGood = true;

  // Build a map: story ID -> BR IDs from story maps and interaction specs
  const brByStory = new Map();
  for (const sid of storyMapContent.match(STORY_ID_PATTERN) || []) {
    // Crude: find BRs near each story mention in the story map
    // We'll just collect all BRs from the story map and specs
  }

  // Simpler approach: for each canvas brief, collect expected BRs from story map
  // lines containing its story IDs, and from interaction specs hosting its screen
  for (const brief of briefs) {
    const expectedBrs = new Set();

    // BRs from story map lines containing this brief's story IDs
    const storyMapLines = storyMapContent.split('\n');
    for (const sid of brief.storyIds) {
      for (const line of storyMapLines) {
        if (line.includes(sid)) {
          for (const br of extractBrIds(line)) {
            expectedBrs.add(br);
          }
        }
      }
    }

    // BRs from interaction specs that host this screen
    if (brief.screenId) {
      for (const spec of specs) {
        if (spec.hostIds.includes(brief.screenId)) {
          for (const br of spec.brIds) {
            expectedBrs.add(br);
          }
        }
      }
    }

    // Check if canvas traceability lists them
    const canvasBrs = new Set(brief.brIds);
    for (const br of expectedBrs) {
      if (!canvasBrs.has(br)) {
        console.log(`\u2717 ${brief.name}: missing business rule ${br}`);
        errorCount++;
        allGood = false;
      }
    }
  }
  if (allGood) {
    console.log('\u2713 All expected business rules are referenced in canvas briefs');
  }
}

function check7_filenameConvention(briefs) {
  console.log('\n--- 7. Filename Convention ---');
  const canvasFiles = listMdFiles(CANVAS_DIR);
  let allGood = true;
  for (const { name } of canvasFiles) {
    if (name === '_upstream.md') continue;
    if (!SCREEN_ID_PATTERN.test(name)) {
      console.log(`\u2717 ${name} does not match {ScreenID}_{name}.md pattern`);
      errorCount++;
      allGood = false;
    }
  }
  if (allGood) {
    console.log('\u2713 All canvas brief filenames conform to naming convention');
  }
}

function check8_storyScreenSummary(storyMapIds, screens) {
  console.log('\n--- 8. Story \u2192 Screen Summary ---');
  const screensByStory = new Map();
  for (const screen of screens) {
    for (const sid of screen.storyIds) {
      if (!screensByStory.has(sid)) screensByStory.set(sid, []);
      screensByStory.get(sid).push(screen.screenId);
    }
  }

  console.log('| Story   | Screens         |');
  console.log('|---------|-----------------|');
  for (const sid of [...storyMapIds].sort()) {
    const screenList = screensByStory.get(sid);
    const screensStr = screenList ? screenList.join(', ') : '(none)';
    console.log(`| ${sid.padEnd(7)} | ${screensStr.padEnd(15)} |`);
  }
}

// --- Main ---

console.log('=== Canvas \u2194 Stories Traceability Report ===');

const { ids: storyMapIds, files: storyMapFiles } = loadStoryMapIds();
const briefs = loadCanvasBriefs();
const screens = loadScreenInventory();
const specs = loadInteractionSpecs();

// Combine all story map content for BR lookups
let storyMapContent = '';
for (const f of storyMapFiles) {
  const content = readFile(path.join(STORIES_DIR, f));
  if (content) storyMapContent += content + '\n';
}

if (storyMapFiles.length === 0) {
  console.log('\n\u26a0 No story map files found in design/05_STORIES/');
  warningCount++;
}

check1_canvasToStory(briefs, storyMapIds);
check2_screenInventoryToCanvas(screens, briefs);
check3_screenInventoryToStory(screens, storyMapIds);
check4_storyToScreen(storyMapIds, screens);
check5_canvasToInteractionSpecs(briefs, specs);
check6_canvasToBusinessRules(briefs, storyMapContent, specs);
check7_filenameConvention(briefs);
check8_storyScreenSummary(storyMapIds, screens);

console.log(`\n=== Summary: ${errorCount} errors, ${warningCount} warnings ===`);

process.exit(errorCount > 0 ? 1 : 0);
