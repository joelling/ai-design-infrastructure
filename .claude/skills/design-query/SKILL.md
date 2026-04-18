---
name: design-query
description: >
  Two-phase compounding query mode. Phase A (wiki bootstrap): synthesizes all existing
  tier artifacts into design/WIKI/ — cross-referenced entity pages for personas, principles,
  patterns, business rules, and constraints. Run once after Tier 3 stabilizes. Phase B
  (ongoing query): accepts natural-language questions, synthesizes cited answers from the
  artifact corpus and wiki, and files insights back (gaps → canvas AC, contradictions →
  lint queue, patterns → governance). Triggers on: "design-query", "what do we know about",
  "which screens are affected by", "find all references to", "what have we decided about",
  "bootstrap the wiki", "initialize the project wiki", "search the design artifacts",
  "who are our personas", "what business rules apply to", "are there any gaps in",
  "what design decisions have we made about", or any question about project knowledge
  that requires searching across multiple artifacts.
---

# Design Query — Artifact Corpus Search + Project Wiki

## Purpose

**Phase A (bootstrap):** Generate `design/WIKI/` — a cross-referenced entity wiki synthesized
from all tier artifacts. Runs once after Tier 3 stabilizes. Creates an onboarding artifact
and the primary search target for ongoing queries.

**Ongoing queries:** Accept natural-language questions. Search the wiki and source artifacts.
Synthesize cited answers. File insights back — gaps, contradictions, patterns, undocumented
decisions — with designer confirmation.

---

## Dependency check

### Phase A — soft dependencies (warn if thin, proceed regardless)
Best results after Tier 3 is complete. Partial wikis are valid for partial projects.
- Most valuable inputs: all of `design/01_*` through `design/12_*`

### Ongoing queries — reads whatever exists
- `design/WIKI/index.md` — primary navigation
- Targeted source artifacts based on query topic

---

## Upstream sync (step 0)

**Phase A:**
- Check `design/.migration-status.md` — if wiki bootstrap is not listed as pending, check whether `design/WIKI/index.md` exists. If it does, offer incremental update instead of full regeneration.
- Value alignment check: if `design/01_DISCOVERY/value-framework.md` exists, confirm wiki synthesis captures the project's primary value drivers.

**Ongoing:**
- Read `design/WIKI/index.md` to understand what's been indexed and when.
- Note any wiki pages whose source artifact has a newer version than recorded in the wiki page header.

After Phase A:
1. Write all wiki files with version headers
2. Mark wiki bootstrap complete in `design/.migration-status.md`
3. Append entry to `design/DECISION_LOG.md` if it exists (date, entity counts, tiers indexed)

After ongoing query:
1. If filing back: make changes with designer confirmation, then bump version headers

### Script commands (Phase A)
```bash
node design/scripts/sync-status.js    # assess which tiers have artifacts (read-only)
```

---

## Workflow — Phase A: Wiki Bootstrap

### Step 0 — Assess coverage
Run `sync-status.js` in read-only mode to identify which artifact directories exist. Report:
- Tiers with artifacts
- Tiers without artifacts (wiki will be thinner here)
- Whether canvas briefs exist (Tier 4 coverage)

### Step 1 — Read all upstream artifacts
For each tier directory that exists, read the primary output files. Prioritize:
- Discovery: `design-brief.md`, `stakeholder-map.md`, `domain-glossary.md`, `value-framework.md`
- User Models: all persona files, `jtbd.md`, `behavioral-archetypes.md`
- Journeys: all journey files
- Process Flows: `index.md`, `business-rules-register.md`
- Stories: `story-map.md`, `walking-skeleton.md`
- IA: `screen-inventory.md`, `navigation-model.md`
- Interaction: `interaction-model.md`, `state-inventory.md`, `behavioral-spec.md`
- Visual: `visual-language.md`, `color-rationale.md`
- Content: `terminology.md`, `microcopy-patterns.md`
- Accessibility: `aria-patterns.md`, `keyboard-nav-plan.md`
- Validation: `research-findings.md` if it exists
- Governance: `design-principles.md`, `pattern-library.md` if they exist
- Canvas: all canvas brief files in `design/13_CANVAS/` if they exist

### Step 2 — Generate wiki entity pages

Create these files in `design/WIKI/`:

**Personas** (`design/WIKI/personas/{persona-id}.md` — one per persona):
```markdown
<!-- artifact: design/WIKI/personas/{id}.md | version: 1 | mode: design-query | updated: YYYY-MM-DD -->

# {Persona name} — {Persona ID}

**Confidence:** {tier} | **Source:** `design/02_USER_MODELS/personas/{file}`

## Who they are
[3–5 sentence synthesis]

## Jobs to be done
[Key JTBD entries from jtbd.md]

## Behavioral archetype
[Relevant archetype from behavioral-archetypes.md]

## Where they appear
| Artifact | Reference |
|---|---|
| Journeys | [list journey files that reference this persona] |
| Stories | [DS-NNN IDs shaped by this persona] |
| Canvas briefs | [screen IDs where this persona is referenced] |
| Interaction states | [states shaped by this persona's needs] |

## Key design implications
[2–3 actionable implications synthesized from all references]
```

**Design Principles** (`design/WIKI/principles/index.md`):
```markdown
<!-- artifact: design/WIKI/principles/index.md | version: 1 | mode: design-query | updated: YYYY-MM-DD -->

# Design Principles

*Source: `design/12_GOVERNANCE/design-principles.md`*

| ID | Principle | State | Screens influenced |
|---|---|---|---|
| GP-001 | [statement] | established | [list] |
```

**Business Rules** (`design/WIKI/constraints/business-rules.md`):
```markdown
<!-- artifact: design/WIKI/constraints/business-rules.md | version: 1 | mode: design-query | updated: YYYY-MM-DD -->

# Business Rules — Cross-Referenced

*Source: `design/04_PROCESS_FLOWS/business-rules-register.md`*

| ID | Rule | Canvas briefs | Stories |
|---|---|---|---|
| BR-01 | [rule text] | [P-02, P-05] | [DS-NNN] |
```

**Accessibility Constraints** (`design/WIKI/constraints/accessibility.md`):
```markdown
<!-- artifact: design/WIKI/constraints/accessibility.md | version: 1 | mode: design-query | updated: YYYY-MM-DD -->

# Accessibility Requirements — Cross-Referenced

*Source: `design/10_ACCESSIBILITY/`*

**WCAG target:** [level]

| Pattern | Applies to | Canvas briefs |
|---|---|---|
| [ARIA pattern] | [component type] | [screens] |
```

**Patterns** (`design/WIKI/patterns/index.md`):
```markdown
<!-- artifact: design/WIKI/patterns/index.md | version: 1 | mode: design-query | updated: YYYY-MM-DD -->

# Interaction & Layout Patterns

*Source: `design/12_GOVERNANCE/pattern-library.md` + canvas brief synthesis*

| Pattern | Definition | Instances |
|---|---|---|
| [name] | [abstract definition] | [canvas briefs] |
```

**Wiki Index** (`design/WIKI/index.md`):
```markdown
<!-- artifact: design/WIKI/index.md | version: 1 | mode: design-query | updated: YYYY-MM-DD -->

# Project Wiki — {Project name from design-brief.md}

**Last updated:** YYYY-MM-DD
**Tiers indexed:** {list}
**Entities:** {N personas | N principles | N business rules | N patterns}

## Quick reference
- [Personas](personas/) — who we're designing for
- [Design Principles](principles/index.md) — codified design decisions
- [Business Rules](constraints/business-rules.md) — constraints with screen cross-refs
- [Accessibility](constraints/accessibility.md) — WCAG requirements and ARIA patterns
- [Patterns](patterns/index.md) — recurring interaction and layout patterns

## Project context
[3–5 sentence synthesis from design-brief.md and value-framework.md]

## What we know about the users
[2–3 key cross-cutting insights from persona + journey synthesis]

## What we know about the domain
[2–3 key constraints or opportunities from discovery + process flows]

## Design system state
[Token coverage, component status, governance state — based on what exists]
```

### Step 3 — Update migration status
Write or update `design/.migration-status.md`:
```markdown
# Migration Status

| Capability | Status | Date |
|---|---|---|
| Wiki bootstrap | complete | YYYY-MM-DD |
| Decision log | [pending / complete / not-started] | YYYY-MM-DD |
```

---

## Workflow — Ongoing: Query Mode

### Step 0 — Understand the question
Identify the query type and route to the right sources:
- Questions about users / personas → wiki `personas/` + `design/02_USER_MODELS/`
- Questions about screens / flows → wiki `constraints/` + `design/13_CANVAS/`
- Questions about business rules → wiki `constraints/business-rules.md` + `design/04_PROCESS_FLOWS/`
- Questions about decisions / rationale → `design/DECISION_LOG.md` + wiki `decisions/`
- Questions about design system state → wiki index + `design/12_GOVERNANCE/`
- Questions about gaps / health → `design/LINT_REPORT.md` + targeted artifacts
- Open-ended → wiki index first, then targeted artifact reads

### Step 1 — Read and synthesize
Read the relevant wiki pages and source artifacts. Write a direct answer with inline citations.

Citation format:
- Source artifact: `[design/path/file.md@v2]`
- Wiki page: `[wiki:personas/joel.md]`
- Story ID: `[DS-NNN]`
- Business rule: `[BR-NN]`

### Step 2 — Evaluate for file-back

After answering, check:

| Discovery | Action |
|---|---|
| Gap — something should exist but doesn't | Offer to add AC note to relevant canvas brief OR add to lint queue |
| Contradiction — two artifacts disagree | File to `design/LINT_REPORT.md` findings queue as Warning |
| Novel pattern — same structure in 3+ sources | Note in `design/12_GOVERNANCE/principle-audit.md` as synthesis candidate |
| Implicit decision without documented rationale | Offer to add entry to `design/DECISION_LOG.md` |
| Wiki page is stale vs. source artifact | Update wiki page to reflect current artifact state |

Always ask before filing back. Present the proposed change to the designer and wait for confirmation.

---

## Output checklist

### Phase A
- [ ] `design/WIKI/index.md` — project entry point + quick reference [synthesis]
- [ ] `design/WIKI/personas/{id}.md` — one page per persona [synthesis]
- [ ] `design/WIKI/principles/index.md` — principles with screen cross-refs [synthesis]
- [ ] `design/WIKI/constraints/business-rules.md` — BR-NNN register cross-referenced [synthesis]
- [ ] `design/WIKI/constraints/accessibility.md` — accessibility requirements cross-referenced [synthesis]
- [ ] `design/WIKI/patterns/index.md` — elevated patterns with instances [synthesis]
- [ ] `design/.migration-status.md` — wiki bootstrap marked complete [infrastructure]

### Ongoing query
- [ ] Cited answer presented
- [ ] File-back actions proposed and confirmed (if any)
- [ ] Stale wiki pages updated (if any)

---

## Rules

- Phase A should run after Tier 3 artifacts stabilize for best quality. Running earlier is fine — wiki will be thinner.
- Phase A is idempotent. Safe to re-run; it regenerates wiki pages from current artifacts.
- The wiki is for navigation and synthesis — always cite the source artifact as the authoritative reference.
- Never auto-modify artifacts. All file-backs require explicit designer confirmation.
- Query results with no gaps, contradictions, or patterns need no file-back — just answer.
- Wiki pages carry version headers. When a source artifact version advances past what the wiki page recorded, the wiki page is stale — flag it and offer to update.
- The wiki is readable by someone who has never run any design mode — it must be self-contained and jargon-free where possible.
