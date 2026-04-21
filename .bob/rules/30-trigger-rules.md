# Trigger rules — which skill to invoke when

Bob routes natural-language requests to skills by matching the request against each skill's description. These rules help disambiguate when the intent could match several skills, and record hard invocation gates.

## Disambiguators

Bob's semantic matching can confuse vocabularily adjacent skills. When the user's request could reasonably match more than one, prefer the leftmost:

| Request intent | Primary skill | Do NOT route to |
|---|---|---|
| "build a screen in Figma" | `figma-screen-compose` | `figma-component`, `figma-page-setup` |
| "set up a new screen" (empty artboards) | `figma-page-setup` | `figma-screen-compose` |
| "create a reusable UI element" | `figma-component` | `figma-screen-compose` |
| "start the Figma session" / "connect to Figma" | `figma-connect` | any other figma-* |
| "what do we know about X" / cross-artifact search | `design-query` | `design-lint` |
| "check the design for health" / "what's stale" | `design-lint` | `design-query` |
| "validate the design" / "heuristic evaluation" | `design-validation` | `design-lint` |
| "plan research" / "write test plan" | `design-research` Phase A | `design-validation` |
| "synthesise research findings" | `design-research` Phase B | `design-governance` |
| "codify principles from patterns" | `design-governance` Phase B | `design-research` |
| "edit the process" / "update a mode" | `workflow-update` | any other |
| "document tokens" / "visualize the palette" | `figma-docs` | `figma-tokens` |
| "add a new token" | `figma-tokens` | `figma-docs` |

When in doubt, ask the user before acting — do not guess across the column boundary.

## Hard invocation gates

These are non-negotiable preconditions. If unmet, warn the user and stop before executing.

| Skill | Gate | Check |
|---|---|---|
| `design-canvas` | Requires IA + interaction + visual + content artifacts | Presence of `design/06_INFORMATION_ARCHITECTURE/`, `design/07_INTERACTION/`, `design/08_VISUAL/`, `design/09_CONTENT/` and their index files |
| `figma-screen-compose` | Requires canvas brief + set-up page + published-library components | Presence of `design/13_CANVAS_BRIEFS/{ID}_*.md`; page artboards exist; Foundation DLS published |
| `design-prototype` | Requires canvas briefs + Figma screens + walking skeleton | Canvas briefs exist; composition logs exist; `design/05_STORIES/walking-skeleton.md` exists |
| any `figma-*` | Requires a healthy Figma MCP connection | Run `figma-connect` first; confirm the active file |

## Soft gates

Warn and proceed with user confirmation:

- `figma-screen-compose` before `design-wireframe` review — warn "no wireframe for this screen; proceed?"
- Any Tier-4 skill before `design-lint` has been run in the current revision — warn "lint report may be stale".
- `design-research` Phase B before `design-research` Phase A — warn "no test plan; running ad-hoc synthesis".

## Slash-command backstops

For high-frequency or easily-ambiguous skills, prefer the explicit slash command (listed in `.bob/commands/`) over relying on semantic matching:

- `/design-lint` — run the health check
- `/workflow-update` — edit the process
- `/sync-status` — pipeline staleness sweep
- `/sync-brd` — regenerate BRD from md SSOT
- `/figma-connect` — verify Figma session
- `/design-query` — ask a question of the corpus

## Phase-ordering rules

Three Phase-B synthesis skills must run in this order (each consumes its predecessor):

1. `design-research` Phase B
2. `design-governance` Phase B
3. `design-query` Phase B

If the user requests one out of order, warn: "predecessor is stale — run it first or proceed with a weaker pass?"

## Umbrella orchestration

Umbrellas orchestrate multiple sub-skills. When a user requests umbrella work, run the sub-skills sequentially in the order below. Bob does not spawn parallel sub-agents; each step is a turn in the conversation (or a tool-use cycle).

**`design-screen-compose`** (Chapter 15):
1. `figma-connect`
2. `figma-handoff` (detect designer changes)
3. `figma-file-setup` (if Working file is new)
4. `figma-page-setup` (per screen)
5. `figma-screen-compose` sub-skill (plan → execute)

**`design-foundation-library`** Phase A (Chapter 17):
1. `figma-connect`
2. `figma-file-setup` (all 3 DLS files)
3. `figma-tokens`
4. `figma-component` (seed set)
5. `figma-parking-lot`
6. `figma-docs`
7. `figma-inventory`

**`design-foundation-library`** Phase B (continuous):
1. `figma-parking-lot` (intake)
2. `figma-component` (promote) or `figma-tokens` (revise)
3. `figma-inventory` (lifecycle update)
4. `figma-audit` (health)
5. `figma-docs` (refresh)
6. `figma-library-mode` (migrations only)
