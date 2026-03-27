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

```markdown
## Voice & Tone Guidelines

### Voice (consistent personality)
Our voice is: [3-4 adjectives]
- [Adjective 1]: [what this means in practice, with example]
- [Adjective 2]: [what this means in practice, with example]
- [Adjective 3]: [what this means in practice, with example]

Our voice is NOT:
- [Anti-adjective]: [what we avoid, with counter-example]

### Tone (shifts by context)
| Context | Tone shift | Example |
|---------|-----------|---------|
| Success | [how tone changes] | "[example message]" |
| Error | [how tone changes] | "[example message]" |
| Warning | [how tone changes] | "[example message]" |
| Onboarding/help | [how tone changes] | "[example message]" |
| Critical/destructive | [how tone changes] | "[example message]" |
| Neutral/informational | [baseline tone] | "[example message]" |
```

Write to `design/09_CONTENT/voice-tone.md`.

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

```markdown
## Microcopy Patterns

### Button labels
| Action type | Pattern | Example | Anti-example |
|-------------|---------|---------|-------------|
| Create | [verb] + [noun] | "Add record" | "Submit" (too vague) |
| Confirm | [specific verb] | "Save changes" | "OK" (too vague) |
| Cancel | "Cancel" | "Cancel" | "Go back" (ambiguous) |
| Destructive | [verb] + [noun] | "Delete record" | "Remove" (too vague) |
| Navigate | [destination] | "View details" | "Click here" |

### Form labels
| Element | Pattern | Example |
|---------|---------|---------|
| Field label | [Noun phrase, sentence case] | "Date of birth" |
| Placeholder | [Example value or instruction] | "e.g., 15 Mar 1990" |
| Helper text | [Additional context] | "Must be 18 or older" |
| Required indicator | [pattern] | [asterisk? word?] |

### Validation messages
| Type | Pattern | Example |
|------|---------|---------|
| Required field | "[Field] is required" | "Date of birth is required" |
| Format error | "[Field] must be [format]" | "Phone must be 8 digits" |
| Range error | "[Field] must be [constraint]" | "Age must be between 18 and 65" |
| Conflict | "[Issue]. [Resolution]" | "This record was updated by someone else. Review changes." |

### Empty states
| Context | Structure | Example |
|---------|-----------|---------|
| No data yet | [Icon] + [message] + [CTA] | "No records found. Add your first record." |
| Filtered to zero | [message] + [suggestion] | "No results match your filters. Try adjusting your criteria." |
| Permission denied | [message] + [action] | "You don't have access to this section. Contact your administrator." |

### Status messages
| Status type | Pattern | Duration | Example |
|-------------|---------|----------|---------|
| Success | "[What happened] successfully" | Auto-dismiss 4s | "Record saved successfully" |
| In progress | "[Action] in progress..." | Until complete | "Importing records..." |
| Error | "[What happened]. [What to do]." | Persistent | "Save failed. Check your connection and try again." |
```

Write to `design/09_CONTENT/microcopy-patterns.md`.

### Step 4 — Content templates

```markdown
## Content Templates

### Notification template
**Subject:** [Action] — [Object]
**Body:** [What happened]. [What to do next, if anything].

### Confirmation dialog template
**Title:** [Verb] [object]?
**Body:** [Consequence of action]. [Is it reversible?]
**Primary action:** [Specific verb]
**Secondary action:** Cancel

### Help text template
[One sentence explaining what this feature/field does].
[One sentence explaining why it matters or what to enter].

### Timestamp display
- Within 1 hour: "X minutes ago"
- Within 24 hours: "X hours ago"
- Within 7 days: "[Day], [time]"
- Beyond 7 days: "[Date]"
```

Write to `design/09_CONTENT/content-templates.md`.

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

- [ ] `design/09_CONTENT/voice-tone.md` — voice principles, tone shifts by context
- [ ] `design/09_CONTENT/terminology.md` — canonical terms, formatting conventions, abbreviation rules
- [ ] `design/09_CONTENT/microcopy-patterns.md` — patterns for buttons, forms, validation, empty states, status messages
- [ ] `design/09_CONTENT/content-templates.md` — templates for notifications, dialogs, help text, timestamps

---

## Rules

- Every label, message, and text element must use terminology from `terminology.md`. No ad-hoc naming.
- Error messages always follow the pattern: [What happened] + [What to do]. Never show raw error codes to users.
- Button labels must be specific verbs, not generic ("Save changes" not "OK", "Delete record" not "Remove").
- Placeholder text is for examples, not labels. Never use placeholder as the only label.
- Content must be role-appropriate — clinical terminology for clinical users, plain language for administrative users. Document per-role variations explicitly.
- Sentence case everywhere (not Title Case) unless the project has a documented reason for Title Case.
