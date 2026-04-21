---
name: design-canvas
description: >
  Synthesis mode that bridges upstream design artifacts to Figma execution.
  Aggregates IA, personas, stories, interaction models, visual specs, content,
  and accessibility into a single per-screen canvas brief that tells the Develop
  loop what to build. First of the four sequential per-sprint Tier 4 modes
  (canvas → wireframe → screen-compose → prototype). Canvas briefs define intent;
  `design-screen-compose` executes them in Figma using `design-foundation-library`
  components; `design-prototype` makes the result interactive. Triggers on:
  "canvas brief", "screen brief", "design to canvas", "translate to UI",
  "build screen", "compose screen", "prepare for figma", "screen spec", "canvas
  spec", "aggregate design", "synthesis", or when ready to translate design
  decisions into executable instructions. HARD BLOCK: requires IA + interaction
  + visual + content artifacts.
---

<!-- mirror: bob | SSOT: design/process/13-canvas.md -->

# design-canvas — Per-Screen Brief Synthesis (Bob)

## Purpose

Aggregate ALL upstream design decisions into per-screen briefs. The brief is the SSOT for build intent — every downstream Tier 4 artifact (wireframe, Figma composition, prototype) consumes it.

## Hard block

Before running, verify:

- `design/06_INFORMATION_ARCHITECTURE/sitemap.md` exists.
- `design/06_INFORMATION_ARCHITECTURE/screen-inventory.md` exists and lists the target screen(s).
- `design/07_INTERACTION/` has state inventory and behavioral specs.
- `design/08_VISUAL/` has visual rationale.
- `design/09_CONTENT/` has microcopy and terminology.

If any is missing, REFUSE and report the gap. Do not attempt a partial brief.

## Workflow

### Step 0 — Staleness sweep

Run `node design/scripts/sync-status.js` filtered to upstream mode dirs. Warn if any upstream is stale; let the user decide whether to proceed or re-run upstream first.

### Step 1 — Scope

Ask the user: one screen, a flow (several connected screens), or a release slice (everything in a walking skeleton slice)? Retrieve the matching IDs from `screen-inventory.md`.

### Step 2 — Per-screen synthesis

For each target screen (ID format `P-NNN`, `OV-NNN`, `DE-NNN`, etc.), produce `design/13_CANVAS_BRIEFS/{ScreenID}_{screen-name}.md` with:

**Section 1 — Frame inventory** — Every frame that will be visualized (default, loaded, empty, error, loading, success, disabled, mobile, tablet, desktop, etc.) with one line per frame describing its purpose.

**Section 2 — Traceability block** — YAML-like list of stable IDs:

```
stories:           [DS-042, DS-043]
business_rules:    [BR-07, BR-18]
process_flow:      PF-03 steps 2–4
interaction_specs: [IS-P-012_default, IS-P-012_error]
personas:          [PER-01 primary, PER-03 secondary]
principles:        [GP-002, GP-007]
```

Enforced by `node design/scripts/sync-traceability.js`.

**Sections 3–12 — Brief body:**

3. Screen purpose (2–4 sentences).
4. Entry points (which flows lead here; from which screens).
5. Primary job-to-be-done (which user story DS-NNN).
6. States covered (each state from the frame inventory, expanded).
7. Layout regions (Header / Content / Footer; modal overlays).
8. Components needed (published library references; flag any missing as `[MISSING]` → parking lot).
9. Content (labels, microcopy, empty-state text, error messages — cite terminology.md).
10. Interaction behaviors (given/when/then per interaction spec).
11. Accessibility requirements (ARIA patterns, keyboard nav, contrast notes).
12. Acceptance criteria (bulleted, UI-agnostic; tag with `[BR-NN]`, `[STATE]`, `[A11Y]`, `[CANVAS]`).

### Step 3 — Backward-propagation check

If the brief synthesis reveals upstream gaps (missing story, missing AC, missing journey stage, new persona behavior, novel persona), apply the depth-of-reach matrix from `design/process/13-canvas.md`:

- AC gap only → add `[CANVAS]`-tagged bullet to story map; next `sync-brd.py` propagates.
- Missing story → designer decision.
- Missing journey stage → designer decision.
- New persona behavior → designer decision.
- New persona → HARD BLOCK; run `design-discovery` + `design-user-models` first.

### Step 4 — Version + manifest

Bump the artifact version header on every new/updated brief. Update `design/13_CANVAS_BRIEFS/_manifest.md`.

### Step 5 — Notify downstream

List screens with fresh briefs. Downstream modes that may now run:

- `design-wireframe` for structural validation.
- `design-screen-compose` (if Foundation Library Phase A complete + wireframe approved).

## Rules

- **Canvas briefs are the SSOT for intent** — never edited by composition runs; composition logs propose brief edits as commented-out blocks at the end of the brief MD.
- **One file per screen.** States are sections, not separate files.
- **Every decision traces to a persona, story, or principle.** If a bullet has no trace, flag it.
- **UI-agnostic AC.** "Allow user to select from a list" — not "show dropdown of values".
- **Tag every AC bullet** correctly so the BRD generator can route it.
- **Flag missing components as `[MISSING]`** — do not silently substitute.
