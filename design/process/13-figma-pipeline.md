# Chapter 13: Figma Execution Pipeline

> **Tier 4 — Develop** | Modes: `figma-*`
>
> This chapter summarizes the existing Figma skill pipeline. For detailed instructions, see each skill's SKILL.md file. Canvas briefs feed INTO this pipeline, and Figma screens feed OUT to the coded prototype. All three form the Develop sync loop.

## Mandatory order

1. **figma-connect** — always first, every session
2. **figma-file-setup** — if file is new or missing standard pages
3. **figma-tokens** — before placing any design element
4. **figma-page-setup** — before drawing on any new screen
5. **figma-component** — for every UI element built
6. **figma-parking-lot** — at the end of each completed page
7. **figma-audit** — before library migration
8. **figma-library-mode** — library migration phase only

## Upstream sync

Figma skills consume upstream design artifacts (canvas briefs, visual specs, interaction models, etc.). The Tier 4 sync loop (canvas ↔ Figma ↔ prototype) already handles drift within the Develop phase. The upstream sync protocol extends this awareness to Tier 1-3 artifacts:

**On session start (via figma-connect):** Check whether upstream design artifacts have changed since the last Figma session. Compare canvas brief sync hashes and upstream artifact versions. If upstream modes have updated (e.g., visual spec revised, new interaction states added), report what's stale and ask the designer whether to update affected Figma screens.

**On completion of any Figma skill:** If Figma screens were modified, report which downstream modes are now potentially stale (prototype).

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

## Position in the Develop loop

Figma is one of three nodes in the Tier 4 sync loop:

```
Canvas Brief ◄──sync──► Figma Screens ◄──sync──► Prototype
     ▲                                                │
     └────────────────── sync ────────────────────────┘
```

Figma is authoritative for **visual execution** — layout, component implementation, and token application. The canvas brief provides intent; the prototype consumes Figma's visual output.

### Sync rules for Figma

| Change type | Behavior |
|---|---|
| Content/label change in brief | Auto-update Figma TEXT properties to match |
| State added/removed in brief | Auto-add/remove component variants |
| Visual tweak made in Figma | Auto-sync to prototype. Brief notes delta. |
| Structural change made in Figma | Flag drift — designer approves direction, brief updates first |
| Prototype improvement approved | Update Figma screens to match |

### Sync awareness in Figma skills

- **figma-page-setup** — before setting up a page, check the canvas brief's sync hash. If stale, run drift detection first.
- **figma-component** — after creating or modifying components, generate a sync hash for the manifest.
- **figma-audit** — include drift detection as an audit check (Figma vs. brief, Figma vs. prototype).

## File architecture

- `[Project] - Working` → active design canvas (screens, flows)
- `[Project] - Core Library` → all tokens + atoms + molecules (published)
- `[Project] - Patterns` → organisms + templates (created when Core Library grows)
