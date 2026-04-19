---
name: figma-audit
description: >
  Figma-mechanical audit. Checks a Figma file for design-system violations: hardcoded values,
  missing variable bindings, non-auto-layout frames, detached components, inventory/lifecycle
  drift, and publishing issues. Also runs a completeness audit (brief→screen verification).
  Use before library migrations or for in-file QA. Triggers on: "figma audit", "design QA",
  "check file", "find hardcoded values", "check for non-components", "check auto-layout",
  "design system check", "before library mode", "validate tokens", "clean up", "screen
  completeness", "check screens against briefs", or any time a component is acting
  unexpectedly. Run before every library migration.
  Umbrella: `design-foundation-library` (Phase B health check across the DLS files). Findings feed `design-governance` Phase B for pattern elevation; library-migration audits coordinate with `figma-library-mode`.
---

# Figma Audit — File Health Check

Run this before library migrations, periodically during active design, or whenever something looks off in the file. The goal is zero violations in a healthy Figma file.

> **Scope note — audit-skill split.** This skill covers Figma-mechanical checks (tokens, auto-layout, components, inventory). Nielsen 10 heuristic evaluation lives in `design-validation`. Cross-tier semantic health (orphans, staleness, principle violations) lives in `design-lint`. All three are complementary, not overlapping.

---

## Audit tools

- `figma_audit_design_system` — primary audit tool
- `figma_lint_design` — secondary linter for specific rule violations
- `figma_get_variables` — verify token coverage
- `figma_take_screenshot` — visual verification at start and end

---

## Audit checklist

### Check 1 — Hardcoded colors
**What**: Any fill or stroke not bound to a `color_{context}/{role}` variable (from 02_Colour Tokens) or a `Colour Styles/...` style (from 01_Colour Styles).
**How**: Run `figma_audit_design_system`, look for color violations.
**Fix**: For each violation, determine the correct semantic token, rebind the fill/stroke.
**Rule**: Primitives are never applied directly — must go through semantic or component-level tokens.

### Check 2 — Hardcoded spacing
**What**: Padding or gap values not referencing a `spacing_size_{N}` variable (from 03_Spacing).
**How**: Check auto-layout padding/gap fields for numeric values instead of variable references.
**Fix**: Identify the closest spacing token, rebind.
**Note**: `0` values are acceptable if intentionally zero (e.g., no gap).

### Check 3 — Hardcoded border radius
**What**: Corner radius values not referencing a `radius-tokens/radius_{component}` or `radius-semantic/{role}` variable (from 09_Radius).
**How**: Check radius fields on frames and components.
**Fix**: Map to correct radius token and rebind.

### Check 4 — Non-auto-layout frames
**What**: Frames that use absolute positioning instead of auto-layout.
**How**: Run `figma_lint_design` for layout violations.
**Fix**: Convert frame to auto-layout. Then bind padding/gap to tokens.
**Exceptions**: Absolutely positioned overlays (tooltips, floating badges, fixed nav) are intentional — document these with an annotation.

### Check 5 — Detached components
**What**: Component instances that have been detached from their master.
**How**: Look for frames in the layers panel that should be component instances.
**Fix**: Either re-link to the master component (delete and re-instantiate), or if the detachment was intentional, convert the element back into a proper new component.
**No exceptions**: Detached components break the single-source-of-truth principle.

### Check 6 — Missing component properties
**What**: Components that have no properties set up (no boolean/text/instance-swap/variant properties).
**How**: Check each published component's Properties panel.
**Fix**: Add appropriate properties. At minimum: interactive states as variants, toggleable elements as boolean properties.
**Note**: Very simple static components (dividers, spacers) may legitimately have no properties.

### Check 7 — Hidden component publishing
**What**: Components with `.` or `_` prefix that are unintentionally showing up as published.
**How**: Review the publish list in Assets panel.
**Fix**: Ensure hidden component names start with `.` — Figma excludes `.` prefixed components from publishing automatically.

### Check 8 — Orphan inventory entries
**What**: Components listed in inventory that no longer exist in the file.
**How**: Cross-reference `design/12_GOVERNANCE/inventory.md` entries against actual components in file.
**Fix**: Mark orphaned entries as `removed` in inventory with date and reason.

### Check 9 — Ghost components
**What**: Components in the file that are NOT in the inventory.
**How**: List all components in file, compare against inventory entries.
**Fix**: Add missing entries to inventory with current status based on location (working page = `draft`, Parking Lot = `staged`, library = `published`).

### Check 10 — Lifecycle consistency
**What**: Components whose inventory status doesn't match their actual location.
**How**: Verify: `draft` components are on working pages, `staged` are in Parking Lot, `published` are in library files.
**Fix**: Update inventory status to match actual location, or flag for investigation if a component moved without the proper workflow.

### Check 10a — Composition log sync
**What**: Audit Figma screens against the composition log at `design/15_FIGMA/composition-logs/{ScreenID}_composition-log.md` and against canvas brief acceptance criteria.
**How**: For each screen on the current page, read its composition log and diff against current Figma nodes.
**Fix**: Flag any instance not present in the composition log (untracked composition), and any composition log entry that does not correspond to a current Figma node (stale log).

### Check 11 — Completeness Audit
**What**: Per-screen verification that the built Figma screen covers everything the canvas brief specifies.
**How**: For each screen on the current page, locate its canvas brief in `design/13_CANVAS_BRIEFS/`. Verify each category:

| Category | What to check |
|----------|--------------|
| Information hierarchy | Primary content visually dominant; secondary accessible within one interaction; tertiary requires deliberate action |
| Interaction completeness | All states from state inventory built (empty, loading, populated, error at minimum); all behavioral spec actions have visible affordances |
| Visual consistency | Zero hardcoded values; all component instances used (no detached or re-created elements); naming matches convention |
| Content accuracy | Labels match terminology guide; error messages follow content strategy; empty state copy present and correct |
| Accessibility | Contrast passes WCAG AA; focus indicators visible; no color-only state signals; non-text content has accessible labels |
| Story coverage | Every DS-NNN in canvas brief traceability block is addressed by at least one element or interaction; no features without story trace |

**Fix**: Document each gap as a completeness finding. Brief → Figma gaps must be reconciled before canvas briefs are marked final.
**Skip condition**: If no canvas briefs exist for the current page, skip Check 11 and note that completeness audit cannot run.
**Heuristic evaluation note**: Nielsen 10 / UX heuristic evaluation is **not** part of this skill. Route those checks to `design-validation` — it owns heuristic evaluation, cognitive walkthroughs, and post-build review checklists.

---

## Audit output format

After running all checks, report findings as:

```
## Audit Results — [Page/File Name] — [Date]

### ✅ Passed
- [List checks that passed]

### ⚠️ Issues Found

#### Hardcoded Colors (N found)
- [Layer name] → [current value] → [correct token]

#### Hardcoded Spacing (N found)
- [Layer name] → [current value] → [correct token]

#### Non-Auto-Layout Frames (N found)
- [Frame name] → [action taken]

#### Detached Components (N found)
- [Layer name] → [action taken]

### Fixes Applied
- [Summary of what was fixed]

### Remaining Issues (requires manual attention)
- [Anything you couldn't fix automatically]

### Completeness Gaps (N found)
- [Category — Screen name] → [gap description] → [story reference if applicable]
```

---

## Fix priority order

1. **Detached components** — highest risk, breaks update propagation
2. **Hardcoded colors** — most visible in theming/dark mode
3. **Non-auto-layout frames** — breaks responsive resizing
4. **Hardcoded spacing/radius** — affects consistency
5. **Completeness gaps** — reconcile with canvas briefs before marking screens final
6. **Missing component properties** — affects usability

---

## Pre-library-migration audit (stricter)

When running an audit before a library migration, apply zero-tolerance:
- All 11 checks must pass before migration starts
- No hardcoded values allowed — every value must have a token
- No detached components allowed — must be relinked or recreated
- All completeness gaps reconciled with canvas briefs
- Document any intentional exceptions with an annotation component
- Run `design-validation` separately for Nielsen heuristic evaluation before migration — violations there should also be resolved or explicitly accepted

---

## Develop loop drift check

When running an audit, also check for drift between Figma screens and their canvas briefs / prototype:

1. **Brief → Figma alignment** — for each screen with a canvas brief, verify components, states, and content strings match. Flag mismatches.
2. **Figma → Prototype alignment** — if a prototype exists (`design/16_PROTOTYPE/manifest.md`), check that Figma screens and prototype screens are in sync per the manifest's sync hashes.
3. **Log drifts** — any detected drifts should be added to `design/16_PROTOTYPE/drift-log.md` for resolution.
