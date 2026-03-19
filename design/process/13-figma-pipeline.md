# Chapter 13: Figma Execution Pipeline

> **Tier 5 — Execution** | Modes: `figma-*`
>
> This chapter summarizes the existing Figma skill pipeline. For detailed instructions, see each skill's SKILL.md file. The design process feeds INTO this pipeline via canvas briefs — it does not replace it.

## Mandatory order

1. **figma-connect** — always first, every session
2. **figma-file-setup** — if file is new or missing standard pages
3. **figma-tokens** — before placing any design element
4. **figma-page-setup** — before drawing on any new screen
5. **figma-component** — for every UI element built
6. **figma-parking-lot** — at the end of each completed page
7. **figma-audit** — before library migration
8. **figma-library-mode** — library migration phase only

## How design artifacts feed Figma

| Design artifact | Figma skill | How |
|----------------|-----------|-----|
| IA sitemap | `figma-file-setup` | Screen list becomes Sitemap page |
| IA screen inventory | `figma-page-setup` | Each screen becomes a numbered Figma page |
| Visual rationale | `figma-tokens` | Color, typography, spacing values become tokens |
| Interaction state inventory | `figma-component` | States become component variants |
| Content patterns | `figma-component` | Text becomes component TEXT properties |
| A11y patterns | `figma-component` | Focus states, ARIA descriptions |
| Canvas briefs | All Figma skills | Single source of truth per screen |
| Validation checklist | `figma-audit` | Extends audit with UX-specific checks |

## Non-negotiable Figma rules

- ZERO hardcoded values — every fill, spacing, radius references a Figma variable
- ALL frames use auto-layout — no absolute positioning
- Every reusable element is a component (`createComponent`, not `createFrame`)
- Page naming: `[number] - [Screen Name]`
- Component staging area to the left of each artboard, cleared to Parking Lot when done

## File architecture

- `[Project] - Working` → active design canvas (screens, flows)
- `[Project] - Core Library` → all tokens + atoms + molecules (published)
- `[Project] - Patterns` → organisms + templates (created when Core Library grows)
