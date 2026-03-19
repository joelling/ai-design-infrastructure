---
name: figma-parking-lot
description: >
  Moves and organizes completed components from the working page into the Parking Lot
  staging page. Use this skill when finishing a page/screen design, before starting
  the next screen, or whenever the component staging area on a page is getting cluttered.
  Triggers on: "move to parking lot", "sort components", "done with this page",
  "organize components", "clean up page", "stage components", "parking lot",
  "finished page", "wrap up page", or at the natural end of working on any screen.
  Also trigger this proactively when you notice components piling up in the left
  staging area of a working page.
---

# Parking Lot — Component Staging

The Parking Lot page is the holding area between "just built on a working page" and "published in a library file". It keeps working pages clean and components organized by category for the eventual library migration.

---

## Parking Lot page structure

The page should have a single root auto-layout frame (vertical, `semantic/spacing/2xl` gap) containing category sections in this order:

```
🅿️ Parking Lot (page)
└── Root Frame [auto-layout, vertical]
    ├── [CATEGORY] Atoms
    │   ├── Category Label Frame
    │   └── Component Row [auto-layout, horizontal, wrap]
    ├── [CATEGORY] Molecules
    │   ├── Category Label Frame
    │   └── Component Row [auto-layout, horizontal, wrap]
    ├── [CATEGORY] Organisms
    │   ├── Category Label Frame
    │   └── Component Row [auto-layout, horizontal, wrap]
    ├── [CATEGORY] Templates
    │   ├── Category Label Frame
    │   └── Component Row [auto-layout, horizontal, wrap]
    ├── [CATEGORY] States
    │   ├── Category Label Frame
    │   └── Component Row [auto-layout, horizontal, wrap]
    └── [CATEGORY] Annotations
        ├── Category Label Frame
        └── Component Row [auto-layout, horizontal, wrap]
```

Category label frames: auto-layout horizontal, 8px gap, with a coloured left border, category name as text.

---

## Category definitions — where does each component go?

| Category | What goes here |
|----------|---------------|
| **Atoms** | Icons, buttons, inputs, labels, badges, tags, avatars, checkboxes, radios, toggles, chips, dividers |
| **Molecules** | Form fields (label + input + helper), card variants, nav items, dropdown items, list rows, search bars |
| **Organisms** | Full navigation bars, modals, sidebars, forms, tables, page headers, footers |
| **Templates** | Page shells, layout grids, dashboard layouts, full-page scaffolds |
| **States** | Loading skeletons, empty states, error states, loading spinners, success confirmations |
| **Annotations** | Spec labels, redline markers, color swatch labels, breakpoint indicators, developer notes |

---

## Move process

### Step 1 — Screenshot the current page
Call `figma_take_screenshot` on the working page. Visually identify all components in the left staging area.

### Step 2 — Categorize before moving
List every component and decide its category. If unsure: a standalone element → Atom, a combination of atoms → Molecule, a full UI section → Organism.

### Step 3 — Move each component to its category row
Use `figma_move_node` to move components from the working page staging area to the appropriate category row on the Parking Lot page.

Order within a category row: alphabetical by component name.

### Step 4 — Group hidden components near their parent
If a published component `Button/Primary` has hidden sub-components `.ButtonIcon` and `.ButtonLabel`, keep those immediately after the published component in the row. Don't separate them from their parent.

### Step 5 — Add a source label
Add a sticky annotation frame near the most recently added batch of components, noting: source page name + date. Use an Annotation component if one exists.

### Step 6 — Verify the working page staging area is clear
The left staging area of the working page should be empty after this operation. Call `figma_take_screenshot` to confirm.

---

## Rules

- **Never delete** components from the staging area without moving them first
- Hidden (`.` prefixed) components always stay adjacent to their parent published component
- Components in the Parking Lot are **not yet published** — they exist only in the Working File
- The Parking Lot is not a permanent home — it's a transit area before the library migration
- Sort the Parking Lot page after every 3–5 page completions to keep it navigable
