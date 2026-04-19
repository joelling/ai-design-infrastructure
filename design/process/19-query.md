---
operation: [query, lint]
---

# Design Query

> **Cross-cutting — all tiers | Compounding** | Mode: `design-query`

> **Not the same as canvas briefs.** `design-canvas` aggregates upstream artifacts **per screen** — one brief per screen, authoritative for build-time intent. `design-query` aggregates them **per entity** — one page per persona / principle / business rule / pattern, authoritative for cross-cutting retrieval. Same corpus, orthogonal axes.

## Why this matters

By the time a project reaches Tier 4, it has generated dozens of artifacts — personas, journeys, business rules, interaction specs, visual rationale, accessibility patterns, canvas briefs. No designer can hold it all in working memory. And no LLM can reliably retrieve the right constraint from a file it hasn't been asked to read.

Design Query closes this gap. It gives designers a natural-language interface to the full artifact corpus: ask a question, get a cited answer synthesized from everything the project knows. More importantly, every answer that reveals something worth preserving — a gap, a contradiction, a novel insight — files back into the project. The corpus compounds. Every query makes the next query richer.

## The mental model

**There are two phases:**

**Phase A (wiki bootstrap):** Run once, after Tier 3 artifacts stabilize. Claude reads all existing tier artifacts and generates `design/WIKI/` — cross-referenced entity pages organized by category. This becomes the primary query target and project onboarding artifact.

**Ongoing (query mode):** Designer asks a question → Claude synthesizes a cited answer from the artifact corpus and wiki → insights file back (gaps become AC notes, contradictions flag to the lint queue, novel patterns elevate to governance).

The wiki is not a finished document. It is a living synthesis that gets richer every time someone queries it.

## Inputs

**Phase A (bootstrap):**
- All artifact directories `design/01_*` through `design/12_*`
- `design/BRD.xlsx` (via `design/BRD_manifest.md` for metadata)
- `design/13_CANVAS/` if it exists

**Ongoing queries:**
- `design/WIKI/` — the primary search target (built in Phase A)
- The specific artifact files most likely to contain the answer (Claude retrieves based on query topic)
- `design/LINT_REPORT.md` — consulted for any query touching health or gaps

## Upstream sync

**Phase A:** Check `design/.migration-status.md`. If wiki bootstrap is not listed as pending, wiki may already exist — check `design/WIKI/index.md` before regenerating.

**Ongoing:** No formal upstream check. Claude reads the wiki index on entry to understand what's been indexed, then retrieves targeted artifacts as needed.

**On completion (Phase A):**
1. Write `design/WIKI/` with versioned entity pages
2. Mark wiki bootstrap complete in `design/.migration-status.md`
3. Append entry to `design/DECISION_LOG.md` if it exists: date, wiki scope (entity counts)

**On completion (query):**
1. If a gap was discovered: ask designer whether to file it (canvas AC note, lint queue, or governance)
2. If a contradiction was discovered: file to `design/LINT_REPORT.md` findings queue and notify designer
3. If a novel pattern was discovered (appears in 3+ independent sources): ask designer whether to note it for the next `design-governance` Phase B run

## Process

### Phase A — Wiki bootstrap

**Step 0 — Check existing wiki**
Read `design/WIKI/index.md` if it exists. If the index is recent (within the last major tier milestone) and the artifact coverage looks complete, offer to update incrementally rather than regenerate.

**Step 1 — Read all upstream artifacts**
For each tier directory that exists, read the primary output files:
- Discovery: `design-brief.md`, `stakeholder-map.md`, `domain-glossary.md`, `competitive-analysis.md`, `value-framework.md`
- User Models: all persona files, `empathy-maps.md`, `jtbd.md`, `behavioral-archetypes.md`
- Journeys: all journey files, all service blueprints
- Process Flows: `index.md`, `business-rules-register.md`
- Stories: `story-map.md`, `walking-skeleton.md`
- IA: `screen-inventory.md`, `navigation-model.md`, `content-hierarchy.md`
- Interaction: `interaction-model.md`, `state-inventory.md`, `behavioral-spec.md`, `error-strategy.md`
- Visual: `visual-language.md`, `color-rationale.md`, `typography-rationale.md`
- Content: `voice-tone.md`, `microcopy-patterns.md`, `terminology.md`
- Accessibility: `aria-patterns.md`, `keyboard-nav-plan.md`, `color-contrast-audit.md`
- Validation: `research-findings.md` if it exists
- Governance: `design-principles.md`, `pattern-library.md` if they exist
- Canvas: all canvas brief files in `design/13_CANVAS/`

**Step 2 — Generate entity pages**
Write the following files in `design/WIKI/`:

```
design/WIKI/
  index.md                    ← entry point + content catalog
  personas/
    {persona-id}.md           ← one page per persona
  principles/
    index.md                  ← all design principles with cross-refs
  patterns/
    index.md                  ← elevated interaction patterns
  constraints/
    business-rules.md         ← all BR-NNN with affected screens
    accessibility.md          ← WCAG targets, ARIA patterns, affected screens
  decisions/
    index.md                  ← summary of key decision log entries (if log exists)
```

**Entity page structure — persona:**
```markdown
<!-- artifact: design/WIKI/personas/{id}.md | version: 1 | mode: design-query | updated: YYYY-MM-DD -->

# {Persona name} — {Persona ID}

**Confidence:** {tier}  
**Evidence:** {research findings that ground this persona}

## Who they are
[3–5 sentence synthesis from persona file]

## What they need (JTBD)
[Key jobs-to-be-done entries]

## Where they appear
- **Journeys:** [links]
- **Stories:** [DS-NNN IDs]
- **Canvas briefs:** [screen IDs]
- **Interaction states:** [state IDs that were shaped by this persona]

## What they tell us about design
[2–3 key design implications synthesized from all references]
```

**Entity page structure — design principles:**
```markdown
<!-- artifact: design/WIKI/principles/index.md | version: 1 | mode: design-query | updated: YYYY-MM-DD -->

# Design Principles

| ID | Principle | State | Screens influenced |
|---|---|---|---|
| GP-001 | [statement] | established | [list] |
...
```

**Entity page structure — constraints/business-rules:**
```markdown
<!-- artifact: design/WIKI/constraints/business-rules.md | version: 1 | mode: design-query | updated: YYYY-MM-DD -->

# Business Rules Register — Cross-Referenced

| ID | Rule | Source | Canvas briefs |
|---|---|---|---|
| BR-01 | [rule text] | `process-flows/index.md` | [P-02, P-05] |
...
```

**Index structure:**
```markdown
<!-- artifact: design/WIKI/index.md | version: 1 | mode: design-query | updated: YYYY-MM-DD -->

# Project Wiki — {Project name}

**Last updated:** YYYY-MM-DD  
**Tiers indexed:** {list}  
**Entity counts:** {N personas, N principles, N business rules, N patterns}

## Quick reference

- [Personas](personas/) — who we're designing for
- [Design Principles](principles/) — codified design decisions
- [Constraints](constraints/) — business rules + accessibility requirements
- [Patterns](patterns/) — recurring interaction and layout patterns
- [Decisions](decisions/) — key decision log summary (if log exists)

## Project context

[3–5 sentence synthesis of the project from design-brief.md + value-framework.md]

## What we know

### About the users
[2–3 key cross-cutting insights from persona + journey synthesis]

### About the domain
[2–3 key constraints or opportunities from discovery + process flows]

### About the design system
[State of the design system: token coverage, component count, governance status]
```

**Step 2.5 — Shard oversized entity pages**

As projects grow, a persona's "Where they appear" table can list hundreds of rows, and a business-rule register can sprawl. When a single cross-reference table on an entity page exceeds ~200 rows, or the page itself exceeds ~500 lines, split along the table axes:

```
design/WIKI/personas/{id}/
  index.md         ← synthesis, JTBD, archetype, design implications
  stories.md       ← full story table
  canvas.md        ← full canvas-brief table
  journeys.md      ← full journey table
  states.md        ← full interaction-state table
```

Only split the tables that exceed the threshold; smaller tables stay on the index. The index page must remain self-sufficient for the question "who is this persona?"; sub-pages expose the long-tail traceability.

Cross-references still resolve via `[[personas/{id}]]` (points at the index). Sub-pages are reached explicitly (e.g. `[[personas/{id}/stories]]`).

The same rule applies to `principles/{id}/`, `constraints/business-rules/{id}/`, and `patterns/{id}/` when their tables grow past the thresholds. Small and medium projects keep the flat layout — this is a scale adaptation, not a default.

**Step 3 — Write migration status update**
Update `design/.migration-status.md` to mark wiki as bootstrapped.

---

### Ongoing — Query mode

**Step 0 — Parse the question**
Read `design/WIKI/index.md`. Identify which wiki section(s) and underlying artifacts are most likely to contain the answer. Route accordingly:
- Questions about users / personas → wiki personas + `design/02_USER_MODELS/`
- Questions about specific screens / flows → wiki constraints + `design/13_CANVAS/`
- Questions about business rules → wiki constraints + `design/04_PROCESS_FLOWS/`
- Questions about what we've decided → wiki decisions + `design/DECISION_LOG.md`
- Questions about design system state → wiki + `design/12_GOVERNANCE/`
- Questions about gaps or health → `design/LINT_REPORT.md` + target artifacts
- Open-ended / cross-cutting → wiki index + targeted artifact reads

**Step 1 — Read and synthesize**
Read the relevant wiki pages and source artifacts. Synthesize a direct answer with citations.

Citation format: `[artifact-path@vN]` or for wiki pages `[wiki:personas/joel.md]`.

**Step 2 — File insights back**

After presenting the answer, evaluate what was learned:

| What was found | Action |
|---|---|
| A gap — something that should exist but doesn't | Offer to add a note to the relevant canvas brief AC, or add to `design/LINT_REPORT.md` |
| A contradiction — two artifacts disagree | File to `design/LINT_REPORT.md` findings queue as a Warning item |
| A novel pattern — same structure in 3+ sources | Note in `design/12_GOVERNANCE/principle-audit.md` as a candidate for next synthesis run |
| An implicit decision with no rationale documented | Offer to add an entry to `design/DECISION_LOG.md` |
| A wiki page that is now stale (artifact has been updated) | Update the wiki page with the new synthesis |

Always ask the designer before filing back. Do not auto-modify other artifacts.

## Outputs

| File | Type | What it contains |
|---|---|---|
| `design/WIKI/index.md` | synthesis | Entry point; project context + content catalog |
| `design/WIKI/personas/{id}.md` | synthesis | Per-persona cross-reference page |
| `design/WIKI/principles/index.md` | synthesis | All design principles with screen cross-refs |
| `design/WIKI/patterns/index.md` | synthesis | Elevated patterns with instances |
| `design/WIKI/constraints/business-rules.md` | synthesis | BR-NNN register with canvas brief cross-refs |
| `design/WIKI/constraints/accessibility.md` | synthesis | Accessibility requirements with screen coverage |
| `design/WIKI/decisions/index.md` | synthesis | Decision log summary (only if DECISION_LOG.md exists) |

## Rules

- Phase A should be run after Tier 3 artifacts have stabilized for best quality. Running earlier produces a thinner wiki.
- Phase A is idempotent. It is safe to re-run — it regenerates wiki pages from current artifacts.
- Ongoing queries never auto-modify artifacts. All file-backs require designer confirmation.
- The wiki is authoritative for navigation but not for design decisions. Always cite the source artifact, not just the wiki page.
- Query results that are purely informational (no gaps, no contradictions) require no file-back.
- Wiki pages carry version headers. When a source artifact is updated, the corresponding wiki page should be flagged as stale and regenerated on the next query that touches it.
- The wiki is a cross-project onboarding artifact — it should be readable by someone who hasn't run any of the design modes themselves.

## Feeds into

- **`design-lint`** — contradiction findings from query are filed to the lint queue
- **`design-governance` Phase B** — novel patterns discovered via query are surfaced as candidate principles
- **`design-canvas`** — query used mid-Tier-4 to retrieve constraints for a specific screen
- **`design-prototype`** — query used to retrieve walking skeleton and interaction model details
- **All skills** — wiki becomes the starting point for any "what do we know about X" question
