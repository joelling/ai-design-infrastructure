---
name: figma-page-setup
description: >
  Sets up a new working page in Figma with correct frames, artboards,
  auto-layout structure, breakpoints, and component staging area. Use this
  skill every time a new screen, flow, or feature page is started. Triggers
  on: "set up page", "new screen", "create artboard", "start [screen name]",
  "new page", "add page for", "design [feature] page", "new flow", "start
  designing [x]", or whenever beginning design work on a new screen. Run
  before placing any design elements on a new page. Umbrella:
  `design-screen-compose` (sprint Working file pages). Runs before
  `figma-screen-compose`.
---

<!-- mirror: bob | SSOT: design/process/15-screen-compose.md -->

# figma-page-setup — New Screen Page Setup (Bob)

## Purpose

Create a page in the sprint Working file that conforms to the project's page template: correctly named, correctly structured (Header / Content / Footer frames with auto-layout), and with a component staging area on the left so `figma-screen-compose` has empty vessels to fill.

## Workflow

### Step 0 — Pre-flight

Run `figma-connect` first. Confirm the active file is the sprint Working file (not a DLS file).

If `screen-inventory.md` doesn't list the target screen ID, STOP and route to IA first.

### Step 1 — Read the canvas brief (if it exists)

If a canvas brief exists for this screen, read:

- Section 1 (Frame inventory) — drives how many artboards to create.
- Section 7 (Layout regions) — drives the Header/Content/Footer structure.

If no brief yet, create a minimal page scaffold and warn the user that `figma-screen-compose` will be blocked until the brief exists.

### Step 2 — Create the page

Use the appropriate `{{MCP_PREFIX}}figma-console__*` tools (figma_execute for page creation if no dedicated tool is available). Name the page: `[NN] - [Screen Name]` where NN is the zero-padded order from the screen inventory.

### Step 3 — Place breakpoint artboards

For each frame in the brief's frame inventory (or the default set if no brief yet):

- Create an artboard at the appropriate breakpoint (mobile 390, tablet 768, desktop 1440, or whatever the project's breakpoint tokens specify — pull from the Foundation DLS).
- Inside each artboard create three auto-layout frames: `Header`, `Content`, `Footer`.
- Apply auto-layout direction VERTICAL on the artboard, spacing = 0.
- Left-pin a "Staging" section OUTSIDE the artboards — used by `figma-parking-lot` for sprint-specific experiments.

### Step 4 — Name frames consistently

Every frame name must match the brief's section labels. Downstream `figma-screen-compose` matches by name when placing components.

### Step 5 — Verify via screenshot

Use `figma_take_screenshot` (or equivalent) to capture the page. Present it to the user. Confirm the page is ready for composition.

### Step 6 — Update inventory

Log the new page into `figma-inventory` with status `page-ready` and the originating screen ID. If a brief exists, cite the brief version.

## Rules

- **Page name format is non-negotiable:** `[NN] - [Screen Name]`.
- **Every artboard has Header/Content/Footer auto-layout frames.** `figma-screen-compose` depends on this contract.
- **Zero hardcoded breakpoint values.** Pull from Foundation DLS variables.
- **Never place components at this step.** This skill only sets up empty vessels.
- **Never run this in a DLS file.** DLS file setup is `figma-file-setup`'s job.
