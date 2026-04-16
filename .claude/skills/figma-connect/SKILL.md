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

> ⚠️ **This skill is for the Figma Console MCP (southleft) only.**
> It uses `mcp__figma-console__*` tools and connects via WebSocket on ports 9223–9232.
> It is NOT the official Figma Dev Mode MCP (`mcp__Figma__*`, port 3845, read-only cloud).
> If you see `mcp__Figma__*` tools but not `mcp__figma-console__*`, you are on the wrong MCP — go to Step 0.

---

## Step 0 — Pre-flight: verify the MCP server is configured (ALWAYS run first)

Before calling any tool, check whether `mcp__figma-console__figma_get_status` is available in the tool list.

**If `mcp__figma-console__*` tools are NOT available:**

The MCP server is not registered with Claude Desktop. Fix it:

1. Check the config file:
   ```
   ~/Library/Application Support/Claude/claude_desktop_config.json
   ```
2. If `mcpServers` is empty or missing the `figma-console` entry, check the install path:
   ```bash
   which figma-console-mcp
   ```
3. If installed, add it to the config:
   ```json
   {
     "mcpServers": {
       "figma-console": {
         "command": "/path/from/which/figma-console-mcp"
       }
     }
   }
   ```
4. If NOT installed:
   ```bash
   npm install -g figma-console-mcp
   ```
5. Tell the user to **fully quit and relaunch Claude Desktop** — a refresh is not enough.
6. After relaunch, confirm `mcp__figma-console__*` tools appear before proceeding.

**If `mcp__figma-console__*` tools ARE available → proceed to Step 1.**

---

## Step 1 — Check status

Call `figma_get_status`. If it returns a healthy connection and lists an active file, confirm the file name with the user and proceed to Step 4.

> Note: The server may run on port 9224 (or higher) if 9223 is already taken by another instance. This is normal — the plugin scans all ports and connects automatically.

---

## Step 2 — Soft refresh (try first if Step 1 is unhealthy)

1. Call `figma_clear_console` to flush stale logs
2. Call `figma_reload_plugin` to reload the Figma Console plugin
3. Call `figma_reconnect` to re-establish the MCP channel
4. Call `figma_get_status` again — if healthy, proceed to Step 4

---

## Step 3 — Hard reset (if soft refresh failed)

Guide the user through this sequence **in order** — order matters:

1. **In Figma**: Close the Figma Console plugin panel (Plugins menu → close)
2. **Here**: Call `figma_reconnect` to reset the MCP side
3. **In Figma**: Reopen the plugin (Plugins → Figma Console → Open)
4. **Here**: Call `figma_get_status` to verify
5. **Here**: Call `figma_list_open_files` to confirm available files

If still failing after the hard reset, ask the user to:
- Quit and relaunch Figma entirely
- Confirm the Figma Console plugin is installed and enabled (not just the official Figma Dev Mode plugin)
- Check that `figma-console-mcp` appears in `claude_desktop_config.json` (see Step 0)

---

## Step 4 — Confirm active file

Once connected, always confirm:
- Which file is currently active (call `figma_list_open_files`)
- Ask the user to click into the correct file in Figma if multiple are open
- Note the file name — use it to set context for the session

---

## Key rules
- Never start design work until the connection is confirmed healthy
- If a tool call fails mid-session, run Step 2 before assuming it's a design error
- Document which file was active at session start in your response to the user
- If the user mentions "Figma MCP" without specifying which one, always clarify — there are two distinct systems and conflating them wastes significant diagnostic time
