---
name: figma-tokens
description: >
  Creates and manages the 3-level design token system (Primitives → Semantic → Component)
  as Figma variables. Use this skill whenever adding new tokens, extending the palette,
  creating semantic aliases, binding component-specific tokens, or when hardcoded values
  are found during an audit. Triggers on: "add tokens", "set up variables", "create token
  system", "add color", "extend palette", "add spacing token", "bind variable", "token
  setup", "hardcoded values found", "fix token", "new design token", or when creating
  any variable in Figma. Also use whenever a component needs a value that doesn't yet
  exist as a token — create the token first, then bind it.
---

# Design Token System — 3-Level Architecture

The token system has exactly three levels. Each level builds on the one below. **Never skip levels, never apply primitives directly to design elements.**

---

## Level 1 — Primitives

**Collection name**: `Primitives`
**Prefix**: `primitive/`
**Purpose**: Raw values with no semantic meaning. The source of truth for all values in the system.

### Naming scheme
```
primitive/color/[hue]/[step]      e.g. primitive/color/blue/500
primitive/color/neutral/[step]    e.g. primitive/color/neutral/100
primitive/color/white
primitive/color/black
primitive/spacing/[px-value]      e.g. primitive/spacing/16
primitive/radius/[px-value]       e.g. primitive/radius/8
primitive/radius/full             (9999px — for pills/circles)
primitive/opacity/[percent]       e.g. primitive/opacity/50
primitive/font-size/[px-value]    e.g. primitive/font-size/16
primitive/font-weight/[value]     e.g. primitive/font-weight/400
primitive/line-height/[value]     e.g. primitive/line-height/150
```

### Minimum seed values

**Color** — 5 hues + neutrals, each 9 steps (50, 100, 200, 300, 400, 500, 600, 700, 800, 900):
- blue, green, red, yellow, purple, neutral

**Spacing** — scale in px: 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128

**Radius**: 2, 4, 8, 12, 16, 24, 9999

**Opacity** (as %): 0, 5, 10, 20, 40, 60, 80, 90, 100

### Rules
- Store raw values only (hex colors, px numbers, unitless ratios)
- **Never apply primitive tokens directly to design elements**
- Primitives are the reference layer — only Semantic tokens consume them

---

## Level 2 — Semantic

**Collection name**: `Semantic`
**Prefix**: `semantic/`
**Purpose**: Assign meaning to primitives. These are the tokens you actually apply to design elements.

### Set up Light and Dark modes on this collection from the start.

### Naming scheme
```
semantic/color/background/[role]        e.g. semantic/color/background/primary
semantic/color/background/[role]        e.g. semantic/color/background/secondary
semantic/color/background/inverse

semantic/color/text/[role]              e.g. semantic/color/text/primary
semantic/color/text/secondary
semantic/color/text/disabled
semantic/color/text/inverse
semantic/color/text/link
semantic/color/text/error

semantic/color/border/[role]            e.g. semantic/color/border/default
semantic/color/border/strong
semantic/color/border/focus
semantic/color/border/error

semantic/color/interactive/[state]      e.g. semantic/color/interactive/default
semantic/color/interactive/hover
semantic/color/interactive/pressed
semantic/color/interactive/disabled

semantic/color/surface/[role]           e.g. semantic/color/surface/default
semantic/color/surface/raised
semantic/color/surface/overlay

semantic/color/feedback/success
semantic/color/feedback/warning
semantic/color/feedback/error
semantic/color/feedback/info

semantic/spacing/[size]                 sizes: 2xs, xs, sm, md, lg, xl, 2xl, 3xl
semantic/radius/[size]                  sizes: none, xs, sm, md, lg, xl, full
semantic/opacity/[role]                 e.g. semantic/opacity/disabled
```

### Aliasing rule
Every semantic token **must** alias a primitive — never store a raw value at the semantic level. This is what enables theming and mode-switching.

Example (Light mode → Dark mode):
- `semantic/color/background/primary` → Light: `primitive/color/neutral/50`, Dark: `primitive/color/neutral/900`

---

## Level 3 — Component

**Collection name**: `Component`
**Prefix**: `component/`
**Purpose**: Component-specific overrides when a component needs a value that diverges from the semantic scale. Use sparingly — only create when semantic tokens are genuinely insufficient.

### Naming scheme
```
component/[component-name]/[property]
e.g.
component/button/padding-x
component/button/padding-y
component/button/radius
component/card/padding
component/card/radius
component/input/height
component/badge/font-size
```

### When to create component tokens
- When a component uses a spacing value that doesn't exist in the semantic scale
- When a component's radius deviates from the standard scale
- When a component needs a color that's semantically specific to that component (e.g., a tag's background)
- NOT for values that already exist at the semantic level — just reference semantic directly

---

## Creating tokens with Figma Console MCP

Use `figma_create_variable_collection` to create each collection, then `figma_batch_create_variables` to seed values in bulk (up to 100 at a time — much faster than one at a time).

Use `figma_batch_update_variables` to set alias references between levels.

Use `figma_add_mode` to add Dark mode to the Semantic collection.

---

## Checklist when adding a new token

1. Does it exist already? Check with `figma_get_variables` first
2. Is it a raw value? → add to Primitives
3. Is it a meaning/role? → add to Semantic, alias to a Primitive
4. Is it component-specific? → add to Component, alias to Semantic where possible
5. Set values for all modes (Light + Dark minimum)
6. Update any components that should use the new token
