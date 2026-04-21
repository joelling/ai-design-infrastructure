---
description: Establish and verify the Figma Console MCP session
---

Run the `figma-connect` skill. Specifically:

1. Confirm the Figma Console MCP server is registered in `.bob/mcp.json`.
2. Call `{{MCP_PREFIX}}figma-console__get_status` (replace `{{MCP_PREFIX}}` with Bob's MCP tool namespace on first invocation — document the resolved prefix in `.bob/rules/50-bob-adaptations.md`).
3. If the connection is stale, instruct the user to run the Figma Console plugin in their active Figma file, then retry `get_status`.
4. Report which Figma file is active, on which port the WebSocket is listening, and whether the user has selection context.
5. If any downstream figma-* skill is about to run, confirm with the user that the active file matches the intended working or DLS file.

Do NOT invoke mutation tools before the status check succeeds.
