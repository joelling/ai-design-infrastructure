---
operation: [ingest, lint]
---

# Governance

> **Tier 3 — Design (init) | Lifecycle — all tiers (synthesis)** | Mode: `design-governance`

## Why this matters

Design systems don't drift because rules were wrong at the start. They drift because implicit conventions accumulate faster than explicit rules — and no one is watching the accumulation. Governance has two jobs: establish the framework on day one (Phase A), and periodically read what the project has learned and codify it as explicit principles (Phase B).

## The mental model

**Phase A:** You are establishing the governance framework — the constitution that defines how the design system evolves. Who can change what, through what process, with what documentation.

**Phase B:** You are the institutional memory. You watch the accumulation of design decisions — validation findings, audit violations, canvas brief patterns, designer overrides — and ask: *what has become a convention that we haven't written down yet?* When you find it, you codify it, track it through its lifecycle, and feed it back into the modes that need it.

## Inputs

### Phase A
- `design/08_VISUAL/visual-language.md` — the visual rules governance enforces at contribution time
- Component inventory (from Figma or design artifacts) — for naming authority categories

### Phase B

| Source | What governance extracts |
|---|---|
| `design/11_VALIDATION/heuristic-evaluation.md` (all runs) | Recurring severity findings → candidate principles to prevent the pattern |
| `figma-audit` findings since last synthesis run | Repeated violations → missing or wrong rules |
| `figma-handoff` detected changes since last synthesis run | Consistent designer overrides → convention doesn't match how people think |
| `design/13_CANVAS_BRIEFS/` all canvas briefs | Recurring component patterns across 3+ screens → candidate pattern elevations |
| `design/07_INTERACTION/interaction-model.md` evolution | New patterns in 4+ screens → candidate interaction standard to codify |
| `design/12_GOVERNANCE/changelog.md` | What keeps changing → signals what needs a stronger or clearer rule |
| Figma inventory lifecycle events | Components patched repeatedly → missing or violated structural rule |

## Upstream sync

**On entry:**

- **Phase A (first run):** Note which upstream artifacts are available. Proceed regardless.
- **Phase B (synthesis):** Check `principle-audit.md` for the last synthesis run date. Identify what has accumulated since then. If nothing meaningful has accumulated, report that and exit — do not synthesize without evidence.

**On completion:**

1. Add or increment version headers on all changed output files
2. Update `design/12_GOVERNANCE/_upstream.md` with consumed artifact versions
3. Report which downstream modes are now potentially stale

## Process

### Phase A — Init (run once, Tier 3, after visual + interaction)

**0. Check upstream.** If `design/12_GOVERNANCE/versioning.md` already exists, governance has been initialized — confirm whether this is a Phase B synthesis run or a targeted governance update.

**1. Copy governance framework templates.** Copy each template from `design/templates/` to its output path if the file does not already exist:

- `design/templates/versioning.tpl.md` → `design/12_GOVERNANCE/versioning.md`
- `design/templates/contribution-guide.tpl.md` → `design/12_GOVERNANCE/contribution-guide.md`
- `design/templates/deprecation-policy.tpl.md` → `design/12_GOVERNANCE/deprecation-policy.md`
- `design/templates/changelog.tpl.md` → `design/12_GOVERNANCE/changelog.md`
- `design/templates/design-principles.tpl.md` → `design/12_GOVERNANCE/design-principles.md`

**2. Customize with project-specific decisions.** Fill the `<!-- PROJECT-SPECIFIC -->` sections in each copied file:

- **Naming authority** — component category list (Category/ComponentName convention) derived from component inventory structure
- **Quality gate criteria** — which rules from `design-visual` are enforced at contribution time
- **Approval roles** — who holds naming authority, who reviews components, who approves breaking changes
- **Sunset timeline** — how many sprints between deprecation notice and removal
- **Migration support commitment** — script provided, one-to-one replacement documented, or notice only

**3. Initialize the principles file.** `design-principles.md` starts empty. Add the initialization date. Principles are populated by Phase B synthesis passes, not on day one.

---

### Phase B — Synthesis (run periodically)

**0. Scope the accumulation.** Check `principle-audit.md` for the last synthesis run date. If fewer than 3 new canvas briefs exist and no new validation or audit runs have occurred, report that and exit.

**1. Scan accumulation sources.** Read all Phase B inputs since the last synthesis run. Extract signals: recurring patterns, repeated violations, consistent overrides, component usage frequencies.

**2. Extract implicit conventions.** A pattern must appear in 3+ independent sources to qualify for codification. Classify each candidate:

- **Ready to codify** — clear pattern, 3+ evidence sources
- **Needs more evidence** — pattern exists, insufficient data points
- **Already codified** — update existing principle's evidence trace
- **Contradicts existing principle** — flag for lifecycle review

Present the classification to the designer before proceeding.

**3. Codify as principles.** For each "ready to codify" candidate, write an entry in `design-principles.md`. Principle IDs (GP-NNN) are sequential and stable — never reused. Retired principles retain their ID with a `[RETIRED]` marker.

**4. Run the principle lifecycle.** For each existing principle: Is it still applicable? Has a new screen type stressed it? Is it being violated consistently in audit (wrong rule vs. weak quality gate)? Are two principles always firing together (recompose)? Is one covering two distinct things (decompose)? Has it held across 5+ decisions (promote to established)?

**5. Elevate patterns.** When a component pattern appears in 3+ canvas briefs with the same abstract structure (same intent, same layout logic, same interaction model), write it to `pattern-library.md` as a named pattern. Patterns are not components — they are named combinations of intent and structure that recur.

**6. Refine governance rules.** Update quality gates in `contribution-guide.md` if audit reveals missing criteria. Update naming authority if new component categories have emerged. Add project-specific examples to `versioning.md` from changelog history.

**7. Write the audit record.** Append a run entry to `principle-audit.md` documenting what was added, promoted, stressed, decomposed, recomposed, retired, and elevated.

## Principle lifecycle

```
EMERGE       — implicit convention spotted in 3+ independent sources
CODIFIED     — written as a principle with evidence, marked "emerging"
ESTABLISHED  — principle has held across 5+ subsequent decisions without contradiction
CANONICAL    — team has explicitly ratified it; non-negotiable
STRESSED     — new screen type or scope change reveals an edge case
DECOMPOSED   — original was too broad; two more specific principles replace it, original retired
RECOMPOSED   — two related principles kept firing together; merged into a higher-order one
RETIRED      — project direction changed; principle archived with reason
```

## Outputs

| File | Type | What it contains |
|---|---|---|
| `design/12_GOVERNANCE/versioning.md` | template | Semver scheme, bump rules, project examples added over time |
| `design/12_GOVERNANCE/contribution-guide.md` | hybrid | Proposal process, modification rules, quality gate, naming authority |
| `design/12_GOVERNANCE/deprecation-policy.md` | hybrid | Deprecation process, sunset timeline, migration requirements |
| `design/12_GOVERNANCE/changelog.md` | template | Initialized changelog, populated by sync scripts and synthesis passes |
| `design/12_GOVERNANCE/design-principles.md` | synthesis | Codified principles with evidence traces, confidence levels, lifecycle state |
| `design/12_GOVERNANCE/pattern-library.md` | synthesis | Named patterns elevated from recurring canvas brief decisions |
| `design/12_GOVERNANCE/principle-audit.md` | synthesis | Per-synthesis-run record: additions, transitions, retirements |

*`_upstream.md` is maintained by `sync-manifest.js` and is not a mode deliverable.*

## Rules

- Phase A runs once. Templates are not regenerated if output files already exist.
- Phase B requires evidence. Never codify a principle with fewer than 3 independent sources.
- Principle IDs (GP-NNN) are stable and never reused. Retired principles are archived, not deleted.
- Every component change must be logged in the changelog. No silent updates.
- Breaking changes always require a major version bump and migration guidance.
- New components must pass the quality gate before entering the library.
- Naming authority is centralized — follow Category/ComponentName. No ad-hoc names.
- Governance rules apply to tokens as well as components.
- Quality gates are not static — synthesis passes refine them as audit reveals what actually causes drift.
- Decomposition and recomposition of principles are healthy — they signal the project is learning.

## Feeds into

- **Figma Library Mode** — governance rules guide library organization
- **Figma Audit** — quality gate criteria and codified principles inform audit checks
- **`design-canvas`** — design-principles feed into canvas brief behavioral spec and accessibility sections
- **`figma-component`** — codified principles affect component quality gates and state decisions
- **`design-validation`** — principles become explicit validation criteria in review-checklist
- **`design-interaction`** — pattern library informs interaction model when new screens are designed
