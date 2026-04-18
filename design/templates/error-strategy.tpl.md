<!-- artifact: design/07_INTERACTION/error-strategy.md | version: 1 | mode: design-interaction | updated: [DATE] -->

# Error Strategy

## Error taxonomy

Five categories cover all error types. Every error in the product belongs to one.

### 1. Validation errors
**What:** Input doesn't meet the required format, range, or constraint.
**When shown:** Inline, on field blur (not on keystroke — don't punish before the user finishes).
**Display pattern:** Below the field. Red border on the field. Icon + message. Never replace the label.
**`aria-live`:** `aria-live="polite"` on the error container — announced when idle.
**Recovery:** Tell the user what format is expected. Show an example if format is non-obvious.

<!-- PROJECT-SPECIFIC: Add validation timing rules and any field-specific exceptions -->

### 2. Network errors
**What:** The request couldn't reach the server, or the server didn't respond in time.
**When shown:** After the user submits an action and the response fails.
**Display pattern:** Toast or inline banner at the top of the affected section. Never block the page if the user can retry.
**`aria-live`:** `role="alert"` — announced immediately.
**Recovery:** Tell the user it's temporary. Offer a retry action. Preserve their input.

### 3. Permission errors
**What:** The user's role or account doesn't allow the requested action.
**When shown:** After the user attempts an action they're not authorized for.
**Display pattern:** Inline message at the point of failure. Do not navigate away. Do not show an error page.
**`aria-live`:** `aria-live="polite"` — the user already knows what they tried.
**Recovery:** Tell the user what access is needed. Offer an alternative path if one exists (e.g., "Request access" link).

### 4. System errors
**What:** An unexpected failure on the backend — database unavailable, service down, unhandled exception.
**When shown:** After a user action that triggers a system-level failure.
**Display pattern:** Full-page error for complete failures. Inline banner for partial failures. Never expose stack traces or error codes to users.
**`aria-live`:** `role="alert"` — announced immediately.
**Recovery:** Apologize briefly. Give a specific action ("Try again" or "Contact support"). Log the error reference code internally; show a human ID to the user if they need to report it.

### 5. Data conflict errors
**What:** The user's action conflicts with the current state of the data (stale read, concurrent edit, optimistic update failure).
**When shown:** After an action that fails due to state mismatch.
**Display pattern:** Inline at the point of conflict. Show what changed and give the user a choice — merge, overwrite, or discard.
**`aria-live`:** `role="alert"`.
**Recovery:** Never silently discard user input. Show both versions if a conflict exists. Let the user decide.

---

## Error message format

Every error message answers three questions in order:
1. **What happened** — plainly, not technically
2. **Why it happened** — only if it helps the user understand what to do
3. **What to do** — specific and actionable

**Bad:** "Error 422: Validation failed"
**Good:** "Date must be today or later. Try entering a future date."

**Bad:** "Something went wrong"
**Good:** "We couldn't save your changes. Your internet connection may be interrupted — check your connection and try again."

---

## Destructive action patterns

All destructive actions (delete, archive, revoke, send-without-undo) require:
1. A confirmation step before execution
2. Clear identification of what will be affected ("Delete 3 items" not "Delete")
3. A cancel option that is the default / first-focus action

<!-- PROJECT-SPECIFIC: List specific destructive actions in this product and their confirmation patterns -->

---

## `aria-live` defaults summary

| Error type | `aria-live` value | Reason |
|---|---|---|
| Validation (field blur) | `polite` | User is still typing nearby — don't interrupt |
| Network failure | `assertive` / `role="alert"` | Action failed — user needs to know now |
| Permission denial | `polite` | User knows what they tried; no urgency |
| System error | `assertive` / `role="alert"` | Unexpected failure — immediate notification |
| Data conflict | `assertive` / `role="alert"` | Data integrity at risk — immediate notification |

---

<!-- PROJECT-SPECIFIC: Add project-specific error examples, recovery actions, and validation timing rules below -->

## Project examples

<!-- [Populate with real error scenarios from this project after interaction model is complete] -->
