# Figma Plugin API Rules — Shared Reference

> Referenced by: `figma-component`, `figma-tokens`, `figma-docs`, `figma-file-setup`, `figma-page-setup`
> Source: Extracted from Figma's official `figma-use` skill + project-specific learnings

---

## Critical rules (memorize these)

1. **`return` is your output channel.** Use `return` to send data back from `figma_execute`. Auto-serialized to JSON. `console.log()` output is NOT returned.
2. **Plain JavaScript with top-level `await`.** No IIFE wrapping needed. Use `return` at the end.
3. **Never call `figma.notify()`** — it throws an error in the MCP plugin context.
4. **`getPluginData()`/`setPluginData()` are unsupported** with `documentAccess: dynamic-page`. Use `getSharedPluginData()`/`setSharedPluginData()` instead.
5. **Colors are 0–1 range**, not 0–255. Divide hex values by 255.
6. **Fills and strokes are read-only arrays.** Clone before modifying:
   ```js
   const fills = JSON.parse(JSON.stringify(node.fills));
   fills[0].color = { r: 0.1, g: 0.2, b: 0.8 };
   node.fills = fills;
   ```
7. **`setBoundVariableForPaint` returns a new paint** — capture it and reassign:
   ```js
   const newPaint = figma.variables.setBoundVariableForPaint(
     { type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', variable
   );
   node.fills = [newPaint];
   ```
8. **`layoutSizingHorizontal = 'FILL'` must be set AFTER `appendChild()`** — setting before throws.
9. **Load fonts before any text operation:**
   ```js
   await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
   ```
10. **Page context resets each `figma_execute` call.** Always switch pages explicitly:
    ```js
    await figma.setCurrentPageAsync(targetPage);
    ```
    Never use the sync setter `figma.currentPage = page` — it throws with `documentAccess: dynamic-page`.
11. **Always `await` every Promise.** Fire-and-forget async calls cause silent failures.
12. **Return ALL created/mutated node IDs** in structured objects for downstream reference.
13. **Position new top-level nodes away from (0,0)** to avoid overlapping existing content.
14. **On error, STOP.** Read the error message before retrying. Failed scripts are atomic — nothing partial is created.
15. **`setExplicitVariableModeForCollection` must be called recursively** on the node AND all its children after binding variables, or variables appear unresolved ("ghost mode"):
    ```js
    function applyMode(node, collectionId, modeId) {
      node.setExplicitVariableModeForCollection(collectionId, modeId);
      if ('children' in node) {
        node.children.forEach(child => applyMode(child, collectionId, modeId));
      }
    }
    ```
16. **`cornerRadius` does NOT support `setBoundVariable`** — use individual corners instead: `topLeftRadius`, `topRightRadius`, `bottomLeftRadius`, `bottomRightRadius`.
17. **`createVariable` accepts a collection object or ID string** — either works.
18. **Set `variable.scopes` explicitly** — never leave as `ALL_SCOPES`. Background: `FRAME_FILL, SHAPE_FILL`. Text: `TEXT_FILL`. Border: `STROKE_COLOR`. Spacing: `GAP`. Radii: `CORNER_RADIUS`. Primitives: `[]` (hidden from picker).

---

## Pre-flight checklist

Run through before submitting any `figma_execute` code:

- [ ] Script uses `return` to send results back
- [ ] No IIFE wrapper — plain top-level code
- [ ] Return value includes all created/mutated node IDs
- [ ] No `figma.notify()` calls
- [ ] All colors in 0–1 range (not 0–255)
- [ ] Fills/strokes cloned before mutation, reassigned after
- [ ] Page switched with `await figma.setCurrentPageAsync()` if needed
- [ ] `layoutSizing = 'FILL'` set AFTER `appendChild()`
- [ ] All fonts loaded with `await figma.loadFontAsync()` before text operations
- [ ] Text formatting applied after font load, not before
- [ ] Nodes resized with `node.resize(w, h)` not direct width/height assignment
- [ ] Variable scopes explicitly set (not `ALL_SCOPES`)
- [ ] New nodes positioned away from (0,0)
- [ ] All node IDs collected for return value
- [ ] Every Promise is `await`ed
- [ ] `setExplicitVariableModeForCollection` called recursively after variable bindings

---

## Common error table

| Error message | Cause | Fix |
|---|---|---|
| `Cannot call with documentAccess: dynamic-page` | Using sync API (`figma.currentPage =`, `getLocalTextStyles()`) | Use async version (`setCurrentPageAsync`, `getLocalTextStylesAsync`) |
| `Cannot read properties of null` | Node not loaded — page not switched first | `await figma.setCurrentPageAsync(page)` before accessing nodes |
| `figma.notify is not a function` | `notify()` unavailable in MCP plugin context | Remove the call entirely. Use `return` for output. |
| `Cannot assign to read only property 'fills'` | Assigning to fills/strokes directly | Clone array, modify clone, reassign: `node.fills = [clonedFill]` |
| `Expected FILL but parent has no auto-layout` | Setting `layoutSizing = 'FILL'` before adding to auto-layout parent | Set sizing AFTER `parent.appendChild(child)` |
| Script hangs (no return) | Un-awaited Promise or infinite loop | Add `await` to all async calls. Check loop conditions. |
| `Font not loaded` | Text operation before `loadFontAsync` | Load font first, then modify text |
| Node detached from parent | Instance detached during modification | Re-find the node by ID after page switch |

---

## HUG enforcement pattern

When creating component sets with `combineAsVariants`, all frames default to FIXED sizing at 100px. Run this enforcement pass before AND after `combineAsVariants`:

```js
function enforceHug(node) {
  if (node.type === 'FRAME' || node.type === 'COMPONENT') {
    node.layoutSizingHorizontal = 'HUG';
    node.layoutSizingVertical = 'HUG';
  }
  if ('children' in node) node.children.forEach(enforceHug);
}

// Before combining
variants.forEach(enforceHug);

// After combining
const componentSet = figma.combineAsVariants(variants, parent);
componentSet.children.forEach(enforceHug);
```

---

## Variant grid layout after `combineAsVariants`

Variants stack at (0,0) after combining. Always manually grid-layout:

```js
const COLS = 6;
const GAP = 40;
const PADDING = 40;

variants.forEach((v, i) => {
  v.x = PADDING + (i % COLS) * (v.width + GAP);
  v.y = PADDING + Math.floor(i / COLS) * (v.height + GAP);
});

const maxRight = Math.max(...variants.map(v => v.x + v.width));
const maxBottom = Math.max(...variants.map(v => v.y + v.height));
componentSet.resize(maxRight + PADDING, maxBottom + PADDING);
```

---

## Generation Notes frame pattern

After creating a component, add an annotation frame documenting assumptions and unresolved items:

```js
const notes = figma.createFrame();
notes.name = '⚠️ Generation Notes';
notes.layoutMode = 'VERTICAL';
notes.fills = [{ type: 'SOLID', color: { r: 1, g: 0.984, b: 0.922 } }]; // #FFFBEB
notes.paddingTop = notes.paddingBottom = notes.paddingLeft = notes.paddingRight = 24;
notes.itemSpacing = 8;
notes.layoutSizingHorizontal = 'HUG';
notes.layoutSizingVertical = 'HUG';
// Add text children documenting assumptions, missing tokens, etc.
```

Place below the component set on the page.
