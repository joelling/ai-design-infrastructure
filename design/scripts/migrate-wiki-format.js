#!/usr/bin/env node

/**
 * migrate-wiki-format — one-shot rewriter for `[text](path.md)` → `[[wikilink]]`
 *
 * v2.1 standardizes design/WIKI/ internal links on Obsidian `[[wikilink]]` syntax.
 * v2.0 wikis may contain `[text](path.md)` style links; this rewrites them in place.
 *
 * Scope:
 *   - Only rewrites links in design/WIKI/*.md
 *   - Only rewrites LOCAL links — external URLs, image links, and anchor-only links untouched
 *   - `[text](page.md)` → `[[page|text]]` (wikilink with alias if text differs from page name)
 *   - `[text](page.md#section)` → `[[page#section|text]]`
 *
 * Usage:
 *   node design/scripts/migrate-wiki-format.js            # rewrite in place
 *   node design/scripts/migrate-wiki-format.js --dry-run  # show what would change
 */

import fs from 'fs';
import path from 'path';

const projectRoot = path.resolve(import.meta.dirname, '../..');
const wikiDir = path.resolve(projectRoot, 'design/WIKI');

function parseArgs(argv) {
  const args = argv.slice(2);
  return {
    dryRun: args.includes('--dry-run'),
  };
}

/**
 * Convert a local markdown link `[text](target)` into a wikilink.
 * Returns the replacement string, or null if the link should be left alone.
 */
function toWikilink(text, target) {
  // Skip external, mailto, anchor-only
  if (/^(https?:\/\/|mailto:|#)/.test(target)) return null;
  // Skip image links (handled by negative lookbehind in caller, but defensive)
  // Skip links pointing outside WIKI (../ or paths without .md — rare but possible)
  if (target.includes('../')) return null;

  // Strip trailing .md and extract anchor
  let page = target;
  let anchor = '';
  const hashIdx = page.indexOf('#');
  if (hashIdx >= 0) {
    anchor = page.slice(hashIdx);
    page = page.slice(0, hashIdx);
  }
  page = page.replace(/\.md$/, '');
  // Strip leading ./ and any directory prefix (WIKI is flat)
  page = page.replace(/^\.\//, '');
  page = path.basename(page);

  if (!page) return null;

  const displayText = text.trim();
  // If display text matches the page name (case-insensitive, ignoring dashes/spaces),
  // emit bare wikilink without alias
  const norm = s => s.toLowerCase().replace(/[-_\s]+/g, '');
  if (norm(displayText) === norm(page)) {
    return `[[${page}${anchor}]]`;
  }
  return `[[${page}${anchor}|${displayText}]]`;
}

/**
 * Rewrite a markdown file's content.
 * Returns { content, replaced } where replaced is the count of rewrites.
 */
function rewriteContent(content) {
  let replaced = 0;
  // Match markdown links that are not image links: [text](target)
  // Negative lookbehind for ! avoids matching image syntax
  const pattern = /(?<!\!)\[([^\]\n]+)\]\(([^)\n]+)\)/g;
  const rewritten = content.replace(pattern, (match, text, target) => {
    const wikilink = toWikilink(text, target);
    if (wikilink === null) return match;
    replaced += 1;
    return wikilink;
  });
  return { content: rewritten, replaced };
}

function run() {
  const { dryRun } = parseArgs(process.argv);

  if (!fs.existsSync(wikiDir)) {
    console.log(`No design/WIKI/ directory found — nothing to migrate.`);
    process.exit(0);
  }

  const mdFiles = fs.readdirSync(wikiDir)
    .filter(f => f.endsWith('.md'))
    .map(f => path.join(wikiDir, f));

  if (mdFiles.length === 0) {
    console.log(`design/WIKI/ is empty — nothing to migrate.`);
    process.exit(0);
  }

  console.log(`\n═══ WIKI wikilink format migration ═══`);
  console.log(dryRun ? `(dry run — no files will be modified)\n` : ``);

  let totalReplaced = 0;
  let filesChanged = 0;

  for (const file of mdFiles) {
    const original = fs.readFileSync(file, 'utf-8');
    const { content, replaced } = rewriteContent(original);

    if (replaced === 0) continue;

    const rel = path.relative(projectRoot, file);
    console.log(`  ${rel}: ${replaced} link(s)${dryRun ? '' : ' rewritten'}`);
    totalReplaced += replaced;
    filesChanged += 1;

    if (!dryRun) fs.writeFileSync(file, content);
  }

  console.log(``);
  if (totalReplaced === 0) {
    console.log(`✓ No regular markdown links found. WIKI already uses wikilinks.`);
  } else {
    console.log(`${dryRun ? 'Would rewrite' : 'Rewrote'} ${totalReplaced} link(s) across ${filesChanged} file(s).`);
    if (dryRun) {
      console.log(`\nRe-run without --dry-run to apply changes.`);
    } else {
      console.log(`\nReview the diff (\`git diff design/WIKI/\`) before committing.`);
    }
  }
}

run();
