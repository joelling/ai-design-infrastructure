# BOB.md — IBM Bob orchestration guide (peer to CLAUDE.md)

> This repository supports two AI-assistant harnesses: Claude Code (via `.claude/` + `CLAUDE.md`) and IBM Bob (via `.bob/` + this file). The **design process itself** lives in `design/process/` and is harness-agnostic. This file is the Bob-side orchestration summary — the skill inventory, trigger rules, and cross-references — tuned to Bob's invocation model.

## Single source of truth

`design/process/` contains 20 numbered markdown chapters plus `README.md`. Chapters describe every mode's mental model, workflow, outputs, and rules. **Bob never edits chapter files directly** — route all process changes through the `workflow-update` skill (or the `/workflow-update` slash command).

### How changes work

- Designers tell Bob what to change; Bob runs `workflow-update`.
- `workflow-update` reads `design/process/_propagation.yaml`, edits the affected chapter(s), and fans out to every mirror.
- `node design/scripts/sync-skills.js` confirms mirror parity (both `.claude/` and `.bob/` in lockstep).
- Claude Code's `CLAUDE.md` and this file are peer orchestration docs — they must stay aligned.

### Skill architecture principles

The seven-principle decision flowchart for one-skill-vs-many is documented in `design/process/README.md`. Bob follows the same topology as Claude: 17 Tier 1–3 standalone design-* skills + 3 Tier 4 umbrellas + 12 figma-* sub-skills, plus 2 harness-infra skills (`workflow-update`, `design-validation`).

---

## Bob-specific adaptations

The full Claude→Bob primitive mapping, known limitations, and the tool-reference substitution checklist live in **`.bob/rules/50-bob-adaptations.md`**. Highlights:

- **No parallel subagent spawn.** Umbrella skills serialise sub-steps inside one conversation.
- **MCP namespace placeholder.** SKILL.md files use `{{MCP_PREFIX}}` where Claude writes `mcp__`. Resolve on first live `figma-connect`.
- **`alwaysAllow`** in `.bob/mcp.json` is conservative by default — graduate safe read-only tools into the list as the user builds confidence.
- **`.bobignore`** keeps Bob out of `.claude/` and out of generated artifacts.

---

## Operational model — Ingest / Query / Lint

The 32 operational skills group under three elemental operations (cross-cutting with tier). A skill's tier tells you *when* it runs; its operation tells you *what kind of work* it does.

- **INGEST** — produce authoritative artifacts from raw inputs or upstream artifacts.
- **QUERY** — aggregate artifacts into a retrieval surface at a specific axis (per-screen, per-entity, per-flow).
- **LINT** — cross-check artifacts for drift, gaps, or principle violations.

## Synthesis pass order

Three skills run a Phase B synthesis pass after Phase A ingest. Run in this order or later passes miss upstream signal:

1. `design-research` Phase B
2. `design-governance` Phase B
3. `design-query` Phase B

Each Phase B must warn in step 0 if its predecessor is stale.

---

## Ordering: Flexible with guardrails

- Modes can be invoked in any order. Every skill checks upstream on entry (step 0) and warns on staleness.
- HARD BLOCKs are non-negotiable; Bob refuses and reports the unmet gate.
- SOFT GATEs are warnings that require user confirmation.

### Hard blocks (checked by every skill in step 0)

- `design-canvas` requires IA + interaction + visual + content artifacts.
- `figma-screen-compose` requires canvas brief + set-up page + published-library components.
- `design-prototype` requires canvas briefs + Figma screens + walking skeleton.
- `design-foundation-library` Phase A must run before any sprint composition places published instances.

### Soft gates

- Wireframe review before Figma execution.
- `design-component-library` Phase A before `design-prototype` (prototype falls back otherwise).
- `design-lint` Critical findings resolved before entering Tier 4.

---

## TIER 1 — DISCOVERY

1. **`design-discovery`** — Processes raw inputs via three-tier intake: per-input cleaning → per-type synthesis → cross-type project context.
2. **`design-user-models`** — Personas, empathy maps, jobs-to-be-done, behavioral archetypes (progressive confidence).

## TIER 2 — DEFINITION (tech- and UI-agnostic)

3. **`design-journeys`** — User journeys, service blueprints.
4. **`design-process-flows`** — Swimlane diagrams + business rules register.
5. **`design-stories`** — User story mapping: backbone, walking skeleton, release slices.
6. **`design-ia`** — Sitemap, navigation model, content hierarchy, taxonomy.

## TIER 3 — DESIGN

7. **`design-interaction`** — Interaction models, behavioral specs, state inventory, error strategy.
8. **`design-visual`** — Brand attributes, color/typography rationale, visual language.
9. **`design-content`** — Voice & tone, microcopy patterns, terminology guide.
10. **`design-accessibility`** — WCAG, ARIA patterns, keyboard nav, contrast audit.
11. **`design-research`** — Two-phase: scenario scripts + test plan (A); findings synthesis (B).
12. **`design-governance`** — Two-phase: versioning + contribution rules (A); principle codification (B).

## CROSS-CUTTING — Compounding knowledge

- **`design-lint`** — Health check: runs structural scripts + semantic checks; outputs `design/LINT_REPORT.md`.
- **`design-query`** — Wiki bootstrap (A) + natural-language query with file-back (ongoing).

## TIER 4 — DEVELOP

Two parallel tracks:

1. **Per-sprint sequential pipeline** — Canvas → Wireframe → Screen Composition → Prototype.
2. **Continuous design-system pipeline** — Foundation Library (Figma) ↔ Component Library (code).

### Per-sprint pipeline

13. **`design-canvas`** — Aggregates upstream into per-screen briefs (authoritative for intent).
14. **`design-wireframe`** — Disposable clickable ASCII wireframes for structural validation.
15. **`design-screen-compose`** — Per-sprint Figma composition umbrella. Orchestrates `figma-connect`, `figma-handoff`, `figma-file-setup`, `figma-page-setup`, `figma-screen-compose` (sub-skill).
16. **`design-prototype`** — Coded interactive prototype; consumes `design-component-library` code when bootstrapped, else falls back.

### Continuous design-system pipeline

17. **`design-foundation-library`** — Continuous Figma library umbrella. Phase A sets up the 3-file DLS; Phase B intakes from the parking lot. Orchestrates `figma-tokens`, `figma-component`, `figma-parking-lot`, `figma-inventory`, `figma-audit`, `figma-docs`, `figma-library-mode`.
18. **`design-component-library`** — Continuous code-side mirror. Phase A scaffolds the framework + Style Dictionary; Phase B detects drift and rebuilds.

### Umbrella sub-skill invocation order

Bob does not spawn parallel sub-agents; umbrellas serialise steps.

**`design-screen-compose`:**
1. `figma-connect` — always first
2. `figma-handoff`
3. `figma-file-setup` (if new Working file)
4. `figma-page-setup` (per screen)
5. `figma-screen-compose` (sub-skill, Plan → Execute)

**`design-foundation-library` Phase A:**
1. `figma-connect`
2. `figma-file-setup` (3 DLS files)
3. `figma-tokens`
4. `figma-component` (seed)
5. `figma-parking-lot`
6. `figma-docs`
7. `figma-inventory`

**`design-foundation-library` Phase B:**
1. `figma-parking-lot` (intake)
2. `figma-component` (promote) or `figma-tokens` (revise)
3. `figma-inventory` (lifecycle)
4. `figma-audit` (health)
5. `figma-docs` (refresh)
6. `figma-library-mode` (migrations only)

### Develop-loop sync rules

| Direction | Trivial change | Structural change |
|---|---|---|
| Canvas → Screen Composition → Prototype | Auto-sync | Flag drift; canvas brief updates first |
| Screen Composition → Canvas (via composition log) | Always require approval (commented-out proposal) | Always require approval |
| Foundation Library → Component Library | Auto-sync tokens | Plan/Execute with approval |
| Foundation Library → Screen Composition | Auto-sync new components | Flag drift on breaking changes |
| Component Library → Prototype | Auto-sync on publishes | Flag drift on breaking API changes |

Rationale: composition log is *evidence*; canvas brief is *intent*. Auto-merging Figma drift back into the brief erodes the brief's role as SSOT.

---

## Trigger rules

Bob auto-routes by matching the user's request against each skill's description. When two skills are vocabularily adjacent, consult `.bob/rules/30-trigger-rules.md` for the disambiguator table and slash-command backstops.

High-level triggers:

- New design project → `design-discovery` first.
- Understand users → `design-user-models`.
- Map how users experience a process → `design-journeys` (tech/UI agnostic).
- Capture decision logic, business rules, exception paths → `design-process-flows`.
- Structure what to build → `design-stories`.
- Determine screen structure → `design-ia`.
- Screen behavior → `design-interaction`.
- Visual direction → `design-visual`.
- Text and labels → `design-content`.
- Accessibility → `design-accessibility`.
- Research test plan → `design-research` Phase A.
- Research synthesis → `design-research` Phase B (then `design-governance` Phase B then `design-query` Phase B).
- Build (per-sprint) → `design-canvas` → `design-wireframe` → `design-screen-compose` → `design-prototype`.
- Design-system bootstrap → `design-foundation-library` Phase A (HARD GATE) → `design-component-library` Phase A (SOFT GATE).
- Sprint composition session → `design-screen-compose` umbrella.
- Anything out of sync → `design-lint` (or `/design-lint`).
- Any question about the corpus → `design-query` (or `/design-query`).
- Any process change → `workflow-update` (or `/workflow-update`).
- After `git pull` updating the toolchain → `node design/scripts/migrate.js`.

A comprehensive trigger list with disambiguators lives in `.bob/rules/30-trigger-rules.md`.

---

## Artifact storage

All design artifacts → `design/` at project root. Key locations:

- `design/13_CANVAS_BRIEFS/` — per-screen briefs (SSOT for intent)
- `design/14_WIREFRAMES/` — disposable ASCII wireframes
- `design/15_FIGMA/composition-logs/` — per-screen composition evidence
- `design/15_COMPONENT_LIBRARY/{tokens,components,code-connect,storybook}/`
- `design/16_PROTOTYPE/`
- `design/WIKI/` — query-generated cross-referenced entity wiki
- `design/LINT_REPORT.md` — health report (generated)
- `design/DECISION_LOG.md` — append-only decision record
- `design/BRD.xlsx` — master business requirements (generated from md SSOT)

### BRD — generated, not authored

Path: `design/BRD.xlsx`. Manifest: `design/BRD_manifest.md`. Regenerate via `python design/scripts/sync-brd.py` (or `/sync-brd`). Sources: story-map, business-rules-register, rbac, notifications, data-dictionary, terminology, screen-inventory. Priority/Release columns preserve PM edits; everything else is overwritten on sync.

### Decision Log — append-only

Path: `design/DECISION_LOG.md`. Skills append entries; entries are never edited or deleted (corrections are new entries).

### Project Wiki

Path: `design/WIKI/`. Entry: `design/WIKI/index.md`. Generated by `design-query` Phase A; refreshed by `node design/scripts/sync-wiki.js` on source version bumps.

---

## Non-negotiable rules

- Journeys and stories are tech- and UI-agnostic.
- Canvas briefs are the SSOT for intent — one file per screen, states as sections. Section 1 = Frame inventory; Section 2 = Traceability block.
- Traceability is enforced by `node design/scripts/sync-traceability.js`.
- Story IDs (DS-NNN) and Business Rule IDs (BR-NN) are stable — never reused.
- Every design decision traces back to a persona, a story, or a principle.
- No Figma screen without a canvas brief (except exploratory).
- No wireframe-less Figma build (soft gate except exploratory).
- No prototype without a Figma implementation.
- ZERO hardcoded values in Figma — every fill, spacing, radius references a token.
- ALL Figma frames use auto-layout.
- Every reusable UI element is a Figma component.
- Page naming: `[number] - [Screen Name]`.
- BRD acceptance criteria are UI-agnostic, bullet-per-requirement. Tags: `[BR-NN]`, `[FLOW]`, `[STATE]`, `[BEHAVIOR]`, `[A11Y]`, `[NOTIF-NNN]`, `[CANVAS]`.
- Staleness is visible — `_upstream.md` per mode dir; version headers on every output artifact.
- Retire, don't delete — IDs stable, lineage preserved, `status: retired` frontmatter.
- `design-lint` never auto-fixes — it reports, designer decides.
- `design-query` never auto-modifies artifacts — all file-backs require designer confirmation.
- Composition logs are append-only evidence; brief edits proposed by composition runs are commented-out and require approval.
- `design-foundation-library` is the single Figma-side SSOT for the design system.
- Style Dictionary is the canonical Figma→code token bridge. `figma-mapping.json` is the universal component-id → code-path bridge.

The complete rule list (including the retire-vs-edit decision framework) lives in `design/process/README.md` and is authoritative.

---

## Harness parity check

Before committing any process-related change, run:

```
node design/scripts/sync-skills.js
```

Zero errors means every skill in the inventory exists in every registered harness with matching `name:` frontmatter and a valid SSOT pointer (non-Claude harnesses). Warnings identify mirrors not yet built out.

For a full pipeline sweep before Tier 4 work:

```
node design/scripts/sync-status.js && node design/scripts/sync-traceability.js && node design/scripts/sync-composition.js
```

Or simply run `/design-lint`.
