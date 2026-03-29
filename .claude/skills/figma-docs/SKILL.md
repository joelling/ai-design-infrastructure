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

On the `↳ Documentation ✅` page, create these shared component sets. Build in the order listed — later components may nest earlier ones.

#### 1. Artboard Header (most critical — every page depends on it)

**Component set name:** `Artboard header`

**Variants:** `Size` (Small, Large) × `Style` (Light, Dark) = 4 variants

**Component properties (all variants):**

| Property | Type | Default | Purpose |
|----------|------|---------|---------|
| `Title text` | TEXT | "Title" | Main page title (display size) |
| `Desc. text` | TEXT | "Description" | Subtitle / description |
| `Project text` | TEXT | "[Project] Design System" | Project name (small, top) |
| `Type text` | TEXT | "Type" | DLS file type label |
| `Show token` | BOOLEAN | true | Show/hide token prefix code block |
| `Show desc.` | BOOLEAN | true | Show/hide description |
| `Show type` | BOOLEAN | true | Show/hide type label |
| `Show project` | BOOLEAN | true | Show/hide project name |

**Large variant structure** (VERTICAL, padding T:480 R:320 B:320 L:320):
1. `Title + Icon` (HORIZONTAL, FILL width, SPACE_BETWEEN, gap 320):
   - Title text — display size
   - Themed icon square (e.g., circular outline icon, ~150×150)
2. `Project` text — project name
3. `token` frame (VERTICAL, padding T:64 B:64) — code block showing token prefix (e.g. `color_light__`)

**Small variant structure** (VERTICAL, compact bar — ~274px height):
- Project name + Title + Type in a single-line compact layout
- Description below

#### 2. Section Header

**Component set name:** `Section header`

**Variants:** `Status` (Done, WIP) × `Size` (Large, Small) = 4 variants

**Component properties:**

| Property | Type | Default |
|----------|------|---------|
| `Show Col-1 Header` | BOOLEAN | true |
| `Show Col-2 Header` | BOOLEAN | true |
| `Show Col-3 Header` | BOOLEAN | true |
| `Show Col-1 Subheader` | BOOLEAN | true |
| `Show Col-2 Subheader` | BOOLEAN | true |
| `Show Col-3 Subheader` | BOOLEAN | true |

**Large variant structure** (HORIZONTAL, gap 64):
- `3-col sections` frame (FILL width, VERTICAL, gap 0):
  - **Row 1 — Headers** (HORIZONTAL, FILL, gap 64): 3 × `Header` frames (FILL width each), each toggleable
  - **Row 2 — Subheaders** (HORIZONTAL, FILL, gap 64): 3 × `Subheader` frames (FILL width each), each toggleable
  - **Row 3 — Body text** (HORIZONTAL, FILL, gap 64): 3 × `Col text` frames (FILL width, VERTICAL, gap 8)
- `Status` frame (HUG): ✅ emoji (Done) or 🚧 emoji (WIP), fontSize 96

**Usage:** Use 1 column by hiding Col-2 and Col-3 headers/subheaders. Use 2 columns by hiding Col-3. All 3 columns for rich descriptions. The body text columns are always present — leave empty for unused columns.

**Small variant:** Same 3-column structure at a smaller type scale.

#### 3. _Colour Details (published — for cross-file use)

**Component set name:** `_Colour Details`

**Variants:** `Size` (Small, Medium, Large) × `Shade` (Dark, Light) = 6 variants

The 3 sizes represent 3 levels of detail:

| Size | Dimensions | Shows | Use case |
|------|-----------|-------|----------|
| Small | 200×120 | Name + hex only | Semantic token tables (compact swatch) |
| Medium | 400×320 | Name + hex + contrast ratio | Secondary references |
| Large | 992×420 | Name + hex + token ref label (NYI) + contrast ratio | Primitive palette documentation |

**Large variant structure** (VERTICAL, gap 32, FILL horizontal, FIXED height 420):
1. `Color Info` frame (VERTICAL, FILL horizontal, HUG vertical, gap 0):
   - `Colour Title` (HORIZONTAL, FILL, gap 0):
     - Name text (e.g. "Blue 100") — fontSize 48, FIXED width
     - `Type` text (e.g. "NYI" or token reference) — fontSize 24, FILL width
   - `Hex colour` text (e.g. "#001729") — fontSize 40, HUG
2. `Contrast Ratio` frame (HORIZONTAL, HUG, gap 4):
   - Contrast icon (half-circle outline, 52×52)
   - Ratio text (e.g. "18.18") — fontSize 40

**Background fill:** Applied to the component frame itself — bound to the colour variable. `Shade=Dark` uses light text on dark fill; `Shade=Light` uses dark text on light fill.

#### 4. Dimension (published — for cross-file documentation)

**Component set name:** `Dimension`

**Variants:** `Variant` (Left, Right, Top, Bottom) × `Size` (Sm, Md, Lg) = 12 variants

Measurement annotation component with a bracket/line indicator and a value or label.

| Size | Shows | Use case |
|------|-------|----------|
| Sm | Raw value number (fontSize 12) + bracket | Compact inline measurements |
| Md | Token name tag instance + bracket | Token reference annotations below swatches |
| Lg | Large value number (fontSize 24) + bracket | Prominent measurements |

**Structure (Bottom variant, all sizes):** VERTICAL, gap 0–4:
1. `Indicator` frame (HORIZONTAL): left bracket line + horizontal line + right bracket line
2. Value display: raw text (Sm/Lg) or `_spacing size` tag instance (Md)

**Direction variants** control which way the bracket points — Bottom (bracket above, label below), Top (bracket below, label above), Left/Right (vertical bracket with horizontal label).

#### 5. Note (published — for cross-file documentation)

**Component set name:** `Note`

**Variants:** `Property 1` (Bottom, Left, Right, Top) = 4 variants

Pointer annotation component — a line with a node endpoint leading to a label + token tag.

**Structure (Right variant):** HORIZONTAL, gap 8:
1. Pointer line frame: circle endpoint (13×13) + horizontal line + end cap
2. Note content frame (VERTICAL, gap 8):
   - "Note" label text — fontSize 14
   - Token tag instance (e.g. `_Font size` or `_spacing size`) showing the token name

#### 6. Other shared components

| Component set | Purpose | Variants |
|--------------|---------|----------|
| `Dashboard thumbnail` | Cover page thumbnails | 18 variants (light/dark × aspect ratios) |
| `Label` (Tags) | Label/tag components | 60+ variants (categories, colours) |
| `Jira ticket` | Ticket reference card | 1 variant |
| `Documentation grid` (Table) | Table template | Single component with 23 children (header + rows) |
| `Acceptance criteria` (Checklist) | Review checklist | Single component with 25 children |
| `Note card` | Annotation card with callout | 2 variants (direction) |
| `Feature` | Feature metric card | 10 variants |
| `IA Level` | IA depth indicator | 16 variants |

---

### Topic-specific documentation components (`_` prefix)

Each topic page creates its own hidden component set for topic-specific visualisation elements. These live on the topic page itself (NOT the Documentation page) and use the `_` prefix.

**`_` prefix convention:** Underscore prefix = scoped to this page, not for cross-file use. These don't appear in the published Assets panel. Period (`.`) prefix is reserved for sub-components nested inside other components.

| Component set | Topic page | What it visualises |
|--------------|-----------|-------------------|
| `_Colour tokens` | Colour | Colour swatches (Color × Value variants) — used in semantic token tables |
| `_Font size` | Typography | Font size specimen rows per style |
| `_spacing size` | Spacing | Spacing token rows with visual bar + label tag |
| `_radius size` | Radius | Radius visualisation circles/rectangles |
| `_radius tokens` | Radius | Radius component token visualisation |
| `_stroke width` | Stroke | Stroke width line samples |
| `_stroke component` | Stroke | Stroke component token visualisation |

**Build order:** Create topic-specific component sets FIRST on each topic page, in a staging area to the far left. Then build the documentation artboard using instances of both shared components (from Documentation page) and topic-specific components.

**Exception:** `_Colour Details`, `Dimension`, and `Note` live on the Documentation page (not topic pages) because they are reused across multiple topic pages and across DLS files.

---

## Figma documentation pages

### Page layout template

Every documentation page uses a single artboard frame containing a header instance followed by "Child" section frames.

```
Artboard Frame (VERTICAL, 0 gap, hug height)
├── Artboard Header INSTANCE (Size=Large, Style=Light or Dark)
│   └── Set: Title, Description, Project name, token prefix
├── Child (VERTICAL, padding L:240 R:240 T:100 B:100, gap 80, FILL horizontal)
│   ├── Section Header INSTANCE (Status=Done or WIP, Size=Large)
│   │   └── Set: 1–3 column headers, subheaders, body text
│   └── Content (varies by topic — swatch grids, tables, etc.)
├── Child ...
└── Child ...
```

### Layout specifications

| Element | Layout | Padding (T/R/B/L) | Gap | Width | Height |
|---------|--------|--------------------|-----|-------|--------|
| Artboard frame | VERTICAL | 0/0/0/0 | 0 | FIXED (artboard width) | HUG |
| Artboard Header (Large) | VERTICAL | 480/320/320/320 | 0 | FILL | HUG |
| Child section | VERTICAL | 100/240/100/240 | 80 | FILL | HUG |
| Section Header (Large) | HORIZONTAL | 0 | 64 | FILL | HUG |
| 3-col sections (inside Section Header) | VERTICAL | 0 | 0 | FILL | HUG |
| Header/Subheader/Body rows | HORIZONTAL | 0 | 64 | FILL | HUG |
| Col text (body column) | VERTICAL | 0 | 8 | FILL | HUG |

**Artboard width:** Typically 4800–5300px. The artboard header and child frames use FILL horizontal to stretch to match.

### Status convention

- ✅ = Page/section is complete and reviewed
- 🚧 = Page/section is in progress or incomplete

Status appears in three places:
1. **Page name** — `↳ Typography ✅` or `↳ Radius 🚧`
2. **Section Header component** — `Status=Done` (✅) or `Status=WIP` (🚧)
3. **Inline within content** — per sub-section where needed

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

The colour page has two separate artboards: one for primitives, one for semantic tokens.

#### Artboard 1: Colour Styles (primitives)

```
Artboard (VERTICAL, 0 gap)
├── Artboard Header INSTANCE (Title="Colour Styles")
├── Child — Section: Primary Colours
│   ├── Section Header INSTANCE (Status=Done, 1-col or 3-col body text describing the hue category)
│   └── {Hue} colors frame (VERTICAL, gap 16)
│       ├── Colour + Documentation (VERTICAL, gap 16)
│       │   ├── Core (HORIZONTAL, FILL, gap 0): 4 × _Colour Details INSTANCE (Size=Large, FILL)
│       │   └── Annotation (HORIZONTAL, FIXED): Dimension INSTANCE (Variant=Bottom, Size=Lg) per swatch
│       ├── Colour + Documentation (next row of the scale)
│       └── ...
├── Child — Section: Neutral Colours
├── Child — Section: Secondary Colours (with sub-sections per hue: Teal, Purple, etc.)
├── Child — Section: Semantic Colours (with sub-sections: Danger, Warning, Success)
└── ...
```

**Section descriptions:** Write project-specific rationale for each colour category — what role the hue plays in the design system, why it was chosen, and where it should be used. Do NOT copy reference file text verbatim.

**Colour swatch grid pattern:**
- Each hue scale is shown in rows of 4 `_Colour Details` (Size=Large) instances
- Steps 100→70 in row 1, 60→30 in row 2, 20→10 in row 3
- Below each swatch row: a `Dimension` (Variant=Bottom) annotation showing the token reference name or "NYI" for unassigned steps
- `Shade=Dark` for steps 60+ (light text on dark fill), `Shade=Light` for steps 50 and below (dark text on light fill)

#### Artboard 2: Colour Tokens (semantic)

```
Artboard (VERTICAL, 0 gap)
├── Artboard Header INSTANCE (Title="Colour Tokens", Desc="Light" or "Dark", token="color_light__")
└── Parent (HORIZONTAL, FILL, gap 80, padding L:240 R:240 T:100 B:100)
    ├── col (FILL, VERTICAL, gap 128): Text tokens section, ...
    ├── col (FILL, VERTICAL, gap 128): Link tokens section, ...
    └── col (FILL, VERTICAL, gap 128): Button tokens sections, ...
```

**Each Section inside a column** (VERTICAL, gap 40):
1. Section header: `_Text Description` (title + 1-line description) + ✅/🚧
2. Table (VERTICAL, gap 0):
   - Header row (HORIZONTAL): Col 1 "Token" | Col 2 "Role" | Col 3 "Value"
   - Data rows (HORIZONTAL): Col 1 = code block with token name | Col 2 = role description text | Col 3 = `_Colour tokens` INSTANCE (Small, showing the resolved colour swatch)

**Create both Light and Dark artboards** — one per colour mode. The token names are the same; the resolved colour values differ.

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
design/16_PROTOTYPE/stories/
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
- **Write project-specific descriptions** — section body text should describe the role, rationale, and usage guidelines for THIS project's design system. Do not copy text from reference files. The skill codifies STRUCTURE and COMPONENT PATTERNS, not content.
- **`_Colour Details`, `Dimension`, and `Note` are published components** — they live on the Documentation page and are intended for use across DLS files (Icons & Illustrations, Components). All other `_` prefixed components are page-scoped and not published.
- **Section Header component replaces raw `_Text Description` frames** — always instantiate the Section Header component set rather than building headers manually. Use its boolean properties to control 1-, 2-, or 3-column body text layouts.
