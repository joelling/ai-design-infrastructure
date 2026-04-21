Design System Project
<!-- toolchain-version: 2.1.0 | updated: 2026-04-18 -->

## Design Playbook — Single Source of Truth

**`design/process/`** is the single source of truth for the entire design process. It contains numbered mode files (01 through 20) plus a README, each describing one design mode — its purpose, mental model, process, outputs, rules, and downstream connections.

### Multi-harness support

This repository supports two AI-assistant harnesses in parallel: Claude Code (via `.claude/` + this file) and IBM Bob (via `.bob/` + `BOB.md`). Both consume the same `design/process/` chapters as authoritative. The fan-out spec is `design/process/_propagation.yaml`; mirror parity is enforced by `node design/scripts/sync-skills.js`. `.bobignore` keeps Bob out of `.claude/`; Claude does not read `.bob/` during design work. Both SKILL.md sets must stay semantically aligned — the `workflow-update` skill handles this automatically.

### How changes work
- **Designers do not edit the process files directly** — all changes go through Claude
- When a designer identifies a process improvement, they tell Claude what to change
- Claude edits the relevant `design/process/*.md` file AND immediately propagates to all affected files per `design/process/_propagation.yaml`:
  - `.claude/skills/*/SKILL.md` — updates the corresponding skill's workflow, rules, dependencies, or outputs
  - `.bob/skills/*/SKILL.md` — mirrored updates for the Bob harness (preserving the `<!-- mirror: bob | SSOT: ... -->` pointer and any `{{MCP_PREFIX}}` placeholders)
  - `CLAUDE.md` AND `BOB.md` — both orchestration docs updated in lockstep; divergence is a bug
  - `design/process/README.md` and `design/process/00-overview.md` — chapter index / tier labels when modes are added/removed/reordered
  - `.bob/rules/50-bob-adaptations.md` — when a new tool dependency needs a Claude→Bob mapping entry
- Claude runs `node design/scripts/sync-skills.js` to confirm parity before reporting done
- Claude summarizes what was propagated so the designer can review via `git diff`
- Git provides full version history of all process changes

### Skill architecture principles
When deciding whether a process mode should map to one skill or multiple skills, follow the seven principles documented in the **Skill architecture** section of `design/process/README.md`. The decision flowchart evaluates: external tool boundaries (P1), independent re-invocation (P2), hard data dependency gates (P3), context window budget (P4), artifact coherence (P5), failure blast radius (P6), and distinct timing/triggers (P7). Current topology: 17 standalone design-* chapters (Tier 1–3 + lint + query + canvas + wireframe + prototype), 3 Tier 4 umbrellas (`design-screen-compose`, `design-foundation-library`, `design-component-library`), and 12 figma-* sub-skills orchestrated by those umbrellas (triggers P1, P2, P3, P6, P7). Watch list for potential future splits: `design-research` (Phase B synthesis), `design-prototype` (drift-sync logic), `figma-screen-compose` sub-skill (Plan vs. Execute), `design-foundation-library` (if Phase B intake routing grows complex), `design-component-library` (if Style Dictionary + Code Connect + Storybook diverge enough to warrant per-tool sub-skills).

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

The 32 operational skills are grouped under three elemental operations (after Karpathy's LLM wiki pattern). This is a cross-cutting lens — a skill's tier tells you *when* it runs; its operation tells you *what kind of work* it does. The viewer reflects this grouping via a sidebar toggle (`By Tier` / `By Operation`); each process chapter's `operation:` YAML frontmatter drives the grouping.

- **INGEST** — produce authoritative artifacts from raw inputs or upstream artifacts. Discovery, user-models, journeys, process-flows, stories, IA, interaction, visual, content, accessibility, research Phase A, governance Phase A, design-screen-compose (umbrella), design-foundation-library Phase A + B, design-component-library Phase A + B, figma-handoff, figma-file-setup, figma-tokens, figma-page-setup, figma-component, figma-screen-compose (sub-skill).
- **QUERY** — aggregate artifacts into a retrieval surface at a specific axis (per-screen, per-entity, per-flow). Canvas, wireframe, prototype, query Phase A, figma-docs, figma-inventory, figma-parking-lot.
- **LINT** — cross-check artifacts for drift, gaps, or principle violations. design-lint, figma-audit, research Phase B, governance Phase B, query Phase B, design-component-library drift detection (Phase B Plan).

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

Tier 4 has two parallel tracks:

1. **Per-sprint sequential pipeline** (chapters 13–16, run for every screen) — Canvas → Wireframe → Screen Composition → Prototype.
2. **Continuous design-system pipeline** (chapters 17–18, bootstrapped once from Tier 3, then continuous) — Foundation Library (Figma) ↔ Component Library (code).

```
Tier 3 (Visual, Content, Interaction, A11y stabilise)
     │
     ├─► Foundation Library (Phase A bootstrap) ──► Component Library (Phase A bootstrap)
     │         │ continuous Phase B                         │ continuous Phase B
     │         ▼                                            ▼
     │  Figma Foundation + Components DLS            Code tokens + components
     │         │                                            │
     │         └──────────────┬─────────────────────────────┘
     │                        │ consumed by
     ▼                        ▼
 Canvas Brief ──► ASCII Wireframe ──► Screen Composition (Figma) ──► Prototype
   (intent)       (flow validation,      (visual execution,           (interaction
                   disposable gate)       published-library            fidelity,
                                          instances only)              consumes code lib)
```

The wireframe is a validation gate (disposable, archived when Figma starts). The prototype closes the loop by consuming Component Library code.

#### Per-sprint sequential pipeline (chapters 13–16):
13. **`design-canvas`** — Aggregates ALL upstream artifacts into per-screen briefs (authoritative for intent)
14. **`design-wireframe`** — Clickable ASCII wireframes for structural/flow validation with stakeholders (validation gate, disposable)
15. **`design-screen-compose`** — Per-sprint Figma composition umbrella. Orchestrates `figma-connect`, `figma-handoff`, `figma-file-setup`, `figma-page-setup`, `figma-screen-compose` (sub-skill). Places published-library component instances; writes composition logs; routes missing-component requests to `design-foundation-library` parking lot.
16. **`design-prototype`** — Coded interactive prototype from Figma screens. When `design-component-library` is bootstrapped, consumes its code components + tokens via `figma-mapping.json`; otherwise falls back to ad-hoc HTML/CSS and flags the gap.

#### Continuous design-system pipeline (chapters 17–18):
17. **`design-foundation-library`** — Continuous Figma library umbrella. Phase A (bootstrap after Tier 3) sets up the 3-file DLS (Foundation, Icons & Illustrations, Components), seeds tokens and foundational components. Phase B (continuous) intakes requests from the parking lot, promotes/defers/rejects, publishes components, revises tokens. Orchestrates `figma-tokens`, `figma-component`, `figma-parking-lot`, `figma-inventory`, `figma-audit`, `figma-docs`, `figma-library-mode`.
18. **`design-component-library`** — Continuous code-side mirror. Phase A (bootstrap after Foundation Library Phase A) scaffolds framework (React / Vue / Svelte / vanilla — project's choice), initialises Style Dictionary, builds first tokens, generates component skeletons. Phase B (continuous, Plan/Execute) detects drift between Figma library and code library, rebuilds tokens from Figma, generates/updates code components, refreshes `figma-mapping.json` (universal bridge) and Code Connect `.figma.tsx` files (if available).

#### Tier 4 mandatory order:
1. **`design-canvas`** must run before any per-sprint build (HARD BLOCK: requires IA + interaction + visual + content)
2. **`design-wireframe`** should run before `design-screen-compose` (SOFT GATE)
3. **`design-foundation-library` Phase A** must run before `design-screen-compose` can place any published-library instance (HARD BLOCK)
4. **`design-component-library` Phase A** should run after Foundation Library Phase A but before `design-prototype` (SOFT GATE; prototype falls back if unavailable)
5. **`design-screen-compose`** requires canvas brief + set-up page + published-library components (HARD BLOCK)
6. **`design-prototype`** requires canvas briefs + Figma screens + walking skeleton (HARD BLOCK)

#### Figma sub-skills — invocation order inside `design-screen-compose`:
1. **`figma-connect`** — ALWAYS first, every session. Never skip.
2. **`figma-handoff`** — Detect and harmonize designer changes since last session.
3. **`figma-file-setup`** — Run if the sprint Working file is new or missing standard pages.
4. **`figma-page-setup`** — Run before composing a new screen's page.
5. **`figma-screen-compose`** (sub-skill) — Plan/Execute composition of published-library instances.

#### Figma sub-skills — invocation inside `design-foundation-library`:
- Phase A: `figma-connect` → `figma-file-setup` (for the 3 DLS files) → `figma-tokens` → `figma-component` (seed) → `figma-parking-lot` → `figma-docs` → `figma-inventory`.
- Phase B: `figma-parking-lot` (intake) → `figma-component` (promote draft) or `figma-tokens` (revise) → `figma-inventory` (lifecycle update) → `figma-audit` (health) → `figma-docs` (refresh) → `figma-library-mode` (migrations only).

#### Develop loop sync rules:
| Direction | Trivial change (content/label) | Structural change |
|---|---|---|
| **Canvas → Screen Composition → Prototype** | **Auto-sync** all three nodes | **Flag drift** — designer approves, canvas brief updates first, then propagates |
| **Screen Composition → Canvas (via composition log)** | **Always require approval** — proposed brief edit written as commented-out block at end of brief MD | **Always require approval** |
| **Foundation Library → Component Library** | **Auto-sync** on token revisions (rebuild) | **Plan/Execute** with designer approval for component matrix changes |
| **Foundation Library → Screen Composition** | **Auto-sync** — new published components become available immediately | **Flag drift** — breaking component changes propagate via composition log replays |
| **Component Library → Prototype** | **Auto-sync** on token or component publishes | **Flag drift** on breaking component API changes |

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
- Ready to build (per-sprint) → `design-canvas` → `design-wireframe` → `design-screen-compose` → `design-prototype`
- Canvas briefs ready for structural validation → `design-wireframe`
- Canvas brief updated after wireframe exists → re-run `design-wireframe` for affected screens
- Wireframe review approved → `design-screen-compose` may begin
- Screen composition starting → archive wireframes
- Making design interactive → `design-prototype`
- **Tier 3 has stabilised (visual + content + interaction + a11y first-pass complete) → `design-foundation-library` Phase A** (HARD GATE before any per-sprint composition)
- **`design-foundation-library` Phase A complete → `design-component-library` Phase A** (SOFT GATE; prototype falls back if skipped)
- New parking-lot intake from `design-screen-compose` or `figma-handoff` → `design-foundation-library` Phase B (triage: promote / defer / reject)
- Token revision in Figma → `design-foundation-library` Phase B publishes → `design-component-library` Phase B rebuild (Style Dictionary regenerates code tokens)
- New component published in Components DLS → `design-component-library` Phase B Plan (diff Figma library against code library) → Execute (mirror)
- Code component drifted from Figma source → `design-component-library` Phase B drift detection flags → designer approves → resync
- Per-sprint composition session starting → `design-screen-compose` umbrella (orchestrates `figma-connect` → `figma-handoff` → `figma-file-setup` → `figma-page-setup` → `figma-screen-compose` sub-skill)
- Blank/empty Figma file (`"children":[]`) → `figma-file-setup` immediately
- Any UI element being built → `figma-component` workflow, not raw `figma_execute`
- `figma_execute` is a last resort — only for operations no other tool covers
- Designer made changes in Figma → `figma-handoff` to detect and harmonize (routes new-component requests to `design-foundation-library` parking lot)
- Need inventory status or reconciliation → `figma-inventory`
- Documentation pages needed for tokens or components → `figma-docs` (within `design-foundation-library`)
- Canvas brief exists, page is set up, screen is empty → `figma-screen-compose` sub-skill Phase A (Plan)
- `figma-screen-compose` sub-skill Phase A approved → Phase B (Execute)
- Canvas brief revised and re-saved → re-run `figma-screen-compose` sub-skill Phase A on affected screens (sync-hash diff)
- Batch UI workload starting (multiple screens) → `figma-screen-compose` sub-skill Phase A in batch mode for pattern report
- Designer fine-tuned in Figma after compose → next session `figma-handoff` classifies overrides against logged compositions
- Mid-stream missing component during composition → no block; placeholder + inventory `draft` entry + queue surfaces in next `design-foundation-library` Phase B (parking-lot triage)
- After `figma-screen-compose` sub-skill runs → `node design/scripts/sync-composition.js` to validate composition logs ↔ briefs ↔ inventory
- **BRD is generated, never authored directly** → `python design/scripts/sync-brd.py` regenerates `design/BRD.xlsx` by aggregating from md SSOT files (story-map, business-rules-register, rbac, notifications, data-dictionary, terminology, screen-inventory)
- Story map updated → `sync-brd.py` regenerates BRD User Stories sheet; AC bullets with `[BR-NN]` tags inline-expand BR text from `business-rules-register.md`
- Business rules register updated → `sync-brd.py` re-expands `[BR-NN]` references in every story's AC cell
- Screen inventory updated → `sync-brd.py` updates BRD Feature/Touchpoint column (reverse lookup of "Stories served")
- IA produces or updates `rbac.md` → `sync-brd.py` regenerates BRD RBAC sheet (warns and overrides if `navigation-model.md` still holds a role-feature matrix)
- IA produces or updates `notifications.md` → `sync-brd.py` regenerates BRD Notification Mapping sheet (interaction artifacts cite `[NOTIF-NNN]` ids; messaging text lives in `notifications.md`)
- IA produces or updates `data-dictionary.md` → `sync-brd.py` regenerates BRD Data Fields sheet
- Interaction specs updated → enrich AC bullets with `[STATE]`/`[BEHAVIOR]`/`[A11Y]`/`[NOTIF-NNN]` tags (in-cell references, no expansion)
- Terminology guide updated → `sync-brd.py` regenerates BRD LOV sheet from `terminology.md` LOV section
- Canvas synthesis reveals AC gap → add `[CANVAS]` tagged AC bullet directly to story-map; next `sync-brd.py` propagates
- Priority/release columns are **out of BRD regeneration scope** — release slicing is a PM concern; sync-brd.py preserves any manually edited values and warns if they look stale
- Screen idea or canvas brief arrives without upstream stories → apply canvas-first backward propagation rule (see `design/process/13-canvas.md` — depth-of-reach matrix: AC gap only → BRD auto; missing story → designer decision; missing journey stage → designer decision; new persona behavior → designer decision; new persona → HARD BLOCK until discovery runs)
- Anything feels out of sync, broken, or missing → `design-lint` for a health report
- Before entering Tier 4 → run `design-lint` to clear Critical findings
- After any research Phase B or governance Phase B synthesis → run `design-lint` to catch propagation gaps
- Asking "what do we know about X?" or searching across artifacts → `design-query`
- After Tier 3 stabilizes (first time) → run `design-query` Phase A to bootstrap `design/WIKI/`
- Querying reveals a gap, contradiction, or undocumented decision → `design-query` files it back with designer confirmation
- After `git pull` updating the toolchain → run `node design/scripts/migrate.js` to check for pending v2 bootstraps (or it runs automatically if post-merge hook is installed)
- Any source artifact version bumped → run `node design/scripts/sync-wiki.js` to detect stale wiki pages and refresh `design/WIKI/.backlinks.json`
- After any artifact is retired or replaced (Split / Merge / Supersede) → run `node design/scripts/sync-retirement.js` to validate `superseded_by` / `merged_into` / `supersedes` pointer integrity

### Artifact storage:
All design artifacts → `design/` directory at project root (including `design/13_CANVAS_BRIEFS/`, `design/14_WIREFRAMES/`, `design/15_FIGMA/composition-logs/`, `design/15_COMPONENT_LIBRARY/{tokens,components,code-connect,storybook}/`, `design/16_PROTOTYPE/`, `design/WIKI/`, `design/LINT_REPORT.md`, and `design/DECISION_LOG.md`)

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
- **Retirement pointers are validated.** After any artifact is retired or replaced (Split / Merge / Supersede), run `node design/scripts/sync-retirement.js` to confirm that every retired artifact declares at least one `superseded_by` / `merged_into` / `supersedes` pointer, that pointer targets resolve to known IDs, and that reverse pointers are consistent. Framework subtrees (`design/process/`, `design/templates/`, `design/scripts/`, `design/viewer/`) are excluded since their retirement markers are illustrative.
- **`figma-screen-compose` places only published-library instances** — never local components, never parking-lot components; all property overrides via `setProperties` (never raw `node.characters`)
- **Composition logs are append-only and evidence-only** — never edit prior runs; brief edits proposed by composition runs are written as commented-out blocks at the end of the brief MD and require explicit designer approval
- **The BRD is a generated artifact, not a source of truth** — every BRD sheet is regenerated from md SSOT files by `sync-brd.py`; manual edits to `design/BRD.xlsx` are overwritten on the next sync (except priority/release columns, which are out of scope). Designers edit md SSOT files; the BRD aggregates.
- **`design-foundation-library` is the single Figma-side source of truth for the design system** — the per-sprint `design-screen-compose` umbrella consumes published instances only; never authors components directly into sprint Working files. Component requests flow upstream via parking lot, never downstream as ad-hoc local variants.
- **Style Dictionary (or equivalent transformer) is the canonical token bridge from Figma to code** — `design-component-library` Phase A initialises it; Phase B regenerates code tokens whenever Foundation Library republishes. `figma-mapping.json` is the universal Figma-component → code-component bridge; Code Connect `.figma.tsx` files are an optional enrichment layer when the team has React + Code Connect available.

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
| Tier 3 stable artifacts (visual + interaction + content + a11y) | `design-foundation-library` Phase A | Bootstrap signal — Foundation DLS variables, foundational components, documentation seed all derive from these |
| `design-foundation-library` published library | `design-screen-compose`, `design-component-library` Phase B | Sprint compositions consume published instances; code library mirrors the same surface |
| `design-component-library` published code | `design-prototype` | Prototype imports code components + Style Dictionary tokens; falls back to ad-hoc HTML/CSS when the library is not bootstrapped |
| Style Dictionary token build | `design-component-library` Phase A + B, `design-prototype` | Code-side token tree generated from Figma variables; consumed by prototype and any downstream production codebase |
| `figma-mapping.json` | `design-component-library`, `design-prototype` | Universal Figma-component-id → code-component-path bridge; canonical when Code Connect is unavailable, complementary when it is |
| Code Connect `.figma.tsx` files | `design-component-library` Phase B (when team has React + Code Connect) | Optional enrichment layer — declarative mapping consumed by Figma's Dev Mode MCP; `figma-mapping.json` remains the universal fallback |
| `data-dictionary.md` (IA) | `sync-brd.py` → BRD Data Fields sheet | Global field catalog (id, type, validation, format, source-screen back-references) |
| `rbac.md` (IA) | `sync-brd.py` → BRD RBAC sheet | Role-feature access matrix; replaces the table previously nested inside `navigation-model.md` |
| `notifications.md` (IA) | `sync-brd.py` → BRD Notification Mapping sheet; `design-interaction` references via `[NOTIF-NNN]` ids | Canonical catalog of notification messages (id, channel, recipient, copy template, trigger event) |

### File architecture (3-file DLS):
- `Foundation – [Project] DLS` → all variables, styles, documentation (single source of truth for tokens)
- `Icons & Illustrations – [Project] DLS` → icon sets, illustration assets (consumes Foundation)
- `Components – [Project] DLS` → UI components, atoms → templates (consumes Foundation)
- `[Project] - Working` → active design canvas (screens, flows; enables all three DLS libraries)
