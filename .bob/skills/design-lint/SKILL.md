---
name: design-lint
description: >
  Cross-tier design health check. Runs structural sync scripts (sync-status.js,
  sync-traceability.js, sync-composition.js) combined with semantic validation to
  produce a severity-classified report at design/LINT_REPORT.md. Checks persona
  confidence vs. evidence, orphaned business rules, uncovered interaction states,
  accessibility gaps, research propagation, governance principle violations, pending
  migrations, and composition-log health. Triggers on: "design-lint", "health check",
  "what's out of sync", "orphaned artifacts", "are we ready for Tier 4", "anything
  broken", "design audit", "gaps", "validate traceability", or before starting
  canvas briefs or a Figma session.
---

<!-- mirror: bob | SSOT: design/process/19-lint.md -->

# design-lint — Cross-Tier Health Check (Bob)

## Purpose

Give the designer a prioritized list of findings across the corpus. Never auto-fix — report, classify, and offer to help resolve Critical items one at a time.

## Workflow

### Step 0 — Upstream check

Confirm the design pipeline has produced at least Tier 1 artifacts. If `design/` is essentially empty, stop and suggest `design-discovery` first.

### Step 1 — Structural sync (scripts)

Run these via BobShell, sequentially, capturing exit codes and output:

1. `node design/scripts/sync-status.js` — pipeline staleness.
2. `node design/scripts/sync-traceability.js` — bidirectional ↔ consistency between canvas briefs ↔ story map ↔ screen inventory ↔ interaction specs ↔ business rules.
3. `node design/scripts/sync-composition.js` — composition logs ↔ briefs ↔ inventory.
4. `node design/scripts/sync-wiki.js` (if wiki exists) — stale wiki pages.
5. `node design/scripts/sync-retirement.js` — retirement-pointer integrity.
6. `node design/scripts/migrate.js` — pending v2 bootstraps.

### Step 2 — Semantic checks

Read the full tier corpus. Evaluate against:

- **Persona confidence vs. evidence** — do persona confidence labels match the research evidence in `design/11_RESEARCH/research-findings.md`?
- **Business-rule orphans** — every `BR-NN` in `business-rules-register.md` traced to at least one story AC and one interaction spec.
- **Interaction-state coverage** — every screen in `screen-inventory.md` has a matching state inventory entry.
- **Accessibility gaps** — every interactive component pattern referenced in canvas briefs has a WCAG/ARIA pattern documented.
- **Research propagation** — RF-NNN findings propagated to downstream flags in user-models and stories.
- **Governance principle violations** — patterns flagged by `figma-audit` that should have elevated to a GP-NNN principle.
- **Composition-log health** — every Figma-composed screen has a log; every log references a brief; every `[MISSING]` placeholder is in the parking lot.

### Step 3 — Classify

Each finding is 🔴 Critical / 🟡 Warning / 🟢 Info.

- **Critical** — blocks Tier 4 or produces wrong output: broken traceability, missing hard-block dependencies, contradictions between SSOTs.
- **Warning** — drift that is recoverable: stale upstream, soft-gate bypasses, persona confidence mismatches.
- **Info** — improvement opportunities: un-elevated patterns, undocumented decisions, wiki staleness.

### Step 4 — Write report

Overwrite `design/LINT_REPORT.md`. Structure:

1. Timestamp + artifact version bump.
2. Summary counts per severity.
3. 🔴 Critical section — each finding with: source, evidence (file + line / artifact id), suggested resolution, affected downstream.
4. 🟡 Warning section.
5. 🟢 Info section.
6. Script outputs (raw, collapsible).

Append a one-line summary to `design/DECISION_LOG.md` (format: `## {date} — Lint pass: {N crit}/{N warn}/{N info}`).

### Step 5 — Offer help

For each 🔴 Critical, ask the user whether to help resolve now. Never auto-fix. If the user accepts, route to the appropriate skill (e.g., missing persona confidence → `design-user-models`; composition drift → `figma-handoff`).

## Rules

- Never modify any artifact other than `LINT_REPORT.md` and an appended line in `DECISION_LOG.md`.
- Run every structural script — don't skip because one is noisy; flag the noise as a finding.
- Critical findings should be resolved before entering Tier 4.
- After any research or governance Phase B synthesis, re-run to catch propagation gaps.
- Bob runs scripts sequentially; expect a 30–90s total runtime on a mid-size corpus. Report progress between scripts.
