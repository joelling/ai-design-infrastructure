Design System Project
<!-- toolchain-version: 2.1.0 | updated: 2026-04-18 -->

## Design Playbook — Single Source of Truth

**`design/process/`** is the single source of truth for the entire design process. It contains numbered mode files (01 through 19) plus a README, each describing one design mode — its purpose, mental model, process, outputs, rules, and downstream connections.

### How changes work
- **Designers do not edit the process files directly** — all changes go through Claude
- When a designer identifies a process improvement, they tell Claude what to change
- Claude edits the relevant `design/process/*.md` file AND immediately propagates to all affected files:
  - `.claude/skills/*/SKILL.md` — updates the corresponding skill's workflow, rules, dependencies, or outputs
  - `CLAUDE.md` — updates pipeline summaries, trigger rules, and cross-references below
  - `design/process/README.md` — updates the chapter index if modes are added/removed/reordered
- Claude summarizes what was propagated so the designer can review via `git diff`
- Git provides full version history of all process changes

### Skill architecture principles
When deciding whether a process mode should map to one skill or multiple skills, follow the seven principles documented in the **Skill architecture** section of `design/process/README.md`. The decision flowchart evaluates: external tool boundaries (P1), independent re-invocation (P2), hard data dependency gates (P3), context window budget (P4), artifact coherence (P5), failure blast radius (P6), and distinct timing/triggers (P7). Currently all design-* chapters are correctly single-skill; the Figma chapter is correctly split into 12 skills (triggers P1, P2, P3, P6, P7), with `figma-screen-compose` filling the placement gap between `figma-component` and `figma-parking-lot`. Three skills are on the watch list for potential future splits: `design-research` (if Phase B synthesis grows complex enough for independent invocation from Phase A), `design-prototype` (if drift-sync logic warrants independent invocation), and `figma-screen-compose` (if Plan grows complex enough to be batched independently from Execute).

### What triggers propagation
Any change to a process chapter must cascade to infrastructure. This includes:
- Adding, removing, or reordering modes
- Changing a mode's dependencies, triggers, outputs, or rules
- Changing process steps or mental models
- Updating non-negotiable principles

---

## Design Process Pipeline — Upstream Design Modes

Skills directory: `.claude/skills/` — read each SKILL.md for full workflow instructions.

### Operational model — Ingest / Query / Lint

The 31 skills are grouped under three elemental operations (after Karpathy's LLM wiki pattern). This is a cross-cutting lens — a skill's tier tells you *when* it runs; its operation tells you *what kind of work* it does. The viewer reflects this grouping via a sidebar toggle (`By Tier` / `By Operation`); each process chapter's `operation:` YAML frontmatter drives the grouping.

- **INGEST** — produce authoritative artifacts from raw inputs or upstream artifacts. Discovery, user-models, journeys, process-flows, stories, IA, interaction, visual, content, accessibility, research Phase A, governance Phase A, figma-handoff, figma-file-setup, figma-tokens, figma-page-setup, figma-component, figma-screen-compose.
- **QUERY** — aggregate artifacts into a retrieval surface at a specific axis (per-screen, per-entity, per-flow). Canvas, wireframe, prototype, query Phase A, figma-docs, figma-inventory, figma-parking-lot.
- **LINT** — cross-check artifacts for drift, gaps, or principle violations. design-lint, design-validation, figma-audit, research Phase B, governance Phase B, query Phase B.

### Synthesis pass order

Three skills run a Phase B synthesis pass after Phase A ingest. They consume each other — run in this order, or the later passes will miss upstream signal:

| Order | Pass | Consumes | Produces |
|---|---|---|---|
| 1 | `design-research` Phase B | completed test sessions | research-findings.md, persona confidence flags, governance-input files |
| 2 | `design-governance` Phase B | research-findings.md + governance-input files + figma-audit patterns | codified principles, pattern elevations, quality-gate refinements |
| 3 | `design-query` Phase B | everything above + all upstream artifacts | WIKI updates, gap flags |

Each Phase B must warn in step 0 if its predecessor is stale.

### Ordering: Flexible with Guardrails
- Modes CAN be invoked in any order
- Each mode checks upstream staleness on entry (step 0) and **reports** if upstream artifacts have changed since last run
- Each mode **warns** if upstream dependencies haven't produced artifacts yet
- User decides whether to re-process with new data or proceed with current outputs
- **HARD BLOCK:** `design-canvas` requires IA + interaction + visual + content artifacts
- **SOFT GATE:** Wireframe review should complete before Figma execution (warning, not hard block)
- **HARD BLOCK:** Figma execution requires canvas briefs for the screen being built
- **HARD BLOCK:** `design-prototype` requires canvas briefs + Figma screens + walking skeleton

### TIER 1 — DISCOVERY (understanding the problem)
1. **`design-discovery`** — Processes raw inputs (interviews, surveys, docs) via three-tier intake: per-input cleaning → per-type synthesis → cross-type project context (stakeholder map, domain glossary, competitive analysis, design brief)
2. **`design-user-models`** — Personas, empathy maps, jobs-to-be-done, behavioral archetypes (progressive confidence: hypothetical → evidence-thin → evidence-grounded → validated)

### TIER 2 — DEFINITION (tech & UI agnostic)
3. **`design-journeys`** — User journeys, service blueprints (user story mapping methodology)
4. **`design-process-flows`** — Process flow diagrams (swimlane, Mermaid) + business rules register; captures decision branches, exception paths, system boundaries, and business logic between journeys and IA
5. **`design-stories`** — User story mapping: backbone, walking skeleton, release slices
6. **`design-ia`** — Sitemap, navigation model, content hierarchy, taxonomy

### TIER 3 — DESIGN (deciding how it looks, feels, and works)
7. **`design-interaction`** — Interaction models, behavioral specs, state inventory, error strategy
8. **`design-visual`** — Brand attributes, color/typography rationale, visual language
9. **`design-content`** — Voice & tone, microcopy patterns, terminology guide
10. **`design-accessibility`** — WCAG, ARIA patterns, keyboard nav, contrast audit
11. **`design-research`** — Two-phase: Phase A (init) writes scenario scripts and test plan before build; Phase B (synthesis, periodic) synthesizes completed usability findings into research-findings.md, writes increment flags to user-models and stories, and feeds behavioral evidence to governance Phase B
12. **`design-governance`** — Two-phase: Phase A (init) sets versioning, contribution rules, deprecation policy from templates; Phase B (synthesis, periodic) codifies implicit conventions as design principles, elevates recurring patterns, refines quality gates

### CROSS-CUTTING — COMPOUNDING KNOWLEDGE (invoke at any tier, any time)
17. **`design-lint`** — Health check across all tiers: runs structural sync scripts (sync-status.js, sync-traceability.js) + LLM semantic checks (persona confidence vs. evidence, orphaned business rules, uncovered interaction states, accessibility gaps, research propagation, governance principle violations). Outputs `design/LINT_REPORT.md` by severity: 🔴 Critical / 🟡 Warning / 🟢 Info.
18. **`design-query`** — Two-phase: Phase A (wiki bootstrap) synthesizes all tier artifacts into `design/WIKI/` — cross-referenced entity pages for personas, principles, business rules, patterns, and constraints. Ongoing: accepts natural-language questions, returns cited answers from artifact corpus, files insights back (gaps → canvas AC, contradictions → lint queue, patterns → governance Phase B). **This is the compounding loop: every query makes the corpus richer.**

### TIER 4 — DEVELOP (build, prototype, and keep in sync)

Tier 4 has a **validation gate** followed by a **sync loop**:

```
Canvas Brief ──► ASCII Wireframe ──► Figma Screens ◄──sync──► Prototype
  (intent)      (flow + layout       (visual            (interaction
                 validation)          execution)          fidelity)
```

The wireframe is a validation gate (disposable, archived when Figma starts). The sync loop remains three nodes (Canvas ↔ Figma ↔ Prototype).

13. **`design-canvas`** — Aggregates ALL upstream artifacts into per-screen briefs (authoritative for intent)
14. **`design-wireframe`** — Clickable ASCII wireframes for structural/flow validation with stakeholders (validation gate, disposable)
15. **Figma pipeline** (`figma-*` skills) — Builds screens in Figma (authoritative for visual execution)
16. **`design-prototype`** — Coded interactive prototype from Figma screens (authoritative for interaction fidelity)

#### Figma pipeline — mandatory order:
1. **`figma-connect`** — ALWAYS run first, every session. Never skip.
2. **`figma-handoff`** — Detect and harmonize designer changes since last session.
3. **`figma-file-setup`** — Run if file is new, blank, or missing standard pages.
4. **`figma-tokens`** — Run before placing any design element. Token system must exist first.
5. **`figma-page-setup`** — Run before drawing anything on a new screen or page.
6. **`figma-component`** — Use for every UI element built. No exceptions.
7. **`figma-screen-compose`** — Two-phase (Plan/Execute). Place published-library component instances into Header/Content/Footer per the canvas brief. Wrapper-frame-first; per-section screenshot review; missing components leave `[MISSING]` placeholders + `draft` inventory entries. Writes append-only composition log per screen.
8. **`figma-parking-lot`** — Run at the end of each completed page. Reads needed-but-missing inventory queue (`requested_by: figma-screen-compose`).
9. **`figma-inventory`** — Run after any component or token lifecycle change. Two new fields: `triggering_screen`, `requested_by`.
10. **`figma-audit`** — Run before any library migration. Audits against composition log + brief acceptance criteria.
11. **`figma-docs`** — Run after audit passes, for documentation pages.
12. **`figma-library-mode`** — Run only during library migration phase.

#### Develop loop sync rules:
| Direction | Trivial change (content/label) | Structural change |
|---|---|---|
| **Canvas → Figma → Prototype** | **Auto-sync** all three nodes | **Flag drift** — designer approves, canvas brief updates first, then propagates |
| **Figma → Canvas (via composition log)** | **Always require approval** — proposed brief edit written as commented-out block at end of brief MD | **Always require approval** |

Rationale for the asymmetry: composition log is *evidence*; canvas brief is *intent*. Auto-merging trivial Figma drift back into the brief erodes the brief's role as the single source of truth.

Visual tweaks made in Figma still auto-sync to prototype (Figma → Prototype is symmetric). Only the upstream direction (Figma → Canvas) requires designer approval.

### Trigger rules:
- Starting a new design project → `design-discovery` first
- New discovery input processed → downstream manifests referencing changed artifacts → notify stale modes
- Need to understand users → `design-user-models`
- Mapping how users experience a process → `design-journeys` (tech/UI agnostic)
- Capturing decision logic, business rules, exception paths → `design-process-flows` (tech/UI agnostic)
- Structuring what to build → `design-stories` (tech/UI agnostic)
- Determining screen structure → `design-ia`
- Defining how screens behave → `design-interaction`
- Establishing visual direction → `design-visual`
- Defining text and labels → `design-content`
- Ensuring accessibility → `design-accessibility`
- Creating research scenarios and test plan before build → `design-research` Phase A
- Usability testing completed, findings need synthesis → `design-research` Phase B
- Persona model needs confidence update from research evidence → `design-research` Phase B
- Managing design system lifecycle (first time) → `design-governance` Phase A
- Codifying patterns, principles, or what the project has learned → `design-governance` Phase B
- After design-research Phase B produces governance-input files → `design-governance` Phase B
- After figma-audit reveals repeated violation patterns → `design-governance` Phase B
- Ready to build → `design-canvas` → `design-wireframe` → Figma pipeline → `design-prototype`
- Canvas briefs ready for structural validation → `design-wireframe`
- Canvas brief updated after wireframe exists → re-run `design-wireframe` for affected screens
- Wireframe review approved → Figma pipeline may begin
- Figma execution starting → archive wireframes
- Making design interactive → `design-prototype`
- Blank/empty Figma file (`"children":[]`) → `figma-file-setup` immediately
- Any UI element being built → `figma-component` workflow, not raw `figma_execute`
- `figma_execute` is a last resort — only for operations no other tool covers
- Designer made changes in Figma → `figma-handoff` to detect and harmonize
- Need inventory status or reconciliation → `figma-inventory`
- Documentation pages needed for tokens or components → `figma-docs`
- Canvas brief exists, page is set up, screen is empty → `figma-screen-compose` Phase A (Plan)
- `figma-screen-compose` Phase A approved → Phase B (Execute)
- Canvas brief revised and re-saved → re-run `figma-screen-compose` Phase A on affected screens (sync-hash diff)
- Batch UI workload starting (multiple screens) → `figma-screen-compose` Phase A in batch mode for pattern report
- Designer fine-tuned in Figma after compose → next session `figma-handoff` classifies overrides against logged compositions
- Mid-stream missing component during composition → no block; placeholder + inventory `draft` entry + queue surfaces in next `figma-parking-lot`
- After `figma-screen-compose` runs → `node design/scripts/sync-composition.js` to validate composition logs ↔ briefs ↔ inventory
- Story map updated → update BRD User Stories sheet (new/changed/retired stories)
- Business rules register updated → enrich BRD acceptance criteria with [BR-NN] tags
- Screen inventory updated → update BRD Feature/Touchpoint column + RBAC sheet
- Interaction specs updated → enrich BRD acceptance criteria with [STATE]/[BEHAVIOR] tags + Notification Mapping
- Terminology guide updated → update BRD LOV sheet + align AC language
- Canvas synthesis reveals AC gap → add [CANVAS] tagged AC to BRD
- Screen idea or canvas brief arrives without upstream stories → apply canvas-first backward propagation rule (see `design/process/13-canvas.md` — depth-of-reach matrix: AC gap only → BRD auto; missing story → designer decision; missing journey stage → designer decision; new persona behavior → designer decision; new persona → HARD BLOCK until discovery runs)
- Anything feels out of sync, broken, or missing → `design-lint` for a health report
- Before entering Tier 4 → run `design-lint` to clear Critical findings
- After any research Phase B or governance Phase B synthesis → run `design-lint` to catch propagation gaps
- Asking "what do we know about X?" or searching across artifacts → `design-query`
- After Tier 3 stabilizes (first time) → run `design-query` Phase A to bootstrap `design/WIKI/`
- Querying reveals a gap, contradiction, or undocumented decision → `design-query` files it back with designer confirmation
- After `git pull` updating the toolchain → run `node design/scripts/migrate.js` to check for pending v2 bootstraps (or it runs automatically if post-merge hook is installed)

### Artifact storage:
All design artifacts → `design/` directory at project root (including `design/14_WIREFRAME/`, `design/15_FIGMA/composition-logs/`, `design/16_PROTOTYPE/`, `design/WIKI/`, `design/LINT_REPORT.md`, and `design/DECISION_LOG.md`)

### BRD — Master Business Requirement Document
- Path: `design/BRD.xlsx`
- Manifest: `design/BRD_manifest.md`
- Blank template: `BRD_Template_v1.0.xlsx` (project root — copy to `design/BRD.xlsx` on project init)
- Validation: `python design/scripts/sync-brd.py`

### Decision Log — Append-only design decision record
- Path: `design/DECISION_LOG.md`
- Purpose: Append-only chronological record of key design decisions — what was decided, why, what was rejected, which artifacts are affected
- Written by: each skill appends an entry when it makes a significant design decision
- Format per entry:
  ```
  ## YYYY-MM-DD — [Decision topic]
  Decision: [what was decided]
  Evidence: [persona IDs, BR-NNN, DS-NNN, artifact paths]
  Trade-off: [what was rejected and why]
  Affects: [story IDs, canvas briefs, artifact paths]
  ```
- Bootstrap: for existing projects, run `design-query` and say "set up the decision log" — Claude reconstructs from documented rationale + designer fills gaps
- Not validated by scripts — maintained by skills and designer review

### Project Wiki — Cross-referenced entity knowledge base
- Path: `design/WIKI/`
- Entry point: `design/WIKI/index.md`
- Generated by: `design-query` Phase A (bootstrap) + ongoing query file-backs
- Contents: personas/, principles/, patterns/, constraints/ (business-rules, accessibility)
- Purpose: cross-referenced synthesis for navigation, onboarding, and query answering
- Bootstrap: run `design-query` Phase A after Tier 3 stabilizes
- Migration: `node design/scripts/migrate.js` detects whether bootstrap is pending

### Toolchain migration
- Migration script: `node design/scripts/migrate.js` — detects pending v2 bootstraps, writes `design/.migration-status.md`
- Post-merge hook: `design/scripts/post-merge-hook.sh` — install to `.git/hooks/post-merge` for automatic detection on git pull
- On new capabilities: Claude reports pending bootstraps at the top of the next skill invocation

### Non-negotiable rules:
- Journeys and stories are TECH AND UI AGNOSTIC — no screen references, no button names, no UI patterns
- Canvas briefs are the SINGLE SOURCE OF TRUTH for intent — named `{ScreenID}_{screen-name}.md`, one file per screen with states as sections
- **Canvas brief structure:** Section 1 = Frame inventory (all frames to visualize), Section 2 = Traceability (stories, business rules, process flow steps, interaction specs), Sections 3–12 = brief body
- **Traceability is enforced:** `node design/scripts/sync-traceability.js` validates bidirectional consistency between canvas briefs ↔ story map ↔ screen inventory ↔ interaction specs ↔ business rules
- **Story IDs (DS-NNN) and Business Rule IDs (BR-NN) are stable** — never reused, splits retire the original with a pointer
- Every design decision must trace back to a persona, story, or design principle
- No Figma screen without wireframe review (except exploratory prototyping) — soft gate, warning not hard block
- No Figma screen without a canvas brief (except exploratory prototyping)
- No prototype screen without a Figma implementation (except exploratory spikes)
- The Develop loop stays in sync — drift is detected and resolved (auto-sync for small changes, designer approval for structural)
- **Staleness is visible** — every mode checks upstream on entry (step 0), artifact versions are incremented on every update, and post-change notifications list affected downstream modes
- **Artifact versions are mandatory** — every output file carries a version header; every mode directory contains `_upstream.md`
- **Incremental updates over full rebuilds** — when re-processing with new upstream data, process the delta, don't discard prior work
- ZERO hardcoded values in Figma — every fill, spacing, radius must reference a variable
- ALL Figma frames use auto-layout — no absolute x/y positioning
- Every reusable UI element must be a Figma component (`createComponent`, not `createFrame`)
- Page naming: `[number] - [Screen Name]` e.g. `01 - PES Profile View`
- **BRD acceptance criteria are UI agnostic** — "allow user to select from a list" not "show dropdown of values"
- **BRD AC uses bullet points, one requirement per bullet** — story-origin bullets are untagged (implied); downstream modes append tagged bullets inline: [BR-NN], [FLOW], [STATE], [BEHAVIOR], [A11Y], [CANVAS]
- **BRD and story-map.md share story IDs** — bidirectional sync, validated by sync-brd.py
- **Design-lint never auto-fixes** — it reports and prioritizes, designer decides what to act on; Critical findings should be resolved before Tier 4
- **design-query never auto-modifies artifacts** — all file-backs (gaps, contradictions, undocumented decisions) require explicit designer confirmation
- **Decision Log is append-only** — entries are never edited or deleted; corrections are new entries that reference and supersede the old one
- **Wiki is for navigation, not authority** — always cite the source artifact; the wiki pages are synthesis, not ground truth
- **On git pull: check migration status** — run `node design/scripts/migrate.js` or confirm with Claude that no bootstraps are pending
- **Retire, don't delete.** Any artifact with accumulated incoming references (personas, stories DS-NNN, screens P-/OV-/DE-, business rules BR-NN, principles GP-NNN, patterns PA-NNN, canvas briefs, interaction specs, components, wiki pages) is retired — never deleted, never ID-reused — using `status: retired` (frontmatter), `[retired]` (heading), or `retired` (registry row). `sync-traceability.js` and `sync-wiki.js` honor the markers and exclude retired artifacts from orphan checks while keeping them cite-able.
- **Edit vs. retire-and-replace decision rule.** Retire when the artifact's *meaning to its consumers* changes; edit when its meaning stays the same. Edit volume is not the signal — semantic impact is. Apply the four tests in order — Identity → Contract → Reversal → Historical-value — and pick the first match: Refinement (edit + version bump), Revision (edit + version bump + Decision Log entry), or Replacement (retire + new ID via Split/Merge/Supersede patterns). High-degree nodes (artifacts cited many times) prefer Revision over Replacement when only Historical-value is at stake. Synthesized artifacts (wiki pages, canvas briefs) never retire on their own — they re-derive from sources. The full framework, decision tests, replacement patterns, and edge cases live in "Retirement status convention → When to retire vs. when to edit" in `design/process/README.md`.
- **Wiki health runs alongside pipeline status.** After any source artifact version bump, run `node design/scripts/sync-wiki.js` to detect wiki pages whose `evidence:` versions now lag the source, and to regenerate `design/WIKI/.backlinks.json` — the reverse index of every `[[wikilink]]` and stable ID across the `design/` corpus.
- **`figma-screen-compose` places only published-library instances** — never local components, never parking-lot components; all property overrides via `setProperties` (never raw `node.characters`)
- **Composition logs are append-only and evidence-only** — never edit prior runs; brief edits proposed by composition runs are written as commented-out blocks at the end of the brief MD and require explicit designer approval

### Cross-reference: Design artifacts → Develop loop
| Design artifact | Feeds into | How |
|----------------|-----------|-----|
| IA sitemap | `figma-file-setup` | Screen list becomes Sitemap page |
| IA screen inventory | `figma-page-setup` | Each screen becomes a numbered Figma page |
| Visual rationale | `figma-tokens` | Color, typography, spacing values become tokens |
| Interaction state inventory | `figma-component` | States become component variants |
| Content patterns | `figma-component` | Text becomes component TEXT properties |
| A11y patterns | `figma-component` | Focus states, ARIA descriptions |
| Canvas briefs | `design-wireframe`, all Figma skills, `design-prototype` | Single source of truth per screen — frame inventory + traceability block + brief body |
| ASCII wireframes | `figma-page-setup`, `figma-component` | Spatial layout reference for Figma build (disposable — archived when Figma starts) |
| Screen inventory (IA) | `design-canvas`, `sync-traceability.js` | Authoritative story-to-screen junction table |
| Business rules register | `design-canvas`, `design-interaction` | Constraint table in canvas briefs, behavioral spec triggers |
| Walking skeleton | `design-prototype` | Primary flow order for wiring screens |
| Story map + release slices | `design-prototype` | Scope and secondary flows |
| Research findings (RF-NNN) | `design-user-models`, `design-stories`, `design-governance` | Increment flags update persona confidence; story flags identify gaps; governance behavioral evidence stream |
| Behavioral archetypes | `design-journeys`, `design-interaction`, `design-visual`, `design-content`, `design-research`, `design-canvas` | Archetype tensions inform state priorities, information density, terminology, and scenario coverage |
| BRD User Stories | All modes, `sync-brd.py` | Master cross-track collaboration document; AC enriched by every contributing mode |
| BRD RBAC | `design-ia` | Role-feature access matrix from navigation model |
| BRD Notification Mapping | `design-interaction` | Trigger events from error strategy and notification flows |
| BRD Data Fields | `design-ia` | Field-level details from content inventory |
| BRD LOV | `design-content` | Canonical terms from terminology guide |
| Designer edits (external) | `figma-handoff` | Detected changes harmonized into design system; classifies overrides against logged compositions |
| Governance inventory | `figma-inventory` | Lifecycle tracking, status, action history; new fields `triggering_screen` and `requested_by` for compose-driven drafts |
| Composition logs | `design-prototype`, `figma-handoff`, `figma-audit`, `design-lint`, `design-query`, `design-governance` Phase B | Per-screen append-only evidence of `figma-screen-compose` runs — `design/15_FIGMA/composition-logs/{ScreenID}_composition-log.md` |
| Documentation components | `figma-docs` | Token visualization, component usage guides, Storybook stories |

### File architecture (3-file DLS):
- `Foundation – [Project] DLS` → all variables, styles, documentation (single source of truth for tokens)
- `Icons & Illustrations – [Project] DLS` → icon sets, illustration assets (consumes Foundation)
- `Components – [Project] DLS` → UI components, atoms → templates (consumes Foundation)
- `[Project] - Working` → active design canvas (screens, flows; enables all three DLS libraries)
