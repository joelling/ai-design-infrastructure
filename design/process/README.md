# Design Process

> **This is a read-only reference.** Designers read these files to understand the process, diagnose issues, and decide on improvements. To make changes, tell Claude what to change — Claude will update the process files and propagate changes to all skill files and CLAUDE.md automatically.

---

## How to use this process guide

This directory describes the complete design process — from understanding the problem to building interactive prototypes. It is organized into numbered chapters that represent distinct modes of design thinking.

**If you're starting a new project:** Read from `01-discovery.md`. Follow the chapters in order.

**If something isn't working:** Find the chapter that covers that part of the process. Read the mental model and process steps. Identify what's off. Tell Claude what to change.

**If you want to understand how a design decision was made:** Trace it back through the chapters. Every decision should connect to a persona, a story, or a design principle documented here.

---

## Chapters

| # | File | Mode | Tier |
|---|------|------|------|
| 00 | [Skill Architecture](00-skill-architecture.md) | Meta | — |
| 01 | [Discovery](01-discovery.md) | `design-discovery` | 1 — Discovery |
| 02 | [User Models](02-user-models.md) | `design-user-models` | 1 — Discovery |
| 03 | [Journey Mapping](03-journeys.md) | `design-journeys` | 2 — Definition |
| 04 | [User Story Mapping](04-stories.md) | `design-stories` | 2 — Definition |
| 05 | [Information Architecture](05-ia.md) | `design-ia` | 2 — Definition |
| 06 | [Interaction Design](06-interaction.md) | `design-interaction` | 3 — Design |
| 07 | [Visual Design](07-visual.md) | `design-visual` | 3 — Design |
| 08 | [Content Strategy](08-content.md) | `design-content` | 3 — Design |
| 09 | [Accessibility](09-accessibility.md) | `design-accessibility` | 3 — Design |
| 10 | [Design Validation](10-validation.md) | `design-validation` | 3 — Design |
| 11 | [Design System Governance](11-governance.md) | `design-governance` | 3 — Design |
| 12 | [Design-to-Canvas Synthesis](12-canvas.md) | `design-canvas` | 4 — Develop |
| 13 | [Figma Execution Pipeline](13-figma-pipeline.md) | `figma-*` | 4 — Develop |
| 14 | [Coded Prototype](14-prototype.md) | `design-prototype` | 4 — Develop |

---

## Process overview

The design process flows through four tiers of thinking, each building on the previous:

```
TIER 1: DISCOVERY          → Understand the problem and who has it
TIER 2: DEFINITION         → Structure what to build (tech/UI agnostic)
TIER 3: DESIGN             → Decide how it looks, feels, behaves, and reads
TIER 4: DEVELOP            → Build screens, prototype, and keep everything in sync
```

### The Develop loop (Tier 4)

Tier 4 is not a linear pipeline — it is a **sync loop** between three nodes:

```
Canvas Brief ◄──sync──► Figma Screens ◄──sync──► Prototype
     ▲                                                │
     └────────────────── sync ────────────────────────┘
```

Each node owns different concerns:
- **Canvas Brief** — intent, structure, content, accessibility (aggregated from upstream)
- **Figma Screens** — visual execution, layout, component implementation
- **Prototype** — interaction fidelity, flow validation, responsive behavior

Changes propagate bidirectionally. Small changes (content, labels, states, visual tweaks) auto-sync. Structural changes (new components, reordered layouts) flag drift and require designer approval before propagating.

### Ordering philosophy

Tiers suggest a natural flow, but modes within them are **flexible with guardrails**:

- Modes can be invoked in any order based on project needs
- Each mode warns if its upstream dependencies don't have artifacts yet
- The designer decides whether to proceed or complete upstream work first
- **Hard blocks exist at the Develop boundary:** `design-canvas` requires IA, interaction, visual, and content artifacts before it can produce screen briefs
- **Hard blocks exist at the Figma boundary:** no screen gets built without a canvas brief
- **Hard blocks exist at the Prototype boundary:** no screen gets prototyped without a Figma implementation

### Why this ordering matters

Discovery first because you can't design for users you don't understand. Definition next because you can't design screens for stories you haven't mapped. Design third because visual, interaction, and content decisions need structural context. Develop last because it builds on everything above — and the sync loop keeps all three representations aligned as the design evolves.

But real projects aren't linear. You might start visual exploration early to test a brand direction. You might revisit personas after journey mapping reveals edge cases. The tiers are a guide, not a cage.

---

## Artifact storage

All design outputs go into the `design/` directory at the project root:

```
design/
  process/                             ← this directory (process specification)
  01-discovery/                           ← Tier 1
  02-user-models/                         ← Tier 1
    personas/
    empathy-maps/
  03-journeys/                            ← Tier 2
    task-flows/
  04-stories/                             ← Tier 2
  05-ia/            ← Tier 2
  06-interaction/                         ← Tier 3
  07-visual/                              ← Tier 3
  08-content/                             ← Tier 3
  09-accessibility/                       ← Tier 3
  10-validation/                          ← Tier 3
  11-governance/                          ← Tier 3
  12-canvas/                              ← Tier 4
  13-prototype/                           ← Tier 4 (code + manifest + drift log)
```

Each chapter specifies exactly which files it produces and where.

---

## Non-negotiable principles

These rules span the entire process. They are not suggestions.

1. **Journeys and stories are tech and UI agnostic.** No screen names, no button labels, no UI patterns. Describe what users do and experience.

2. **Canvas briefs are the single source of truth for intent.** The brief says it, Figma builds it, the prototype implements it. No improvisation without approval.

3. **Every design decision traces back.** To a persona, a story, or a design principle. If you can't trace it, question it.

4. **No Figma screen without a canvas brief.** Exception: exploratory prototyping, clearly labeled as such.

5. **No prototype screen without a Figma implementation.** Exception: exploratory spikes, clearly labeled.

6. **Accessibility is built in, not bolted on.** WCAG AA minimum. Keyboard-operable. Contrast-compliant. Screen reader-friendly.

7. **No hardcoded values in Figma.** Every color, spacing, and radius references a variable.

8. **The domain glossary and terminology guide are canonical.** One term, one label, everywhere.

9. **The Develop loop stays in sync.** Drift between canvas briefs, Figma screens, and prototype is detected and resolved — auto-sync for small changes, designer approval for structural changes.
