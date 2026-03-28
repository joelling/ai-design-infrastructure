---
name: figma-handoff
description: >
  Detects and harmonizes work created or edited by a human designer in Figma. When a designer
  makes changes outside the AI workflow — creating elements, editing components, adding screens —
  this skill analyzes the intent, identifies potential components and variables, and integrates
  the work into the design system. Use this skill at the start of any session where a designer
  has been working independently, or when new untracked elements are detected. Triggers on:
  "designer handoff", "harmonize", "what changed in figma", "designer made changes",
  "integrate designer work", "sync designer edits", "new elements in figma", "detect changes",
  "human edits", "review figma changes", or when figma-connect detects untracked modifications.
---

# Designer Handoff — Detect and Harmonize

When a human designer creates or edits elements in Figma outside the AI-assisted workflow, those changes need to be detected, analyzed, and integrated into the design system. This skill bridges the gap between freeform design exploration and systematic design system management.

---

## When to run

- **Every session start** (after figma-connect): Quick scan for changes since last session
- **On demand**: When the designer says they've been working in Figma
- **After figma-connect detects changes**: When the connection check reveals modified pages

---

## Detection process

### Step 1 — Capture current state

1. Call `figma_get_design_changes` to detect modifications since last session
2. Call `figma_take_screenshot` on each modified page
3. Call `figma_get_file_data` for structural analysis of changed pages
4. Compare against the last known state (prototype manifest sync hashes, inventory records)

### Step 2 — Classify changes

For each detected change, classify it:

| Classification | Meaning | Example |
|---------------|---------|---------|
| **New element** | Something that didn't exist before | New frame, new text block, new shape |
| **Modified element** | Existing element with changed properties | Colour changed, text edited, resized |
| **New component** | Designer created a component | New component in layers panel |
| **Modified component** | Existing component was edited | Variant added, property changed |
| **New page** | A new page was added | New screen page |
| **Structural change** | Layout or hierarchy changed | Frames reordered, sections added/removed |

### Step 3 — Analyze intent

For each change, determine the designer's likely intent:

1. **Is it a component candidate?** — Is this element reused or reusable? Does it follow a pattern that should be componentized?
2. **Are there hardcoded values?** — Does it use raw colours, spacing, or radius instead of variables?
3. **Does it follow naming conventions?** — Page names, layer names, component names
4. **Does it affect the token system?** — New colours, new spacing values, new typography styles not in the current token set
5. **Does it conflict with existing components?** — Similar to an existing component but different enough to be intentional

### Step 4 — Report findings

Present findings to the designer in this format:

```
## Handoff Analysis — [Date]

### Changes detected
- [Page]: [N] new elements, [N] modified elements

### Component candidates
- [Element name] → suggested as [Category/ComponentName]
  - Reason: [why it should be a component]
  - Hardcoded values: [list any]
  - Suggested tokens: [token bindings needed]

### Token gaps
- [New colour/spacing/value] not in current token system
  - Suggested token: [collection/path]
  - Closest existing: [nearest match]

### Naming issues
- [Element] doesn't follow convention → suggested: [corrected name]

### Conflicts
- [Element] is similar to existing [Component] — intentional variant or duplicate?

### Recommended actions
1. [Action items in priority order]
```

---

## Harmonization process

After the designer reviews findings and approves actions:

### For component candidates
1. Run `figma-component` workflow on each approved element
2. Ensure all variables are bound (no hardcoded values)
3. Add inventory entry via `figma-inventory`

### For token gaps
1. Run `figma-tokens` to add new tokens to the appropriate collection
2. Follow the alias chain rule — primitive first, then semantic if needed
3. Rebind the designer's elements to use the new tokens

### For naming issues
1. Rename elements to follow conventions using `figma_rename_node`
2. Update page names if needed

### For structural changes
1. Check canvas brief alignment — does the change match or contradict the brief?
2. If it extends the brief, flag for brief update (drift log entry)
3. If it contradicts the brief, discuss with designer before proceeding

---

## Integration with other skills

| Skill | How handoff interacts |
|-------|----------------------|
| `figma-connect` | Handoff scan runs after connection is confirmed |
| `figma-tokens` | New token gaps are resolved via tokens skill |
| `figma-component` | Component candidates are created via component skill |
| `figma-inventory` | All detected assets get inventory entries |
| `figma-audit` | Post-harmonization audit confirms compliance |
| `design-canvas` | Structural changes may require brief updates |

---

## Rules

- **Never overwrite designer work without approval.** Present findings, get confirmation, then act.
- **Preserve designer intent.** The goal is harmonization, not enforcement. If a designer intentionally broke a convention, understand why before correcting.
- **Hardcoded values are always flagged** but the designer decides whether to tokenize them or leave them as exploration.
- **New components from designer work follow the same lifecycle** — draft → staged → audited → published.
- **Document everything.** Every harmonization action is logged in the inventory Notes field.
