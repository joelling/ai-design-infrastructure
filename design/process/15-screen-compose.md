---
operation: ingest
---

# Screen Composition

> **Tier 4 — Develop sequential** | Mode: `design-screen-compose` (umbrella)
>
> Sub-skills: `figma-connect`, `figma-handoff`, `figma-file-setup`, `figma-page-setup`, `figma-screen-compose`
>
> The per-sprint Figma workflow. Reads canvas briefs (intent), composes screens by placing instances of components published by `design-foundation-library`, writes composition logs as evidence. Does not create components or tokens — those are owned by `design-foundation-library`.

## Mental model

Screen composition is *assembly*, not *fabrication*. The Figma library (owned by `design-foundation-library`) supplies the parts. The canvas brief (owned by `design-canvas`) supplies the assembly instructions. This mode places the parts into per-sprint Figma files and records what got built.

The unit of work is a **sprint**, not a screen. One Figma file per sprint. Pages within the file map to epics from the BRD/story map. Screens within pages are composed from canvas briefs in walking-skeleton order.

When composition discovers a component the library does not yet have, the workflow does not block — it drops a `[MISSING]` placeholder, files an intake entry to `design-foundation-library`, and continues. Resolution is `design-foundation-library`'s responsibility, not this mode's.

## Position in the Tier 4 pipeline

```
                            ┌──────────────────────────┐
                            │ design-foundation-library│  ← upstream publisher (continuous)
                            │ (Figma library)          │
                            └────────┬─────────────────┘
                                     │ instances consumed
                                     ▼
   Canvas Brief ──► ASCII Wireframe ──► Figma Screens ◄──sync──► Prototype
   (intent)        (validation gate)    (this mode)              (interaction fidelity)
        ▲                                                              │
        └──────────────── sync loop (per sprint) ──────────────────────┘
```

`design-screen-compose` is the **Figma Screens** node. It consumes from `design-foundation-library` (library instances) and `design-canvas` (intent). Sync within the per-sprint loop with `design-prototype` is bidirectional per the rules in [Develop loop sync rules](#develop-loop-sync-rules).

## Mandatory order (per-sprint session)

1. **`figma-connect`** — always first, every session. Establishes plugin bridge, validates open file, captures session metadata.
2. **`figma-handoff`** — detect any designer changes since last session. Classify into two streams:
   - Changes *within sprint files* (overrides, content edits) → propose canvas brief edits as commented blocks; designer approves.
   - Changes *introducing new components* (new node not in library) → push to `design-foundation-library` parking lot intake queue.
3. **`figma-file-setup`** — if starting a new sprint and no sprint file exists, create one. **One file per sprint.** Standard pages: Sitemap, Cover, then one page per epic.
4. **`figma-page-setup`** — for each new epic page, scaffold artboards with auto-layout Header/Content/Footer/STAGING frames bound to tokens.
5. **`figma-screen-compose`** — Two-phase per screen:
   - **Phase A (Plan):** Read brief sections 4–8, 12. Build per-section composition plan. Identify gaps (missing components, ambiguous content). Designer approves before any mutation.
   - **Phase B (Execute):** Wrapper-frame-first. Section-by-section instantiation with per-section screenshot review. Append to composition log. Stop at 3-iteration cap per section for forced designer review.

## File architecture (per project)

| File | Purpose | Owner |
|---|---|---|
| `[Project] - Sprint NN` | Active sprint workspace (1 file per sprint, pages per epic) | `design-screen-compose` |
| `Foundation – [Project] DLS` | Variables, styles, documentation pages | `design-foundation-library` |
| `Icons & Illustrations – [Project] DLS` | Icon sets, illustration assets | `design-foundation-library` |
| `Components – [Project] DLS` | Published component library | `design-foundation-library` |

The 3 DLS files are durable, owned by `design-foundation-library`. Sprint files are the per-sprint working surface owned by this mode. Sprint files consume the DLS libraries via Figma's Library publishing mechanism — they are clients, not authorities.

## Two-phase screen composition (Plan/Execute)

Composition mirrors the Phase A/B pattern used by `design-canvas`, `design-research`, `design-governance`, `design-query`, `design-foundation-library`, `design-component-library`. The split exists because designer review of intent reconciliation must happen before shared Figma state is touched.

### Phase A — Plan (read-only)

Read the canvas brief. Build a composition plan section by section:

- **Section identity:** which Header/Content sub-section is being composed
- **Component matrix:** which library components will be instantiated, with property override values from the brief
- **Gap report:** components referenced by brief but not in library (queued for `design-foundation-library` intake), token gaps, ambiguous content
- **Story annotations:** story IDs from brief Section 2 to be displayed via optional `[ANNOTATION] Stories` frame

Designer reviews and approves before Phase B mutates Figma. Approval can edit brief MD, accept deviation, or abort.

### Phase B — Execute (mutates Figma)

Wrapper-frame-first to prevent silent reparenting failures across `figma_execute` boundaries. For each section in the plan:

1. Create the wrapper frame inside Content with auto-layout
2. Instantiate library components in order
3. Apply property overrides via `setProperties` only — never raw `node.characters`
4. Capture per-section screenshot
5. Designer accepts / nudges / re-plans / aborts

Append to `design/15_FIGMA/composition-logs/{ScreenID}_composition-log.md` after each successful section. The log is append-only and versioned with sync-hash.

## Missing-component handling (no block)

When a brief-referenced component is not present in the published library:

1. Drop a labeled `[MISSING] {ID}` placeholder frame in the slot.
2. Hand off to `design-foundation-library` intake: append a `draft` entry to `design/12_GOVERNANCE/inventory.md` with `triggering_screen` and `requested_by: design-screen-compose`.
3. Continue composing the rest of the screen.

`design-foundation-library` Phase B is responsible for triaging and resolving these intake entries via parking lot → component creation → publication. This mode never creates components.

## Develop loop sync rules

Composition introduces an asymmetry between intent (canvas brief) and evidence (composition log) that the rest of the per-sprint loop must honour:

| Direction | Trivial change (content/label/state) | Structural change |
|---|---|---|
| **Canvas → Figma → Prototype** | Auto-sync (existing rule) | Flag drift, designer approves |
| **Figma → Canvas (via composition log)** | **Always require approval** — proposed brief edit written as commented block at end of brief MD | **Always require approval** |

Rationale: composition log is *evidence*; brief is *intent*. Auto-merging trivial Figma drift back into the brief erodes the brief's role as the single source of truth.

## Wireframe review gate

Before starting Phase A for a screen, check whether wireframe review has been completed for that screen. If `design/14_WIREFRAMES/manifest.md` shows the screen's review status as "pending" or no wireframe exists, **warn** the designer that structural validation hasn't happened yet. Soft gate — designer can proceed with conscious decision.

## Upstream sync

**On session start (via `figma-connect`):** Check whether upstream artifacts have changed since the last session. Compare canvas brief sync hashes against composition log sync hashes. Compare `design-foundation-library` library publication timestamps against last consumed version. If upstream has updated, report what's stale and ask whether to re-compose affected screens.

**On completion of any composition session:** Report which downstream modes are now potentially stale (`design-prototype`).

## Hard rules

- **Library instances only** — published `Components – [Project] DLS`. No local components, no parking-lot draft components.
- **No hardcoded values** — inherited from variables on published components.
- **Parent and child auto-layout everywhere** — no absolute positioning.
- **One file per sprint.** Pages within the file map to epics from BRD/story map.
- **Linked-library token discovery** — never rely on local-only variable queries.
- **Wrapper frame first** — prevents silent reparenting failures.
- **Property overrides via `setProperties`** — never raw `node.characters` (placeholder text leaks).
- **Per-section screenshots** — full-page screenshots hide truncation and overlap.
- **No new components in this mode** — delegate to `design-foundation-library` via intake.
- **No brief auto-edit** — proposed changes written as commented blocks for designer approval.
- **Composition log is append-only.**
- **3-iteration cap per section** — forces designer review on persistent failure.

## Outputs

- Mutated sprint Figma file (component instances placed in wrapper frames within Content sub-frames)
- Optional `[ANNOTATION] Stories` frame per artboard listing story IDs from brief Section 2
- `design/15_FIGMA/composition-logs/{ScreenID}_composition-log.md` — append-only, versioned with sync-hash
- `design/12_GOVERNANCE/inventory.md` `draft` entries for missing components (with `triggering_screen` + `requested_by: design-screen-compose`)
- Commented-block proposed brief edits at the bottom of `design/13_CANVAS_BRIEFS/{ScreenID}_*.md` (never auto-applied)

## Sync workflow

```bash
node design/scripts/sync-version.js init <log-file> design-screen-compose
node design/scripts/sync-version.js bump <log-file>
node design/scripts/sync-manifest.js design-screen-compose
node design/scripts/sync-composition.js
```

`sync-composition.js` validates: every composition log references a real canvas brief; every `[MISSING]` placeholder has a matching inventory `draft` entry routed to `design-foundation-library`; every brief edit proposal is still commented (not yet accepted); brief sync-hash at composition time matches a real brief revision.

## Designer review checkpoints

| Where | What designer does |
|---|---|
| End of Phase A (per screen) | Approve plan / edit brief MD / accept deviation / abort |
| Per section in Phase B | Accept screenshot / nudge / re-plan section / abort |
| 3-iteration cap | Forced designer review |
| End of Phase B (per screen) | Decide which downstream skills to invoke based on back-pressure summary |
| Brief edit proposals | Edit brief MD directly to accept proposals |
| Inventory `draft` queue | `design-foundation-library` Phase B picks up via intake routing |

## Relationship to neighbouring modes

| Mode | Relationship |
|---|---|
| `design-canvas` | Hard upstream — provides brief intent. Composition log proposes brief edits (commented blocks). |
| `design-wireframe` | Soft-gate at Phase A entry — warn if wireframe is absent. |
| `design-foundation-library` | Hard upstream publisher — supplies library instances. Receives intake from missing-component handling. Lateral handoff via parking lot. |
| `design-component-library` | Indirect downstream — code prototype consumes code-side library that mirrors Figma library; composition does not write to code library. |
| `design-prototype` | Per-sprint sync loop peer. Reads composition log for "why this layout" disambiguation. |
| `design-governance` Phase B | Consumes pattern reports + intake-queue cluster for Template promotion + DS roadmap. |
| `design-lint` | New checks: brief↔composition log sync, orphan compositions, deviation backlog age, missing-component queue age. |
| `design-query` | Composition logs added to the queryable corpus. |

## Triggers

- New sprint starting → `figma-file-setup` (creates sprint file, epic pages)
- Canvas brief exists, page is set up, screen is empty → `figma-screen-compose` Phase A
- Phase A approved → Phase B
- Brief revised and re-saved → re-run Phase A on affected screens (sync-hash diff)
- Batch UI workload starting (multiple screens) → Phase A in batch mode for pattern report
- Designer fine-tuned in Figma between sessions → next `figma-handoff` classifies overrides; routes new components to `design-foundation-library` intake
- Mid-stream missing component → no block; placeholder + intake routing to `design-foundation-library`

## Figma MCP options

This mode uses the **figma-console MCP** (plugin-based, full write access via Plugin API) for all composition work. The official Figma MCP (REST-based, code-extraction focused) is not used here — see `17-foundation-library.md` for its role in `design-component-library` Code Connect workflows.

## Shared Figma API constraints

All `figma-*` sub-skills under this mode reference `.claude/skills/_figma-api-rules.md` — a shared document of Figma Plugin API limitations, safe patterns, and known workarounds. Designers do not need to read this file — it informs AI behavior when executing Figma code.
