# Chapter 12: Design-to-Canvas Synthesis

> **Tier 4 — Synthesis** | Mode: `design-canvas`

## Why this matters

This is the critical bridge. Without canvas briefs, someone must mentally aggregate 10+ design artifact files while working in Figma — pulling screen purpose from IA, states from interaction design, labels from content, ARIA patterns from accessibility, all simultaneously. Canvas briefs do that aggregation once, into a self-contained document per screen.

## The mental model

You are a project manager assembling a construction package. The architect (IA) designed the floor plan. The interior designer (visual) chose the finishes. The engineer (interaction) specified the electrical and plumbing. The accessibility consultant wrote the compliance requirements. Your job is to compile a single document that the construction crew (Figma) can follow without needing to read any upstream documents.

## Hard dependencies

This mode **blocks** if these artifacts are missing:

| Required | What it provides | Path |
|----------|-----------------|------|
| IA sitemap | Screen inventory and purpose | `design/information-architecture/sitemap.md` |
| Interaction model | States, behaviors, patterns | `design/interaction/interaction-model.md` |
| Visual spec | Tokens, hierarchy, density | `design/visual/visual-language.md` |
| Content terminology | Labels, microcopy | `design/content/terminology.md` |

Additional artifacts are used if available (personas, story map, state inventory, behavioral specs, error strategy, microcopy patterns, ARIA patterns, keyboard nav plan, contrast audit, review checklist). Each enriches the brief. Missing ones are noted.

## Process

**1. Select screens to brief.** From the IA sitemap, identify which screens need canvas briefs. Brief one or batch multiple.

**2. Compose the canvas brief.** For each screen, pull from all upstream artifacts and assemble:

- **Purpose and context** — what this screen does, primary persona, entry/exit points (from IA)
- **Stories served** — which user stories this screen fulfills, with acceptance criteria (from story map)
- **Layout and content hierarchy** — what information appears and in what order, with actions (from IA content inventory)
- **Components needed** — what components this screen requires, with variants, categorized by atom/molecule/organism (from interaction model + IA)
- **States** — all states this screen can be in, with conditions and user actions (from state inventory)
- **Content specification** — exact labels, button text, empty state messages, error messages (from content artifacts)
- **Visual specification** — density, key tokens, special treatments (from visual language)
- **Accessibility specification** — tab order, ARIA landmarks, key patterns, screen reader flow (from a11y artifacts)
- **Behavioral specifications** — key given/when/then interactions (from behavioral spec)
- **Acceptance criteria** — aggregated from stories and validation checklist
- **Breakpoint notes** — responsive adaptations (from visual language grid)

**3. Cross-reference check.** After writing, verify: every story ID references a real story, every component is either existing or flagged for creation, every content string comes from content artifacts, every state matches the inventory.

## Outputs

| File | What it contains |
|------|-----------------|
| `design/canvas/[screen-name]-brief.md` | One complete brief per screen |

## Rules

- **Hard dependencies are non-negotiable.** Do not produce briefs without IA, interaction, visual, and content artifacts.
- Canvas briefs are the **single source of truth** for Figma execution. If the brief says "Save changes," Figma uses "Save changes."
- One brief per screen. Sub-views (tabs, panels) are sections within the same brief.
- Briefs must be **self-contained** — a reader can build the screen from the brief alone.
- When upstream artifacts conflict, flag and resolve the conflict in the brief before proceeding.
- Update briefs when upstream artifacts change. Briefs are living documents.

## Feeds into

- **Figma Page Setup** — page name, sub-frame structure
- **Figma Components** — what to build, with which variants, states, and TEXT properties
- **Figma Tokens** — which tokens to apply
- **Figma Audit** — acceptance criteria become verification checks
