# MSI Test — Design System Project

## Design Playbook — Single Source of Truth

**`design/process/`** is the single source of truth for the entire design process. It contains numbered mode files (01 through 14) plus a README, each describing one design mode — its purpose, mental model, process, outputs, rules, and downstream connections.

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
When deciding whether a process mode should map to one skill or multiple skills, follow the seven principles documented in the **Skill architecture** section of `design/process/README.md`. The decision flowchart evaluates: external tool boundaries (P1), independent re-invocation (P2), hard data dependency gates (P3), context window budget (P4), artifact coherence (P5), failure blast radius (P6), and distinct timing/triggers (P7). Currently all design-* chapters are correctly single-skill; the Figma chapter is correctly split into 11 skills (triggers P1, P2, P3, P6, P7). Two skills are on the watch list for potential future splits: `design-validation` and `design-prototype`.

### What triggers propagation
Any change to a process chapter must cascade to infrastructure. This includes:
- Adding, removing, or reordering modes
- Changing a mode's dependencies, triggers, outputs, or rules
- Changing process steps or mental models
- Updating non-negotiable principles

---

## Design Process Pipeline — Upstream Design Modes

Skills directory: `.claude/skills/` — read each SKILL.md for full workflow instructions.

### Ordering: Flexible with Guardrails
- Modes CAN be invoked in any order
- Each mode checks upstream staleness on entry (step 0) and **reports** if upstream artifacts have changed since last run
- Each mode **warns** if upstream dependencies haven't produced artifacts yet
- User decides whether to re-process with new data or proceed with current outputs
- **HARD BLOCK:** `design-canvas` requires IA + interaction + visual + content artifacts
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
11. **`design-validation`** — Heuristic evaluation, test plans, review checklist
12. **`design-governance`** — Design system versioning, contribution rules, deprecation policy

### TIER 4 — DEVELOP (build, prototype, and keep in sync)

Tier 4 is a **sync loop** between three nodes, not a linear pipeline:

```
Canvas Brief ◄──sync──► Figma Screens ◄──sync──► Prototype
     ▲                                                │
     └────────────────── sync ────────────────────────┘
```

13. **`design-canvas`** — Aggregates ALL upstream artifacts into per-screen briefs (authoritative for intent)
14. **Figma pipeline** (`figma-*` skills) — Builds screens in Figma (authoritative for visual execution)
15. **`design-prototype`** — Coded interactive prototype from Figma screens (authoritative for interaction fidelity)

#### Figma pipeline — mandatory order:
1. **`figma-connect`** — ALWAYS run first, every session. Never skip.
2. **`figma-handoff`** — Detect and harmonize designer changes since last session.
3. **`figma-file-setup`** — Run if file is new, blank, or missing standard pages.
4. **`figma-tokens`** — Run before placing any design element. Token system must exist first.
5. **`figma-page-setup`** — Run before drawing anything on a new screen or page.
6. **`figma-component`** — Use for every UI element built. No exceptions.
7. **`figma-parking-lot`** — Run at the end of each completed page.
8. **`figma-inventory`** — Run after any component or token lifecycle change.
9. **`figma-audit`** — Run before any library migration.
10. **`figma-docs`** — Run after audit passes, for documentation pages.
11. **`figma-library-mode`** — Run only during library migration phase.

#### Develop loop sync rules:
| Change type | Behavior |
|---|---|
| Content/label change | **Auto-sync** all three nodes |
| State addition/removal | **Auto-sync** all three nodes |
| Visual tweak | Figma → Prototype auto-syncs. Brief notes delta. |
| Structural change | **Flag drift** — designer approves, canvas brief updates first, then propagates |

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
- Validating design decisions → `design-validation`
- Managing design system lifecycle → `design-governance`
- Ready to build → `design-canvas` → Figma pipeline → `design-prototype`
- Making design interactive → `design-prototype`
- Blank/empty Figma file (`"children":[]`) → `figma-file-setup` immediately
- Any UI element being built → `figma-component` workflow, not raw `figma_execute`
- `figma_execute` is a last resort — only for operations no other tool covers
- Designer made changes in Figma → `figma-handoff` to detect and harmonize
- Need inventory status or reconciliation → `figma-inventory`
- Documentation pages needed for tokens or components → `figma-docs`
- Story map updated → update BRD User Stories sheet (new/changed/retired stories)
- Business rules register updated → enrich BRD acceptance criteria with [BR-NN] tags
- Screen inventory updated → update BRD Feature/Touchpoint column + RBAC sheet
- Interaction specs updated → enrich BRD acceptance criteria with [STATE]/[BEHAVIOR] tags + Notification Mapping
- Terminology guide updated → update BRD LOV sheet + align AC language
- Canvas synthesis reveals AC gap → add [CANVAS] tagged AC to BRD
- Screen idea or canvas brief arrives without upstream stories → apply canvas-first backward propagation rule (see `design/process/13-canvas.md` — depth-of-reach matrix: AC gap only → BRD auto; missing story → designer decision; missing journey stage → designer decision; new persona behavior → designer decision; new persona → HARD BLOCK until discovery runs)

### Artifact storage:
All design artifacts → `design/` directory at project root (including `design/15_PROTOTYPE/`)

### BRD — Master Business Requirement Document
- Path: `design/BRD.xlsx`
- Manifest: `design/BRD_manifest.md`
- Blank template: `BRD_Template_v1.0.xlsx` (project root — copy to `design/BRD.xlsx` on project init)
- Validation: `python design/scripts/sync-brd.py`

### Non-negotiable rules:
- Journeys and stories are TECH AND UI AGNOSTIC — no screen references, no button names, no UI patterns
- Canvas briefs are the SINGLE SOURCE OF TRUTH for intent — named `{ScreenID}_{screen-name}.md`, one file per screen with states as sections
- **Canvas brief structure:** Section 1 = Frame inventory (all frames to visualize), Section 2 = Traceability (stories, business rules, process flow steps, interaction specs), Sections 3–12 = brief body
- **Traceability is enforced:** `node design/scripts/sync-traceability.js` validates bidirectional consistency between canvas briefs ↔ story map ↔ screen inventory ↔ interaction specs ↔ business rules
- **Story IDs (DS-NNN) and Business Rule IDs (BR-NN) are stable** — never reused, splits retire the original with a pointer
- Every design decision must trace back to a persona, story, or design principle
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

### Cross-reference: Design artifacts → Develop loop
| Design artifact | Feeds into | How |
|----------------|-----------|-----|
| IA sitemap | `figma-file-setup` | Screen list becomes Sitemap page |
| IA screen inventory | `figma-page-setup` | Each screen becomes a numbered Figma page |
| Visual rationale | `figma-tokens` | Color, typography, spacing values become tokens |
| Interaction state inventory | `figma-component` | States become component variants |
| Content patterns | `figma-component` | Text becomes component TEXT properties |
| A11y patterns | `figma-component` | Focus states, ARIA descriptions |
| Canvas briefs | All Figma skills + `design-prototype` | Single source of truth per screen — frame inventory + traceability block + brief body |
| Screen inventory (IA) | `design-canvas`, `sync-traceability.js` | Authoritative story-to-screen junction table |
| Business rules register | `design-canvas`, `design-interaction` | Constraint table in canvas briefs, behavioral spec triggers |
| Walking skeleton | `design-prototype` | Primary flow order for wiring screens |
| Story map + release slices | `design-prototype` | Scope and secondary flows |
| Validation checklist | `figma-audit` | Extends audit with UX-specific checks |
| Behavioral archetypes | `design-journeys`, `design-interaction`, `design-visual`, `design-content`, `design-validation`, `design-canvas` | Archetype tensions inform state priorities, information density, terminology, and scenario coverage |
| BRD User Stories | All modes, `sync-brd.py` | Master cross-track collaboration document; AC enriched by every contributing mode |
| BRD RBAC | `design-ia` | Role-feature access matrix from navigation model |
| BRD Notification Mapping | `design-interaction` | Trigger events from error strategy and notification flows |
| BRD Data Fields | `design-ia` | Field-level details from content inventory |
| BRD LOV | `design-content` | Canonical terms from terminology guide |
| Designer edits (external) | `figma-handoff` | Detected changes harmonized into design system |
| Governance inventory | `figma-inventory` | Lifecycle tracking, status, action history |
| Documentation components | `figma-docs` | Token visualization, component usage guides, Storybook stories |

### File architecture (3-file DLS):
- `Foundation – [Project] DLS` → all variables, styles, documentation (single source of truth for tokens)
- `Icons & Illustrations – [Project] DLS` → icon sets, illustration assets (consumes Foundation)
- `Components – [Project] DLS` → UI components, atoms → templates (consumes Foundation)
- `[Project] - Working` → active design canvas (screens, flows; enables all three DLS libraries)
