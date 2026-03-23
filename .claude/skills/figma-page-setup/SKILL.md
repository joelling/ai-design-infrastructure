---
name: figma-page-setup
description: >
  Sets up a new working page in Figma with correct frames, artboards, auto-layout
  structure, breakpoints, and component staging area. Use this skill every time a
  new screen, flow, or feature page is started. Triggers on: "set up page", "new
  screen", "create artboard", "start [screen name]", "new page", "add page for",
  "design [feature] page", "new flow", "start designing [x]", or whenever beginning
  design work on a new screen or section of the product. Run this before placing
  any design elements on a new page.
---

# Page Setup — New Screen or Feature

Every working page follows the same structure. Set this up before any design elements are placed.

---

## Step 1 — Name and add the page

Page naming format: `[number] - [Screen Name]`

```
01 - Dashboard
02 - Onboarding Flow
03 - Settings
04 - Checkout
```

Insert the page before `🅿️ Parking Lot` — Parking Lot always stays last.

---

## Step 2 — Determine breakpoints

Ask (or infer from context) which breakpoints are needed:

| Breakpoint | Frame size | When to use |
|-----------|-----------|-------------|
| Mobile | 390 × 844 | iPhone 14 / default mobile |
| Tablet | 768 × 1024 | iPad portrait |
| Desktop | 1440 × 900 | Standard laptop |
| Wide | 1920 × 1080 | Large monitor |

Create **all relevant breakpoints** if designing a responsive product. For a mobile-only product, create Mobile only. For a web app, create Desktop + Wide minimum.

Arrange frames left to right: Mobile → Tablet → Desktop → Wide, with `semantic/spacing/3xl` gap between them.

---

## Step 3 — Set up each artboard frame

For each breakpoint frame:

```
[Frame name: e.g., "Dashboard — Desktop"]
  Auto-layout: vertical
  Width: [breakpoint width], Height: hug contents
  Padding: 0
  Gap: 0
  Fill: semantic/color/background/primary
```

Inside each artboard frame, create three sub-frames:
```
[FRAME] Header
  Auto-layout: horizontal
  Width: fill container, Height: fixed (e.g. 64px for desktop)
  Padding: semantic/spacing/md (left + right)

[FRAME] Content
  Auto-layout: vertical
  Width: fill container, Height: hug contents
  Padding: semantic/spacing/xl (top + bottom), semantic/spacing/2xl (left + right)
  Gap: semantic/spacing/lg

[FRAME] Footer
  Auto-layout: horizontal
  Width: fill container, Height: fixed (e.g. 80px)
  Padding: semantic/spacing/md
```

All values must reference variables — no hardcoded numbers.

---

## Step 4 — Create the component staging area

To the **left of the leftmost artboard** (with `semantic/spacing/2xl` gap from the artboard edge), create:

```
[STAGING] [Page Name]
  Auto-layout: vertical
  Width: 400px (fixed)
  Height: hug contents
  Gap: semantic/spacing/lg
  Fill: none (transparent)
```

This is where new components are built and held before moving to the Parking Lot. It keeps the artboard clean.

Label it clearly with a text element: `Component Staging — [Page Name]`

---

## Step 5 — Add page annotation

Top-left corner, outside the artboard, create an annotation frame:

```
[ANNOTATION] Page Info
  Auto-layout: vertical
  Padding: semantic/spacing/sm
  Gap: semantic/spacing/xs
  Fill: semantic/color/surface/raised
  Radius: semantic/radius/sm

  Contents:
  - Page name (bold)
  - Version: v0.1
  - Last updated: [today's date]
  - Status: [Draft / Review / Final]
```

---

## Step 6 — Verify

Before starting to design:
- [ ] Page is named correctly and placed before Parking Lot
- [ ] All breakpoint frames are created with correct dimensions
- [ ] All frames use auto-layout
- [ ] All fill/spacing/radius values reference variables
- [ ] Component staging area is set up to the left
- [ ] Page annotation frame is populated

---

## Layer naming convention

Maintain consistent layer names throughout the page:

| Prefix | Use for |
|--------|---------|
| `[FRAME]` | Structural layout frames |
| `[SECTION]` | Named content sections (hero, features, etc.) |
| `[STAGING]` | Component staging area |
| `[ANNOTATION]` | Spec notes, page info, developer notes |
| No prefix | Component instances (use component's own name) |

Clean layer names make developer handoff and Parking Lot sorting dramatically easier.

---

## Develop loop sync

This skill participates in the Tier 4 Develop sync loop. Before setting up a new page:

1. **Check canvas brief exists** — verify `design/13_CANVAS/[screen-name]-brief.md` exists for this screen. Do not set up a page without a brief (except exploratory prototyping).
2. **Check sync hash** — if a brief exists and has a sync hash, confirm the brief is current (not stale from upstream changes).
3. **Use brief for structure** — page name, sub-frame structure, and breakpoints come from the canvas brief's layout and breakpoint sections.
