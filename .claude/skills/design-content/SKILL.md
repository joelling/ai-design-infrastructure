---
name: design-content
description: >
  Defines content strategy — voice and tone, microcopy patterns, terminology guide, and
  content templates. Ensures consistent, clear language across all screens before components
  are built. Triggers on: "content strategy", "microcopy", "voice and tone", "terminology",
  "labels", "error messages", "empty states text", "button labels", "placeholder text",
  "help text", "content guidelines", or when determining what text should appear in any
  UI element. Upstream dependencies: design-user-models, design-interaction, design-discovery.
---

# Content Strategy — Voice, Tone & Microcopy

## Purpose

Define the content strategy so that every text element in the product — labels, messages, errors, empty states, help text — is consistent, clear, and appropriate for the audience. Content decisions made here feed directly into Figma component TEXT properties.

---

## Dependency check

**Soft dependencies** (warn if missing, don't block):
- `design/02_USER_MODELS/personas/*` — content adapts to audience expertise
- `design/02_USER_MODELS/behavioral-archetypes.md` — archetype tensions inform terminology complexity and tone adaptation
- `design/07_INTERACTION/error-strategy.md` — error messages need content
- `design/07_INTERACTION/state-inventory.md` — empty/loading/error states need content
- `design/01_DISCOVERY/domain-glossary.md` — terminology source of truth

---

## Upstream sync (step 0)

Before starting this mode's workflow:

0. **Value alignment check:** If `design/01_DISCOVERY/value-framework.md` exists, verify that this mode's outputs can be traced to a vision element, driver, or lever defined there. If an output cannot be connected to a documented user need or a value lever, question whether it belongs. If no value framework exists yet, proceed — but flag any outputs whose purpose is unclear.
1. Check `design/09_CONTENT/_upstream.md` for the dependency manifest
2. Compare recorded upstream versions against current artifact files
3. If upstream has changed, report what changed (additive / corrective / structural) and ask the designer: re-process or proceed?
4. If re-processing, update incrementally — process the delta, don't rebuild from scratch

After completing this mode's workflow:

1. Add or increment `<!-- artifact: ... -->` version headers on all changed output files
2. Update `design/09_CONTENT/_upstream.md` with consumed and produced artifact versions
3. Report which downstream modes are now potentially stale

### Script commands
```bash
# On entry — check staleness:
node design/scripts/sync-status.js

# After completing — version and manifest:
node design/scripts/sync-version.js init <file> design-content   # first time
node design/scripts/sync-version.js bump <file>                    # subsequent updates
node design/scripts/sync-manifest.js content                       # update manifest
```

---

## Workflow

### Step 1 — Voice & tone

Copy `design/templates/voice-tone.tpl.md` to `design/09_CONTENT/voice-tone.md` if the file does not already exist. The template pre-seeds the context category rows (Success, Error, Warning, Onboarding, Critical, Neutral) and voice adjective format. Fill the PROJECT-SPECIFIC sections: voice adjective values, definitions, and all tone descriptions per context.

### Step 2 — Terminology guide

```markdown
## Terminology Guide

### Canonical terms
| Concept | Canonical label | Abbreviation | Never say | Role-specific display |
|---------|----------------|-------------|-----------|---------------------|
| [concept] | [label] | [abbr] | [alternatives to avoid] | [who sees what] |

### Formatting conventions
- Dates: [format, e.g., "15 Mar 2026"]
- Times: [format, e.g., "14:30" or "2:30 PM"]
- Numbers: [format, e.g., "1,234" or "1234"]
- Percentages: [format]
- Currency: [format]
- Names: [format, e.g., "Rank + Last Name" or "Full name"]
- Status labels: [capitalization convention]

### Abbreviation rules
- [When to abbreviate vs. spell out]
- [Standard abbreviations used across the product]
```

Write to `design/09_CONTENT/terminology.md`.

### Step 3 — Microcopy patterns

Copy `design/templates/microcopy-patterns.tpl.md` to `design/09_CONTENT/microcopy-patterns.md` if the file does not already exist. The template pre-seeds pattern type headings and structural rules (button label format, form field composition, validation message format, empty state anatomy, status anatomy). Fill the PROJECT-SPECIFIC copy examples below each rule using project terminology and voice/tone.

### Step 4 — Content templates

Copy `design/templates/content-templates.tpl.md` to `design/09_CONTENT/content-templates.md` if the file does not already exist. The template pre-seeds template type inventory (notification, confirmation dialog, help text, timestamp display logic) with section schemas. Fill the PROJECT-SPECIFIC examples using project terminology and voice/tone.

---

## Bridge to Figma

| Content artifact | Figma skill | How it's used |
|-----------------|------------|---------------|
| Microcopy patterns | `figma-component` | TEXT properties: label, placeholder, helperText |
| Empty state content | `figma-component` | State/Empty component content |
| Error messages | `figma-component` | State/Error component content |
| Terminology | All Figma work | Canonical labels used everywhere |
| Terminology + microcopy | **BRD** (`design/BRD.xlsx`) | LOV sheet populated from terminology guide; acceptance criteria language aligned with canonical terms. Update `design/BRD_manifest.md` after enrichment. |

---

## Output checklist

- [ ] `design/09_CONTENT/voice-tone.md` — voice principles, tone shifts by context `[hybrid template]`
- [ ] `design/09_CONTENT/terminology.md` — canonical terms, formatting conventions, abbreviation rules `[synthesis]`
- [ ] `design/09_CONTENT/microcopy-patterns.md` — patterns for buttons, forms, validation, empty states, status messages `[hybrid template]`
- [ ] `design/09_CONTENT/content-templates.md` — templates for notifications, dialogs, help text, timestamps `[hybrid template]`

---

## Rules

- Every label, message, and text element must use terminology from `terminology.md`. No ad-hoc naming.
- Error messages always follow the pattern: [What happened] + [What to do]. Never show raw error codes to users.
- Button labels must be specific verbs, not generic ("Save changes" not "OK", "Delete record" not "Remove").
- Placeholder text is for examples, not labels. Never use placeholder as the only label.
- Content must be role-appropriate — clinical terminology for clinical users, plain language for administrative users. Document per-role variations explicitly.
- Sentence case everywhere (not Title Case) unless the project has a documented reason for Title Case.
