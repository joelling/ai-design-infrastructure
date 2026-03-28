---
name: figma-library-mode
description: >
  Reorganizes components from the Parking Lot into the separate design library file(s),
  handles variable relinking, and sets up publishing. Use this skill when entering
  "library mode" — the distinct phase of moving staged components into the master library.
  Triggers on: "library mode", "move to library", "reorganize library", "publish components",
  "create library file", "migrate components", "set up library", "library migration",
  "master library", or whenever the Parking Lot has accumulated enough components to
  warrant a library push. Also use when asked about which file type components belong in,
  or when relinking variables after a library restructure.
---

# Library Mode — Migration and Publishing

Library mode is a distinct working mode. You're not designing — you're reorganizing and publishing. The end goal is clean, published library files that the Working File consumes.

---

## File architecture

```
[Project] - Working          ← Active design canvas (screens, flows)
Foundation – [Project] DLS   ← All variables/styles + documentation pages (published first)
Icons & Illustrations – [Project] DLS ← Icon sets, illustration assets (published)
Components – [Project] DLS   ← Atoms + Molecules + Organisms + Templates (published)
```

**One source of truth for tokens**: Variables live in Foundation DLS only. Components and Icons files consume Foundation as an enabled library.

**When to split Components further**: Above ~2,000 components or when file performance degrades. Split by domain (e.g., `Data Viz – [Project] DLS`, `Forms – [Project] DLS`).

---

## Pre-migration audit

Before touching anything, take stock of what's in the Parking Lot:

1. Call `figma_take_screenshot` on the Parking Lot page
2. Call `figma_audit_design_system` to surface any issues
3. List all components by category
4. Flag any components with hardcoded values (fix before migrating — run `figma-audit` skill)
5. Confirm all components have descriptions

Don't migrate broken components.

---

## Migration process

### Phase 1 — Token migration → Foundation DLS (do this first)

Tokens must exist in the Foundation DLS before any file that references them.

1. Open (or create) the Foundation DLS file
2. Recreate the 8 numbered variable collections as defined in the `figma-tokens` skill (01 Colour Styles, 02 Colour Tokens, 03 Spacing, 04 Typography, 05 Icon Sizes, 09 Radius, 10 Stroke, 11 Elevation). Do not duplicate the full token spec here — refer to `figma-tokens` SKILL.md for naming conventions, modes, and alias rules.
3. Recreate all token values — work collection by collection:
   - Copy primitive values via `figma_execute` script or by hand
   - Set up semantic aliases pointing to primitives
   - Set up mode variants (Light/Dark for colour, Lg/Md/Sm for spacing and typography)
4. Verify: spot-check 5–10 tokens to confirm values are correct in Foundation DLS

> **Warning**: There is no native Figma bulk-relink tool. Token migration is manual. Work systematically — one collection at a time, one category at a time.

### Phase 2 — Atom + Molecule migration → Components DLS

1. Select Atoms category from Parking Lot
2. Copy component frames to Components DLS file
3. **Relink variables**: each component's fills, spacing, and radius will still point to the Working File's variables. Manually rebind each to the Foundation DLS's equivalent tokens (Foundation must be published and enabled in Components DLS first)
4. Verify visually — if colors/spacing look wrong, a variable is still pointing to the wrong collection
5. Repeat for Molecules

### Phase 3 — Organism + Template migration → Components DLS

Same process as Phase 2, same destination file. Organisms and Templates go into the Components DLS alongside Atoms and Molecules. Components here reference tokens from Foundation DLS (cross-file aliases — Figma supports this as long as Foundation DLS is published first).

### Phase 4 — States + Annotations → Components DLS

States and Annotations are reused everywhere, so they belong in Components DLS alongside Atoms.

### Icons — Icon migration → Icons & Illustrations DLS

1. Select all icon components from Parking Lot
2. Copy to Icons & Illustrations DLS file
3. Relink any colour variables to Foundation DLS tokens
4. Organize by category (e.g., Navigation, Action, Status)

---

## Inventory lifecycle updates

During library migration, update the design system inventory for each migrated component:
- Status: `staged` → `audited` (after pre-migration audit passes) → `published` (after successful publish)
- Location: Update from "Parking Lot" to library file name
- Published version: Record initial version (v0.1)

---

## Publishing

Publishing order matters — downstream files depend on upstream libraries being published first.

### Step 1 — Publish Foundation DLS first

1. In Figma: **Main menu → Assets → Libraries → Foundation – [Project] DLS → Publish**
2. Add a publish note (e.g., "Initial publish — v0.1")
3. Confirm all variable collections are included

### Step 2 — Publish Icons & Illustrations DLS

1. Enable Foundation DLS as a library in the Icons file (for colour token references)
2. Publish Icons & Illustrations DLS
3. Add a publish note

### Step 3 — Publish Components DLS

1. Enable Foundation DLS as a library in the Components file
2. Publish Components DLS
3. Confirm all top-level components (non `.` and non `_` prefixed) appear in the publish list
4. Confirm hidden components (`.` prefix) are NOT in the publish list

---

## Enabling the libraries in the Working File

1. In Working File: **Assets panel → Libraries icon → Enable all three DLS files**
2. Swap existing component instances to use library versions where possible
3. Verify that components update correctly when you make a change in a library and re-publish

---

## Post-migration Working File cleanup

After a successful library migration:
- The Parking Lot page should be cleared (or archived)
- The Working File no longer needs local copies of migrated components — delete them
- Add a Cover page annotation noting which library versions are enabled

---

## Variable relinking reference

When variables show as "missing" after migration:

| Symptom | Cause | Fix |
|---------|-------|-----|
| Color shows as grey/pink | Fill variable points to old Working File's Colour Styles or Colour Tokens collection | Re-select fill, choose variable from Foundation DLS |
| Spacing reverts to 0 | Spacing or Typography variable missing | Re-bind from Foundation DLS's Spacing or Typography collection in auto-layout panel |
| Radius looks wrong | Radius variable points to old collection | Re-bind from Foundation DLS's Radius collection |
| Stroke width wrong | Stroke variable missing | Re-bind from Foundation DLS's Stroke collection |
| Component looks right but shows warning | A nested `.hidden` component still uses Working File vars | Unhide it temporarily, relink to Foundation DLS, re-hide |

Work component by component. There is no shortcut.
