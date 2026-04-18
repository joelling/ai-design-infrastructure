<!-- artifact: design/09_CONTENT/content-templates.md | version: 1 | mode: design-content | updated: [DATE] -->

# Content Templates

> Reusable copy structures for recurring content patterns. Each section defines the schema; project-specific examples go below each schema.

## Notification

Used for: system alerts, status updates, background process completions.

**Schema:**
- **Title** (optional): 3–6 words. States what happened. Not a question.
- **Body**: 1–2 sentences. [What happened] + [what the user can or should do next].
- **Action** (optional): 1–2 buttons. First = primary response. Second = dismiss or secondary path.
- **Tone**: Matches context (success / warning / error / info) per voice-tone.md.

```
[Title — optional]
[Body: what happened + what to do]
[Action button] [Secondary action — optional]
```

<!-- PROJECT-SPECIFIC: Add recurring notification patterns from this product's notification mapping -->

---

## Confirmation dialog

Used for: destructive actions, irreversible operations, send-without-undo scenarios.

**Schema:**
- **Title**: "[Verb] [what]?" — direct question, names the specific thing being affected.
- **Body**: 1 sentence. States the consequence. Does not ask "are you sure?".
- **Primary button**: The specific destructive verb — "Delete", "Archive", "Revoke" — not "OK" or "Yes".
- **Cancel button**: "Cancel" — always present, always the safer default / first focus.

```
[Verb] [specific item name]?
[One sentence: what will happen, e.g., "This will permanently delete X. You can't undo this."]
[Cancel]  [Destructive verb]
```

**Rules:**
- Never use "Are you sure?" — it adds no information.
- Never use "OK" or "Yes" as the confirm button on destructive actions.
- Cancel is always present and receives focus by default.

<!-- PROJECT-SPECIFIC: List the destructive action dialogs used in this product -->

---

## Help text

Used for: contextual guidance, feature explanation, inline documentation.

**Schema:**
- **Trigger**: Appears on [icon click / hover / always visible].
- **Length**: 1–3 sentences max. If longer, link to full documentation.
- **Structure**: [What this thing does] + [when to use it or what it affects].
- **Tone**: Neutral/instructional per voice-tone.md. No marketing language.

```
[What this is / does]
[When to use it or what it affects — if non-obvious]
[Learn more →] — only if extended documentation exists
```

<!-- PROJECT-SPECIFIC: List recurring help text patterns and the features they explain -->

---

## Timestamp display

Used for: creation dates, modification dates, event times, deadlines.

**Display logic:**

| Age | Format | Example |
|---|---|---|
| < 1 minute | "Just now" | — |
| 1–59 minutes | "[N] minutes ago" | "3 minutes ago" |
| 1–23 hours | "[N] hours ago" | "2 hours ago" |
| Yesterday | "Yesterday at [time]" | "Yesterday at 2:30 PM" |
| 2–6 days ago | "[Weekday] at [time]" | "Tuesday at 2:30 PM" |
| > 7 days | "[Date]" (localized) | "12 Apr 2025" |
| Future (deadline) | "[Date] at [time]" or "[N] days" | "Due in 3 days" |

**Accessibility:** Always provide the absolute date/time in a `title` attribute or `aria-label` even when showing relative format — screen readers and tooltips should reveal the full timestamp.

<!-- PROJECT-SPECIFIC: Define the timestamp formats for this product's locale and timezone handling rules -->
