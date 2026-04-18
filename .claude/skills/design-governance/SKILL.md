---
name: design-governance
description: >
  Two-phase governance mode. Phase A (init): establishes the governance framework —
  versioning scheme, contribution guidelines, deprecation policy, and naming authority,
  using templates customized for the project. Runs once after visual language is established.
  Phase B (synthesis): periodically reads accumulated design decisions (validation findings,
  audit violations, canvas brief patterns, designer overrides) and codifies implicit
  conventions as explicit design principles, elevates recurring patterns, and refines quality
  gates. Triggers on: "governance", "design system versioning", "contribution guide",
  "deprecation", "component lifecycle", "naming convention authority", "change management",
  "design principles", "what patterns have we established", "what have we learned",
  "codify conventions", "principle audit", or when the design system needs lifecycle
  management rules or periodic synthesis of accumulated design knowledge.
---

# Design System Governance — Framework + Living Synthesis

## Purpose

**Phase A:** Define the rules for how the design system evolves — versioning, contribution, deprecation, naming authority. Run once after visual language is established.

**Phase B:** Watch the accumulation of design decisions across the project. Identify implicit conventions. Codify them as explicit principles with evidence traces. Manage the principle lifecycle. Elevate recurring patterns. Refine quality gates. Run periodically.

---

## Dependency check

### Phase A — soft dependencies (warn if missing, don't block)
- `design/08_VISUAL/visual-language.md` — establishes the visual rules governance enforces
- Component inventory (from Figma or design artifacts) — for naming authority categories

### Phase B — synthesis sources (report what's available, proceed with what exists)
- `design/11_VALIDATION/heuristic-evaluation.md` — all runs
- `figma-audit` findings since last synthesis run
- `figma-handoff` detected changes since last synthesis run
- `design/13_CANVAS/` — all canvas briefs
- `design/07_INTERACTION/interaction-model.md`
- `design/12_GOVERNANCE/changelog.md`
- Figma inventory lifecycle events
- `figma-screen-compose` Phase A pattern reports (e.g. "12 of 14 list views share Header→Filter→ListItem") — Template promotion candidates
- Clusters of `draft` inventory entries with `requested_by: figma-screen-compose` (multiple screens needing the same component) — DS roadmap signal

---

## Upstream sync (step 0)

**Phase A (first run):**
0. Check if `design/12_GOVERNANCE/versioning.md` exists. If yes, governance is already initialized — ask whether this is a Phase B synthesis run or a targeted governance update.
1. Value alignment check: if `design/01_DISCOVERY/value-framework.md` exists, verify outputs trace to a vision element or driver.
2. Note which Phase A inputs are available. Proceed regardless.

**Phase B (synthesis runs):**
0. Check `design/12_GOVERNANCE/principle-audit.md` for the last synthesis run date.
1. Identify what has accumulated since then: new validation runs, new audit results, new canvas briefs, new handoff events.
2. If nothing meaningful has accumulated (fewer than 3 new canvas briefs AND no new validation/audit), report that and exit.
3. Report accumulation scope to the designer before proceeding.

After completing either phase:
1. Add or increment `<!-- artifact: ... -->` version headers on all changed output files
2. Update `design/12_GOVERNANCE/_upstream.md` with consumed and produced artifact versions
3. Report which downstream modes are now potentially stale

### Script commands
```bash
node design/scripts/sync-status.js                                    # check staleness
node design/scripts/sync-version.js init <file> design-governance    # first time
node design/scripts/sync-version.js bump <file>                      # subsequent updates
node design/scripts/sync-manifest.js governance                      # update manifest
```

---

## Workflow — Phase A: Init

### Step 1 — Copy governance framework templates

Copy each template from `design/templates/` if the output file does not already exist:

| Template | Output path |
|---|---|
| `design/templates/versioning.tpl.md` | `design/12_GOVERNANCE/versioning.md` |
| `design/templates/contribution-guide.tpl.md` | `design/12_GOVERNANCE/contribution-guide.md` |
| `design/templates/deprecation-policy.tpl.md` | `design/12_GOVERNANCE/deprecation-policy.md` |
| `design/templates/changelog.tpl.md` | `design/12_GOVERNANCE/changelog.md` |
| `design/templates/design-principles.tpl.md` | `design/12_GOVERNANCE/design-principles.md` |

### Step 2 — Customize with project-specific decisions

Fill the `<!-- PROJECT-SPECIFIC -->` sections in each copied file:

**contribution-guide.md — naming authority:**
```markdown
### Naming authority
Category list: [derive from component inventory — e.g. Form/, Navigation/, Feedback/, Data/, Layout/]
Convention: Category/ComponentName — no exceptions
Hidden components: `.` prefix — no exceptions
New categories require approval from: [name or role]

### Quality gate
Before a component enters the library it must pass:
- [ ] figma-audit — zero violations
- [ ] All states from design-interaction state inventory represented
- [ ] Content follows design-content patterns
- [ ] Accessibility patterns from design-accessibility applied
- [ ] Auto-layout applied — no absolute x/y positioning
- [ ] ZERO hardcoded values — every fill, spacing, radius references a variable
- [ ] Description filled in Properties panel
- [ ] [Add project-specific visual language rules from design/08_VISUAL/visual-language.md]

### Approval roles
- Naming authority: [name or role]
- Component review: [name or role]
- Breaking change approval: [name or role]
```

**deprecation-policy.md — timeline and support:**
```markdown
### Sunset timeline
[N sprints / N weeks] between deprecation notice and removal

### Migration support commitment
[Script provided / One-to-one replacement documented / Notice only]
```

### Step 3 — Initialize the principles file

`design-principles.md` starts empty after template copy. Add the initialization record:

```markdown
<!-- Governance initialized: [YYYY-MM-DD] -->
<!-- No principles yet. Principles are populated by Phase B synthesis passes. -->
```

---

## Workflow — Phase B: Synthesis

### Step 0 — Scope the accumulation

Check `principle-audit.md` for the last synthesis run date. Report:
- Canvas briefs created/updated since last run
- Validation runs completed
- Audit passes completed
- Figma-handoff overrides detected

If accumulation is insufficient (fewer than 3 canvas briefs AND no new validation/audit), report and exit.

### Step 1 — Scan accumulation sources

For each available source since the last synthesis run, extract signals:

| Source | Extraction |
|---|---|
| Heuristic evaluations | Severity-2+ findings; group by heuristic and screen area |
| Audit findings | Violation types and counts; flag any type appearing 3+ times |
| Handoff changes | Element types consistently overridden; note override pattern |
| Canvas briefs | Recurring component types across screens; layout patterns in 3+ briefs |
| Interaction model | Patterns assigned to 4+ screens |
| Changelog | Components modified 3+ times; note what type of change recurs |

### Step 2 — Extract implicit conventions

For each signal, classify:

```
READY TO CODIFY       — 3+ independent sources, pattern is clear
NEEDS MORE EVIDENCE   — pattern exists, fewer than 3 data points
ALREADY CODIFIED      — matches an existing principle → update evidence trace
CONTRADICTS EXISTING  — conflicts with a current principle → flag for lifecycle review
```

Present the classification to the designer before proceeding to Step 3.

### Step 3 — Codify as principles

For each "ready to codify" candidate, add an entry to `design-principles.md`:

```markdown
## GP-[NNN] — [Principle statement — imperative, specific, actionable]

**State:** emerging
**Emerged:** [YYYY-MM-DD]
**Confidence:** emerging
**Evidence:**
- [file@version] — [brief description of the signal]
- [file@version] — [brief description of the signal]
- [file@version] — [brief description of the signal]
**Downstream:** [which modes / which Figma rules this affects]

**History:**
- [YYYY-MM-DD] → codified
```

Principle IDs are sequential (GP-001, GP-002, …) and stable. Never reused. Retired principles retain their ID with a `[RETIRED]` marker and a reason.

### Step 4 — Run the principle lifecycle

For each existing principle, evaluate:

| Question | If yes → |
|---|---|
| Has the project pivoted away from this? | Candidate for RETIREMENT |
| Does a new screen type reveal an edge case? | Mark STRESSED, document edge case |
| Is it violated consistently in audit? | Question the rule OR strengthen the quality gate |
| Do two principles always fire together? | Candidate for RECOMPOSITION |
| Does one principle cover two distinct things? | Candidate for DECOMPOSITION |
| Has it held across 5+ subsequent decisions? | Promote: emerging → ESTABLISHED |
| Has the team explicitly ratified it? | Promote to CANONICAL |

Lifecycle transitions:

```
DECOMPOSE:
  GP-NNN → [RETIRED] "decomposed into GP-NNN and GP-NNN"
  GP-NNN (new, more specific principle)
  GP-NNN (new, more specific principle)

RECOMPOSE:
  GP-NNN → [RETIRED] "recomposed with GP-NNN into GP-NNN"
  GP-NNN → [RETIRED] "recomposed with GP-NNN into GP-NNN"
  GP-NNN (new, higher-order principle)

RETIRE:
  State: RETIRED
  Reason: [project direction change / superseded by GP-NNN / no longer applicable]
```

### Step 5 — Elevate patterns

When a component pattern appears in 3+ canvas briefs with the same abstract structure, add an entry to `pattern-library.md`:

```markdown
## [Pattern name — descriptive, UI-agnostic]

**Abstract definition:** [intent + structure, not implementation]
**Evidence:**
- [canvas-brief@version]
- [canvas-brief@version]
- [canvas-brief@version]
**Component candidates:** [which Figma components implement this pattern]
**Interaction model reference:** [interaction-model.md section, if applicable]
**Emerged:** [YYYY-MM-DD]
```

### Step 6 — Refine governance rules

Based on synthesis findings, update:
- Quality gate in `contribution-guide.md` if audit violations reveal a missing criterion
- Naming authority if new component categories have emerged and need formalization
- `versioning.md` — add real project examples from changelog history

### Step 7 — Write the principle audit record

Append a run entry to `principle-audit.md`:

```markdown
## Synthesis run — [YYYY-MM-DD]

**Accumulation since last run:**
- Canvas briefs: [N new/updated]
- Validation runs: [N]
- Audit passes: [N]
- Handoff events: [N overrides detected]

**Principles added:** [GP-NNN — statement], ...
**Principles updated (evidence):** [GP-NNN], ...
**Principles promoted:** [GP-NNN: emerging → established], ...
**Principles stressed:** [GP-NNN — edge case summary], ...
**Principles decomposed:** [GP-NNN → GP-NNN + GP-NNN]
**Principles recomposed:** [GP-NNN + GP-NNN → GP-NNN]
**Principles retired:** [GP-NNN — reason]
**Patterns elevated:** [pattern name], ...
**Governance rules refined:** [description of updates made]
```

---

## Output checklist

### Phase A
- [ ] `design/12_GOVERNANCE/versioning.md` — template copied, project examples section initialized [template]
- [ ] `design/12_GOVERNANCE/contribution-guide.md` — template copied, naming authority + quality gate + roles filled [hybrid]
- [ ] `design/12_GOVERNANCE/deprecation-policy.md` — template copied, timeline + support level filled [hybrid]
- [ ] `design/12_GOVERNANCE/changelog.md` — template copied [template]
- [ ] `design/12_GOVERNANCE/design-principles.md` — template copied, initialization date added [template → synthesis]

### Phase B
- [ ] `design/12_GOVERNANCE/design-principles.md` — new/transitioned principles written [synthesis]
- [ ] `design/12_GOVERNANCE/pattern-library.md` — elevated patterns added [synthesis]
- [ ] `design/12_GOVERNANCE/principle-audit.md` — new run record appended [synthesis]
- [ ] `design/12_GOVERNANCE/contribution-guide.md` — quality gates refined if needed [hybrid]
- [ ] `design/12_GOVERNANCE/versioning.md` — project examples added from changelog if available [hybrid]

---

## Rules

- Phase A runs once. Templates are not regenerated if output files already exist.
- Phase B requires evidence. Do not codify a principle with fewer than 3 independent sources.
- Principle IDs (GP-NNN) are stable and never reused.
- Retired principles are marked RETIRED with a reason — never deleted.
- Every component change must be logged in the changelog. No silent updates.
- Breaking changes always require a major version bump and migration guidance.
- Quality gates are living rules — synthesis passes refine them as audit reveals what causes drift.
- Naming authority is centralized. No ad-hoc component names. Follow Category/ComponentName.
- Governance rules apply to tokens as well as components.
- Decomposition and recomposition of principles are healthy — they signal the project is learning, not failing.
