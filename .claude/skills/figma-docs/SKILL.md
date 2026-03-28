---
name: figma-docs
description: >
  Creates and maintains design system documentation pages within DLS Figma files and optionally
  generates Storybook stories for coded component documentation. Handles documentation page
  layout, token visualization, component usage guides, and design rationale pages following
  the standard DLS documentation template. Triggers on: "document component", "create docs page",
  "design system docs", "storybook", "documentation page", "token documentation", "usage guide",
  "component docs", "visualize tokens", "document the design system", "docs page", or when
  a new foundation topic needs a documentation page in the DLS file.
---

# Design System Documentation

Documentation lives in two places: **Figma DLS files** (visual documentation for designers) and optionally **Storybook** (interactive documentation for developers). This skill handles both.

---

## Bootstrap sequence (run this first)

Before any topic documentation page can be built, the Documentation page's shared components must exist. This is a one-time setup per DLS file — if the `↳ Documentation ✅` page already has components, skip to the relevant topic page section.

### Step 0 — Build the Documentation page component library

On the `↳ Documentation ✅` page, create these 8 shared component sets. All are reusable across every topic page via `figma_instantiate_component`:

| Component | Description | Usage |
|-----------|-------------|-------|
| `Artboard header` | Page title + icon + subtitle + token prefix code block | First element on every topic page |
| `Dashboard thumbnail` | File cover thumbnails (light + dark variants) | Cover Page only |
| `Tags` | Label components (status, category, token type) | Anywhere labels are needed |
| `Jira ticket` | Ticket reference card | Traceability sections |
| `Documentation table` | Table template: header row + divider → data row + divider pattern | Token tables, property tables |
| `Checklist` | Review/completion checklist | Audit pages |
| `Note card` | Annotation card with callout | Design rationale, exceptions |
| `Asset metrics` | Metric cards with counts | Cover page, summary pages |

Build order for `Artboard header` (most critical — every page depends on it):
1. Create a COMPONENT frame (not a regular frame): 4800px wide, VERTICAL auto-layout
2. Add padding: T:320, R:480, B:320, L:320
3. First child: HORIZONTAL frame, FILL width, SPACE_BETWEEN — contains title text (left) + themed icon square (right)
4. Second child: subtitle text (FILL width)
5. Third child: code block frame containing token prefix label (e.g. `color_`, `spacing_size_`, `font-header/`)

Once Artboard header exists, all other topic pages can be built.

---

### Topic-specific documentation components (`_` prefix)

Each topic page maintains its own hidden component set for topic-specific reusable documentation elements. These live on the topic page itself (not the Documentation page) and use the `_` prefix so they don't appear in the published Assets panel.

| Component set | Topic page | Variants | What it documents |
|--------------|-----------|----------|-------------------|
| `_Colour tokens` | Colour ✅ | 42 (Color × Value) | 200×120px colour swatches with name + hex |
| `_Font size` | Typography ✅ | — | Font size specimens per style |
| `_spacing size` | Spacing ✅ | — | Spacing token rows with visual bar |
| `_radius size` | Radius 🚧 | — | Radius visualisation components |
| `_radius tokens` | Radius 🚧 | — | Radius component token visualisation |
| `_stroke width` | Stroke 🚧 | — | Stroke width visualisation |
| `_stroke component` | Stroke 🚧 | — | Stroke component token visualisation |

**`_` prefix rule:** Use `_` (underscore) prefix for topic-specific component sets — not `.` (period). Period prefix is reserved for sub-components that should not appear in Assets at all. Underscore prefix means "scoped to this page, not for cross-file use."

Build these component sets at the top of each topic page before building the documentation content. Place them in a dedicated staging area (e.g. a Section named `_components`) at the far left of the page.

---

## Figma documentation pages

### Page layout template

Every documentation page in a DLS file follows this structure:

**Page frame** — 4800px wide, VERTICAL auto-layout, 0 gap, hug height

```
Page Frame (4800px, VERTICAL, 0 gap)
├── Artboard Header (INSTANCE from Documentation page)
│   ├── Title + Icon (HORIZONTAL, SPACE_BETWEEN)
│   │   ├── Title (display text)
│   │   └── Themed icon square
│   ├── Subtitle text
│   └── Code block (token prefix indicator)
├── Child Section (VERTICAL, padding 240/100, gap 80, FILL horizontal)
│   ├── Section Header (HORIZONTAL, SPACE_BETWEEN, FILL)
│   │   ├── _Text Description (title + body text)
│   │   └── Status icon (✅ or 🚧)
│   └── Content (varies by topic)
├── [Divider line]
├── Child Section ...
└── ...
```

### Layout specifications

| Element | Layout | Padding | Gap | Sizing |
|---------|--------|---------|-----|--------|
| Page frame | VERTICAL | 0 | 0 | 4800px fixed width, hug height |
| Artboard Header | VERTICAL | 320/480/320/320 (T/R/B/L) | — | FILL horizontal |
| Child Section | VERTICAL | 240/100/240/100 | 80 | FILL horizontal, hug height |
| Section Header | HORIZONTAL | — | — | FILL horizontal, SPACE_BETWEEN |
| _Text Description | VERTICAL | — | 16 | — |

### Reusable documentation components

These components live on the `↳ Documentation ✅` page of each DLS file:

| Component | Purpose | When to use |
|-----------|---------|-------------|
| Artboard Header | Page title with project branding | Every documentation page, first element |
| Dashboard Thumbnail | Cover page thumbnails (light/dark) | Cover Page only |
| Tags | Label components (status, category) | Anywhere labels are needed |
| Documentation Table | Table template (header+divider → row+divider) | Token tables, property tables |
| Checklist | Review/completion checklist | Audit pages, review pages |
| Note Card | Annotation card with callout | Design rationale, exceptions |
| Note | Inline note | Brief annotations |
| Asset Metrics | Metric cards with counts | Cover page, summary pages |

### Status convention

- ✅ = Page is complete and reviewed
- 🚧 = Page is in progress or incomplete

Status appears in both the page name (`↳ Typography ✅`) and section headers.

---

## Documentation page types

### Foundation topic pages

For each foundation topic (Colour, Typography, Spacing, Grid, Radius, Stroke, Elevation, Motion):

1. **Artboard Header** with topic title, icon, and token prefix code block
2. **Overview section** — what this foundation covers, design rationale
3. **Token table** — all tokens in this collection with names, values per mode, aliases
4. **Visual examples** — swatches (colour), type specimens (typography), spacing scale visualization
5. **Usage guidelines** — do's and don'ts, when to use which token
6. **Accessibility notes** — contrast ratios (colour), minimum sizes (typography)

### Colour documentation specifics

The colour page has two major sections:
1. **Colour Styles** (primitives) — shows all scales with swatches:
   - Each hue group: section header → colour swatch rows
   - Each swatch: colour fill + name + hex + contrast ratio + token reference label
   - Annotation layer shows WCAG ratings and "NYI" for unassigned steps
2. **Colour Tokens** (semantic) — cards grouped by context:
   - Background, Text, Button, Tag, Layer, Link, Icon, Support, Focus, Field, Border, etc.
   - Each card: token name, alias reference, hex value, colour swatch circle

### Icon documentation page (Icon Fundamentals)

The Icon Fundamentals page documents the icon design system:
1. **Grid & keyline reference** — 24px canvas, active area zones, key shapes (circle/square/portrait/landscape)
2. **Size scale table** — all sizes (16–48px), use cases, Foundation token references
3. **Style guide** — Line vs Fill vs Graphic — when to use each
4. **Color token map** — `color_icon/*` token group with light/dark swatches
5. **Category index** — all icon categories with counts and example icons
6. **Naming convention** — `Icon/{Category}/{Name}` pattern with examples

Each documentation section follows the standard Child Section template (VERTICAL, padding 240/100, gap 80).

### Icon category pages (Line Icons, Fill Icons, Graphic Icons)

Each style page (Line, Fill, Graphic) follows this structure:
- **Artboard Header** — page title + style name + count
- **Section per category** — Action, Navigation, Communication, Status, Content, Interface
  - Section header with category name + icon count + ✅/🚧 status
  - Icon grid: HORIZONTAL auto-layout, wrap, gap 24, showing icon + name label below
  - Each icon cell: VERTICAL auto-layout, gap 8, icon component + name text

### Illustration documentation pages

Each illustration tier (Spot, Feature, Hero) follows:
1. **Artboard Header** — tier name, dimensions, use cases
2. **Usage guidelines** — when to use this tier, do/don't examples
3. **Color palette** — constrained palette for this tier with token references
4. **Light/Dark comparison** — side-by-side colour mode examples
5. **Component gallery** — all illustrations in this tier, displayed at canonical size
6. **Size variants** — all dimension options with visual examples

### Component documentation pages

For each published component in Components DLS:

1. **Component showcase** — all variants displayed
2. **Properties table** — name, type, options, default
3. **Token bindings** — which tokens the component uses
4. **States** — visual examples of all interactive states
5. **Usage guidelines** — when to use, when not to use
6. **Anatomy** — labelled diagram of component parts

---

## Storybook integration (optional)

When the project uses a coded prototype with a component library, generate Storybook stories:

### Story file structure
```
design/15_PROTOTYPE/stories/
├── foundations/
│   ├── Colors.stories.{js|tsx}
│   ├── Typography.stories.{js|tsx}
│   ├── Spacing.stories.{js|tsx}
│   └── Icons.stories.{js|tsx}
├── components/
│   ├── Button.stories.{js|tsx}
│   ├── Card.stories.{js|tsx}
│   └── [ComponentName].stories.{js|tsx}
└── pages/
    └── [PageName].stories.{js|tsx}
```

### Story generation rules
- Each component gets one story file with multiple stories (one per variant/state)
- Foundation stories visualize token values as rendered examples
- Stories include controls matching Figma component properties
- Stories reference the same token values as Figma (single source of truth)

---

## Process

**1. Identify what needs documentation.** Check inventory for components/tokens without documentation pages.

**2. Create or update the Figma documentation page** using the layout template above. Use Figma Console MCP tools:
- `figma_create_child` for frames
- `figma_set_text` for content
- `figma_instantiate_component` for reusable doc components
- `figma_set_fills` with variable references for colour swatches

**3. Update page status.** Change page name suffix from 🚧 to ✅ when complete.

**4. Optionally generate Storybook stories** if the project has a prototype with a component library.

---

## Rules

- Every published token collection MUST have a documentation page in its DLS file
- Every published component SHOULD have documentation (prioritize complex/frequently used ones)
- Documentation pages use the standard layout template — no freeform layouts
- All values shown in documentation must reference actual tokens (no hardcoded display values)
- Keep documentation in sync — when tokens or components change, update their docs page
- Storybook stories are optional but recommended for projects with coded prototypes
