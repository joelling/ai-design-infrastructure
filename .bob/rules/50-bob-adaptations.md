# Bob adaptations — Claude → Bob mapping and known limitations

This repo supports two AI-assistant harnesses. The process (`design/process/`) is shared and tool-agnostic; the harness directories differ. This file records every place Bob behaves differently from Claude Code, and the mitigation used.

## Primitive mapping

| Claude Code primitive | Bob equivalent | Notes |
|---|---|---|
| `CLAUDE.md` at repo root | `.bob/rules/*.md` auto-injected + `BOB.md` | Both harnesses share a peer orchestration doc |
| `.claude/skills/{name}/SKILL.md` | `.bob/skills/{name}/SKILL.md` | Identical YAML-frontmatter + markdown format; descriptions tuned for Bob's semantic matching |
| Slash commands | `.bob/commands/{name}.md` | YAML frontmatter (description, argument-hint) + markdown body; invoked via `/` menu |
| Hooks (SessionStart, PreToolUse, PostToolUse, Stop) | not supported | Repo does not currently use hooks; future hook-based features would require a BobShell wrapper |
| Subagents (`Agent` tool, Explore/Plan/general-purpose) | Bob Modes (`/plan`, `/ask`, `/advanced`, `/code`, `/review`) | No true parallel subagent spawn. Umbrella skills run sub-steps sequentially inside a single Bob conversation |
| MCP server config | `.bob/mcp.json` (project) + `~/.bob/mcp_settings.json` (global) | Same `mcpServers` schema as Claude Code / standard MCP |
| Permissions / allowlists | Trusted folders + `.bobignore` + per-server `alwaysAllow` array | Bob's folder-trust gating is stricter than Claude's — untrusted folders disable auto-approval |
| User-per-task model selection | automatic routing (Claude / Granite / Llama / Mistral) | Bob chooses; consistency depends on Bob's router |
| `WebFetch` / `WebSearch` (native) | MCP web-search connector only | Tagged steps in `design-discovery`, `design-research` degrade gracefully if no connector is configured |
| `TodoWrite` task tracking | not confirmed; file-backed fallback at `design/.todo.md` | Only affects prose nudges — no workflow correctness impact |

## MCP tool-name placeholder

Bob's MCP tool namespacing is not yet confirmed. Claude uses `mcp__figma-console__*` and `mcp__github__*`. Until confirmed, SKILL.md files written for Bob use the placeholder `{{MCP_PREFIX}}` where the namespace would appear — e.g. `{{MCP_PREFIX}}figma-console__get_status`. A single-pass rewrite will resolve all placeholders once the namespace is known.

Action: confirm on first live `figma-connect` session; update every occurrence in `.bob/skills/**/SKILL.md`.

## Tool-reference substitutions to apply when porting a skill

When translating `.claude/skills/{name}/SKILL.md` → `.bob/skills/{name}/SKILL.md`:

1. Replace invocations of the Claude `Skill` tool with natural-language prose ("run the `{name}` skill"). Bob auto-routes by description.
2. Replace `Agent`-tool subagent spawns with an explicit sequential list of steps. If the skill used Explore/Plan in parallel, serialise them and flag the latency cost.
3. Replace `mcp__figma-console__*` with `{{MCP_PREFIX}}figma-console__*` (placeholder).
4. Replace `mcp__github__*` with `{{MCP_PREFIX}}github__*` (placeholder).
5. Replace `WebFetch` / `WebSearch` with a note: "requires a web-search MCP connector; if unavailable, ask the user to supply the content".
6. Replace `TodoWrite` with file-backed progress notes (`design/.todo.md`) or drop the line entirely — low impact.
7. Replace built-in `/init`, `/review` references where present — Bob has built-in equivalents with the same names.

## Limitations the user should expect

- **No cross-skill parallelism within a single Bob turn.** Claude can spawn three Explore agents in parallel; Bob runs steps serially in one conversation.
- **Description-matching can misroute between vocabularily adjacent skills.** Mitigations: disambiguator table in `30-trigger-rules.md`; slash-command backstops for high-frequency cases.
- **Model choice is not user-configurable.** Accept Bob's routing.
- **Approval-mode friction on long-running builds.** Foundation Library Phase A can involve many Figma mutations; Bob prompts per tool invocation unless the tool is in `alwaysAllow`. Graduate stable tools into `alwaysAllow` in `.bob/mcp.json` conservatively.
- **BobShell inherits env from the trusted-folder's shell.** Confirm `GITHUB_TOKEN`, `FIGMA_PAT`, and any other secrets are exported in the project's shell before running scripts.

## Record of accepted divergence

When a skill's Bob version must degrade a Claude-side capability, note it here with date and rationale. (No entries yet.)

| Date | Skill | Divergence | Rationale |
|---|---|---|---|
| — | — | — | — |

## Propagation rule (Bob side)

Any change to `design/process/*.md` must update the matching `.bob/skills/*/SKILL.md` as well as `BOB.md` and — if a new tool dependency is introduced — this file's primitive mapping and substitution lists. The `workflow-update` skill automates this using `design/process/_propagation.yaml`. Run `node design/scripts/sync-skills.js` to verify.
