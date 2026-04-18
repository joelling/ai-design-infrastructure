<!-- artifact: design/10_ACCESSIBILITY/accessibility-requirements.md | version: 1 | mode: design-accessibility | updated: [DATE] -->

# Accessibility Requirements

## Compliance target

**Standard:** WCAG 2.1 AA (minimum)
**Scope:** All interactive elements and content visible to end users. AAA criteria applied where they improve usability without scope conflict.

## Assistive technology support matrix

| AT | Platform | Browser | Support level |
|---|---|---|---|
| NVDA (latest) | Windows | Chrome, Firefox | Full |
| JAWS (latest) | Windows | Chrome, Edge | Full |
| VoiceOver | macOS | Safari | Full |
| VoiceOver | iOS | Safari | Full |
| TalkBack | Android | Chrome | Full |
| Narrator | Windows | Edge | Partial — critical paths only |

## Keyboard navigation requirements

- All interactive elements reachable by Tab / Shift-Tab
- All actions operable by keyboard (Enter, Space, Arrow keys per ARIA patterns)
- No keyboard trap — focus must be releasable from all components
- Skip navigation link required on pages with repeated navigation blocks
- DOM (reading) order must match visual order

## Focus management standards

| Trigger | Focus destination |
|---|---|
| Modal / dialog opens | First focusable element inside dialog |
| Modal / dialog closes | Element that triggered it |
| Route / page change | Page title or first heading (`h1`) |
| Inline error appears | Error message or first invalid field |
| Notification (critical) | Notification region |
| Notification (non-critical) | Live region announcement only, no focus move |
| Destructive confirmation | Confirm button (not cancel — never default to the dangerous action) |

## Color and contrast minimums

| Element type | Minimum ratio |
|---|---|
| Body text (< 18pt regular / < 14pt bold) | 4.5 : 1 |
| Large text (≥ 18pt regular / ≥ 14pt bold) | 3 : 1 |
| UI components and graphic elements | 3 : 1 |
| Decorative content | No requirement |

## Motion and animation

- All non-essential animation must respect `prefers-reduced-motion: reduce`
- No content flashes more than 3 times per second
- Auto-playing motion must be pausable, stoppable, or hideable

---

<!-- PROJECT-SPECIFIC: Add domain- or regulatory-specific requirements below. Delete this section if none apply. -->
<!-- Examples: healthcare → Section 508; EU products → EN 301 549 -->

## Domain / regulatory additions

<!-- [Add project-specific requirements here] -->
