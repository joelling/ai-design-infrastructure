---
name: figma-file-setup
description: >
  Sets up Figma files using the 3-file DLS architecture (Foundation, Icons & Illustrations,
  Components) plus project Working files. Use this skill whenever starting a new project,
  creating a new DLS or working file, or when a file is missing the standard page structure.
  Triggers on: "new project", "set up file", "create file structure", "new figma file",
  "start project", "initialize file", "file setup", "DLS setup", "design library setup",
  or when opening a blank Figma file for the first time. Also use when the user wants to
  know what files/pages a project should have, or when reorganising an existing file.
---

# Figma File Setup

## 3-File DLS Architecture

Every project uses three Design Language System (DLS) files plus one or more Working files:

| File | Name pattern | Purpose |
|------|-------------|---------|
| **Foundation** | `Foundation – [Project] DLS` | All variables, styles, colour/grid/typography/spacing/radius/stroke/elevation/motion documentation |
| **Icons & Illustrations** | `Icons & Illustrations – [Project] DLS` | Icon sets, illustration assets |
| **Components** | `Components – [Project] DLS` | UI components (atoms → templates) |
| **Working File** | `[Project] - Working` | Active design canvas — screens, flows, exploration |

**One source of truth for tokens:** Variables live in Foundation DLS only. The Components file and Icons & Illustrations file consume Foundation as an enabled library. Working files enable all three DLS libraries.

---

## Library-First Initialization Path

When starting a new project, create files in this order:

1. **Create Foundation DLS file** — set up all 8 variable collections via `figma-tokens`
2. **Create Icons & Illustrations DLS file** — enable Foundation as a library
3. **Create Components DLS file** — enable Foundation as a library
4. **Create Working file** — enable all three DLS libraries
5. Only then begin screen design

---

## Foundation DLS — Sequential Build Order

The Foundation DLS file must be built in a specific sequence. Each step is a prerequisite for the next. Do NOT skip steps or reorder.

```
Step 1: Create the file and all pages (this skill)
Step 2: Create 8 variable collections (figma-tokens Phase 1)
Step 3: Create Figma Styles — text styles, effect styles, grid styles (figma-tokens Phase 2)
Step 4: Build Documentation page component library (figma-docs bootstrap)
Step 5: Build topic-specific documentation pages (figma-docs topic pages)
Step 6: Initialize inventory (figma-inventory)
Step 7: Publish the file as a library
```

**Why this order matters:**
- Documentation pages require shared components from Step 4 (Artboard header, etc.)
- Topic documentation pages require variables from Step 2 to bind swatch colours
- Inventory initialization in Step 6 records what was published in Step 7
- Figma Styles (Step 3) must be created in the Foundation file before they can be referenced

---

## DLS File — Page Structure

All three DLS files follow the same page naming convention:

```
Cover Page
      ↳ Read me
      ↳ Documentation ✅
      ↳ Design Token Fundamentals ✅
——————————————
      ↳ {Topic} ✅        ← completed
      ↳ {Topic} 🚧        ← in progress
---
{Scratch pages}            ← no prefix, flat name
```

Status emojis: ✅ = complete, 🚧 = in progress

### Page details (DLS files)

**Cover Page**
Create an annotation frame (1440×900) with:
- Project name (large heading text)
- File type label (e.g., "Foundation DLS", "Components DLS")
- Date started
- Team / owner

**      ↳ Read me**
Project overview, usage instructions, contribution guidelines.

**      ↳ Documentation ✅**
Houses reusable documentation components (see section below).

**      ↳ Design Token Fundamentals ✅**
Foundation DLS only — visual reference for the token architecture and alias chain.

**Topic pages**
Each topic gets its own page with a status emoji. Topics vary by DLS file type.

**Foundation DLS topic pages (in order):**
```
      ↳ Colour 🚧
      ↳ Grid 🚧
      ↳ Typography 🚧
      ↳ Spacing 🚧
      ↳ Radius 🚧
      ↳ Stroke 🚧
      ↳ Elevation 🚧
      ↳ Motion 🚧
```

All start as 🚧. Update to ✅ via `figma-docs` as each page is completed.

**Scratch pages**
Flat names, no arrow prefix. Temporary exploration that hasn't been formalized.

---

## Icons & Illustrations DLS — File Specification

This file contains all icon components and illustration assets. It consumes Foundation DLS as an enabled library and publishes to Working files and the Components DLS.

### Page naming convention

Follows the same Foundation convention (6-space indent + ↳ prefix + status emoji):

```
Cover Page
      ↳ Read me
      ↳ Documentation ✅
——————————————
      ↳ Icon Fundamentals ✅
      ↳ Line Icons ✅
      ↳ Fill Icons ✅
      ↳ Graphic Icons 🚧
---
      ↳ Spot Illustrations 🚧
      ↳ Feature Illustrations 🚧
      ↳ Hero Illustrations 🚧
---
X
```

Separators (——————————————) divide icons from illustrations from scratch.

---

### Icon system

#### Grid and keyline system

All icons are drawn on a **24px canvas** (canonical size). This aligns with `spacing_size_24` from Foundation 03_Spacing.

| Zone | Size | Purpose |
|------|------|---------|
| Canvas | 24×24px | Component frame size |
| Active area | 20×20px | 2px safe area each side |
| Optical center | visual, not metric | Icons must feel centered, not just be |

Key shape reference frames (not published — on Fundamentals page):
- **Circle:** 20px diameter — for round/cyclical concepts
- **Square:** 18×18px — for UI controls and containers
- **Portrait rect:** 16×20px — for vertical/directional metaphors
- **Landscape rect:** 20×16px — for horizontal metaphors

#### Stroke weight

Bound to Foundation token: `stroke_width/stroke_width_medium` (1px) for 24px icons.
At smaller sizes (16px): use `stroke_width/stroke_width_thin` (0.5px).
At larger sizes (32px+): use `stroke_width/stroke_width_thick` (2px).

#### Size scale

From Foundation `05_Icon Sizes` collection (Sm/Md/Lg modes):

| Size | Use case | Grid base |
|------|---------|-----------|
| 16px | Dense layouts, secondary indicators | `spacing_size_16` |
| 20px | Secondary actions, mobile UI | `spacing_size_16` + `spacing_size_4` |
| 24px | **Primary standard — all icons built here** | `spacing_size_24` |
| 32px | Feature sections, display | `spacing_size_32` |
| 40px | Large display, marketing | `spacing_size_40` |
| 48px | Hero/headline icons | `spacing_size_40` + `spacing_size_8` |

#### Icon styles

| Style | Usage | When to create |
|-------|-------|---------------|
| **Line** (outlined) | Default UI icons, high-density layouts | Always — primary style |
| **Fill** (solid) | Active/selected states, emphasis | When active state differentiation is needed |
| **Graphic** | Marketing, empty states, feature callouts | When decorative complexity is needed |

Line and Fill variants are offered as separate pages. Graphic Icons are complex decorative icons (multi-layer, multiple colors, may not scale down).

#### Component naming

```
Icon/{Category}/{Name}
```

Categories follow usage patterns:
- `Icon/Action/` — add, delete, edit, upload, download
- `Icon/Navigation/` — arrow-left, chevron-down, home, menu
- `Icon/Communication/` — email, phone, chat, notification
- `Icon/Status/` — check, warning, error, info, loading
- `Icon/Content/` — document, image, video, file, folder
- `Icon/Interface/` — search, filter, sort, settings, close

Hidden sub-components use `.` prefix (e.g., `.IconStroke`, `.IconFill`) — don't appear in Assets.

#### Component properties

Every icon component exposes these properties:

| Property | Type | Values | Default |
|----------|------|--------|---------|
| `size` | VARIANT | `sm` (16), `md` (20), `lg` (24), `xl` (32) | `lg` (24) |
| `color` | INSTANCE_SWAP or fill variable | bound to `color_icon/*` token | `color_icon/default` |

Do NOT create separate components per size — use the `size` variant property on a single component. Icon frames resize via fixed width/height bound to `05_Icon Sizes` variables.

#### Color tokens (icon-specific)

Icons bind to `color_icon/*` tokens from Foundation 02_Colour Tokens:

| Token | Light mode usage | Dark mode usage |
|-------|-----------------|-----------------|
| `color_icon/default` | Primary icon colour | Inverted equivalent |
| `color_icon/secondary` | Supporting icons, less emphasis | Inverted equivalent |
| `color_icon/disabled` | Disabled state icons | Inverted equivalent |
| `color_icon/interactive` | Clickable/active icons | Inverted equivalent |
| `color_icon/inverse` | Icons on dark backgrounds | Icons on light backgrounds |
| `color_icon/success` | Confirmation, success icons | Inverted equivalent |
| `color_icon/warning` | Warning icons | Inverted equivalent |
| `color_icon/error` | Error, destructive icons | Inverted equivalent |

If `color_icon/*` tokens don't yet exist in Foundation 02_Colour Tokens, run `figma-tokens` to add them before creating icon components.

---

### Illustration system

#### Scale tiers

| Tier | Dimensions | Use cases |
|------|-----------|----------|
| **Spot** | 80×80px, 120×120px | Empty states, micro-moments, status confirmations |
| **Feature** | 200×160px, 320×240px | Onboarding steps, feature callouts, section headers |
| **Hero** | 480×360px, 800×600px | Error pages, marketing sections, splash screens |

All dimensions use 4:3 ratio (Feature, Hero) or 1:1 (Spot). Resize constraints preserve ratio.

#### Component naming

```
Illustration/{Tier}/{Name}
```

Examples:
- `Illustration/Spot/empty-state-search`
- `Illustration/Spot/success-check`
- `Illustration/Feature/onboarding-01`
- `Illustration/Hero/404-error`

#### Component properties

| Property | Type | Values | Default |
|----------|------|--------|---------|
| `colorMode` | VARIANT | `light`, `dark` | `light` |
| `size` | VARIANT | tier-specific sizes | smallest |

Each colorMode variant has fills bound to Foundation colour tokens (same primitive steps, different semantic meaning per mode).

#### Color strategy for illustrations

Illustrations use a constrained palette from Foundation 01_Colour Styles:

**Full color palette (Feature + Hero):**
- Primary: `Colour Styles/Primary Colour/*` — 2-3 steps (e.g., 40, 60, 80)
- Neutral: `Colour Styles/Neutral Colour/*` — 2-3 steps for backgrounds/fills
- Accent: one Secondary Colour — 1-2 steps

**Spot illustration palette (simplified):**
- Maximum 3 colors: Primary 60 + Neutral 20 + white

**Light/Dark adaptation rules:**
- Light backgrounds use darker fills (steps 60-100 for primary elements)
- Dark backgrounds use lighter fills (steps 20-50 for primary elements, steps 80-100 for backgrounds)
- Stroke weights increase 0.5px on dark mode (thin strokes disappear against dark)
- Saturation decreases ~15% in dark mode fills

#### Layer naming inside illustrations

Functional names only — no `Group 1` or `Path 2`:
- `background` — the backdrop fill/shape
- `primary-shape` — the main illustrative element
- `accent` — secondary/highlight elements
- `shadow` — drop shadow or depth layer
- `detail-*` — numbered detail layers

---

### Foundation DLS dependency

Icons & Illustrations DLS consumes these Foundation collections:
- **05_Icon Sizes** — icon frame sizing variables
- **02_Colour Tokens** — `color_icon/*` token group
- **01_Colour Styles** — illustration primitive palette
- **10_Stroke** — stroke weight for icon outlines

Enable Foundation DLS as a library in this file before building any components.

---

### Initialization checklist

- [ ] File named: `Icons & Illustrations – [Project] DLS`
- [ ] Pages created in correct order with naming convention
- [ ] Foundation DLS enabled as library
- [ ] Cover Page populated
- [ ] Documentation ✅ page set up with reusable doc components (from Foundation)
- [ ] Icon Fundamentals page: grid frames, keyline reference, size scale table
- [ ] `color_icon/*` tokens confirmed in Foundation — run figma-tokens if missing
- [ ] Line icon components follow `Icon/{Category}/{Name}` naming
- [ ] All icon fills bound to `color_icon/*` tokens (zero hardcoded fills)
- [ ] Icon size controlled via `05_Icon Sizes` variables (zero hardcoded dimensions)
- [ ] Illustration components follow `Illustration/{Tier}/{Name}` naming
- [ ] Illustration fills bound to Foundation colour tokens (zero hardcoded fills)
- [ ] Published to Working file and Components DLS

---

## Documentation Page Layout Template (DLS files)

Standard layout for documentation and topic pages:

- **Page frame:** 4800px wide, VERTICAL auto-layout, 0 gap
- **Artboard Header:** reusable INSTANCE, VERTICAL, padding 320/480/320/320, title + icon HORIZONTAL SPACE_BETWEEN
- **Child sections:** VERTICAL, padding 240h/100v, gap 80, FILL horizontal
- **Section headers:** HORIZONTAL, SPACE_BETWEEN, title left + status icon right
- All frames auto-layout, fill container horizontal, hug contents vertical

---

## Reusable Documentation Components

The Documentation page in each DLS file provides these reusable components:

- **Artboard header** — page title with project branding
- **Dashboard thumbnail** — cover thumbnails
- **Tags** — label components
- **Documentation table** — table template
- **Checklist** — review checklist
- **Note card / Note** — annotation components
- **Asset metrics** — metric cards

---

## Working File — Page Structure

Working files use a different page convention:

```
Cover Page
🗺️ Sitemap
── [screen pages: 01 - Dashboard, 02 - Profile, etc.] ──
🅿️ Parking Lot
```

### Page details (Working file)

**Cover Page**
Same as DLS cover but labeled "Working File".

**🗺️ Sitemap**
Free-form page for mapping screen hierarchy and user flows. Simple frames connected with arrows/connectors. No auto-layout required — it's a planning canvas.

**[Screen pages]**
Added as work progresses. Follow naming: `01 - Dashboard`, `02 - Onboarding Flow`, etc. Each gets set up with the `figma-page-setup` skill.

**🅿️ Parking Lot**
Always the LAST page. Staging area for components before they migrate to a DLS library file. Set up with:
- A single full-canvas auto-layout frame (vertical, 64px gap)
- Category header frames: Atoms / Molecules / Organisms / Templates / States / Annotations
- Each category is a horizontal auto-layout row for components

---

## Initial Token Scaffold

After creating the Foundation DLS file, immediately scaffold the token system via the `figma-tokens` skill. The 8 variable collections to create:

| # | Collection |
|---|-----------|
| 01 | Colour Styles |
| 02 | Colour Tokens |
| 03 | Spacing |
| 04 | Typography |
| 05 | Icon Sizes |
| 09 | Radius |
| 10 | Stroke |
| 11 | Elevation |

> Collections 06–08 are reserved. See `figma-tokens` SKILL.md for full spec on naming, modes, types, and seeding values.

Tokens live **only** in the Foundation DLS file. All other files consume them via library enablement.

---

## Non-negotiable rules for all files

- Every frame uses auto-layout — no exceptions
- Every value (color, spacing, radius, opacity) references a variable — no hardcoded values
- Components are placed in the left staging area of each page as they're created, then moved to Parking Lot when the page is done
- Parking Lot page is always the last page in the Working file
- Variables exist only in Foundation DLS — never duplicated into other files

---

## Checklist

- [ ] Foundation DLS file created (`Foundation – [Project] DLS`)
- [ ] Foundation: Cover Page, Read me, Documentation, Design Token Fundamentals pages + 8 topic pages created
- [ ] Foundation: 8 variable collections scaffolded via `figma-tokens` Phase 1
- [ ] Foundation: Base token values seeded (colours, spacing, radius, typography)
- [ ] Foundation: Light + Dark modes configured on colour collections
- [ ] Foundation: Figma Styles created via `figma-tokens` Phase 2 (27 text styles, 4 effect styles, 3 grid styles)
- [ ] Foundation: Documentation page component library built via `figma-docs` bootstrap
- [ ] Icons & Illustrations DLS file created (`Icons & Illustrations – [Project] DLS`)
- [ ] Icons & Illustrations: Foundation library enabled
- [ ] Components DLS file created (`Components – [Project] DLS`)
- [ ] Components: Foundation library enabled
- [ ] Working file created (`[Project] - Working`)
- [ ] Working file: All three DLS libraries enabled
- [ ] Working file: Pages created — Cover Page, Sitemap, Parking Lot
- [ ] Working file: Cover annotation frame populated
- [ ] Working file: Parking Lot set up with category rows
