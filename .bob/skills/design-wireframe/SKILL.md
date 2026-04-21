---
name: design-wireframe
description: >
  Builds clickable ASCII wireframes from canvas briefs for structural and flow
  validation before Figma execution. Static HTML with monospace styling —
  deliberately rough to elicit feedback on structure, not aesthetics.
  Disposable: archived when Figma begins. Triggers on: "wireframe",
  "ascii wireframe", "clickable wireframe", "structural review", "flow
  validation", "validate layout", "wireframe this screen", "sketch the flow",
  or when canvas briefs are ready and the designer wants structural validation
  before Figma. Upstream: canvas briefs (hard), walking skeleton, screen
  inventory. Soft gate before `design-screen-compose`.
---

<!-- mirror: bob | SSOT: design/process/14-wireframe.md -->

# design-wireframe — ASCII Clickable Wireframes (Bob)

## Purpose

Validate screen structure and flow BEFORE Figma execution. The roughness is the feature — stakeholders can comment on structure without being distracted by aesthetics. Disposable: archived (not updated) when Figma starts.

## Workflow

### Step 0 — Upstream check

- Canvas brief(s) exist for the target screen(s) in `design/13_CANVAS_BRIEFS/`. HARD BLOCK if missing.
- `design/05_STORIES/walking-skeleton.md` identifies the primary flow order.
- `design/06_INFORMATION_ARCHITECTURE/screen-inventory.md` lists the target screens.

### Step 1 — Determine scope

Ask: single screen, a flow, or all walking-skeleton screens? Pull the canvas brief(s) for each.

### Step 2 — Produce ASCII wireframes

For each screen:

- Read the brief's frame inventory (Section 1) and layout regions (Section 7).
- Produce a monospaced ASCII representation per frame state (default, loaded, empty, error, etc.).
- Keep boxes generous — favor whitespace for legibility.
- Label interactive regions `[Link]` or `[Button]`; label empty regions with their purpose (`<product list>`, `<status indicator>`).
- Add a footer block: screen ID, brief version, persona primary, stories covered.

### Step 3 — Assemble clickable HTML

Write `design/14_WIREFRAMES/index.html` (overview + flow graph) and `design/14_WIREFRAMES/{ScreenID}_{screen-name}.html` per screen. Use:

- `<pre>` with a monospace font stack.
- `<a href="{NextScreenID}.html">` around interactive `[Link]` text — clickable flow navigation.
- A minimal `<nav>` header with back/next per the walking skeleton.
- A plain grey/black palette — no brand color, no styling that implies aesthetic intent.

### Step 4 — Review guidance

Attach a REVIEW.md prompting specific questions:

- Does the structure match the job-to-be-done?
- Are navigation paths obvious from this page alone?
- Are empty / error states covered?
- What's missing?

### Step 5 — Version + archive flag

Bump the wireframe version. When Figma composition is approved for a screen, MOVE the HTML to `design/14_WIREFRAMES/_archived/` (do not delete) and note in the brief.

## Rules

- **Disposable.** After Figma starts, wireframes are archived, not updated. Do not maintain them in parallel.
- **Deliberately rough.** No brand color, no typography choices, no icon art.
- **One state per ASCII block.** Don't try to cram multiple states into one frame.
- **Clickable only between wireframe screens.** No external links, no Figma deeplinks.
- **Soft gate before Figma.** A wireframe review should complete before `design-screen-compose` runs for that screen; warn (not block) if skipped.
- **Canvas brief updated after wireframe exists** → re-run this skill for affected screens.
