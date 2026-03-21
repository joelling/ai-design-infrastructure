---
name: design-ia
description: >
  Defines the information architecture — screen inventory, navigation model, content hierarchy,
  and taxonomy. This is the structural bridge between upstream design thinking and downstream
  Figma execution. The IA sitemap directly informs Figma page structure. Triggers on:
  "information architecture", "sitemap", "navigation", "IA", "screen inventory", "content
  hierarchy", "page structure", "taxonomy", "route structure", "nav model", or when
  determining what screens the product needs and how they connect. Upstream dependencies:
  design-journeys, design-stories.
---

# Information Architecture — Structure & Navigation

## Purpose

Define the structural organization of the product — what screens exist, how they're organized, how users navigate between them, and how content is hierarchically arranged within each screen. The IA is the **direct bridge to Figma**: the sitemap becomes the Figma page list, the screen inventory becomes the component checklist.

---

## Dependency check

**Soft dependencies** (warn if missing, don't block):
- `design/03-journeys/task-flows/*` — task flows reveal what screens are needed
- `design/04-stories/story-map.md` — stories define what each screen must support
- `design/02-user-models/personas/*` — different roles may need different navigation
- Spec data model — defines what information exists to display

---

## Upstream sync (step 0)

Before starting this mode's workflow:

1. Check `design/information-architecture/_upstream.md` for the dependency manifest
2. Compare recorded upstream versions against current artifact files
3. If upstream has changed, report what changed (additive / corrective / structural) and ask the designer: re-process or proceed?
4. If re-processing, update incrementally — process the delta, don't rebuild from scratch

After completing this mode's workflow:

1. Add or increment `<!-- artifact: ... -->` version headers on all changed output files
2. Update `design/information-architecture/_upstream.md` with consumed and produced artifact versions
3. Report which downstream modes are now potentially stale

### Script commands
```bash
# On entry — check staleness:
node design/scripts/sync-status.js

# After completing — version and manifest:
node design/scripts/sync-version.js init <file> design-ia   # first time
node design/scripts/sync-version.js bump <file>              # subsequent updates
node design/scripts/sync-manifest.js ia                      # update manifest
```

---

## Workflow

### Step 1 — Screen inventory

From task flows and story maps, identify every distinct screen/view the product needs:

```markdown
## Screen Inventory

| # | Screen name | Purpose | Primary persona(s) | Stories served | Entry points |
|---|-------------|---------|-------------------|----------------|--------------|
| 01 | [Name] | [What it does] | [Who uses it] | DS-xxx, DS-xxx | [How users get here] |
| 02 | [Name] | ... | ... | ... | ... |
```

Distinguish between:
- **Full screens** (own URL/route, own page in Figma)
- **Views within screens** (tabs, panels, expanded sections — same page, different state)
- **Overlays** (modals, drawers, popovers — temporary, on top of a screen)

Write to `design/05-ia/sitemap.md`.

### Step 2 — Navigation model

Define how users move between screens. Consider:
- **Global navigation** (always visible — what items are in the main nav?)
- **Local navigation** (contextual — within a section, what sub-nav exists?)
- **Role-based navigation** (do different roles see different nav items?)
- **Entry points** (can the product be entered from multiple places? e.g., deep link, external launch)

```markdown
## Navigation Model

### Global navigation
| Nav item | Screen | Visible to roles | Icon/label |
|----------|--------|-------------------|------------|

### Role-based variations
| Role | Sees | Doesn't see | Default landing |
|------|------|-------------|----------------|

### Navigation patterns
- Primary pattern: [sidebar / top bar / bottom tabs / etc.]
- Secondary pattern: [breadcrumbs / back button / etc.]
- Contextual: [in-page tabs / segmented controls / etc.]

### Entry points
| Entry point | Context provided | Landing screen | What the user expects |
|-------------|-----------------|----------------|----------------------|
```

Write to `design/05-ia/navigation-model.md`.

### Step 3 — Content hierarchy

For each screen in the inventory, define what information appears and in what order of priority:

```markdown
## Content Inventory

### [Screen Name]
#### Primary content (immediately visible, above the fold)
1. [Data element] — from [data model entity] — [display priority]
2. [Data element] — ...

#### Secondary content (visible on scroll or interaction)
1. [Data element]

#### Tertiary content (available on demand — expand, drill-down, overlay)
1. [Data element]

#### Actions available
- [Action 1] — [who can perform it] — [what it does]
- [Action 2] — ...
```

Write to `design/05-ia/content-inventory.md`.

### Step 4 — Taxonomy

Define how content is categorized and labeled across the product:

```markdown
## Taxonomy

### Content types
| Type | Description | Where it appears | Example |
|------|-------------|------------------|---------|

### Categorization scheme
[How is content organized? By type? By status? By date? By role?]

### Label conventions
| Concept | Label used | Rationale |
|---------|-----------|-----------|
```

Write to `design/05-ia/taxonomy.md`.

---

## Bridge to Figma

The IA directly informs Figma skills:

| IA artifact | Figma skill | How it's used |
|-------------|------------|---------------|
| Screen inventory | `figma-file-setup` | Screen list becomes Sitemap page |
| Screen inventory | `figma-page-setup` | Each screen becomes a numbered Figma page (`01 - [Name]`) |
| Content hierarchy | `figma-component` | Determines which components each screen needs |
| Navigation model | `figma-component` | Navigation components need role-based variants |
| Taxonomy | `design-content` | Labels feed into content strategy |

---

## Output checklist

- [ ] `design/05-ia/sitemap.md` — complete screen inventory with purpose, personas, and stories served
- [ ] `design/05-ia/navigation-model.md` — global nav, role-based variations, entry points
- [ ] `design/05-ia/content-inventory.md` — per-screen content hierarchy
- [ ] `design/05-ia/taxonomy.md` — content categorization and label conventions

---

## Rules

- Every screen in the inventory must trace back to at least one user story or task flow. No orphan screens.
- Navigation must account for all roles — if roles see different things, document the variations explicitly.
- Content hierarchy uses three levels: primary (immediately visible), secondary (visible on scroll/interaction), tertiary (on-demand). Don't flatten everything to primary.
- Screen names established here become the canonical names used everywhere downstream — in Figma pages, in canvas briefs, in component names. Choose them carefully.
- The IA is the first place where technology decisions start to appear (routes, screen types). This is intentional — IA bridges the agnostic upstream with the concrete downstream.
