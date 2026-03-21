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

10. **Staleness is visible.** Every mode knows when its upstream has changed. Artifact versions are tracked, and no mode silently operates on outdated inputs.

---

## Artifact Sync Protocol

Changes to upstream artifacts ripple downstream. The sync protocol ensures every mode is aware of upstream changes, without requiring the designer to remember the dependency graph.

### Three mechanisms

1. **On-entry staleness check (automatic).** When any mode is invoked, it checks its `_upstream.md` manifest against current upstream artifact versions. If upstream has changed, it reports what's stale, classifies severity, and asks the designer whether to re-process.

2. **Post-change notification (automatic).** After any mode produces or updates artifacts, it reports which downstream modes are now potentially stale by scanning their manifests.

3. **Pipeline sweep (on-demand).** The designer asks "what's stale?" and the system scans all `_upstream.md` manifests to produce a full pipeline status report.

### Artifact versioning

Every output file from every mode carries a version comment as its first line:

```markdown
<!-- artifact: [path] | version: [N] | mode: [mode-name] | updated: [date] | evidence: [upstream-file@vN, ...] -->
```

### Dependency manifests

Each mode's output directory contains `_upstream.md` — a manifest tracking:
- Which upstream artifacts were consumed and at which versions
- Which artifacts were produced and at which versions
- Which downstream modes consume those artifacts

### Change classification

| Severity | Meaning | Example |
|---|---|---|
| **Additive** | New artifacts exist upstream that weren't consumed | New interview cleaned, new persona added |
| **Corrective** | Existing upstream artifacts were revised | Pain signal updated, metric corrected |
| **Structural** | Upstream fundamentals shifted | New user role, problem reframed, scope changed |

### Progressive confidence (User Models)

User models carry an explicit confidence tier (hypothetical → evidence-thin → evidence-grounded → validated) that reflects how much evidence supports them. As discovery inputs accumulate, confidence is promoted and the evidence trace updated. See Chapter 2 for details.

### Incremental updates

When re-processing with new upstream data, modes update incrementally — processing the delta, revising affected outputs, and leaving unaffected artifacts unchanged. Full rebuilds are reserved for structural changes.

### Automation scripts

Three CLI scripts in `design/scripts/` automate the error-prone parts of the sync protocol. Claude invokes them explicitly — no hooks, no watchers.

| Script | Usage | What it does |
|--------|-------|-------------|
| `sync-version.js` | `node design/scripts/sync-version.js <read\|init\|bump> <file> [mode]` | Read, initialize, or increment artifact version headers |
| `sync-manifest.js` | `node design/scripts/sync-manifest.js <mode-name>` | Scan a mode's inputs and outputs, write `_upstream.md` manifest |
| `sync-status.js` | `node design/scripts/sync-status.js` | Pipeline sweep — scan all manifests, detect staleness, report |

**Typical workflow:**
1. After completing a mode, run `sync-version.js init` or `bump` on each output file
2. Run `sync-manifest.js <mode>` to write the manifest
3. At any time, run `sync-status.js` to see the full pipeline status

Mode config (output dirs, inputs, downstream consumers) is defined in `design/scripts/modes.js`.

### Relationship to the Develop sync loop

The Tier 4 sync loop (canvas ↔ Figma ↔ prototype) operates within the Develop phase with sync hashes and drift detection. The Artifact Sync Protocol extends this awareness upward into Tiers 1-3, using the same principles (detect change, classify severity, report and ask) but adapted for the sequential nature of upstream modes.
