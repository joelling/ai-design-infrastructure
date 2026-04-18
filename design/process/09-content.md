---
operation: ingest
---

# Content Strategy

> **Tier 3 — Design** | Mode: `design-content`

## Why this matters

Every UI element contains text — labels, messages, errors, empty states, help text. Without a content strategy, different screens use different terms for the same concept, error messages are inconsistent, and button labels are vague. Content strategy ensures the product speaks with one voice and uses one vocabulary.

## The mental model

You are defining how the product talks to its users. Two dimensions:
- **Voice** = the product's consistent personality (always the same — e.g., professional, direct, helpful)
- **Tone** = how the voice shifts by context (success is encouraging, errors are calm and actionable, destructive actions are cautious)

And one source of truth: the **terminology guide**. Every concept in the product has one canonical label, documented once, used everywhere.

## Inputs

- `design/02_USER_MODELS/personas/*` — content adapts to audience expertise
- `design/02_USER_MODELS/behavioral-archetypes.md` — archetype tensions inform terminology complexity and tone adaptation
- `design/07_INTERACTION/error-strategy.md` — error messages need content
- `design/07_INTERACTION/state-inventory.md` — empty/loading/error states need content
- `design/01_DISCOVERY/domain-glossary.md` — terminology source of truth

## Upstream sync

**On entry:** Check `design/09_CONTENT/_upstream.md` (if it exists). If upstream has changed since last run:

1. Report what changed and classify severity (additive / corrective / structural)
2. Ask the designer: re-process with new data, or proceed with current outputs?
3. If re-processing, update incrementally — revise affected terminology, microcopy, and templates, don't rebuild from scratch

**On completion:** After producing or updating artifacts:

1. Add or increment version headers on all changed output files
2. Update `design/09_CONTENT/_upstream.md` with consumed artifact versions
3. Report which downstream modes are now potentially stale (accessibility, canvas, figma-component)

## Process

**0. Check upstream sync.** Run the upstream sync check described above. If this is a first run, note which upstream artifacts are available and which are absent.

**1. Define voice and tone.** Copy `design/templates/voice-tone.tpl.md` to `design/09_CONTENT/voice-tone.md` if the file does not already exist. The template pre-seeds the context category rows (Success, Error, Warning, Onboarding, Critical, Neutral) and voice adjective format. Fill the PROJECT-SPECIFIC sections: voice adjective values, definitions, and all tone descriptions per context.

**2. Build the terminology guide.** For every concept in the product, establish: the canonical label, abbreviation rules, terms to never use, and role-specific display rules. Define formatting conventions for dates, times, numbers, names, and status labels.

**3. Create microcopy patterns.** Copy `design/templates/microcopy-patterns.tpl.md` to `design/09_CONTENT/microcopy-patterns.md` if the file does not already exist. The template pre-seeds pattern type headings and structural rules (button label format, form field composition, validation message format, empty state anatomy, status anatomy). Fill the PROJECT-SPECIFIC copy examples below each rule using project terminology and voice/tone.

**4. Write content templates.** Copy `design/templates/content-templates.tpl.md` to `design/09_CONTENT/content-templates.md` if the file does not already exist. The template pre-seeds template type inventory (notification, confirmation dialog, help text, timestamp display logic) with section schemas. Fill the PROJECT-SPECIFIC examples using project terminology and voice/tone.

## Outputs

| File | Type | What it contains |
|------|------|-----------------|
| `design/09_CONTENT/voice-tone.md` | hybrid template | Context category rows pre-seeded; voice adjectives and tone descriptions filled by mode |
| `design/09_CONTENT/terminology.md` | synthesis | Canonical terms, formatting conventions, abbreviation rules |
| `design/09_CONTENT/microcopy-patterns.md` | hybrid template | Pattern type headings and structural rules pre-seeded; copy examples filled by mode |
| `design/09_CONTENT/content-templates.md` | hybrid template | Template type inventory with schemas pre-seeded; project examples filled by mode |

*`_upstream.md` is maintained by `sync-manifest.js` and is not a mode deliverable.*

## Rules

- Every label and message must use terminology from `terminology.md`. No ad-hoc naming.
- Error messages always follow: [what happened] + [what to do]. Never show raw error codes.
- Button labels must be specific verbs ("Save changes" not "OK", "Delete record" not "Remove").
- Placeholder text is for examples, not labels. Never use placeholder as the only label.
- Content must be role-appropriate. Document per-role variations explicitly.
- Sentence case everywhere unless documented otherwise.

## BRD enrichment

After completing content artifacts:
1. **LOV sheet** — populate from the terminology guide: canonical list names, display values, system codes
2. **Acceptance criteria language** — review existing AC entries in the BRD User Stories sheet and align with canonical terminology. Replace ad-hoc terms with terminology guide entries.

Update `design/BRD_manifest.md` after enrichment.

## Feeds into

- **Figma Components** — TEXT properties use these patterns
- **[Canvas Briefs](12-canvas.md)** — exact labels and messages for each screen
- **[Accessibility](09-accessibility.md)** — content affects screen reader announcements
- **BRD** (`design/BRD.xlsx`) — LOV sheet populated from terminology guide; acceptance criteria language aligned with canonical terms
