---
name: figma-tokens
description: >
  Creates and manages the 3-level design token system (Primitives > Semantic > Component)
  across 8 numbered variable collections in Figma. Use this skill whenever adding new tokens,
  extending the palette, creating semantic aliases, binding component-specific tokens, or when
  hardcoded values are found during an audit. Triggers on: "add tokens", "set up variables",
  "create token system", "add color", "extend palette", "add spacing token", "bind variable",
  "token setup", "hardcoded values found", "fix token", "new design token", or when creating
  any variable in Figma. Also use whenever a component needs a value that doesn't yet
  exist as a token -- create the token first, then bind it.
---

# Design Token System -- Foundation DLS Conventions

## Token Architecture -- 3 Levels

```
Level 1 (Primitives)  --> raw values, static across modes OR inverted for light/dark
Level 2 (Semantic)    --> alias to primitives, purpose-named
Level 3 (Component)   --> alias to semantics OR primitives, component-specific
```

### Alias chain rule

- Semantic tokens MUST alias to primitives. Never raw values at semantic level.
- Component tokens MUST alias to either semantic or primitive tokens. Never raw values at component level.
- Primitives hold the only raw values in the entire system.

---

## 8 Variable Collections

| # | Collection | Purpose | Modes | Types |
|---|-----------|---------|-------|-------|
| 01 | Colour Styles | Primitive colour scales | Light Mode, Dark Mode | COLOR |
| 02 | Colour Tokens | Semantic + component colour aliases | Light Mode, Dark Mode | COLOR |
| 03 | Spacing | Responsive spacing scale | Lg, Md, Sm | FLOAT |
| 04 | Typography | Font primitives + semantic sizes + line heights + density | Lg, Md, Sm | FLOAT, STRING |
| 05 | Icon Sizes | Icon dimension tokens | Sm, Md, Lg | FLOAT |
| 09 | Radius | Primitive sizes + component tokens | Single mode | FLOAT |
| 10 | Stroke | Primitive widths + component tokens | Single mode | FLOAT |
| 11 | Elevation | Scrim/shadow colours + opacity tokens | Light Mode, Dark Mode | COLOR, FLOAT |

> Collections 06, 07, 08 are reserved. See Gap Fix Tokens below for 06_Motion.

---

## Naming Conventions

### 01 Colour Styles (Primitives)

Pattern: `Colour Styles/{Category}/{Hue}/{Hue} {Step}`

Examples:
```
Colour Styles/Primary Colour/Blue/Blue 60
Colour Styles/Neutral Colour/Grey/Grey 100
Colour Styles/Semantic/Red/Red 50
Colour Styles/Secondary Colour/Teal/Teal 30
Colour Styles/Illustration/Purple/Purple 20
```

**Categories:** Primary Colour, Neutral Colour, Secondary Colour, Semantic, Illustration

**Steps:** 10, 20, 30, 40, 50, 60, 70, 80, 90, 100 (plus occasional 5 and White)

**Light/Dark inversion:** Step values are inverted between modes. Blue 100 in Light Mode = Blue 10 in Dark Mode.

---

### 02 Colour Tokens (Semantic)

Pattern: `color_{context}/{role}` -- all alias to Colour Styles primitives.

Examples:
```
color_text/primary
color_text/secondary
color_text/disabled
color_text/reverse_primary
color_link/default
color_link/hover
color_button-bg/primary_default
color_button-bg/primary_hover
color_button-bg/primary_active
color_button-bg/primary_disabled
color_button-text/primary_default
color_button-outline/primary_default
color_border/default
color_border/strong
color_field/default
color_field/disabled
color_icon/default
color_icon/secondary
color_icon/disabled
color_icon/interactive
color_icon/inverse
color_icon/success
color_icon/warning
color_icon/error
color_support/error
color_support/warning
color_support/success
color_support/info
color_layer/01
color_layer/02
color_layer/overlay
color_focus/default
color_tag/bg_blue
color_tag/text_blue
color_miscellaneous/divider
```

**Contexts:** text, link, button-bg, button-text, button-outline, border, field, icon, support, layer, focus, tag, miscellaneous

**States embedded in name:** default, hover, active, disabled, reverse_*

#### color_icon/* — Icon token roles

| Token | Role |
|-------|------|
| `color_icon/default` | Primary icon colour |
| `color_icon/secondary` | Supporting / less-emphasis icons |
| `color_icon/disabled` | Disabled state icons |
| `color_icon/interactive` | Clickable / active icons |
| `color_icon/inverse` | Icons on inverted backgrounds |
| `color_icon/success` | Confirmation / success icons |
| `color_icon/warning` | Warning icons |
| `color_icon/error` | Error / destructive icons |

> Icon tokens are consumed by the Icons & Illustrations DLS file — ensure these exist before building icon components.

---

### 03 Spacing

Pattern: `spacing_size_{N}`

```
spacing_size_2
spacing_size_4
spacing_size_8
spacing_size_12
spacing_size_16
spacing_size_24
spacing_size_32
spacing_size_40
spacing_size_56
spacing_size_parent
spacing_size_child
```

**Scale:** 2, 4, 8, 12, 16, 24, 32, 40, 56

**Modes = responsive breakpoints (Lg, Md, Sm):** Values decrease at smaller breakpoints. For example, `spacing_size_56` might resolve to 56 at Lg, 40 at Md, 32 at Sm.

---

### 04 Typography

Typography is split into sub-groups within a single collection. Modes = Lg, Md, Sm (responsive breakpoints).

**Primitives (rem base):**
```
_rem/0.625rem        (10px)
_rem/0.75rem         (12px)
_rem/0.875rem        (14px)
_rem/1rem            (16px)
_rem/1.125rem        (18px)
_rem/1.25rem         (20px)
_rem/1.5rem          (24px)
_rem/1.75rem         (28px)
_rem/2rem            (32px)
_rem/2.25rem         (36px)
_rem/2.75rem         (44px)
_rem/3.5rem          (56px)
```

**Header sizes** (alias to _rem/ primitives):
```
font-header/header-size_44
font-header/header-size_36
font-header/header-size_28
font-header/header-size_24
font-header/header-size_20
font-header/header-size_18
```

**Body sizes** (alias to _rem/ primitives):
```
font-body/body-size_18
font-body/body-size_16
font-body/body-size_14
```

**Caption sizes** (alias to _rem/ primitives):
```
font-caption/caption-size_12
font-caption/caption-size_10
```

**Line height (per-size, direct px values):**
```
Line height Header/line-height_header_44
Line height Header/line-height_header_36
Line height Header/line-height_header_28
Line height Header/line-height_header_24
Line height Header/line-height_header_20
Line height Header/line-height_header_18
Line height Body/line-height_body_18
Line height Body/line-height_body_16
Line height Body/line-height_body_14
Line height Caption/line-height_caption_12
Line height Caption/line-height_caption_10
```

**Line height density (multiplier):** 🚧
```
line-height-density/narrow       (1.1)
line-height-density/balanced     (1.25)
line-height-density/spacious     (1.4)
line-height-density/compact      (1.15)
```

**Paragraph spacing:** 🚧
```
paragraph-spacing/xs             (0)
paragraph-spacing/sm             (8)
paragraph-spacing/md             (16)
```

**Character spacing:** 🚧
```
letter-spacing/none              (0)
letter-spacing/tight             (1)
letter-spacing/wide              (2)
```

**Typeface (STRING):**
```
typeface/family-sans             "Inter"
typeface/family-mono             "IBM Plex Mono"
```

**Font weight (STRING):** 🚧
```
font-weight/300                  "Light"
font-weight/400                  "Regular"
font-weight/500                  "Medium"
font-weight/600                  "SemiBold"
```

---

### 05 Icon Sizes

Modes: Sm, Md, Lg -- 6 FLOAT variables total.

---

### 09 Radius

**Two tiers within a single-mode collection:**

Primitive:
```
radius-size/radius_size_xs
radius-size/radius_size_sm
radius-size/radius_size_md
radius-size/radius_size_lg
radius-size/radius_size_full
```
These alias to Typography `_rem/` primitives.

Semantic: 🚧
```
radius-semantic/interactive
radius-semantic/container
radius-semantic/surface
radius-semantic/full
```

Component:
```
radius-tokens/radius_button       (full)
radius-tokens/radius_card         (md)
radius-tokens/radius_backdrop     (lg)
radius-tokens/radius_field        (xs)
radius-tokens/radius_tag          (sm)
```

---

### 10 Stroke

**Two tiers within a single-mode collection:**

Primitive:
```
stroke_width/stroke_width_thin      (0.5)
stroke_width/stroke_width_medium    (1)
stroke_width/stroke_width_thick     (2)
```

Component:
```
stroke_component_tokens/stroke_{component}
```

---

### 11 Elevation

**Light/Dark modes.**

```
Scrim Surface/Scrim Colour             semi-transparent black (light) / white (dark)
Scrim Surface/Shadow Colour            🚧 for effect styles
Scrim Surface/Shadow Colour Strong     🚧 for stronger shadows
```

Opacity tokens: 🚧
```
opacity/disabled                       (0.4)
opacity/hover                          (0.08)
opacity/pressed                        (0.12)
opacity/scrim                          (0.5)
```

---

## Modular Typography System

Each font style is a composition of 6 independent token references. No monolithic text style -- every attribute is separately tokenized.

| Attribute | Token pattern | Example |
|-----------|-------------|---------|
| Font family | `typeface/family-{family}` | `typeface/family-sans` |
| Font weight | `font-weight/{N}` | `font-weight/400` |
| Font size | `font-{category}/{category}-size_{N}` | `font-header/header-size_44` |
| Line height density | `line-height-density/{density}` | `line-height-density/narrow` |
| Paragraph spacing | `paragraph-spacing/{size}` | `paragraph-spacing/xs` |
| Character spacing | `letter-spacing/{name}` | `letter-spacing/none` |

### Density tiers

| Density | Multiplier | Usage |
|---------|-----------|-------|
| narrow | 1.1 | Display, H1, H2, numbers |
| compact | 1.15 | Small utility text |
| balanced | 1.25 | H3-H6, body, captions |
| spacious | 1.4 | Large body text |

---

## Contrast-Anchored Colour System

Each step has a defined WCAG contrast ratio against white. Steps at the same position across ALL hues maintain contrast ratios within a narrow variance -- swapping Blue 60 for Teal 60 preserves accessibility.

| Step | Contrast range | WCAG level | Usage |
|------|---------------|------------|-------|
| 100 | ~18 | AAA | Text, decorative |
| 90 | ~15 | AAA | Text, decorative |
| 80 | ~11 | AAA | Text, decorative |
| 70 | ~7.5-8 | AAA text, AA large | Text emphasis |
| 60 | ~5 | AA text | Primary interactive |
| 50 | ~3.3 | AA large only | Large text, icons |
| 40 | ~2.3 | Decorative only | Borders, dividers |
| 30 | ~1.7 | Decorative only | Subtle backgrounds |
| 20 | ~1.3 | Background only | Light tints |
| 10 | ~1.1 | Background only | Faintest tints |

**Rule:** Never use a step for a purpose above its WCAG clearance. If text needs AA compliance, use step 60 or higher.

---

## Mode Strategy

| Domain | Modes | Strategy |
|--------|-------|----------|
| Colour (01, 02) | Light Mode, Dark Mode | Value inversion -- step 100 light = step 10 dark |
| Spacing (03) | Lg, Md, Sm | Responsive breakpoints -- values scale down |
| Typography (04) | Lg, Md, Sm | Responsive breakpoints -- sizes scale down |
| Icon Sizes (05) | Sm, Md, Lg | Size variants |
| Radius (09) | Single mode | Not responsive |
| Stroke (10) | Single mode | Not responsive |
| Elevation (11) | Light Mode, Dark Mode | Shadow/scrim colour inversion |

---

## Gap Fix Tokens

The following tokens need to be created to complete the system. Each is marked with 🚧.

### In existing collections

| Collection | Token group | Variables |
|-----------|------------|-----------|
| 04 Typography | `font-weight/{300,400,500,600}` (STRING) | 4 |
| 04 Typography | `line-height-density/{narrow,balanced,spacious,compact}` (FLOAT) | 4 |
| 04 Typography | `paragraph-spacing/{xs,sm,md}` (FLOAT) | 3 |
| 04 Typography | `letter-spacing/{none,tight,wide}` (FLOAT) | 3 |
| 09 Radius | `radius-semantic/{interactive,container,surface,full}` (FLOAT) | 4 |
| 11 Elevation | `Scrim Surface/Shadow Colour` (COLOR) | 1 |
| 11 Elevation | `Scrim Surface/Shadow Colour Strong` (COLOR) | 1 |
| 11 Elevation | `opacity/{disabled,hover,pressed,scrim}` (FLOAT) | 4 |

### New collection

| # | Collection | Token group | Variables |
|---|-----------|------------|-----------|
| 06 | Motion | `motion-duration/{instant,fast,normal,slow}` (STRING) | 4 |
| 06 | Motion | `motion-easing/{ease-out,ease-in,ease-in-out}` (STRING) | 3 |

**06_Motion values (documentation-ready, STRING type):**
```
motion-duration/instant        "100ms"
motion-duration/fast           "200ms"
motion-duration/normal         "300ms"
motion-duration/slow           "500ms"
motion-easing/ease-out         "cubic-bezier(0.0, 0.0, 0.2, 1)"
motion-easing/ease-in          "cubic-bezier(0.4, 0.0, 1, 1)"
motion-easing/ease-in-out      "cubic-bezier(0.4, 0.0, 0.2, 1)"
```

Motion is STRING type because Figma variables cannot store easing curves or durations natively. These tokens serve as documentation and can be consumed by code export tooling.

---

## Phase 2: Figma Styles

Figma Styles are separate from Variables. Variables hold individual values; Styles are named applied design properties (text formatting, paint fills, effects, layout grids). Both must exist in the Foundation DLS file.

> **Important:** Styles do NOT bind to Variables automatically. Text styles store explicit font values. Effect style colours are raw rgba() values unless manually coded to reference a variable colour. This is a Figma limitation — document the values from tokens, but they are statically set.

### Text Styles (27 total)

Naming pattern: `{Category}/{Weight} {Size}`

Categories: `Header`, `Body`, `Caption`, `Overline`, `Numbers`

Create all 27 text styles using `figma_execute` with `figma.createTextStyle()`:

```javascript
// Example: create one text style
const style = figma.createTextStyle();
style.name = 'Header/Light 56';
style.fontName = { family: 'Inter', style: 'Regular' };
style.fontSize = 56;
style.lineHeight = { value: 62, unit: 'PIXELS' };
style.paragraphSpacing = 8;
style.letterSpacing = { value: 0, unit: 'PIXELS' };
```

**Complete text style definitions:**

| Style name | Family | Style | Size | Line height | Para spacing | Letter spacing |
|-----------|--------|-------|------|-------------|-------------|----------------|
| `Header/Light 56` | Inter | Regular | 56 | 62px | 8 | 0 |
| `Header/Regular 44` | Inter | Medium | 44 | 48px | 8 | 0 |
| `Header/Regular 32` | Inter | Medium | 32 | 35px | 8 | 0 |
| `Header/Semibold 24` | Inter | Semi Bold | 24 | 30px | 8 | 0 |
| `Header/Medium 20` | Inter | Medium | 20 | 25px | 8 | 0 |
| `Header/Medium 16` | Inter | Medium | 16 | 20px | 0 | 0 |
| `Header/Regular 16` | Inter | Regular | 16 | 20px | 8 | 0 |
| `Header/Medium 14` | Inter | Medium | 14 | 18px | 8 | 0 |
| `Overline/Regular 14` | Inter | Regular | 14 | 14px | 8 | 1px |
| `Body/Regular 18` | Inter | Regular | 18 | 25px | 16 | 0 |
| `Body/Semibold 18` | Inter | Semi Bold | 18 | 25px | 16 | 0 |
| `Body/Regular 16` | Inter | Regular | 16 | 20px | 12 | 0 |
| `Body/Italic 16` | Inter | Italic | 16 | 20px | 12 | 0 |
| `Body/Medium 16` | Inter | Medium | 16 | 20px | 12 | 0 |
| `Body/Semibold 16` | Inter | Semi Bold | 16 | 20px | 12 | 0 |
| `Body/Regular 14` | Inter | Regular | 14 | 18px | 12 | 0 |
| `Body/Semibold 14` | Inter | Semi Bold | 14 | 14px | 12 | 0 |
| `Body/Regular 12` | Inter | Regular | 12 | 15px | 12 | 0 |
| `Body/Semibold 12` | Inter | Semi Bold | 12 | 15px | 12 | 0 |
| `Caption/Regular 12` | Inter | Regular | 12 | 15px | 8 | 0 |
| `Caption/Regular 10` | Inter | Regular | **10** | 13px | 8 | 0 |
| `Caption/Regular 8` | Inter | Regular | 8 | 10px | 8 | 0 |
| `Numbers/Medium 32` | IBM Plex Mono | Medium | 32 | 40px | 0 | 0 |
| `Numbers/Medium 24` | IBM Plex Mono | Medium | 24 | 30px | 0 | 0 |
| `Numbers/Medium 16` | IBM Plex Mono | Medium | 16 | 20px | 0 | 0 |
| `Numbers/Regular 16` | IBM Plex Mono | Regular | 16 | 20px | 0 | 0 |
| `Numbers/Regular 14` | IBM Plex Mono | Regular | 14 | 20px | 0 | 0 |

> **Fonts required:** Inter (Regular, Italic, Medium, Semi Bold) + IBM Plex Mono (Regular, Medium). Ensure both are loaded in the Figma file before creating text styles.

---

### Effect Styles (4 total)

Create using `figma.createEffectStyle()`. Shadow colours should reference 11_Elevation variables when those variables exist.

| Style name | Type | Blur | Offset (x, y) | Spread | Color |
|-----------|------|------|---------------|--------|-------|
| `Floating Shadow` | DROP_SHADOW | 40 | 4, 4 | 0 | rgba(0,0,0,0.3) |
| `Elevated Shadow` | DROP_SHADOW | 20 | 4, 4 | 0 | rgba(0,0,0,0.15) |
| `Material Shadow` | DROP_SHADOW | 8 | 4, 4 | 0 | rgba(0,0,0,0.05) |
| `Scrim Surface` | BACKGROUND_BLUR | 5 | — | — | — |

```javascript
// Example: create Elevated Shadow
const style = figma.createEffectStyle();
style.name = 'Elevated Shadow';
style.effects = [{
  type: 'DROP_SHADOW',
  color: { r: 0, g: 0, b: 0, a: 0.15 },
  offset: { x: 4, y: 4 },
  radius: 20,
  spread: 0,
  visible: true,
  blendMode: 'NORMAL'
}];
```

---

### Grid Styles (3 total)

Create using `figma.createGridStyle()`. Matches the 3 canonical breakpoints in the Grid documentation page.

| Style name | Type | Count | Gutter | Margin | Alignment |
|-----------|------|-------|--------|--------|-----------|
| `Desktop grid` | COLUMNS | 12 | 24 | 48 | STRETCH |
| `Tablet portrait grid` | COLUMNS | 8 | 20 | 32 | STRETCH |
| `Mobile grid` | COLUMNS | 4 | 8 | 16 | STRETCH |

```javascript
// Example: create Desktop grid
const style = figma.createGridStyle();
style.name = 'Desktop grid';
style.gridStyleId = style.id;
style.grids = [{
  pattern: 'COLUMNS',
  count: 12,
  gutterSize: 24,
  offset: 48,
  alignment: 'STRETCH',
  visible: true
}];
```

---

### Paint Styles

The reference Foundation file has 0 paint styles. Paint styles make colours discoverable via the colour picker and enable non-variable fill application. Create one paint style per primitive colour swatch.

**Naming pattern:** `{Category}/{Hue}/{Hue} {Step}` (matches Colour Styles variable naming)

Create programmatically using `figma.createPaintStyle()` after variable values are confirmed:

```javascript
// Example: create Blue 60 paint style
const style = figma.createPaintStyle();
style.name = 'Primary Colour/Blue/Blue 60';
style.paints = [{ type: 'SOLID', color: { r: 0.098, g: 0.439, b: 0.784 }, opacity: 1 }];
```

> **Priority:** Text styles and effect styles are higher priority than paint styles. Paint styles for all ~90 primitive colours is a significant effort — create on demand per-hue as documentation pages are built, not upfront in bulk.

---

### Styles creation workflow

Run after completing all 8 variable collections (Phase 1). Use `figma_execute` for bulk creation:

1. Load Inter + IBM Plex Mono fonts: `await figma.loadFontAsync({ family: 'Inter', style: 'Regular' })` for each weight before creating text styles
2. Create all 27 text styles in a single `figma_execute` block
3. Create all 4 effect styles
4. Create all 3 grid styles
5. Screenshot the file's styles panel to verify
6. Create paint styles on demand per topic page

---

## Creating Tokens with Figma Console MCP

Use `figma_create_variable_collection` to create each collection, then `figma_batch_create_variables` to seed values in bulk (up to 100 at a time).

Use `figma_batch_update_variables` to set alias references between levels.

Use `figma_add_mode` to add modes to collections (Dark Mode for colour, Md/Sm for spacing/typography).

Use `figma_rename_mode` to rename the default mode (e.g., rename "Mode 1" to "Light Mode" or "Lg").

### Workflow

1. Create the collection with `figma_create_variable_collection`
2. Rename the default mode to the correct name
3. Add additional modes
4. Batch-create all variables with raw values for the first mode
5. Batch-update variables to set values for additional modes
6. For semantic/component tokens, batch-update to set alias references

---

## Checklist When Adding a New Token

1. Does it exist already? Check with `figma_get_variables` first
2. Which collection does it belong to? Match by domain (colour, spacing, typography, radius, stroke, elevation, motion)
3. Which level?
   - Raw value --> Primitive (Level 1) in the appropriate collection
   - Purpose/role --> Semantic (Level 2), alias to a primitive
   - Component-specific --> Component (Level 3), alias to semantic or primitive
4. Follow the naming convention for that collection exactly
5. Set values for ALL modes in the collection
6. Verify alias chains: semantic --> primitive, component --> semantic or primitive
7. Update any components that should use the new token
