---
name: design-visual
description: >
  Establishes the visual language, brand expression, and aesthetic direction — color rationale,
  typography rationale, spacing philosophy, iconography, and visual hierarchy — before tokens
  are created in Figma. This mode answers WHY specific visual values were chosen, so that
  figma-tokens knows WHAT values to create. Triggers on: "visual design", "brand", "color
  palette", "typography", "visual language", "moodboard", "look and feel", "aesthetic",
  "visual style", "brand attributes", "color rationale", "spacing philosophy", "density",
  "iconography", or when deciding what the product should look and feel like. Upstream
  dependencies: design-discovery, design-ia.
---

# Visual Design — Brand & Visual Language

> **Quick reference**
> - **Purpose:** Establish visual language and brand expression — the WHY behind token values
> - **Inputs:** Design brief, personas, IA (soft deps)
> - **Outputs:** Brand attributes, color rationale, typography rationale, visual language → `design/08_VISUAL/`
> - **Hard rules:** Every color choice needs a rationale. All text colors need WCAG contrast ratios. Spacing scale must be mathematical.
> - **Common mistake:** Choosing colors without documenting WCAG contrast ratios — contrast failures discovered later force rework

## Purpose

Establish the visual language and brand expression for the product. This mode produces the **rationale and specifications** that drive token creation in Figma. It answers "why these colors? why this typography? why this spacing?" so that `figma-tokens` can create the right primitive and semantic values.

---

## Dependency check

**Soft dependencies** (warn if missing, don't block):
- `design/01_DISCOVERY/design-brief.md` — design principles guide visual direction
- `design/02_USER_MODELS/personas/*` — user context affects visual density and complexity
- `design/02_USER_MODELS/behavioral-archetypes.md` — archetype patterns inform information density and visual complexity decisions
- `design/06_INFORMATION_ARCHITECTURE/*` — content density affects spacing and hierarchy decisions

---

## Upstream sync (step 0)

Before starting this mode's workflow:

0. **Value alignment check:** If `design/01_DISCOVERY/value-framework.md` exists, verify that this mode's outputs can be traced to a vision element, driver, or lever defined there. If an output cannot be connected to a documented user need or a value lever, question whether it belongs. If no value framework exists yet, proceed — but flag any outputs whose purpose is unclear.
1. Check `design/08_VISUAL/_upstream.md` for the dependency manifest
2. Compare recorded upstream versions against current artifact files
3. If upstream has changed, report what changed (additive / corrective / structural) and ask the designer: re-process or proceed?
4. If re-processing, update incrementally — process the delta, don't rebuild from scratch

After completing this mode's workflow:

1. Add or increment `<!-- artifact: ... -->` version headers on all changed output files
2. Update `design/08_VISUAL/_upstream.md` with consumed and produced artifact versions
3. Report which downstream modes are now potentially stale

### Script commands
```bash
# On entry — check staleness:
node design/scripts/sync-status.js

# After completing — version and manifest:
node design/scripts/sync-version.js init <file> design-visual   # first time
node design/scripts/sync-version.js bump <file>                  # subsequent updates
node design/scripts/sync-manifest.js visual                      # update manifest
```

---

## Workflow

### Step 1 — Brand attributes

Define the personality of the product through brand attributes:

```markdown
## Brand Attributes

### Personality spectrum
[Position the product on each axis]

| Spectrum | Position | Rationale |
|----------|----------|-----------|
| Playful ←→ Serious | [position] | [why] |
| Casual ←→ Formal | [position] | [why] |
| Simple ←→ Complex | [position] | [why] |
| Bold ←→ Restrained | [position] | [why] |
| Warm ←→ Cool | [position] | [why] |

### Visual principles
1. [Principle 1] — [what it means for visual decisions]
2. [Principle 2] — [what it means]
3. [Principle 3] — [what it means]
```

Write to `design/08_VISUAL/brand-attributes.md`.

### Step 2 — Color rationale

Choose colors with explicit reasoning. Every color choice must have a "why":

```markdown
## Color Rationale

### Primary palette
| Role | Hue | Value range | Rationale |
|------|-----|-------------|-----------|
| Interactive/Primary | [hue] | [range] | [why this color for primary actions] |
| Background | [hue] | [range] | [why — density, readability, fatigue] |
| Surface | [hue] | [range] | [why — elevation, grouping] |
| Text | [hue] | [range] | [why — contrast, readability] |

### Semantic colors
| Meaning | Color | Rationale | WCAG contrast (on bg) |
|---------|-------|-----------|----------------------|
| Success | [color] | [why] | [ratio] |
| Warning | [color] | [why] | [ratio] |
| Error/Danger | [color] | [why] | [ratio] |
| Information | [color] | [why] | [ratio] |

### Domain-specific colors
[Are there colors with domain meaning? e.g., status indicators, classification levels]

| Domain concept | Color | Rationale | Accessibility note |
|---------------|-------|-----------|-------------------|

### Color scale specification
For each primary hue, specify the step scale (maps to primitive tokens):
- [Hue]/50 through [Hue]/900 — [describe the intended use of light vs. dark steps]

### Dark mode strategy
- Approach: [invert? shift? separate palette?]
- Key differences from light mode: [what changes besides bg/fg swap]
```

Write to `design/08_VISUAL/color-rationale.md`.

### Step 3 — Typography rationale

Select fonts and define the type scale:

```markdown
## Typography Rationale

### Font selection
| Role | Font family | Weight range | Rationale |
|------|-------------|-------------|-----------|
| Headings | [font] | [weights] | [why — personality, readability] |
| Body | [font] | [weights] | [why — readability at small sizes, screen rendering] |
| Monospace/Data | [font] | [weights] | [why — alignment in tables, code] |

### Type scale
| Step | Size (px) | Line height | Use case |
|------|-----------|-------------|----------|
| xs | [px] | [ratio] | [where used] |
| sm | [px] | [ratio] | [where used] |
| md (base) | [px] | [ratio] | [body text] |
| lg | [px] | [ratio] | [where used] |
| xl | [px] | [ratio] | [where used] |
| 2xl | [px] | [ratio] | [page headings] |

### Hierarchy rules
- [How many heading levels? When to use which?]
- [Maximum font sizes on screen?]
- [When to use weight vs. size for emphasis?]
```

Write to `design/08_VISUAL/typography-rationale.md`.

### Step 4 — Visual language

Define the remaining visual properties:

```markdown
## Visual Language

### Spacing philosophy
- Approach: [4px grid? 8px grid? custom?]
- Density: [compact / comfortable / spacious — and why]
- Scale: [list the spacing values and their semantic meanings]

### Elevation & depth
| Level | Use case | Shadow/border treatment |
|-------|----------|------------------------|
| 0 (flat) | [where used] | [treatment] |
| 1 (raised) | [where used] | [treatment] |
| 2 (overlay) | [where used] | [treatment] |

### Border radius
| Token | Value | Use case |
|-------|-------|----------|
| none | 0 | [where] |
| sm | [px] | [where] |
| md | [px] | [where] |
| lg | [px] | [where] |
| full | 9999px | [pills, avatars] |

### Iconography
- Style: [line / filled / duotone / custom]
- Size grid: [16px / 20px / 24px / 32px]
- Stroke width: [if line icons]
- Source: [icon library or custom]

### Grid & layout
- Column grid: [12-column? 16-column?]
- Gutter width: [px]
- Max content width: [px]
- Breakpoints: [list with rationale]
```

Write to `design/08_VISUAL/visual-language.md`.

---

## Bridge to Figma

| Visual artifact | Figma skill | How it's used |
|----------------|------------|---------------|
| Color scale specification | `figma-tokens` | Becomes `primitive/color/[hue]/[step]` tokens |
| Semantic colors | `figma-tokens` | Becomes `semantic/color/[meaning]` tokens |
| Type scale | `figma-tokens` | Becomes `primitive/font-size/[step]` tokens |
| Spacing scale | `figma-tokens` | Becomes `semantic/spacing/[size]` tokens |
| Border radius | `figma-tokens` | Becomes `semantic/radius/[size]` tokens |
| Dark mode strategy | `figma-tokens` | Informs Light/Dark mode in Semantic collection |

---

## Output checklist

- [ ] `design/08_VISUAL/brand-attributes.md` — personality spectrum, visual principles
- [ ] `design/08_VISUAL/color-rationale.md` — full color palette with rationale, WCAG contrast noted, dark mode strategy
- [ ] `design/08_VISUAL/typography-rationale.md` — font selection, type scale, hierarchy rules
- [ ] `design/08_VISUAL/visual-language.md` — spacing, elevation, radius, iconography, grid

---

## Rules

- Every color choice must have a rationale — "it looks good" is not sufficient. Tie to brand attributes, accessibility, or domain meaning.
- All text colors must note their WCAG contrast ratio against their intended background. Minimum 4.5:1 for body text, 3:1 for large text/UI elements.
- The spacing scale must be mathematical (typically multiples of 4 or 8) — no arbitrary values.
- Typography selections must consider screen rendering quality, licensing, and availability in Figma.
- Dark mode is not just "invert colors" — define the actual strategy (shifted backgrounds, adjusted contrast, reduced saturation).
- Visual language decisions must trace back to brand attributes. If a visual choice contradicts a brand principle, revise one or the other.
