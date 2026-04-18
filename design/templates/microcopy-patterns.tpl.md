<!-- artifact: design/09_CONTENT/microcopy-patterns.md | version: 1 | mode: design-content | updated: [DATE] -->

# Microcopy Patterns

> Structural rules for each copy type. Project-specific examples go in each section below the rule.

## Buttons and CTAs

**Structure:** Verb + object. Never noun-only labels.
- Primary action: "[Verb] [what]" — e.g., "Save draft", "Submit report", "Delete account"
- Secondary action: "[Verb] [what]" or just "[Verb]" if the object is clear from context — e.g., "Cancel"
- Avoid: "OK", "Yes", "Submit" (without object), "Click here"
- Destructive actions: use the specific verb — "Delete", not "Remove". Never "OK" for a destructive confirm.

<!-- PROJECT-SPECIFIC: List recurring button patterns and the exact labels used in this product -->

---

## Form field labels and hints

**Label structure:** Noun phrase. Describes what the field contains, not what the user should do.
- Good: "Email address", "Due date", "Project name"
- Avoid: "Enter your email", "Please provide a project name"

**Hint text structure:** Answers "what format?" or "why do we need this?" — one sentence, below the label.
- Good: "Used for login and notifications" / "DD/MM/YYYY"
- Avoid: Restating the label, legal disclaimers in hint text

**Placeholder text:** Use sparingly. Disappears on input — never put required information only in placeholders.

<!-- PROJECT-SPECIFIC: List domain-specific field labels and their canonical hint text -->

---

## Validation messages

**Structure:** [What's wrong] + [what to fix]. Always specific.
- "Email address must include '@' and a domain — for example, name@company.com"
- "Date must be today or later"
- Never: "Invalid input", "This field is required" (without saying what's required)

**When to show:** On field blur, not on keystroke. Show all field errors on form submit if inline validation was missed.

<!-- PROJECT-SPECIFIC: List validation rules for this product's key fields -->

---

## Empty states

**Structure:** [What's missing or why it's empty] + [what the user can do]. Always actionable.
Four types:
1. **First use** — "You haven't created any [items] yet. [CTA to create first one]"
2. **No results** — "No [items] match '[search term]'. Try a different search or [CTA to clear filter]"
3. **Filtered out** — "No [items] visible with current filters. [CTA to clear filters]"
4. **Error** — handled by error strategy, not empty state patterns

Never use: "Nothing here", "No data", "N/A" alone.

<!-- PROJECT-SPECIFIC: List the key empty states in this product and their copy -->

---

## Status messages

**Structure:** [Current state] — noun phrase or short sentence. Avoid explaining why unless it helps.
- Loading: "Loading [what]..." or just "Loading..." if context is clear
- Processing: "Saving...", "Submitting...", "Uploading..."
- Success: "[What] saved", "[What] submitted" — past tense, brief
- Permanent states: "Draft", "Active", "Archived", "Pending review" — noun or adjective only

**Timing:** Success messages persist for 4–6 seconds unless they describe a permanent state change. Status chips (badges) are permanent.

<!-- PROJECT-SPECIFIC: List status vocabulary used in this product (e.g., lifecycle states for key entities) -->
