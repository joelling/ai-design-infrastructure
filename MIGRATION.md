# Upgrading to v2

This guide is for designers who already have a project using this toolchain (v1) and want to upgrade to v2.

**v2 adds three new capabilities:**
1. **`design-query`** — Ask natural-language questions about your entire project and get cited answers. Also bootstraps a cross-referenced Project Wiki (`design/WIKI/`).
2. **`design-lint`** — Run a full health check across all tiers and get a severity-classified report (`design/LINT_REPORT.md`).
3. **Decision Log** — Append-only record of key design decisions with evidence and trade-offs (`design/DECISION_LOG.md`).

None of this touches your existing artifacts. All your personas, stories, journeys, canvas briefs, and Figma files stay exactly as they are.

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

Claude will read `design/.migration-status.md` and tell you what's pending. There are three possible responses:

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
