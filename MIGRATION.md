# Upgrading to v2 / v2.1

This guide is for designers who already have a project using an older version of this toolchain and want to upgrade.

**v2 added three capabilities:**
1. **`design-query`** — Ask natural-language questions about your entire project and get cited answers. Also bootstraps a cross-referenced Project Wiki (`design/WIKI/`).
2. **`design-lint`** — Run a full health check across all tiers and get a severity-classified report (`design/LINT_REPORT.md`).
3. **Decision Log** — Append-only record of key design decisions with evidence and trade-offs (`design/DECISION_LOG.md`).

**v2.1 adds a cleanup layer on top:**
1. **Operational-model lens** — every process chapter carries an `operation:` tag (Ingest / Query / Lint). The viewer exposes a `By Tier` / `By Operation` toggle.
2. **Automatic wiki format migration** — v2.0 wikis with `[text](path.md)` links are rewritten to `[[wikilink]]` format. Script detects and prompts on `git pull`.
3. **BRD manifest consolidation** — the standalone `BRD_manifest.md` merges into `BRD.xlsx` as a "Manifest" sheet. One file going forward.
4. **Thinking directory cleanup** — `design/thinking/` essays retire; the agentic-design narrative moves to `WIKI/about.md`.
5. **Batch ingest orchestrator** — `design/scripts/ingest-batch.js` runs discovery over a backlog of inputs in one pass and re-runs affected downstream modes in dependency order.
6. **Audit-skill split clarified** — `figma-audit` is Figma-mechanical only; Nielsen heuristics live in `design-validation`; cross-tier semantic checks live in `design-lint`.

None of this touches your existing artifacts. Personas, stories, journeys, canvas briefs, and Figma files stay exactly as they are.

---

## Step 1 — Get the update

**Using a Git client (GitHub Desktop, Sourcetree, Tower):**
1. Open the project in your Git client
2. Click **Pull** (or "Fetch origin" then "Pull")

**Using the terminal:**
```bash
git pull
```

**If the repo is managed by someone else:** Ask them to pull the latest and let you know when it's done.

---

## Step 2 — Check what needs to be set up

Open Claude Code in your project. Then type:

> **"Check if my project needs any v2 migration steps."**

Claude will read `design/.migration-status.md` and tell you what's pending. The most common responses below — depending on which version you're upgrading from, you may see one or several.

---

### Nothing to do

> "Your project is fully up to date."

All v2 features are already set up. Skip to [Using the new features](#using-the-new-features).

---

### Wiki bootstrap needed

Your project has existing design artifacts but the Project Wiki hasn't been generated yet.

1. Claude will explain what it's going to do and ask if you want to proceed
2. Say: **"Yes, run the wiki bootstrap"**
3. Claude reads all your existing artifacts and generates `design/WIKI/` — this may take a few minutes
4. When it's done, Claude gives you a summary of what was created

---

### Decision Log setup needed

1. Claude offers two options:
   - **Automatic reconstruction** — Claude reads existing artifacts and extracts decisions that have documented rationale. Takes ~2 minutes.
   - **Start fresh** — Log starts empty and fills in automatically from today forward.
2. If you chose automatic, Claude shows you the reconstructed entries and asks you to fill in anything missing (trade-offs, implicit decisions, historical context)
3. Say **"Looks good, save the log"** when you're satisfied

> The automatic reconstruction captures only decisions that were documented in artifact rationale sections. Implicit decisions — why one persona was prioritized, why a journey was scoped a certain way — won't be there. Fill those in manually if they matter.

---

### WIKI wikilink format rewrite (v2.1)

Your project has a v2.0 wiki with `[text](path.md)` style links. v2.1 standardizes on Obsidian `[[wikilink]]` syntax so the wiki renders correctly in Obsidian's graph view.

Say: **"Run the wiki format migration"**

Claude will run `node design/scripts/migrate-wiki-format.js`, which rewrites links in place across `design/WIKI/*.md`. Review the diff (`git diff design/WIKI/`) before committing.

Dry-run first if you want a preview:
```bash
node design/scripts/migrate-wiki-format.js --dry-run
```

---

### BRD Manifest consolidation (v2.1)

The standalone `design/BRD_manifest.md` is being retired — its contents move into `design/BRD.xlsx` as a "Manifest" sheet. Single source, single file.

Say: **"Run the BRD manifest migration"**

Claude will run `python design/scripts/sync-brd.py --migrate-manifest`, which copies the table into the xlsx and deletes the `.md` file. Your existing BRD data is untouched.

---

### Thinking directory cleanup (v2.1)

`design/thinking/` contains legacy essays and the agentic-design narrative. v2.1:
- Moves `agentic-design-narrative.md` → `design/WIKI/about.md` (preserved)
- Archives `ai-design-infrastructure-summary.md` for you to fold manually into README.md (not auto-written — READMEs are hand-crafted)
- Deletes three essays (`intentionality-led-design.md`, `signal-and-contact.md`, `the-designers-new-discipline.md`)

Say: **"Run the thinking directory cleanup"**

Claude will run `node design/scripts/migrate-thinking.js`. Dry-run first if you want a preview:
```bash
node design/scripts/migrate-thinking.js --dry-run
```

---

### Informational notes (v2.1)

These show up in the status file but require no action:

- **Batch ingest orchestrator available** — `node design/scripts/ingest-batch.js <dir>` processes a backlog of raw inputs in one pass. Use it only if you want to — the per-mode flow still works.
- **Audit-skill split** — `figma-audit` no longer includes Nielsen 10 heuristics. Use `design-validation` for heuristic evaluation going forward. No artifact impact.

---

## Step 3 — Verify with a health check

After migration, ask Claude:

> **"Run design-lint and show me the results."**

You'll get a report at three severity levels:

- 🔴 **Critical** — blocks next steps (rare, needs immediate action)
- 🟡 **Warning** — should fix before starting Figma execution
- 🟢 **Info** — good to know, no action required

Address any Critical items before starting Tier 4 work. Warnings are at your discretion.

---

## Using the new features

### Asking questions about your project

Just ask Claude naturally:

- *"What do we know about users who are anxious about privacy?"*
- *"Which screens are affected by business rule BR-07?"*
- *"What design decisions have we made about the onboarding flow?"*
- *"Are there any gaps in our coverage for the payment journey?"*

Claude searches your artifact corpus and wiki, then gives you a cited answer. If the answer reveals a gap or contradiction, it will ask if you want to log it.

### Running a health check

Say **"run design-lint"** at any time. Good moments:
- Before starting a new Tier 4 screen
- After a round of changes to upstream artifacts
- After a `design-research` or `design-governance` synthesis run
- When something feels off

### Browsing the wiki

The wiki lives at `design/WIKI/index.md`. Open it in any markdown viewer, or ask Claude:
- *"Show me a summary of our personas from the wiki"*
- *"What does the wiki say about our design principles?"*

---

## Automatic detection on future git pulls

To have the migration check run automatically every time you pull:

```bash
cp design/scripts/post-merge-hook.sh .git/hooks/post-merge
chmod +x .git/hooks/post-merge
```

After this, `git pull` will print a summary if new capabilities need bootstrapping.

To check migration status at any time without Claude:

```bash
node design/scripts/migrate.js
```

---

## Troubleshooting

**Claude says it can't find migration status:**
> "Check what's in the design folder and tell me if design/.migration-status.md exists."

If it doesn't exist:
> "Run the v2 migration check manually."

**Wiki bootstrap stopped partway through:**
This can happen on large projects. Say:
> "Resume the wiki bootstrap from where it stopped."

**Something looks wrong in the Decision Log:**
The automatic reconstruction is a starting point, not a finished document. Say:
> "Open the decision log and let's review and correct the entries together."

**You're not sure which version the toolchain is on:**
> "What version of the toolchain is this project using?"

---

## What you don't need to do

- Re-run any existing design modes — existing artifacts are untouched
- Update your Figma files
- Modify the BRD
- Change how you work with Claude day-to-day — the new features add on top of your existing workflow
