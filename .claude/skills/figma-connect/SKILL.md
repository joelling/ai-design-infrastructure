---
name: figma-connect
description: >
  Manages the Figma Console MCP connection. Use this skill at the START of every Figma
  work session to confirm the connection is live, and whenever the connection is stuck,
  stale, unresponsive, or needs to be reset. Triggers on: "figma not responding",
  "connection stuck", "plugin not connecting", "restart figma", "figma MCP issue",
  "reconnect figma", "kill channels", "figma session", or when any figma_ tool call
  fails or returns an unexpected error. Also use proactively before starting any design
  work to confirm which file is active and connection is healthy.
---

# Figma Console MCP — Connection Management

Always run through this skill at the start of a Figma session, and whenever you hit connection problems.

## Step 1 — Check status

Call `figma_get_status` first. If it returns a healthy connection and lists an active file, confirm the file name with the user and proceed. Skip to the end.

## Step 2 — Soft refresh (try first)

If status is unhealthy or a tool call failed:
1. Call `figma_clear_console` to flush stale logs
2. Call `figma_reload_plugin` to reload the Figma Console plugin
3. Call `figma_reconnect` to re-establish the MCP channel
4. Call `figma_get_status` again — if healthy, proceed

## Step 3 — Hard reset (if soft refresh failed)

Guide the user through this sequence **in order** — order matters:
1. **In Figma**: Close the Figma Console plugin panel (Plugins menu → close)
2. **Here**: Call `figma_reconnect` to reset the MCP side
3. **In Figma**: Reopen the plugin (Plugins → Figma Console → Open)
4. **Here**: Call `figma_get_status` to verify
5. **Here**: Call `figma_list_open_files` to confirm available files

If still failing after the hard reset, ask the user to:
- Quit and relaunch Figma entirely
- Check that the Figma Console plugin is installed and enabled
- Confirm the MCP server is running (check Claude Code terminal output)

## Step 4 — Confirm active file

Once connected, always confirm:
- Which file is currently active (call `figma_list_open_files`)
- Ask the user to click into the correct file in Figma if multiple are open
- Note the file name — use it to set context for the session

## Key rules
- Never start design work until the connection is confirmed healthy
- If a tool call fails mid-session, run Step 2 before assuming it's a design error
- Document which file was active at session start in your response to the user
