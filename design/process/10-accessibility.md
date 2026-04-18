# Accessibility

> **Tier 3 — Design** | Mode: `design-accessibility`

## Why this matters

Accessibility is not a layer you add at the end. It's a set of requirements that shape component design, color choices, keyboard behavior, and content structure from the start. Retrofitting accessibility is expensive and often results in poor experiences for assistive technology users.

## The mental model

For every design decision, ask: "Can someone use this if they can't see it? Can't hear it? Can't use a mouse? Can't process information quickly?" Accessibility means ensuring the answer is yes — through semantic structure, keyboard operability, screen reader announcements, and contrast.

## Inputs

- `design/08_VISUAL/color-rationale.md` — colors to audit for contrast
- `design/07_INTERACTION/interaction-model.md` — interactions need keyboard equivalents
- `design/06_INFORMATION_ARCHITECTURE/navigation-model.md` — navigation needs a keyboard plan

## Upstream sync

**On entry:** Check `design/10_ACCESSIBILITY/_upstream.md` (if it exists). If upstream has changed since last run:

1. Report what changed and classify severity (additive / corrective / structural)
2. Ask the designer: re-process with new data, or proceed with current outputs?
3. If re-processing, update incrementally — revise affected patterns and audits, don't rebuild from scratch

**On completion:** After producing or updating artifacts:

1. Add or increment version headers on all changed output files
2. Update `design/10_ACCESSIBILITY/_upstream.md` with consumed artifact versions
3. Report which downstream modes are now potentially stale (canvas, figma-tokens, figma-component)

## Process

**0. Check upstream sync.** Run the upstream sync check described above. If this is a first run, note which upstream artifacts are available and which are absent.

**1. Define requirements.** Copy `design/templates/a11y-requirements.tpl.md` to `design/10_ACCESSIBILITY/accessibility-requirements.md` if the file does not already exist. The template pre-seeds the WCAG 2.1 AA target, AT support matrix, keyboard navigation requirements, focus management standards, contrast minimums, and motion rules. Fill the PROJECT-SPECIFIC section with domain or regulatory additions.

**2. Audit color contrast.** Test every color combination from the visual spec. Text on background (4.5:1 for normal, 3:1 for large), UI elements on background (3:1). Flag failures with suggested fixes. Verify that no information is conveyed by color alone — always pair with text, icon, or pattern.

**3. Define ARIA patterns.** Copy `design/templates/aria-reference.tpl.md` to `design/10_ACCESSIBILITY/aria-reference.md` if the file does not already exist — this is a static reference and requires no project customization. Then create `design/10_ACCESSIBILITY/aria-application.md` with the project-specific component-to-role mapping: for each component in the project's component set, document ARIA role, states, properties, keyboard interactions, focus management, and screen reader announcements.

**4. Plan keyboard navigation.** Define global keyboard shortcuts. For each screen, specify the tab order. Define focus management rules: where focus goes when a modal opens/closes, when inline errors appear, when new content loads.

## Outputs

| File | Type | What it contains |
|------|------|-----------------|
| `design/10_ACCESSIBILITY/accessibility-requirements.md` | pure template | WCAG 2.1 AA target, AT support matrix, focus management standards; domain additions filled by mode |
| `design/10_ACCESSIBILITY/color-contrast-audit.md` | synthesis | All color combos tested, failures flagged |
| `design/10_ACCESSIBILITY/aria-reference.md` | pure template | Static ARIA role reference table for standard component types; no project customization required |
| `design/10_ACCESSIBILITY/aria-application.md` | synthesis | Per-component ARIA role mapping for this project's specific component set |
| `design/10_ACCESSIBILITY/keyboard-nav-plan.md` | synthesis | Tab order, focus management, shortcuts |

*`_upstream.md` is maintained by `sync-manifest.js` and is not a mode deliverable.*

## Rules

- WCAG AA is the minimum. Never lower without explicit approval.
- Color must never be the only indicator of meaning.
- Every interactive element must be keyboard-operable.
- Focus must be visible at all times.
- Modal dialogs must trap focus.
- Screen reader announcements use `aria-live="polite"` by default, `assertive` only for errors or time-sensitive alerts.
- If the contrast audit reveals failures, flag to visual design for color adjustment before Figma tokens.

## Feeds into

- **Figma Tokens** — may require adjusting color values
- **Figma Components** — ARIA roles, focus states, keyboard behavior
- **[Canvas Briefs](12-canvas.md)** — tab order and ARIA landmarks per screen
