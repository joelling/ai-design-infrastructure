---
operation: ingest
---

# Foundation Library

> **Tier 4 — Continuous (Tier 3 bootstrap)** | Mode: `design-foundation-library` (umbrella)
>
> Sub-skills: `figma-tokens`, `figma-component`, `figma-parking-lot`, `figma-inventory`, `figma-audit`, `figma-docs`, `figma-library-mode`
>
> The Figma library is a continuous artifact. Bootstrap once from Tier 3 visual + content direction. Then grow with every sprint as new components are needed and as designers discover gaps in their per-sprint work.

## Mental model

The Figma library is the *durable* design surface. Per-sprint Figma files (owned by `design-screen-compose`) are *disposable* — they're scratch space for this sprint's screens. The library is what persists, what publishes, and what every sprint consumes from.

Two phases mirror the lifecycle pattern of `design-research` and `design-governance`:

- **Phase A (Bootstrap):** Runs once, after Tier 3 `design-visual` and `design-content` complete. Creates the 3-file DLS architecture, sets up the full token system, scaffolds the parking lot intake area.
- **Phase B (Continuous):** Runs throughout the project lifecycle, triggered by new component needs surfaced from canvas briefs, `figma-screen-compose` `[MISSING]` placeholders, or designer-introduced overrides classified by `figma-handoff`.

This mode does not own per-sprint screen building — that is `design-screen-compose`. It owns the *parts* (tokens, components, library files) that `design-screen-compose` *assembles*.

## Position in the Tier 4 architecture

```
Tier 3 visual + content ──► design-foundation-library Phase A (bootstrap)
                                       │ publishes
                                       ▼
                            ┌──────────────────────────┐
                            │ Foundation, Components,  │  ← consumed by design-screen-compose
                            │ Icons & Illustrations    │     (per-sprint instances)
                            │ DLS files                │
                            └────────┬─────────────────┘
                                     │ publishes
                                     ▼
                            ┌──────────────────────────┐
                            │ design-component-library       │  ← downstream code-side mirror
                            │ Phase A or Phase B       │
                            └──────────────────────────┘

design-screen-compose intake ──► design-foundation-library Phase B (continuous)
designer override intake ──┘
```

## Phase A — Bootstrap

Runs once. Triggered by Tier 3 completion of `design-visual` and `design-content`.

### Inputs
- `design/08_VISUAL/visual-language.md` — color, typography, spacing, iconography rationale
- `design/09_CONTENT/terminology.md` — canonical labels, voice/tone (informs documentation pages)
- `design/12_GOVERNANCE/` — versioning, contribution rules, deprecation policy from `design-governance` Phase A
- (Optional) memory: `Foundation Figma analysis` (page naming, variable collections, layout patterns)

### Outputs
- **3-file DLS architecture published in Figma:**
  - `Foundation – [Project] DLS` — variables, styles, documentation pages
  - `Icons & Illustrations – [Project] DLS` — icon sets, illustration assets
  - `Components – [Project] DLS` — UI components, atoms → templates
- Full 3-level token system in Foundation (Primitives → Semantic → Component) across the 8 numbered variable collections (Colour Styles, Colour Tokens, Spacing, Typography, Icon Sizes, Radius, Stroke, Elevation)
- Parking lot intake area scaffolded in Components DLS
- `design/12_GOVERNANCE/inventory.md` initialised with bootstrap entries
- `_upstream.md` recording consumed Tier 3 versions

### Workflow
1. **`figma-connect`** — establish bridge to Figma
2. **`figma-file-setup`** (DLS variant) — create the 3 DLS files if they do not exist
3. **`figma-tokens`** — build the full 3-level token system from `design-visual` rationale
4. **`figma-component`** (initial seed) — create the foundational component set (typography, button, input, layout primitives) needed for first sprint
5. **`figma-parking-lot`** — scaffold the intake area in Components DLS
6. **`figma-docs`** — create initial documentation pages for tokens and seed components
7. **`figma-inventory`** — record bootstrap entries with `lifecycle: published`

After Phase A publishes, **trigger `design-component-library` Phase A** so the code-side library can mirror the Figma library from day one.

## Phase B — Continuous

Runs throughout the lifecycle. No fixed cadence — triggered by component need.

### Triggers
- Canvas brief references a component not yet in the library
- `figma-screen-compose` drops a `[MISSING]` placeholder and writes an inventory `draft` entry with `requested_by: design-screen-compose`
- `figma-handoff` classifies a designer override as introducing a new component (designer manually built something that should be promoted to the library)
- Designer manually flags a component for promotion via parking lot
- Token revision needed (e.g., color scale extension, new spacing step)
- Library reorganisation phase (semi-annual)

### Workflow
1. **`figma-connect`** — establish bridge
2. **Intake routing** — scan inventory `draft` queue + parking lot for pending items. Triage:
   - Promote (becomes a real library component)
   - Defer (needs more occurrences before promotion)
   - Reject (one-off; document in inventory as `lifecycle: rejected`)
3. **`figma-tokens`** (if needed) — add or revise tokens before component creation
4. **`figma-component`** — create or revise the component, bind to tokens, create variants
5. **`figma-inventory`** — update lifecycle from `draft` → `published`; record `triggering_screen` and `requested_by`
6. **`figma-audit`** — run before any library migration phase
7. **`figma-docs`** — update documentation pages for changed components
8. **`figma-library-mode`** — run only during library reorganisation phases

After any component publishes, **trigger `design-component-library` Phase B** so the code-side mirror stays in sync.

## Parking lot — intake queue

Re-scoped from earlier process versions. The parking lot is the **visual intake surface** within the Components DLS file where:

1. `figma-handoff` deposits unfamiliar nodes detected in sprint files (designer built something new during composition)
2. Designers manually park a node they want promoted to a library component
3. `design-screen-compose` `[MISSING]` placeholders surface as inventory `draft` entries that visually correspond to parked items

Phase B triages the parking lot. Items move from parking lot → component creation → publication, or from parking lot → rejected (with reason).

## Token revision propagation

When `figma-tokens` revises a token value:

1. Bump variable version in Foundation DLS
2. Append entry to `design/12_GOVERNANCE/inventory.md` with `revision_reason`
3. Trigger `design-component-library` Phase B (token sync)
4. `figma-audit` re-runs against affected components on next session
5. Notify `design-prototype` of pending visual drift

## Component lifecycle

| Lifecycle state | Meaning |
|---|---|
| `draft` | Component need surfaced (from intake or designer); not yet built in library |
| `in-progress` | Being built in library; not yet published |
| `published` | Available in library; can be instantiated by `design-screen-compose` |
| `revised` | Published but recently modified; downstream sync may be pending |
| `deprecated` | Still in library but slated for removal; new compositions should not use |
| `rejected` | Intake reviewed and decided not to promote; one-off; documented |

`figma-inventory` tracks transitions. `design-lint` flags components stuck in `draft` or `in-progress` for >N days.

## Hard rules

- **The library is the durable artifact.** Sprint files are disposable. Never store reusable components in sprint files.
- **All components in `Components – [Project] DLS` must bind only to tokens published in `Foundation – [Project] DLS`.**
- **No hardcoded values in any library component.**
- **All library frames use auto-layout.**
- **Every reusable element is a component (`createComponent`, not `createFrame`).**
- **Variable collections follow the 8 numbered convention** (Colour Styles, Colour Tokens, Spacing, Typography, Icon Sizes, Radius, Stroke, Elevation).
- **Token aliases follow the 3-level chain** (Component → Semantic → Primitives). Never raw values at semantic or component level.
- **Parking lot items must have inventory entries** before they are promoted to components.
- **Library publication triggers `design-component-library` Phase B** — Figma library is the source of truth for the code mirror; never the reverse.

## Outputs

- 3 DLS files: Foundation, Icons & Illustrations, Components (published Figma libraries)
- `design/12_GOVERNANCE/inventory.md` — component & token lifecycle log (extended schema includes `published_in_code`, `code_component_path` populated by `design-component-library`)
- Documentation pages within Foundation DLS (token tables, usage guides)
- `_upstream.md` recording consumed Tier 3 versions and intake sources

## Sync workflow

```bash
node design/scripts/sync-version.js init <inventory> design-foundation-library
node design/scripts/sync-version.js bump <inventory>
node design/scripts/sync-manifest.js design-foundation-library
```

## Designer review checkpoints

| Where | What designer does |
|---|---|
| End of Phase A | Approve token system + foundational component set; sign off bootstrap |
| Phase B intake triage | Decide promote / defer / reject for each parking lot item |
| Token revision | Approve before propagation to `design-component-library` |
| Library migration phase | Approve before `figma-library-mode` reorganisation runs |
| Audit findings | Decide which violations to fix vs. accept |

## Relationship to neighbouring modes

| Mode | Relationship |
|---|---|
| `design-visual` | Hard upstream for Phase A — color/typography/spacing rationale becomes tokens |
| `design-content` | Hard upstream for Phase A — terminology informs documentation; component TEXT defaults |
| `design-governance` | Lateral — Phase A reads governance framework (versioning, deprecation policy); Phase B feeds back recurring pattern signals |
| `design-canvas` | Lateral — briefs reference library components; component absence triggers Phase B intake |
| `design-screen-compose` | Hard downstream consumer — sprint files instantiate from this mode's published library; missing-component placeholders route back via intake |
| `design-component-library` | Direct downstream — every publication and token revision triggers code-side sync |
| `design-prototype` | Indirect downstream — prototype consumes code library mirror; component lifecycle changes propagate via `design-component-library` |
| `figma-handoff` | Lateral — classifies designer overrides; routes unfamiliar nodes to this mode's parking lot |
| `design-lint` | Cross-cutting — flags stuck `draft`/`in-progress` components, untoken'd values in library, code-mirror parity gaps |
| `design-query` | Cross-cutting — library and inventory added to queryable corpus |

## Triggers

- Tier 3 `design-visual` + `design-content` complete (first time) → Phase A
- Phase A complete → trigger `design-component-library` Phase A
- Canvas brief or `design-screen-compose` `[MISSING]` queues a component → Phase B intake
- `figma-handoff` classifies designer override as new component → Phase B intake
- Token revision needed → Phase B
- Component publishes → trigger `design-component-library` Phase B
- Library reorganisation phase scheduled → Phase B with `figma-library-mode`

## Figma MCP options

Phase A and Phase B both use **figma-console MCP** (plugin-based, full Plugin API) for all library construction. The official Figma MCP is not used by this mode but is referenced by `design-component-library` for Code Connect workflows.

## Shared Figma API constraints

All `figma-*` sub-skills reference `.claude/skills/_figma-api-rules.md`.
