# Design Process

> **This is a read-only reference.** Designers read these files to understand the process, diagnose issues, and decide on improvements. To make changes, tell Claude what to change — Claude will update the process files and propagate changes to all skill files and CLAUDE.md automatically.

---

## How to use this process guide

This directory describes the complete design process — from understanding the problem to building screens in Figma. It is organized into numbered chapters that represent distinct modes of design thinking.

**If you're starting a new project:** Read from `01-discovery.md`. Follow the chapters in order.

**If something isn't working:** Find the chapter that covers that part of the process. Read the mental model and process steps. Identify what's off. Tell Claude what to change.

**If you want to understand how a design decision was made:** Trace it back through the chapters. Every decision should connect to a persona, a story, or a design principle documented here.

---

## Chapters

| # | File | Mode | Tier |
|---|------|------|------|
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
| 12 | [Design-to-Canvas Synthesis](12-canvas.md) | `design-canvas` | 4 — Synthesis |
| 13 | [Figma Execution Pipeline](13-figma-pipeline.md) | `figma-*` | 5 — Execution |

---

## Process overview

The design process flows through four tiers of thinking, each building on the previous:

```
TIER 1: DISCOVERY          → Understand the problem and who has it
TIER 2: DEFINITION         → Structure what to build (tech/UI agnostic)
TIER 3: DESIGN             → Decide how it looks, feels, behaves, and reads
TIER 4: SYNTHESIS           → Aggregate everything into screen-level briefs
         ↓
FIGMA EXECUTION            → Build the screens (existing pipeline)
```

### Ordering philosophy

Tiers suggest a natural flow, but modes within them are **flexible with guardrails**:

- Modes can be invoked in any order based on project needs
- Each mode warns if its upstream dependencies don't have artifacts yet
- The designer decides whether to proceed or complete upstream work first
- **Hard blocks exist only at the synthesis boundary:** `design-canvas` requires IA, interaction, visual, and content artifacts before it can produce screen briefs
- **Hard blocks exist at the Figma boundary:** no screen gets built without a canvas brief

### Why this ordering matters

Discovery first because you can't design for users you don't understand. Definition next because you can't design screens for stories you haven't mapped. Design third because visual, interaction, and content decisions need structural context. Synthesis last because it aggregates everything into the single document that drives Figma execution.

But real projects aren't linear. You might start visual exploration early to test a brand direction. You might revisit personas after journey mapping reveals edge cases. The tiers are a guide, not a cage.

---

## Artifact storage

All design outputs go into the `design/` directory at the project root:

```
design/
  process/                             ← this directory (process specification)
  discovery/                           ← Tier 1
  user-models/                         ← Tier 1
    personas/
    empathy-maps/
  journeys/                            ← Tier 2
    task-flows/
  stories/                             ← Tier 2
  information-architecture/            ← Tier 2
  interaction/                         ← Tier 3
  visual/                              ← Tier 3
  content/                             ← Tier 3
  accessibility/                       ← Tier 3
  validation/                          ← Tier 3
  governance/                          ← Tier 3
  canvas/                              ← Tier 4
```

Each chapter specifies exactly which files it produces and where.

---

## Non-negotiable principles

These rules span the entire process. They are not suggestions.

1. **Journeys and stories are tech and UI agnostic.** No screen names, no button labels, no UI patterns. Describe what users do and experience.

2. **Canvas briefs are the single source of truth for Figma.** The brief says it, Figma builds it. No improvisation.

3. **Every design decision traces back.** To a persona, a story, or a design principle. If you can't trace it, question it.

4. **No Figma screen without a canvas brief.** Exception: exploratory prototyping, clearly labeled as such.

5. **Accessibility is built in, not bolted on.** WCAG AA minimum. Keyboard-operable. Contrast-compliant. Screen reader-friendly.

6. **No hardcoded values in Figma.** Every color, spacing, and radius references a variable.

7. **The domain glossary and terminology guide are canonical.** One term, one label, everywhere.
