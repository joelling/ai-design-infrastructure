# Visual Design

> **Tier 3 — Design** | Mode: `design-visual`

## Why this matters

Visual design establishes **why** specific visual choices were made — so that when tokens are created in Figma, they carry intent, not just arbitrary values. A color palette without rationale is just a set of hex codes. A color palette with rationale ("this blue conveys clinical trust at AA contrast") is a design system foundation.

## The mental model

You are defining the product's visual personality. Every choice — color, typography, spacing, density — should trace back to brand attributes and user needs. Ask:
- Does this visual choice match the product's personality (serious vs. playful, dense vs. spacious)?
- Does this serve the primary persona's context (time-pressured clinician vs. data analyst)?
- Does this meet accessibility requirements?

## Inputs

- `design/01_DISCOVERY/design-brief.md` — design principles guide visual direction
- `design/02_USER_MODELS/personas/*` — user context affects density and complexity
- `design/02_USER_MODELS/behavioral-archetypes.md` — archetype patterns inform information density and visual complexity decisions
- `design/06_INFORMATION_ARCHITECTURE/*` — content density affects spacing decisions

## Upstream sync

**On entry:** Check `design/08_VISUAL/_upstream.md` (if it exists). If upstream has changed since last run:

1. Report what changed and classify severity (additive / corrective / structural)
2. Ask the designer: re-process with new data, or proceed with current outputs?
3. If re-processing, update incrementally — revise affected visual rationale and values, don't rebuild from scratch

**On completion:** After producing or updating artifacts:

1. Add or increment version headers on all changed output files
2. Update `design/08_VISUAL/_upstream.md` with consumed artifact versions
3. Report which downstream modes are now potentially stale (accessibility, canvas, figma-tokens)

## Process

**0. Check upstream sync.** Run the upstream sync check described above. If this is a first run, note which upstream artifacts are available and which are absent.

**1. Define brand attributes.** Position the product on personality spectrums: playful ↔ serious, casual ↔ formal, simple ↔ complex, bold ↔ restrained, warm ↔ cool. Each position needs a rationale tied to the domain and users. Derive 3-5 visual principles from these positions.

**2. Choose colors with rationale.** Every color choice must answer "why?" Define the primary palette (interactive, background, surface, text) with rationale. Define semantic colors (success, warning, error, info) with WCAG contrast ratios. Define domain-specific colors if applicable. Specify the color scale (steps from 50 to 900). Define the dark mode strategy.

**3. Select typography with rationale.** Choose fonts for headings, body, and monospace/data. Define the type scale (xs through 2xl) with sizes, line heights, and use cases. Establish hierarchy rules: how many heading levels, when to use weight vs. size for emphasis.

**4. Define the visual language.** Spacing philosophy (4px or 8px grid, density level, semantic scale). Elevation and depth (flat, raised, overlay — when each is used). Border radius scale. Iconography style (line, filled, duotone; size grid; source). Grid and layout system (column grid, gutter, max width, breakpoints).

## Outputs

| File | What it contains |
|------|-----------------|
| `design/08_VISUAL/brand-attributes.md` | Personality spectrum, visual principles |
| `design/08_VISUAL/color-rationale.md` | Full palette with rationale, WCAG contrast, dark mode strategy |
| `design/08_VISUAL/typography-rationale.md` | Font selection, type scale, hierarchy rules |
| `design/08_VISUAL/visual-language.md` | Spacing, elevation, radius, iconography, grid |

*`_upstream.md` is maintained by `sync-manifest.js` and is not a mode deliverable.*

## Rules

- Every color choice must have a rationale — "it looks good" is not sufficient.
- All text colors must note WCAG contrast ratio. Minimum 4.5:1 for body text, 3:1 for large text/UI.
- The spacing scale must be mathematical (multiples of 4 or 8) — no arbitrary values.
- Typography must consider screen rendering, licensing, and Figma availability.
- Dark mode is not "invert colors" — define the actual strategy.
- Visual choices must trace back to brand attributes. Contradictions must be resolved.

## Token handoff

The visual rationale documents produced here feed directly into `figma-tokens`, which translates them into a 3-level token system:

```
Primitives  →  Semantic  →  Component
(raw values)   (purpose)    (targeted overrides)
```

To ensure the handoff is unambiguous, the rationale documents must include the following:

**Color rationale → Primitive tokens**
- Define the full step scale for each hue (steps 10, 20, 30 … 100, or 50–900 depending on the scale chosen). Each step becomes one primitive variable.
- **Dark mode inversion rule:** Light and dark mode use the same hue palette but with steps mirrored. A color at step 100 in light mode maps to step 10 in dark mode (and vice versa). Mid-range steps (40–60) may be shared or adjusted for legibility — document any exceptions explicitly. Anchors like pure white and pure black do not invert.
- `color-rationale.md` must include a table showing each semantic role (background, surface, border, text, interactive, success, warning, error, info) with its light-mode step and dark-mode step.

**Typography rationale → Primitive + semantic tokens**
- The token system builds each named type style from **6 independent tokens**: font family, font weight, font size, line height (density), paragraph spacing, and letter spacing.
- `typography-rationale.md` must therefore document all 6 properties for every named style (e.g., Body/Default, Heading/H1, Label/Small) — not just size and weight. Missing properties will default to Figma's base values, which may not be intentional.
- Type scale naming should match the semantic token names that will appear in Figma (e.g., `text/body/default`, `text/heading/h1`).

**Spacing and visual language → Primitive tokens**
- The spacing scale must be expressed as a named sequence (e.g., space-1 = 4px, space-2 = 8px …). Each step becomes one primitive variable.
- Border radius, elevation, and grid values follow the same pattern — name every discrete value, even if there are only 2 or 3.

## Feeds into

- **Figma Tokens** — color, typography, and spacing values become primitive and semantic tokens (see Token handoff above)
- **[Accessibility](10-accessibility.md)** — color palette needs contrast auditing
- **[Canvas Briefs](13-canvas.md)** — visual specs inform density and token usage per screen
