---
name: figma-audit
description: >
  Audits a Figma file or page for design system violations: hardcoded values, missing
  variable bindings, non-auto-layout frames, detached components, and publishing issues.
  Use this skill for design QA, before library migrations, or any time you want to
  verify the file is clean. Triggers on: "audit", "design QA", "check file", "find
  hardcoded values", "check for non-components", "check auto-layout", "find issues",
  "design system check", "before library mode", "validate tokens", "clean up", or
  any time a component is acting unexpectedly and you suspect a token/variable issue.
  Run this before every library migration.
---

# Design Audit — Figma System Health Check

Run this audit before library migrations, periodically during active design, or whenever something looks off. The goal is zero violations in a healthy file.

---

## Audit tools

- `figma_audit_design_system` — primary audit tool
- `figma_lint_design` — secondary linter for specific rule violations
- `figma_get_variables` — verify token coverage
- `figma_take_screenshot` — visual verification at start and end

---

## Audit checklist — 7 checks

### Check 1 — Hardcoded colors
**What**: Any fill or stroke not bound to a `semantic/` or `component/` variable.
**How**: Run `figma_audit_design_system`, look for color violations.
**Fix**: For each violation, determine the correct semantic token, rebind the fill/stroke.
**Rule**: Primitives are never applied directly — must go through Semantic.

### Check 2 — Hardcoded spacing
**What**: Padding or gap values not referencing a `semantic/spacing/` or `component/` variable.
**How**: Check auto-layout padding/gap fields for numeric values instead of variable references.
**Fix**: Identify the closest semantic spacing token, rebind.
**Note**: `0` values are acceptable if intentionally zero (e.g., no gap).

### Check 3 — Hardcoded border radius
**What**: Corner radius values not referencing a `semantic/radius/` or `component/` variable.
**How**: Check radius fields on frames and components.
**Fix**: Map to correct semantic radius token and rebind.

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
```

---

## Fix priority order

1. **Detached components** — highest risk, breaks update propagation
2. **Hardcoded colors** — most visible in theming/dark mode
3. **Non-auto-layout frames** — breaks responsive resizing
4. **Hardcoded spacing/radius** — affects consistency
5. **Missing component properties** — affects usability

---

## Pre-library-migration audit (stricter)

When running an audit before a library migration, apply zero-tolerance:
- All 7 checks must pass before migration starts
- No hardcoded values allowed — every value must have a token
- No detached components allowed — must be relinked or recreated
- Document any intentional exceptions with an annotation component

---

## Develop loop drift check

When running an audit, also check for drift between Figma screens and their canvas briefs / prototype:

1. **Brief → Figma alignment** — for each screen with a canvas brief, verify components, states, and content strings match. Flag mismatches.
2. **Figma → Prototype alignment** — if a prototype exists (`design/15_PROTOTYPE/manifest.md`), check that Figma screens and prototype screens are in sync per the manifest's sync hashes.
3. **Log drifts** — any detected drifts should be added to `design/15_PROTOTYPE/drift-log.md` for resolution.
