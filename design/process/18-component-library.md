---
operation: ingest
---

# Component Library

> **Tier 4 — Continuous (Tier 3 bootstrap)** | Mode: `design-component-library`
>
> The code-side mirror of the Figma library. Tokens transform via Style Dictionary; components are built once per published Figma component; the link between Figma and code is Code Connect when available, JSON manifest otherwise.

## Mental model

The Figma library (`design-foundation-library`) defines visual and structural truth. The code library mirrors it: every published Figma component should have a code counterpart with matching variants, props, and tokens. Tokens flow one direction only — Figma is authoritative; code is generated.

Two phases mirror `design-foundation-library`:

- **Phase A (Bootstrap):** Runs once after `design-foundation-library` Phase A publishes the Foundation file. Scaffolds the code library directory, initialises Style Dictionary, builds initial token output, scaffolds the chosen framework's component skeleton.
- **Phase B (Continuous):** Runs whenever the Figma library publishes new components or revises tokens. Pulls deltas, rebuilds tokens, generates or updates code components, refreshes Code Connect mappings or the JSON manifest, updates Storybook stories.

Technology is **a project decision, not a process decision** — same as `design-prototype`. The skill defines workflow, not stack. React, Vue, Svelte, Web Components, vanilla TypeScript — all valid. Style Dictionary is the canonical token transformer because it targets every framework.

## Code Connect is optional

Not all users have Figma plans that include Code Connect. The skill writes a JSON manifest (`figma-mapping.json`) as the universal bridge. When Code Connect is available, the skill *also* writes `.figma.tsx` Code Connect files for richer dev-mode integration. `design-prototype` reads either surface — the manifest first, Code Connect files as enrichment.

## Position in the Tier 4 architecture

```
design-foundation-library (Figma library)
       │ publishes Foundation, Components
       ▼
┌────────────────────────────┐
│ design-component-library         │
│ Phase A (bootstrap) /      │
│ Phase B (continuous)       │
└────────┬───────────────────┘
         │
         ├─► Style Dictionary token build
         ├─► Code components (chosen framework)
         ├─► figma-mapping.json (always)
         ├─► Code Connect .figma.tsx (if enterprise)
         └─► Storybook stories (optional)
                    │
                    ▼
         design-prototype (consumes code library)
```

## Phase A — Bootstrap

Runs once. Triggered by `design-foundation-library` Phase A publishing the Foundation file.

### Inputs
- `Foundation – [Project] DLS` (Figma file) — variables, styles
- `Components – [Project] DLS` (Figma file) — initial seed components
- `design/12_GOVERNANCE/inventory.md` — what's published in Figma
- (Designer choice at first invocation) — framework: React / Vue / Svelte / vanilla / Web Components

### Outputs
- `design/15_COMPONENT_LIBRARY/` directory scaffolded
  - `tokens/` — Style Dictionary source + build outputs (CSS vars, JS const, platform-specific)
  - `components/` — code component implementations in chosen framework
  - `code-connect/` — `.figma.tsx` files (only if Code Connect available)
  - `figma-mapping.json` — Figma node ID ↔ code component path (always written)
  - `storybook/` — story files (only if Storybook scaffolded)
  - `manifest.md` — what's published, version, build status
  - `_upstream.md` — manifest of consumed Figma library versions
- Style Dictionary config (`tokens/config.json` or equivalent)
- Initial token build output (`tokens/build/`)
- Foundational component code skeletons matching the seed components from `design-foundation-library` Phase A
- Initial `figma-mapping.json` populated with seed components

### Workflow
1. **Choose framework** — designer decides at first invocation; recorded in `manifest.md` `tech_stack` field (analogous to `design-prototype` tech selection)
2. **Scaffold directory** — copy `design/templates/library-code-manifest.tpl.md` and `figma-mapping.tpl.json` to their target paths
3. **Initialise Style Dictionary** — write `tokens/config.json` with the project's chosen platform targets (web/iOS/Android/etc.). Token source is the Figma variables exported via Tokens Studio plugin or REST API.
4. **First token build** — pull tokens from Figma, run Style Dictionary build, verify output matches Figma values
5. **Scaffold component skeletons** — for each seed component in `design-foundation-library` Phase A, generate a code skeleton with matching variants. Bind component styles to token CSS vars (or framework equivalent).
6. **Write `figma-mapping.json`** — map each seed Figma component node ID to its code path
7. **Write Code Connect files** (if available) — generate `.figma.tsx` per component using the Figma Code Connect CLI
8. **Scaffold Storybook** (optional) — initialise Storybook config; generate stories for each seed component

After Phase A completes, code library is ready for `design-prototype` consumption.

## Phase B — Continuous

Runs whenever the Figma library changes. No fixed cadence.

### Triggers
- `design-foundation-library` publishes a new component
- `design-foundation-library` revises a token value
- `design-foundation-library` deprecates a component
- Designer requests a manual code-side rebuild
- Library migration phase coordinated with `design-foundation-library`

### Workflow (Plan/Execute pattern, mirrors `figma-screen-compose`)

#### Plan (read-only)
1. Diff Figma library against code library:
   - **Tokens:** compare Figma variable values against `tokens/build/` output values; flag drift
   - **Components:** compare published Figma components against code component inventory; flag missing, deprecated, or revised
   - **Code Connect mappings:** flag any Figma node ID without a corresponding mapping
2. Build a delta report: tokens to rebuild, components to add/update/deprecate, mappings to add/refresh
3. Designer reviews delta; approves before mutation

#### Execute
1. **Rebuild tokens** — pull updated Figma variables, run Style Dictionary build, write to `tokens/build/`
2. **Update components:**
   - New Figma component → generate code skeleton, bind styles to tokens
   - Revised Figma component → update code component to match new variants/props
   - Deprecated Figma component → mark code component deprecated; do not delete (keeps prototype building)
3. **Refresh `figma-mapping.json`** — update node ID ↔ code path mappings
4. **Refresh Code Connect files** (if available) — regenerate `.figma.tsx` for changed components
5. **Update Storybook stories** (if scaffolded)
6. **Append to `manifest.md`** with version bump and change summary
7. Notify `design-prototype` of pending sync

## Drift detection

The skill detects three kinds of drift between Figma and code:

| Drift type | Detection | Resolution |
|---|---|---|
| **Token value drift** | Style Dictionary build output ≠ current Figma variable values | Rebuild from Figma (Figma is authoritative) |
| **Component matrix drift** | Figma component variant set ≠ code component variant set | Update code variants to match Figma; never the reverse |
| **Mapping drift** | Figma node ID exists, no `figma-mapping.json` entry (or vice versa) | Update mapping; flag orphaned mappings for removal |

Manual edits to code tokens are **reverted at next Phase B build** — code tokens are generated, not authored. If a token needs to change, change the Figma variable.

## Hard rules

- **Code Connect is optional, not required.** `figma-mapping.json` is always written; Code Connect files are an enrichment when the Figma plan supports them.
- **Tokens are generated from Figma, never authored in code.** Manual edits to `tokens/build/` are reverted at next build.
- **Style Dictionary is the canonical transformer.** Other tools may layer on top, but every project gets Style Dictionary as the baseline.
- **Component code mirrors Figma component structure.** Variants, props, default values come from Figma; code re-implements the same surface.
- **Framework choice is project-specific.** This mode does not prescribe React vs. Vue vs. Svelte. Recorded in `manifest.md` at first invocation.
- **Component lifecycle is owned by `design-foundation-library`.** This mode reflects state changes, never initiates them.
- **`design-prototype` consumes from this library when it exists.** When this mode is not yet bootstrapped, `design-prototype` falls back to ad-hoc HTML/CSS — but flags the gap.
- **Library migration must coordinate with `design-foundation-library`.** Run `figma-library-mode` first; this mode rebuilds against the migrated library second.

## Outputs

| File | What it contains |
|------|-----------------|
| `design/15_COMPONENT_LIBRARY/tokens/config.json` | Style Dictionary config (sources, platforms, transformations) |
| `design/15_COMPONENT_LIBRARY/tokens/source/` | Token JSON pulled from Figma |
| `design/15_COMPONENT_LIBRARY/tokens/build/` | Generated platform-specific token files (CSS vars, JS const, etc.) |
| `design/15_COMPONENT_LIBRARY/components/` | Code component implementations |
| `design/15_COMPONENT_LIBRARY/figma-mapping.json` | Figma node ID ↔ code path (universal bridge) |
| `design/15_COMPONENT_LIBRARY/code-connect/*.figma.tsx` | Code Connect mappings (Figma enterprise only) |
| `design/15_COMPONENT_LIBRARY/storybook/` | Storybook config + stories (optional) |
| `design/15_COMPONENT_LIBRARY/manifest.md` | Tech stack, build commands, version, sync state |
| `design/15_COMPONENT_LIBRARY/_upstream.md` | Consumed Figma library versions |

## Manifest format

```markdown
# Code Library Manifest

## Tech stack
- Framework: [React / Vue / Svelte / vanilla / etc.]
- Token build: Style Dictionary [version]
- Code Connect: [available / unavailable]
- Storybook: [scaffolded / not used]
- Build: [build command]
- Run: [run command]

## Component mapping

| Figma component | Figma node ID | Code path | Code Connect file | Sync hash |
|---|---|---|---|---|
| Button/Primary | 12345:678 | components/Button.tsx | code-connect/Button.figma.tsx | abc123 |

## Token build status

| Collection | Last built (Figma version) | Status |
|---|---|---|
| Colour Tokens | v15 | up-to-date |
| Spacing | v8 | drift detected |
```

## Sync workflow

```bash
node design/scripts/sync-version.js init <manifest> design-component-library
node design/scripts/sync-version.js bump <manifest>
node design/scripts/sync-manifest.js design-component-library
# Style Dictionary build (project-defined; example):
cd design/15_COMPONENT_LIBRARY && npx style-dictionary build
```

## Relationship to neighbouring modes

| Mode | Relationship |
|---|---|
| `design-foundation-library` | Hard upstream — every publication and token revision triggers Phase B here |
| `design-prototype` | Hard downstream — prototype consumes this library's components and tokens. When this mode is not bootstrapped, prototype falls back and flags the gap. |
| `design-screen-compose` | Indirect — instances in sprint files reference Figma components; `figma-mapping.json` lets `design-prototype` resolve those instances to code components |
| `design-governance` Phase B | Lateral — codified principles inform component API design |
| `design-lint` | Cross-cutting — checks parity between Figma library and code library; flags drift |
| `design-query` | Cross-cutting — code library entries added to queryable corpus |
| `figma-audit` | Lateral — extended audit scope includes code-side mirror parity |

## Triggers

- `design-foundation-library` Phase A complete → Phase A here
- `design-foundation-library` publishes new component → Phase B
- `design-foundation-library` revises token → Phase B
- `design-foundation-library` deprecates component → Phase B
- Designer requests manual rebuild → Phase B
- `design-prototype` reports drift between code tokens and Figma tokens → Phase B

## Figma MCP options

Phase B reads from Figma to detect drift. Two MCP options:

**figma-console MCP** — used for variable extraction during token build (no rate limits, plugin-based).

**Official Figma MCP** — used for Code Connect generation when available (REST-based, integrates with Code Connect CLI).

This is the only mode that benefits from both MCP servers being connected. `design-foundation-library` and `design-screen-compose` use figma-console only.

## Designer review checkpoints

| Where | What designer does |
|---|---|
| Phase A — framework choice | Pick framework; recorded in `manifest.md` |
| Phase B — Plan | Approve delta report before Execute |
| Drift resolution | Confirm Figma is authoritative for any token value mismatch |
| Library migration | Coordinate timing with `design-foundation-library` `figma-library-mode` |

## Watch list (per skill architecture P4)

The skill starts as one umbrella. Watch for split into sub-skills if the SKILL.md exceeds ~400 lines:
- `design-component-library-tokens` — Style Dictionary build only
- `design-component-library-components` — component generation
- `design-component-library-connect` — Code Connect mapping (Figma enterprise only)
- `design-component-library-storybook` — Storybook docs

Split triggers: P4 (context budget), P2 (designers run token rebuild without component rebuild), P1 (Code Connect uses different toolchain than Style Dictionary).
