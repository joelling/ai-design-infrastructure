# Chapter 8: Content Strategy

> **Tier 3 — Design** | Mode: `design-content`

## Why this matters

Every UI element contains text — labels, messages, errors, empty states, help text. Without a content strategy, different screens use different terms for the same concept, error messages are inconsistent, and button labels are vague. Content strategy ensures the product speaks with one voice and uses one vocabulary.

## The mental model

You are defining how the product talks to its users. Two dimensions:
- **Voice** = the product's consistent personality (always the same — e.g., professional, direct, helpful)
- **Tone** = how the voice shifts by context (success is encouraging, errors are calm and actionable, destructive actions are cautious)

And one source of truth: the **terminology guide**. Every concept in the product has one canonical label, documented once, used everywhere.

## Inputs

- `design/user-models/personas/*` — content adapts to audience expertise
- `design/user-models/behavioral-archetypes.md` — archetype tensions inform terminology complexity and tone adaptation
- `design/interaction/error-strategy.md` — error messages need content
- `design/interaction/state-inventory.md` — empty/loading/error states need content
- `design/discovery/domain-glossary.md` — terminology source of truth

## Upstream sync

**On entry:** Check `design/content/_upstream.md` (if it exists). If upstream has changed since last run:

1. Report what changed and classify severity (additive / corrective / structural)
2. Ask the designer: re-process with new data, or proceed with current outputs?
3. If re-processing, update incrementally — revise affected terminology, microcopy, and templates, don't rebuild from scratch

**On completion:** After producing or updating artifacts:

1. Add or increment version headers on all changed output files
2. Update `design/content/_upstream.md` with consumed artifact versions
3. Report which downstream modes are now potentially stale (accessibility, canvas, figma-component)

## Process

**0. Check upstream sync.** Run the upstream sync check described above. If this is a first run, note which upstream artifacts are available and which are absent.

**1. Define voice and tone.** Describe the product's voice with 3-4 adjectives, each with practical examples. Define how tone shifts by context: success, error, warning, onboarding, critical/destructive, and neutral.

**2. Build the terminology guide.** For every concept in the product, establish: the canonical label, abbreviation rules, terms to never use, and role-specific display rules. Define formatting conventions for dates, times, numbers, names, and status labels.

**3. Create microcopy patterns.** Define patterns for: button labels (by action type), form labels (field label, placeholder, helper text, required indicator), validation messages (by error type), empty states (by context), and status messages (by type, with duration).

**4. Write content templates.** Create reusable templates for: notifications, confirmation dialogs, help text, and timestamp display rules.

## Outputs

| File | What it contains |
|------|-----------------|
| `design/content/voice-tone.md` | Voice principles, tone shifts by context |
| `design/content/terminology.md` | Canonical terms, formatting conventions, abbreviation rules |
| `design/content/microcopy-patterns.md` | Patterns for buttons, forms, validation, empty states, status |
| `design/content/content-templates.md` | Templates for notifications, dialogs, help text, timestamps |
| `design/content/_upstream.md` | Upstream dependency manifest — consumed and produced artifact versions |

## Rules

- Every label and message must use terminology from `terminology.md`. No ad-hoc naming.
- Error messages always follow: [what happened] + [what to do]. Never show raw error codes.
- Button labels must be specific verbs ("Save changes" not "OK", "Delete record" not "Remove").
- Placeholder text is for examples, not labels. Never use placeholder as the only label.
- Content must be role-appropriate. Document per-role variations explicitly.
- Sentence case everywhere unless documented otherwise.

## Feeds into

- **Figma Components** — TEXT properties use these patterns
- **[Canvas Briefs](12-canvas.md)** — exact labels and messages for each screen
- **[Accessibility](09-accessibility.md)** — content affects screen reader announcements
