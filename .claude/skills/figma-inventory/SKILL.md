---
name: figma-inventory
description: >
  Manages the design system inventory — a structured log of every component, token collection,
  style, and asset across all DLS files (Foundation, Icons & Illustrations, Components) and
  the Working file. Tracks lifecycle status, location, taxonomy, and action history. Use this
  skill to view inventory status, add/update entries, run inventory reports, or reconcile
  inventory against actual Figma file contents. Triggers on: "inventory", "design system
  inventory", "component list", "what components exist", "asset log", "inventory report",
  "reconcile inventory", "inventory status", "what's published", "what's in draft",
  "component history", "asset tracking", or when needing a full picture of design system assets.
---

# Design System Inventory

The inventory is the single source of truth for what exists in the design system, where it lives, and what state it's in. It bridges the gap between Figma files (where assets physically exist) and the governance process (which tracks lifecycle and decisions).

---

## Inventory file

**Path:** `design/12_GOVERNANCE/inventory.md`

The inventory is a markdown file with structured tables. It is NOT a Figma artifact — it lives in the repo alongside governance artifacts.

---

## Inventory schema

Each entry tracks one design system asset:

| Field | Description | Example |
|-------|-------------|---------|
| ID | Unique identifier: `{type}-{NNN}` | `CMP-001`, `TKN-042`, `ICN-015` |
| Name | Asset name (component: Category/Name, token: collection/path) | `Button/Primary`, `color_text/primary` |
| Type | `component`, `token-collection`, `token`, `style`, `icon`, `illustration` | `component` |
| Category | Atomic Design tier or token collection | `Atom`, `Molecule`, `01_Colour Styles` |
| Status | Lifecycle state | `draft` |
| Location | Current file and page | `Working / 03 - Dashboard` |
| DLS File | Target DLS file | `Components – [Project] DLS` |
| Properties | Component properties or token modes | `size: sm/md/lg, variant: primary/secondary` |
| Tokens bound | Token references used | `color_button-bg/primary, spacing_size_16` |
| Version | Current version (after publishing) | `v0.1` |
| Created | Date created | `2026-03-28` |
| Updated | Date last modified | `2026-03-28` |
| Notes | Action history, decisions, references | `Moved to Parking Lot 2026-03-28` |

### ID prefixes

| Prefix | Asset type |
|--------|-----------|
| `CMP` | Component |
| `TKN` | Token (individual variable) |
| `TKC` | Token collection |
| `STY` | Style (text style, effect style) |
| `ICN` | Icon |
| `ILL` | Illustration |

---

## Lifecycle states

```
draft → staged → audited → published → deprecated → removed
```

| State | Meaning | Location |
|-------|---------|----------|
| `draft` | Created on a working page, not yet reviewed | Working file, screen pages |
| `staged` | Moved to Parking Lot, awaiting audit | Working file, Parking Lot page |
| `audited` | Passed figma-audit (all 10 checks) | Working file, Parking Lot page |
| `published` | Migrated to DLS file and published | Foundation/Icons/Components DLS |
| `deprecated` | Marked for removal, alternative documented | DLS file (with deprecation notice) |
| `removed` | Deleted from DLS file, archived in inventory | N/A (inventory record retained) |

---

## Process

### Adding entries

Entries are added automatically by other skills:
- **figma-component** → adds `draft` entry after creating any component
- **figma-tokens** → adds entries for new token collections and individual tokens
- **figma-parking-lot** → updates status to `staged`
- **figma-audit** → updates status to `audited` (if all checks pass)
- **figma-library-mode** → updates status to `published` with version

### Manual inventory operations

**Full reconciliation:** Compare inventory against actual Figma file contents. Use Figma MCP tools (`figma_get_variables`, `figma_search_components`, `figma_get_library_components`) to list all assets, then diff against inventory entries. Add missing entries (ghost components → Check 9 in audit), mark removed entries (orphans → Check 8).

**Status report:** Generate a summary of inventory by status, type, and location:
```
## Inventory Report — [Date]

### By status
- draft: N components, N tokens
- staged: N components
- audited: N components
- published: N components, N token collections, N styles
- deprecated: N components
- removed: N components

### By DLS file
- Foundation DLS: N token collections, N styles
- Icons & Illustrations DLS: N icons, N illustrations
- Components DLS: N components

### Action items
- [List components stuck in draft for >7 days]
- [List deprecated components past sunset date]
- [List ghost/orphan mismatches]
```

**History query:** Search the Notes field for action history on any asset.

---

## Inventory initialization

When starting a new project or adding inventory to an existing project:

1. Create `design/12_GOVERNANCE/inventory.md` with the table header
2. Run full reconciliation against all Figma files
3. Populate entries with best-guess status based on location
4. Review with designer for accuracy

For existing Foundation DLS files, token collections should be pre-populated:
- 01_Colour Styles → `TKC-001`, status: `published`
- 02_Colour Tokens → `TKC-002`, status: `published`
- etc. for all 8+ collections

---

## Rules

- The inventory is append-only for history — never delete an entry, mark it `removed` instead
- Every asset in the design system MUST have an inventory entry
- Status transitions follow the lifecycle strictly — no skipping states (except `draft` → `removed` for abandoned work)
- The inventory is reconciled during every `figma-audit` run (Checks 8, 9, 10)
- Token collections are tracked as single entries; individual tokens within are tracked only when they have notable history (e.g., renamed, deprecated)
- The inventory does NOT replace Figma as the source of truth for visual design — it tracks lifecycle metadata that Figma doesn't store

## Feeds into

- **figma-audit** — Checks 8, 9, 10 cross-reference the inventory
- **figma-library-mode** — reads inventory to know what's ready for migration
- **design-governance** — inventory supports versioning and deprecation workflows
- **figma-handoff** — inventory helps identify untracked designer work
