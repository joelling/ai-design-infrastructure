---
operation: ingest
---

# Screen Composition — Canvas Brief → Figma Screens

> **Tier 4 — Develop** | Mode: `figma-screen-compose`
>
> Fills the gap between `figma-page-setup` (which scaffolds empty Header/Content/Footer frames) and `design-prototype` (which assumes screens are composed). Two-phase: Plan (read-only) then Execute (mutates Figma + writes composition log).

## Mental model

`figma-page-setup` produces *infrastructure* — empty token-bound auto-layout frames waiting for content. `figma-component` produces *parts* — components staged to the left of the artboard. Neither owns the **placement** of those parts into those frames, with property overrides driven by the canvas brief. That ownership is what this mode adds.

The canvas brief carries the intent (Sections 4 layout hierarchy, 5 components needed, 6 states, 7 content, 8 visual spec, 12 breakpoint notes). This mode reads the brief, instantiates published-library components into the wrapper frame inside Content, applies property overrides via `setProperties`, and writes a composition log capturing exactly what got built and why.

## Two phases

| Phase | Touches Figma? | Purpose |
|---|---|---|
| **Phase A — Plan** | No (read-only) | Build per-section composition plan + gap report. Designer reviews and approves before any mutation. |
| **Phase B — Execute** | Yes (mutates) | Wrapper-first; section-by-section instantiation with per-section screenshot review. Composition log appended. |

The split mirrors `design-canvas`, `design-research`, `design-governance`, `design-query` — designer reviews intent reconciliation before shared state is touched.

## Position in the Tier 4 pipeline

```
Canvas Brief ──► ASCII Wireframe ──► Figma (page-setup → component → screen-compose) ◄──sync──► Prototype
                 (validation gate)                          ▲                                          │
                                                            └─────────── sync ─────────────────────────┘
```

The wireframe is still the validation gate (disposable, archived when Figma starts). The sync loop remains three nodes (Canvas ↔ Figma ↔ Prototype). Within the Figma node, screen-compose is the moment intent becomes pixels.

## Develop loop sync — asymmetric direction rules

Composition introduces an asymmetry that the rest of the Develop loop must honour:

| Direction | Trivial change (content/label) | Structural change |
|---|---|---|
| **Canvas → Figma → Prototype** | Auto-sync (existing rule) | Flag drift, designer approves |
| **Figma → Canvas (via composition log)** | **Always require approval** — proposed brief edit written as commented block at end of brief MD | **Always require approval** |

Rationale: composition log is *evidence*; brief is *intent*. Auto-merging trivial Figma drift back into the brief erodes the brief's role as the single source of truth.

## Hard rules

- **Library instances only** (published Components DLS). No local, no parking-lot.
- **No hardcoded values** — inherited from variables on published components.
- **Parent and child auto-layout everywhere** — no absolute positioning.
- **Linked-library token discovery** — never rely on local-only variable queries.
- **Wrapper frame first** — prevents silent reparenting failures across `figma_execute` boundaries.
- **Property overrides via `setProperties`** — never raw `node.characters` (placeholder text leaks).
- **Per-section screenshots** — full-page screenshots hide truncation and overlap.
- **No new components** — delegates to `figma-component`. Drops `[MISSING]` placeholder + writes inventory `draft` entry instead.
- **No brief auto-edit** — proposed changes written as commented blocks for designer approval.
- **Composition log is append-only.**
- **3-iteration cap per section** — forces designer review on persistent failure.

## Missing-component handling (no block)

When a brief-referenced component is not `published`:

1. Drop a labeled `[MISSING] {ID}` placeholder frame in the slot.
2. Append a `draft` entry to `design/12_GOVERNANCE/inventory.md` with two new fields: `triggering_screen` and `requested_by: figma-screen-compose`.
3. Continue composing the rest of the screen.

`figma-parking-lot` reads these `draft` entries and surfaces them as a needed-but-missing queue. `design-governance` Phase B clusters them across screens to spot Template promotion candidates.

## Backward propagation

Composition reveals brief gaps. The depth-of-reach matrix in `13-canvas.md` (lines 164–172) governs propagation upstream. Composition log entries are recognised as a back-pressure source equivalent to canvas synthesis findings.

## Outputs

- Figma file mutations (within wrapper frame inside the Content sub-frame)
- Optional `[ANNOTATION] Stories` frame next to the rightmost artboard, listing story IDs from brief Section 2
- `design/15_FIGMA/composition-logs/{ScreenID}_composition-log.md` — append-only, versioned with sync-hash
- `design/12_GOVERNANCE/inventory.md` `draft` entries for missing components (with `triggering_screen` + `requested_by`)
- Commented-block proposed brief edits at the bottom of `design/13_CANVAS/{ScreenID}_*.md` (never auto-applied)

## Sync workflow

```bash
node design/scripts/sync-version.js init <log-file> figma-screen-compose
node design/scripts/sync-version.js bump <log-file>
node design/scripts/sync-manifest.js figma-screen-compose
node design/scripts/sync-composition.js
```

`sync-composition.js` validates: every composition log references a real canvas brief; every `[MISSING]` placeholder has a matching inventory `draft` entry; every brief edit proposal is still commented (not yet accepted); brief sync-hash at composition time matches a real brief revision.

## Designer review checkpoints

| Where | What designer does |
|---|---|
| End of Phase A | Approve plan / edit brief MD / accept deviation / abort |
| Per section in Phase B | Accept screenshot / nudge / re-plan section / abort |
| 3-iteration cap | Forced designer review |
| End of Phase B | Decide which downstream skills to invoke based on back-pressure summary |
| Brief edit proposals | Edit brief MD directly to accept proposals |
| Inventory `draft` queue | Invoke `figma-component` to resolve missing components |

## Relationship to neighbouring modes

| Mode | Relationship |
|---|---|
| `design-canvas` | Composition log is the canonical evidence of Figma execution. Deviations propose brief edits (commented blocks). |
| `design-wireframe` | Soft-gate at Phase A entry — warn if wireframe is absent. |
| `figma-page-setup` | Hard upstream — Header/Content/Footer/STAGING frames must exist. |
| `figma-component` | Hard upstream for any in-brief component; lateral handoff for missing components surfaced during composition. |
| `figma-tokens` | Lateral — token gaps flagged for resolution. |
| `figma-parking-lot` | Reads `draft` entries with `requested_by: figma-screen-compose` as needed-but-missing queue. |
| `figma-handoff` | Classifies designer overrides against logged compositions on next session. |
| `figma-inventory` | New inventory fields: `triggering_screen`, `requested_by`. |
| `figma-audit` | Audits against composition log + brief acceptance criteria. |
| `design-prototype` | Reads composition log for "why this layout" disambiguation. |
| `design-governance` Phase B | Consumes pattern reports + needed-but-missing inventory cluster for Template promotion + DS roadmap. |
| `design-lint` | New checks: brief↔composition log sync, orphan compositions, deviation backlog age, missing-component queue age. |
| `design-query` | Composition logs added to the queryable corpus. |

## Triggers

- Canvas brief exists, page is set up, and the screen is empty → Phase A
- Phase A approved → Phase B
- Brief revised and re-saved → re-run Phase A on affected screens (sync-hash diff)
- Batch UI workload starting (multiple screens) → Phase A in batch mode for pattern report
- Designer fine-tuned in Figma → next session, `figma-handoff` classifies, composition log is updated
- Mid-stream missing component discovered → no block; placeholder + inventory `draft` + queue
