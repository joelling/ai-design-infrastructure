---
name: figma-audit
description: >
  Audits a Figma file or page for design system violations: hardcoded values, missing
  variable bindings, non-auto-layout frames, detached components, and publishing issues.
  Also runs UX heuristic audit (Nielsen's 10 applied to built screens) and completeness
  audit (brief→screen verification) as extended post-build checks. Use this skill for
  design QA, before library migrations, or any time you want to verify the file is clean.
  Triggers on: "audit", "design QA", "check file", "find hardcoded values", "check for
  non-components", "check auto-layout", "find issues", "design system check", "before
  library mode", "validate tokens", "clean up", "heuristic audit", "UX audit", "screen
  completeness", "design review", "review screens", "check screens against briefs", or
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

### Check 11 — UX Heuristic Audit
**What**: Built screens evaluated against Nielsen's 10 usability heuristics. Run post-build, against completed Figma screens compared with canvas briefs. Requires canvas briefs to exist.
**How**: For each screen on the current page, verify each heuristic. Rate: **Pass** / **Needs work** / **Violation**.

| # | Heuristic | What to verify |
|---|-----------|---------------|
| 1 | Visibility of system status | Loading states, progress indicators, and async feedback built for all state-change actions |
| 2 | Match between system and real world | Labels and terminology match domain glossary and terminology guide |
| 3 | User control and freedom | Undo, cancel, and escape routes present for all destructive or multi-step actions |
| 4 | Consistency and standards | Same pattern uses the same component across all screens; platform conventions followed |
| 5 | Error prevention | Confirmation dialogs present for destructive actions; constraints and defaults prevent common errors |
| 6 | Recognition rather than recall | Options visible; no critical information buried behind unlabeled icons or collapsed sections |
| 7 | Flexibility and efficiency of use | Expert paths or shortcuts present where archetypes require them |
| 8 | Aesthetic and minimalist design | Information density matches canvas brief intent; no low-priority content competing with primary |
| 9 | Help users recover from errors | Error messages follow the error strategy: what happened + why + what to do |
| 10 | Help and documentation | Contextual help present at known friction points identified in behavioral spec |

**Fix**: Document each Violation as a UX heuristic finding in the audit report.
**Governance feed**: Heuristic violations appearing on 3+ screens are flagged with `GOVERNANCE SIGNAL` in the audit report. Governance Phase B reads these as structural evidence when evaluating design principle candidates.

### Check 12 — Completeness Audit
**What**: Per-screen verification that the built Figma screen covers everything the canvas brief specifies.
**How**: For each screen on the current page, locate its canvas brief in `design/13_CANVAS/`. Verify each category:

| Category | What to check |
|----------|--------------|
| Information hierarchy | Primary content visually dominant; secondary accessible within one interaction; tertiary requires deliberate action |
| Interaction completeness | All states from state inventory built (empty, loading, populated, error at minimum); all behavioral spec actions have visible affordances |
| Visual consistency | Zero hardcoded values; all component instances used (no detached or re-created elements); naming matches convention |
| Content accuracy | Labels match terminology guide; error messages follow content strategy; empty state copy present and correct |
| Accessibility | Contrast passes WCAG AA; focus indicators visible; no color-only state signals; non-text content has accessible labels |
| Story coverage | Every DS-NNN in canvas brief traceability block is addressed by at least one element or interaction; no features without story trace |

**Fix**: Document each gap as a completeness finding. Brief → Figma gaps must be reconciled before canvas briefs are marked final.
**Skip condition**: If no canvas briefs exist for the current page, skip Check 12 and note that completeness audit cannot run.

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

### UX Heuristic Violations (N found)
- [Heuristic N — Screen name] → [issue description] → [Needs work / Violation]
- GOVERNANCE SIGNAL: [Heuristic N — pattern] — found in [screen1], [screen2], [screen3] (repeat if 3+ screens)

### Completeness Gaps (N found)
- [Category — Screen name] → [gap description] → [story reference if applicable]
```

---

## Fix priority order

1. **Detached components** — highest risk, breaks update propagation
2. **Hardcoded colors** — most visible in theming/dark mode
3. **UX heuristic violations (Violation severity)** — user-facing quality; fix before delivery
4. **Non-auto-layout frames** — breaks responsive resizing
5. **Hardcoded spacing/radius** — affects consistency
6. **Completeness gaps** — reconcile with canvas briefs before marking screens final
7. **Missing component properties** — affects usability

---

## Pre-library-migration audit (stricter)

When running an audit before a library migration, apply zero-tolerance:
- All 12 checks must pass before migration starts
- No hardcoded values allowed — every value must have a token
- No detached components allowed — must be relinked or recreated
- No UX heuristic violations at Violation severity — resolve or document as accepted risk with justification
- All completeness gaps reconciled with canvas briefs
- Document any intentional exceptions with an annotation component

---

## Develop loop drift check

When running an audit, also check for drift between Figma screens and their canvas briefs / prototype:

1. **Brief → Figma alignment** — for each screen with a canvas brief, verify components, states, and content strings match. Flag mismatches.
2. **Figma → Prototype alignment** — if a prototype exists (`design/16_PROTOTYPE/manifest.md`), check that Figma screens and prototype screens are in sync per the manifest's sync hashes.
3. **Log drifts** — any detected drifts should be added to `design/16_PROTOTYPE/drift-log.md` for resolution.
