---
name: design-accessibility
description: >
  Defines accessibility requirements and patterns — WCAG compliance targets, ARIA patterns
  per component, keyboard navigation plans, color contrast audits, and screen reader
  considerations. Ensures accessibility is built in from the start, not retrofitted.
  Triggers on: "accessibility", "a11y", "WCAG", "screen reader", "keyboard navigation",
  "contrast", "ARIA", "assistive technology", "tab order", "focus management", "alt text",
  "color blind", or when ensuring the design meets accessibility standards. Upstream
  dependencies: design-visual, design-interaction, design-ia.
---

# Accessibility — Built-In, Not Bolted On

## Purpose

Define accessibility requirements and patterns before UI construction so they are incorporated from the start. Every component built in Figma should already know its ARIA role, keyboard behavior, and contrast requirements from this mode's output.

---

## Dependency check

**Soft dependencies** (warn if missing, don't block):
- `design/visual/color-rationale.md` — colors to audit for contrast
- `design/interaction/interaction-model.md` — interactions need keyboard equivalents
- `design/information-architecture/navigation-model.md` — navigation needs keyboard nav plan

---

## Workflow

### Step 1 — Requirements definition

```markdown
## Accessibility Requirements

### Compliance target
- **WCAG version:** 2.1 (or 2.2 if applicable)
- **Conformance level:** AA (minimum for government/institutional systems)
- **Legal/regulatory basis:** [cite if applicable]

### Assistive technology support
| Technology | Support level | Notes |
|-----------|--------------|-------|
| Screen readers (NVDA, JAWS, VoiceOver) | Full | [notes] |
| Keyboard-only navigation | Full | [notes] |
| Screen magnification (200%-400%) | Full | [notes] |
| Voice control (Dragon, Voice Control) | Partial | [notes] |
| Switch access | Partial | [notes] |

### Key constraints
- [Any domain-specific accessibility requirements]
- [Organizational accessibility standards beyond WCAG]
```

Write to `design/accessibility/accessibility-requirements.md`.

### Step 2 — Color contrast audit

Audit every color combination from the visual spec:

```markdown
## Color Contrast Audit

### Text on background
| Foreground | Background | Contrast ratio | WCAG AA (normal) | WCAG AA (large) | Pass? |
|-----------|-----------|----------------|------------------|-----------------|-------|
| [color] | [color] | [ratio] | 4.5:1 required | 3:1 required | [Y/N] |

### UI elements on background
| Element | Color | Background | Contrast ratio | 3:1 required | Pass? |
|---------|-------|-----------|----------------|-------------|-------|

### Failures & remediations
| Combination | Current ratio | Required | Suggested fix |
|-------------|--------------|----------|---------------|

### Color-independence check
| Information conveyed by color | Secondary indicator | Notes |
|-----------------------------|---------------------|-------|
| [e.g., status levels] | [icon, label, pattern] | [never color-only] |
```

Write to `design/accessibility/color-contrast-audit.md`.

### Step 3 — ARIA patterns

For each component type, define the ARIA semantics:

```markdown
## ARIA Patterns

### [Component type]
- **Role:** [ARIA role]
- **States:** [aria-expanded, aria-selected, aria-disabled, etc.]
- **Properties:** [aria-label, aria-describedby, aria-live, etc.]
- **Keyboard:** [which keys do what]
- **Focus management:** [where does focus go on open/close/action]
- **Screen reader announcement:** [what is announced and when]

### Common patterns reference
| Pattern | ARIA role | Key interactions | Announcement |
|---------|----------|-----------------|-------------|
| Button | button | Enter/Space to activate | "[label], button" |
| Link | link | Enter to follow | "[label], link" |
| Text input | textbox | Type to enter | "[label], edit text" |
| Checkbox | checkbox | Space to toggle | "[label], checkbox, [checked/unchecked]" |
| Select/Dropdown | combobox/listbox | Arrow keys to navigate | "[label], combobox, [value]" |
| Modal dialog | dialog | Esc to close, Tab trapped | "[title], dialog" |
| Data table | table | Arrow keys for cells | "[caption], table, [rows] x [cols]" |
| Tab panel | tablist/tab/tabpanel | Arrow keys between tabs | "[label], tab, [selected]" |
| Toast/Alert | status/alert | — (auto-announced) | "[message]" |
| Navigation | navigation | Tab between items | "[label], navigation" |
```

Write to `design/accessibility/aria-patterns.md`.

### Step 4 — Keyboard navigation plan

```markdown
## Keyboard Navigation Plan

### Global keyboard shortcuts
| Key | Action | Context |
|-----|--------|---------|
| Tab | Move to next focusable element | Global |
| Shift+Tab | Move to previous focusable element | Global |
| Esc | Close overlay / cancel action | When overlay is open |
| [custom shortcuts if any] | | |

### Per-screen tab order
#### [Screen Name]
1. [Skip link to main content]
2. [Navigation items]
3. [Primary content area — list order]
4. [Secondary actions]
5. [Footer elements]

### Focus management rules
| Event | Focus behavior |
|-------|---------------|
| Modal opens | Focus moves to first focusable element inside modal |
| Modal closes | Focus returns to the element that triggered the modal |
| Inline error on submit | Focus moves to first field with error |
| New content loaded | Focus stays; screen reader announces via aria-live |
| Page navigation | Focus moves to page heading |
| Toast appears | Announced via aria-live, no focus change |
```

Write to `design/accessibility/keyboard-nav-plan.md`.

---

## Bridge to Figma

| A11y artifact | Figma skill | How it's used |
|--------------|------------|---------------|
| Contrast audit | `figma-tokens` | May require adjusting primitive color values |
| ARIA patterns | `figma-component` | Component descriptions include ARIA roles |
| Focus management | `figma-component` | Focus state variant required for interactive components |
| Keyboard nav | `design-canvas` | Canvas briefs include tab order per screen |

---

## Output checklist

- [ ] `design/accessibility/accessibility-requirements.md` — WCAG target, AT support matrix
- [ ] `design/accessibility/color-contrast-audit.md` — all color combos tested, failures flagged
- [ ] `design/accessibility/aria-patterns.md` — per-component ARIA semantics
- [ ] `design/accessibility/keyboard-nav-plan.md` — tab order, focus management, shortcuts

---

## Rules

- WCAG AA is the minimum. Never lower the target without explicit user approval.
- Color must never be the only indicator of meaning. Always pair with text, icon, or pattern.
- Every interactive element must be keyboard-operable. No mouse-only interactions.
- Focus must be visible at all times — never hide the focus indicator.
- Modal dialogs must trap focus (Tab cycles within the modal, not behind it).
- Screen reader announcements for dynamic content use `aria-live="polite"` by default, `aria-live="assertive"` only for errors or time-sensitive alerts.
- If the contrast audit reveals failures, flag them to `design-visual` for color adjustment before proceeding to Figma tokens.
