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

Library mode is a distinct working mode. You're not designing — you're reorganizing and publishing. The end goal is a clean, published library file that the Working File consumes.

---

## File architecture

```
[Project] - Working          ← You are here (Working File)
[Project] - Core Library     ← Atoms + Molecules + all Tokens
[Project] - Patterns         ← Organisms + Templates (create when needed)
```

**One source of truth for tokens**: Variables live in Core Library only. Never duplicate the token collections across library files.

**When to create the Patterns library**: When the Core Library has 50+ component types, OR when the file starts to feel sluggish, OR when Organisms/Templates are numerous enough to warrant their own namespace.

**When to split further**: Above ~2,000 components or when file performance degrades noticeably. Split by domain (e.g., `[Project] - Data Viz Library`, `[Project] - Forms Library`).

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

### Phase 1 — Token migration (do this first)

Tokens must exist in the library file before components that reference them.

1. Open (or create) the Core Library file
2. Create the three variable collections in Core Library: `Primitives`, `Semantic`, `Component`
3. Recreate all token values — this is currently manual in Figma. Work collection by collection:
   - Copy primitive values by hand or via `figma_execute` script
   - Set up semantic aliases pointing to primitives
   - Set up Light + Dark modes on Semantic
4. Verify: spot-check 5–10 tokens to confirm values are correct in Core Library

> **Warning**: There is no native Figma bulk-relink tool. Token migration is manual. Work systematically — one collection at a time, one category at a time.

### Phase 2 — Atom + Molecule migration → Core Library

1. Select Atoms category from Parking Lot
2. Copy component frames to Core Library file
3. **Relink variables**: each component's fills, spacing, and radius will still point to the Working File's variables. Manually rebind each to the Core Library's equivalent tokens
4. Verify visually — if colors/spacing look wrong, a variable is still pointing to the wrong collection
5. Repeat for Molecules

### Phase 3 — Organism + Template migration → Patterns Library (if applicable)

Same process as Phase 2, but destination is Patterns Library. Components here reference tokens from Core Library (cross-file aliases — Figma supports this as long as Core Library is published first).

### Phase 4 — States + Annotations → Core Library

States and Annotations are reused everywhere, so they belong in Core Library alongside Atoms.

---

## Publishing

Once a library file is populated and tokens are correctly linked:

1. In Figma: **Main menu → Assets → Libraries → [Your Library] → Publish**
2. Add a publish note (e.g., "Initial publish — v0.1")
3. Confirm all top-level components (non `.` and non `_` prefixed) appear in the publish list
4. Confirm hidden components (`.` prefix) are NOT in the publish list

---

## Enabling the library in the Working File

1. In Working File: **Assets panel → Libraries icon → Enable [Core Library]**
2. Swap existing component instances to use library versions where possible
3. Verify that components update correctly when you make a change in the library and re-publish

---

## Post-migration Working File cleanup

After a successful library migration:
- The Parking Lot page should be cleared (or archived)
- The Working File no longer needs local copies of migrated components — delete them
- Add a Cover page annotation noting which library version is enabled

---

## Variable relinking reference

When variables show as "missing" after migration:

| Symptom | Cause | Fix |
|---------|-------|-----|
| Color shows as grey/pink | Fill variable points to old Working File collection | Re-select fill, choose variable from Core Library |
| Spacing reverts to 0 | Padding/gap variable missing | Re-bind from Component properties or auto-layout panel |
| Component looks right but shows warning | A nested `.hidden` component still uses Working File vars | Unhide it temporarily, relink, re-hide |

Work component by component. There is no shortcut.
