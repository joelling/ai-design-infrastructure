# Design Lint

> **Cross-cutting — all tiers | Lifecycle** | Mode: `design-lint`

## Why this matters

Design artifacts drift. Stories acquire orphaned acceptance criteria. Interaction states get specified but never land in a canvas brief. Research findings update a persona's confidence but the persona file itself never changes. Accessibility specs are written but no Figma annotation traces back to them. None of these drift silently enough to cause an immediate failure — but they accumulate and compound, and by the time you notice, you're fixing a canvas brief that references a deleted persona.

Design Lint is your health check. It combines script-based structural validation with LLM-based semantic validation, and produces a dated, citable health snapshot you can act on.

## The mental model

You are reading the project as a whole — not through the lens of any single design mode, but as a systems check across all tiers. You ask:

- **Orphan check:** Are there artifacts that nothing references, or references that point to artifacts that don't exist?
- **Coverage check:** Are there things that should be present (based on what other artifacts require) but aren't?
- **Consistency check:** Do artifacts agree with each other, or have they drifted semantically?
- **Confidence check:** Do user model confidence tiers match the evidence that's been gathered?
- **Propagation check:** Have research findings, governance decisions, and audit results been incorporated into the artifacts that depend on them?

The output is a health report by severity — not a list of things Claude should fix automatically, but a clear prioritized list the designer can act on.

## Inputs

| Source | What lint examines |
|---|---|
| All `design/*/` artifact directories | Structural integrity, version headers, upstream manifests |
| `design/02_USER_MODELS/personas/` | Confidence tiers vs. evidence in research findings |
| `design/04_PROCESS_FLOWS/business-rules-register.md` | BR-NNN tags — are all referenced in canvas briefs? |
| `design/05_STORIES/story-map.md` | DS-NNN IDs — are all referenced in canvas briefs and BRD? |
| `design/07_INTERACTION/state-inventory.md` | States — are all covered in at least one canvas brief? |
| `design/10_ACCESSIBILITY/` | ARIA patterns and keyboard nav — are all referenced in canvas briefs? |
| `design/11_VALIDATION/research-findings.md` | Findings — have confidence tiers in personas been updated? |
| `design/12_GOVERNANCE/design-principles.md` | Principles — are any violated in canvas briefs or Figma audit findings? |
| `design/13_CANVAS/` | Canvas briefs — traceability blocks, frame inventory completeness |
| `design/.migration-status.md` | Pending v2 bootstraps (wiki, decision log) |

## Upstream sync

**On entry:** Run structural sync scripts immediately. No upstream staleness check needed — lint IS the staleness check.

**On completion:**
1. Write `design/LINT_REPORT.md` with the full findings
2. Append a summary entry to `design/DECISION_LOG.md` if it exists (date, scope, critical count, warning count)
3. Report what should be fixed before Tier 4 begins (critical items)

## Process

### Step 0 — Run structural sync scripts

Run the following scripts and capture their output. These are the mechanical checks:

```bash
node design/scripts/sync-status.js          # version staleness sweep
node design/scripts/sync-traceability.js    # bidirectional traceability validation
```

Collect all reported issues. Classify them into the severity model below.

### Step 1 — Semantic health checks (LLM-based)

For each check, read the relevant files and evaluate:

**Persona confidence vs. evidence**
- For each persona in `design/02_USER_MODELS/personas/`: note the `<!-- confidence: -->` tier
- Read `design/11_VALIDATION/research-findings.md` if it exists
- Check: does the evidence level in research findings match the stated confidence tier? A persona marked `evidence-grounded` should have at least 2–3 research finding citations in its file or in the findings document.
- Flag: any persona whose confidence tier appears optimistic relative to the evidence present

**Business rules coverage**
- Read `design/04_PROCESS_FLOWS/business-rules-register.md` for all BR-NNN IDs
- Check each canvas brief in `design/13_CANVAS/` for BR-NNN references in the traceability block
- Flag: any BR-NNN that appears in the register but is referenced in zero canvas briefs

**Interaction states coverage**
- Read `design/07_INTERACTION/state-inventory.md` for all defined states
- Check canvas briefs for state references
- Flag: any state defined in the inventory but not covered by any canvas brief

**Accessibility pattern coverage**
- Read `design/10_ACCESSIBILITY/aria-patterns.md` and `keyboard-nav-plan.md`
- Check canvas briefs for accessibility section references to these patterns
- Flag: any ARIA pattern or keyboard nav plan entry not referenced in any canvas brief

**Research propagation**
- Read `design/11_VALIDATION/research-findings.md` if it exists
- Check whether each finding has an increment flag to a specific persona or story (RF-NNN → persona / story)
- Cross-check: has the flagged persona's `<!-- confidence: -->` tier been updated since the finding was written? (compare dates via version headers)
- Flag: any finding whose increment target has not been updated

**Governance principle violations**
- Read `design/12_GOVERNANCE/design-principles.md` if it exists
- For each ESTABLISHED or CANONICAL principle, read 3–5 recent canvas briefs
- Flag: any principle that appears to be violated or underapplied in the canvas briefs reviewed
- Do not check EMERGING principles — they're still accumulating evidence

**Migration status**
- Check if `design/.migration-status.md` exists
- If it does and lists pending bootstraps, report them as Info-level items

### Step 2 — Classify findings by severity

Apply this model to all findings from Steps 0 and 1:

| Severity | Definition | Example |
|---|---|---|
| 🔴 **Critical** | Blocks Tier 4 progress or creates unresolvable traceability gaps | Canvas brief missing traceability block; story ID in BRD not found in story-map.md |
| 🟡 **Warning** | Should be fixed before starting Figma execution; won't block but creates downstream risk | BR-07 not referenced in any canvas brief; persona confidence tier appears optimistic |
| 🟢 **Info** | Observations worth tracking; no action required immediately | Pending v2 bootstrap; research finding not yet incorporated (finding is recent) |

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

**Overall status:** [Healthy / Needs attention / Blocked]

---

## 🔴 Critical

### [Finding ID] — [Short description]
**File:** `[artifact path]`
**Issue:** [What's wrong]
**Fix:** [Specific action to take]

[repeat for each critical finding]

---

## 🟡 Warning

### [Finding ID] — [Short description]
[...]

---

## 🟢 Info

### [Finding ID] — [Short description]
[...]

---

## Scripts run

- `sync-status.js` — [N issues found]
- `sync-traceability.js` — [N issues found]

## Scope

Tiers checked: [list which artifact directories existed and were checked]
```

### Step 4 — Present and prioritize

Present findings to the designer. For each Critical item, offer to help fix it immediately. For Warning items, ask whether to address them now or proceed. Do not auto-fix anything without designer confirmation.

## Outputs

| File | Type | What it contains |
|---|---|---|
| `design/LINT_REPORT.md` | synthesis | Dated health report with all findings by severity |

*`LINT_REPORT.md` is versioned and dated — old reports are overwritten on each run. History is visible via git.*

## Rules

- Lint never fixes anything automatically. It reports and prioritizes; the designer decides what to act on.
- Critical findings should be resolved before starting Tier 4.
- Warning findings should be reviewed before any Figma execution session.
- Lint can be run at any tier at any time — it is not a one-time gate.
- When design-lint runs after a research Phase B or governance Phase B, run it within the same session to catch propagation gaps immediately.
- Lint findings that persist across 3+ consecutive runs without being addressed should be escalated — they signal a structural gap, not a temporary oversight.

## Feeds into

- **`design-canvas`** — critical lint findings should be resolved before canvas briefs are generated
- **`design-query`** — contradiction findings flagged to the lint queue by query are sourced from this report
- **`design-governance` Phase B** — repeated warning patterns across runs are synthesis evidence
- **`design-wiki`** (via `design-query`) — lint report summary is indexed in project wiki health section
