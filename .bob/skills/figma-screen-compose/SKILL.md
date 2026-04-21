---
name: figma-screen-compose
description: >
  Composes a Figma screen by placing published-library component instances into
  the empty Header/Content/Footer frames produced by figma-page-setup, per the
  canvas brief. Two-phase: Phase A plans the composition and surfaces gaps
  without touching Figma; Phase B mutates Figma section-by-section with
  per-section screenshot review. Triggers on: "compose [screen]", "build the
  screen", "place components", "fill the page", "render the brief in Figma",
  "execute the canvas brief", "assemble [screen]", "wire up [screen] in Figma",
  or whenever a canvas brief exists and the artboards are empty. Run AFTER
  figma-page-setup AND after required components exist in the published
  Components DLS library. Do NOT use raw figma_execute — that bypasses
  composition logging and back-pressure.
---

<!-- mirror: bob | SSOT: design/process/15-screen-compose.md -->

# figma-screen-compose — Place Published Instances (Bob)

> **Umbrella:** `design-screen-compose` (the per-sprint orchestrator). This is the one-screen mechanics sub-skill. Do not confuse the two.

## Hard blocks

- Canvas brief exists for the target screen at `design/13_CANVAS_BRIEFS/{ScreenID}_*.md`.
- Page exists in the sprint Working file with Header/Content/Footer frames (from `figma-page-setup`).
- Foundation DLS Phase A is complete and Components DLS is published.
- `figma-connect` has been run this session.

If any is unmet, REFUSE and route the user to the missing step.

## Phase A — Plan (no Figma mutations)

### Step 0 — Load context

Read:

- The canvas brief.
- The composition log for this screen if one exists: `design/15_FIGMA/composition-logs/{ScreenID}_composition-log.md`.
- Published-library component inventory via `{{MCP_PREFIX}}figma-console__figma_get_library_components`.

### Step 1 — Diff the brief

Compute a sync-hash of the brief's frame inventory + component list + traceability block. Compare with the last logged hash in the composition log. If unchanged and the screen is already composed, stop and report "no changes".

### Step 2 — Plan per section

For each section in the brief (Header, Content, Footer, plus any modal overlays), enumerate:

- Components to place (cite Components DLS IDs).
- Instance property overrides (text content, variant, boolean props) — via `setProperties`, never raw `node.characters`.
- Layout within the frame (auto-layout direction, gap, padding — all token-bound).
- Any `[MISSING]` components → placeholder + queue for parking lot intake with `requested_by: figma-screen-compose` and `triggering_screen: {ScreenID}`.

### Step 3 — Present the plan

Show the user the full plan before any mutation. Include:

- Component counts per section.
- List of `[MISSING]` items and their placeholder plan.
- Any brief-AC bullets that can't be satisfied by current library capabilities → proposed back-pressure (commented-out brief edit at the end of the plan).

Ask for explicit approval before Phase B.

## Phase B — Execute (Figma mutations, section by section)

### Step 1 — Place, one section at a time

For each section (Header → Content → Footer → modals):

1. Call `figma_instantiate_component` for each component in order.
2. Call `figma_set_instance_properties` for every override.
3. Set auto-layout on the parent frame via `figma_execute` or equivalent, bound to tokens.
4. Take a per-section screenshot (`figma_take_screenshot`).
5. Present the screenshot to the user. Confirm before proceeding to the next section.

### Step 2 — Handle `[MISSING]`

For each placeholder:

- Insert a native Figma frame with a diagonal-hatch fill labelled `[MISSING: {component-name}]`.
- Log a parking-lot entry via `figma-parking-lot` with full context (brief reference, screen id, intended usage).
- DO NOT block the composition run — placeholders are expected.

### Step 3 — Append composition log

Write/append `design/15_FIGMA/composition-logs/{ScreenID}_composition-log.md`:

- Timestamp.
- Brief version consumed.
- Per-section component list with instance IDs and override summaries.
- Screenshots captured.
- `[MISSING]` queue entries.
- Any user feedback collected between sections.

**Append-only.** Never rewrite a prior run.

### Step 4 — Back-pressure proposals

If during composition a better approach surfaced than what the brief specified, write the proposed brief edit as a commented-out block AT THE END of the brief MD. DO NOT edit the brief body.

### Step 5 — Validate

Run `node design/scripts/sync-composition.js` to verify brief ↔ composition log ↔ inventory consistency.

## Rules

- **Published-library instances only.** Never local components, never parking-lot components, never raw frames that could have been components.
- **Property overrides via `setProperties`.** Never `node.characters`.
- **Token-bound everything.** Zero hardcoded fills, spacings, radii.
- **Auto-layout everywhere.** No absolute x/y.
- **Per-section screenshot review.** Never compose a whole screen then show results — the user must approve incrementally.
- **Composition logs are append-only evidence.** Brief is intent; log is evidence. Don't auto-sync log content back into brief body.
- **Canvas brief revised and re-saved** → re-run Phase A (sync-hash diff) on affected screens.
- **Batch mode:** If composing multiple screens, run Phase A for all of them first (pattern report), then execute Phase B one by one.
