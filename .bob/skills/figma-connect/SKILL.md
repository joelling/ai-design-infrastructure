---
name: figma-connect
description: >
  Manages the Figma Console MCP connection. Use this skill at the START of every
  Figma work session to confirm the connection is live, and whenever the
  connection is stuck, stale, unresponsive, or needs to be reset. Triggers on:
  "figma not responding", "connection stuck", "plugin not connecting", "restart
  figma", "figma MCP issue", "reconnect figma", "kill channels", "figma
  session", or when any figma_ tool call fails or returns an unexpected error.
  Also use proactively before starting any design work to confirm which file is
  active. Umbrella: shared by `design-foundation-library` (Phase A and B) and
  `design-screen-compose` (every sprint session). Always invoked first.
---

<!-- mirror: bob | SSOT: design/process/15-screen-compose.md -->

# figma-connect — Connection Management (Bob)

> ⚠️ **Figma Console MCP (southleft) only.** Uses `{{MCP_PREFIX}}figma-console__*` tools and connects via WebSocket on ports 9223–9232. It is NOT the official Figma Dev Mode MCP (`{{MCP_PREFIX}}Figma__*`, port 3845, read-only cloud).
>
> Replace `{{MCP_PREFIX}}` with Bob's MCP namespace on the first live run of this skill; document the resolved prefix in `.bob/rules/50-bob-adaptations.md` and regenerate this line across every SKILL.md in one pass via `workflow-update`.

## Step 0 — Pre-flight

Before calling any tool, confirm `{{MCP_PREFIX}}figma-console__figma_get_status` is available in the tool inventory.

**If `figma-console` tools are NOT available:**

1. Check `.bob/mcp.json` at the repo root — is the `figma-console` server registered? If not, re-register it (see existing `.bob/mcp.json` entry as a template).
2. Check the install: `which figma-console-mcp` (run via BobShell).
3. If not installed: `npm install -g figma-console-mcp`.
4. Ask the user to reload the Bob session (trusted-folder re-open) so MCP servers re-register.
5. After reload, confirm `{{MCP_PREFIX}}figma-console__*` tools appear before proceeding.

## Step 1 — Check status

Call `figma_get_status`. If healthy and an active file is listed, confirm the file name with the user and proceed to Step 4.

> The MCP server may run on a higher port (9224+) if 9223 is taken. Normal — the plugin scans all ports.

## Step 2 — Soft refresh (try first if Step 1 is unhealthy)

1. `figma_clear_console` — flush stale logs.
2. `figma_reload_plugin` — reload the Figma Console plugin.
3. `figma_reconnect` — re-establish the MCP channel.
4. `figma_get_status` again — if healthy, proceed to Step 4.

## Step 3 — Hard reset (if soft refresh failed)

Guide the user through this sequence in order:

1. **In Figma** — close the Figma Console plugin panel (Plugins → close).
2. **Here** — call `figma_reconnect`.
3. **In Figma** — reopen the plugin (Plugins → Figma Console → Open).
4. **Here** — call `figma_get_status` to verify.
5. **Here** — call `figma_list_open_files` to confirm available files.

If still failing:

- Quit and relaunch Figma entirely.
- Confirm the Figma Console plugin is installed and enabled.
- Confirm `figma-console-mcp` in `.bob/mcp.json` and that the BobShell can run it.

## Step 4 — Confirm active file

Always:

- `figma_list_open_files` to enumerate.
- Ask the user to click into the correct file if multiple are open.
- Note the file name — use it as session context.

## Rules

- Never start design work until the connection is confirmed healthy.
- If a tool call fails mid-session, run Step 2 before assuming it's a design error.
- Document which file was active at session start in your response to the user.
- Two distinct Figma MCPs exist — always clarify which the user means if ambiguous.
- This skill is invoked BEFORE every other `figma-*` skill. Never skip.
