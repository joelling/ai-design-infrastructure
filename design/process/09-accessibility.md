# Chapter 9: Accessibility

> **Tier 3 — Design** | Mode: `design-accessibility`

## Why this matters

Accessibility is not a layer you add at the end. It's a set of requirements that shape component design, color choices, keyboard behavior, and content structure from the start. Retrofitting accessibility is expensive and often results in poor experiences for assistive technology users.

## The mental model

For every design decision, ask: "Can someone use this if they can't see it? Can't hear it? Can't use a mouse? Can't process information quickly?" Accessibility means ensuring the answer is yes — through semantic structure, keyboard operability, screen reader announcements, and contrast.

## Inputs

- `design/visual/color-rationale.md` — colors to audit for contrast
- `design/interaction/interaction-model.md` — interactions need keyboard equivalents
- `design/information-architecture/navigation-model.md` — navigation needs a keyboard plan

## Process

**1. Define requirements.** Set the WCAG target (typically 2.1 AA minimum). Define assistive technology support levels. Document domain-specific accessibility requirements.

**2. Audit color contrast.** Test every color combination from the visual spec. Text on background (4.5:1 for normal, 3:1 for large), UI elements on background (3:1). Flag failures with suggested fixes. Verify that no information is conveyed by color alone — always pair with text, icon, or pattern.

**3. Define ARIA patterns.** For each component type, document: ARIA role, states (expanded, selected, disabled), properties (label, describedby, live), keyboard interactions, focus management, and screen reader announcements.

**4. Plan keyboard navigation.** Define global keyboard shortcuts. For each screen, specify the tab order. Define focus management rules: where focus goes when a modal opens/closes, when inline errors appear, when new content loads.

## Outputs

| File | What it contains |
|------|-----------------|
| `design/accessibility/accessibility-requirements.md` | WCAG target, AT support matrix |
| `design/accessibility/color-contrast-audit.md` | All color combos tested, failures flagged |
| `design/accessibility/aria-patterns.md` | Per-component ARIA semantics |
| `design/accessibility/keyboard-nav-plan.md` | Tab order, focus management, shortcuts |

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
