---
name: design-lint
description: >
  Cross-tier health check. Runs structural sync scripts (sync-status.js, sync-traceability.js)
  combined with LLM-based semantic validation to produce a severity-classified lint report
  (design/LINT_REPORT.md). Checks: persona confidence vs. evidence, orphaned business rules,
  uncovered interaction states, accessibility pattern gaps, research propagation, governance
  principle violations, and pending migration bootstraps. Triggers on: "design-lint",
  "health check", "what's out of sync", "orphaned artifacts", "are we ready for Tier 4",
  "anything broken in the design", "check the project", "run a design audit", "what gaps
  exist", "validate traceability", or any time before starting canvas briefs or a Figma session.
---

# Design Lint — Health Check Across All Tiers

> **Scope note — audit-skill split.** `design-lint` covers **cross-tier semantic health**: orphans, staleness, principle violations, propagation gaps. Figma-mechanical checks (tokens, auto-layout, detached components) live in `figma-audit`. Nielsen 10 heuristic evaluation lives in `design-validation`. All three are complementary — don't duplicate their work here.

## Purpose

Run a full health check across all design tiers. Combines mechanical script-based checks
(version staleness, traceability gaps) with LLM-based semantic checks (persona confidence,
governance violations, research propagation). Outputs a dated `design/LINT_REPORT.md`
classified by severity: Critical / Warning / Info.

Run before Tier 4 begins. Run after any research Phase B or governance Phase B synthesis.
Run any time something feels off.

---

## Dependency check

No upstream hard dependencies — lint is the upstream check. Read whatever exists.

Soft dependencies (the more that exist, the richer the lint run):
- `design/02_USER_MODELS/personas/` — for confidence tier checks
- `design/04_PROCESS_FLOWS/business-rules-register.md` — for BR orphan checks
- `design/07_INTERACTION/state-inventory.md` — for state coverage checks
- `design/10_ACCESSIBILITY/` — for accessibility propagation checks
- `design/11_VALIDATION/research-findings.md` — for research propagation checks
- `design/12_GOVERNANCE/design-principles.md` — for principle violation checks
- `design/13_CANVAS_BRIEFS/` — for canvas brief coverage
- `design/.migration-status.md` — for pending v2 bootstrap flags

---

## Upstream sync (step 0)

No upstream manifest check. Lint IS the staleness check — it reads raw artifacts directly.

After completing:
1. Write `design/LINT_REPORT.md` (overwrite if it exists — history is in git)
2. Add or increment version header on `LINT_REPORT.md`
3. Append a summary line to `design/DECISION_LOG.md` if it exists

### Script commands
```bash
node design/scripts/sync-status.js          # version staleness sweep
node design/scripts/sync-traceability.js    # bidirectional traceability validation
node design/scripts/sync-composition.js     # brief ↔ composition log structural checks
```

---

## Workflow

### Step 0 — Run structural scripts

Run `sync-status.js` and `sync-traceability.js`. Collect all reported issues.

### Step 1 — Semantic checks

Run these LLM-based checks. Read the relevant files and evaluate:

**1a — Persona confidence vs. evidence**
- Read each persona file's `<!-- confidence: -->` tier
- Read `design/11_VALIDATION/research-findings.md` if it exists
- Flag: any persona whose confidence tier appears higher than the evidence supports

**1b — Business rules orphan check**
- Read all BR-NNN IDs from `design/04_PROCESS_FLOWS/business-rules-register.md`
- Scan all canvas briefs in `design/13_CANVAS_BRIEFS/` for BR-NNN citations in traceability blocks
- Flag: any BR-NNN not referenced in any canvas brief (Warning unless Tier 4 has started, then Critical)

**1c — Interaction state coverage**
- Read all state IDs from `design/07_INTERACTION/state-inventory.md`
- Scan canvas briefs for state references
- Flag: any state defined but not covered in any canvas brief

**1d — Accessibility pattern coverage**
- Read ARIA patterns and keyboard nav plan entries from `design/10_ACCESSIBILITY/`
- Scan canvas briefs for accessibility section references to these patterns
- Flag: any pattern with zero canvas brief references

**1e — Research propagation**
- Read `design/11_VALIDATION/research-findings.md` — check each finding's increment flag
- For each flagged persona or story, check whether its version header has been updated since the finding's date
- Flag: any finding whose increment target shows no update

**1f — Governance principle violations**
- Read ESTABLISHED and CANONICAL principles from `design/12_GOVERNANCE/design-principles.md`
- Spot-check 3–5 recent canvas briefs for alignment with each principle
- Flag: any principle that appears violated or consistently ignored

**1g — Migration status**
- Check `design/.migration-status.md` for pending bootstraps
- Report each as an Info item

**1h — Composition log health (figma-screen-compose)**
- Brief ↔ composition log sync: every composition log in `design/15_FIGMA/composition-logs/` references a real brief; the brief sync-hash at composition time matches a real brief revision
- Orphan compositions: composition log exists for a brief that has been deleted
- Deviation backlog age: accepted deviations in composition logs that haven't been rolled back into brief edits in N days
- Missing-component queue age: `draft` inventory entries with `requested_by: figma-screen-compose` older than N days
- Run `node design/scripts/sync-composition.js` for the structural checks; the age/orphan semantic checks are LLM passes

### Step 2 — Classify by severity

| Severity | When to apply |
|---|---|
| 🔴 Critical | Blocks Tier 4 or creates unresolvable traceability gap |
| 🟡 Warning | Risk that should be resolved before Figma execution |
| 🟢 Info | Worth knowing; no immediate action required |

### Step 3 — Write the lint report

Write `design/LINT_REPORT.md`:

```markdown
<!-- artifact: design/LINT_REPORT.md | version: N | mode: design-lint | updated: YYYY-MM-DD -->

# Design Lint Report — YYYY-MM-DD

## Summary

| Severity | Count |
|---|---|
| 🔴 Critical | N |
| 🟡 Warning | N |
| 🟢 Info | N |

**Overall status:** Healthy / Needs attention / Blocked

---

## 🔴 Critical

### LNT-001 — [Short description]
**File:** `[artifact path]`
**Issue:** [What's wrong and why it blocks progress]
**Fix:** [Specific action to take]

---

## 🟡 Warning

### LNT-002 — [Short description]
[...]

---

## 🟢 Info

### LNT-003 — [Short description]
[...]

---

## Scripts run
- `sync-status.js` — [N issues]
- `sync-traceability.js` — [N issues]

## Scope
Tiers checked: [list artifact directories that existed]
```

### Step 4 — Present findings and prioritize

Present the report summary. For each Critical item, offer to help resolve it immediately.
For Warning items, ask whether to address them now or proceed with awareness.
Never auto-fix anything without explicit designer confirmation.

---

## Output checklist

- [ ] `design/LINT_REPORT.md` — written with findings by severity [synthesis]
- [ ] Version header incremented on `LINT_REPORT.md`
- [ ] `design/DECISION_LOG.md` — summary line appended (if log exists)

---

## Rules

- Never auto-fix. Lint reports; designer decides.
- Critical findings should be resolved before starting Tier 4 (canvas briefs).
- Warning findings should be reviewed before any Figma execution session.
- Run after every research Phase B or governance Phase B — these synthesis passes often leave propagation gaps.
- Lint findings that persist across 3+ consecutive runs without resolution signal a structural gap, not a temporary oversight — escalate them.
- Lint is idempotent: re-running overwrites `LINT_REPORT.md`. History is in git.
