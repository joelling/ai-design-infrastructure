# Interaction Design

> **Tier 3 — Design** | Mode: `design-interaction`

## Why this matters

Interaction design defines **how the product responds to user actions**. Without it, screens are static pictures — no one has decided what happens when data is loading, when a form has errors, when the user lacks permission, or when the network fails. These states are where most usability issues hide.

## The mental model

Think of every screen as a state machine. At any moment, the screen is in one state. User actions or system events trigger transitions to other states. Your job is to enumerate every state, define every transition, and specify the feedback the user receives.

The critical discipline: **given/when/then**. Every interaction is specified as: Given [precondition], When [user does X], Then [system does Y]. This format ensures testability and eliminates ambiguity.

## Inputs

- `design/06_INFORMATION_ARCHITECTURE/*` — defines what screens exist and their content
- `design/05_STORIES/story-map.md` — stories define what interactions each screen supports
- `design/02_USER_MODELS/behavioral-archetypes.md` — archetype tensions inform state priorities and error strategy (e.g., offline-first for field archetypes, batch operations for process-heavy archetypes)
- Spec state machines or workflow rules (if applicable)

## Upstream sync

**On entry:** Check `design/07_INTERACTION/_upstream.md` (if it exists). If upstream has changed since last run:

1. Report what changed and classify severity (additive / corrective / structural)
2. Ask the designer: re-process with new data, or proceed with current outputs?
3. If re-processing, update incrementally — revise affected interaction patterns and states, don't rebuild from scratch

**On completion:** After producing or updating artifacts:

1. Add or increment version headers on all changed output files
2. Update `design/07_INTERACTION/_upstream.md` with consumed artifact versions
3. Report which downstream modes are now potentially stale (content, accessibility, canvas)

## Process

**0. Check upstream sync.** Run the upstream sync check described above. If this is a first run, note which upstream artifacts are available and which are absent.

**1. Categorize each screen by interaction pattern.** Common patterns: browse & filter, form & submit, dashboard, wizard/stepper, detail view, review & decide. Each pattern implies a default set of states and transitions.

**2. Build the state inventory.** For every screen and major component, enumerate all possible states: empty, loading, populated, error, partial, filtered (no results), unauthorized, read-only, stale. For each state, document: when it occurs, what the user sees, and what actions are available.

**3. Write behavioral specifications.** For each key interaction, write given/when/then specs. Include variations (different preconditions leading to different outcomes) and error paths (what happens when things go wrong).

**4. Define the error strategy.** Create a unified approach: error categories (validation, network, permission, system, data conflict), when validation happens (on blur, on submit, real-time), error message format ([what happened] + [why] + [what to do]), and destructive action protection.

**5. Define feedback and micro-interactions.** What feedback does the user receive for: success, in-progress actions, destructive actions, state changes, background processes? What are the transition principles (fade, slide, instant)? How is reduced motion handled?

## Outputs

| File | What it contains |
|------|-----------------|
| `design/07_INTERACTION/interaction-model.md` | Per-screen interaction patterns + feedback/transitions |
| `design/07_INTERACTION/state-inventory.md` | All states for every screen and major component |
| `design/07_INTERACTION/behavioral-spec.md` | Given/when/then specs for key interactions |
| `design/07_INTERACTION/error-strategy.md` | Unified error handling approach |
| `design/07_INTERACTION/_upstream.md` | Upstream dependency manifest — consumed and produced artifact versions |

## Rules

- Every screen must have at minimum: Empty, Loading, Populated, and Error states defined. No screen is "always populated."
- Behavioral specs use given/when/then format — non-negotiable. It ensures testability.
- Error messages always include: what happened, why, and what to do next.
- Destructive actions always require confirmation.
- State transitions must be defined — don't just define states in isolation, define how the system moves between them.
- The state inventory maps 1:1 to Figma component variants. If a state is in the inventory, it must be built.
- **Traceability headers are mandatory.** Every interaction spec file MUST include these header fields:
  - `**Story references:** DS-NNN, DS-NNN` — which stories this spec covers
  - `**Business rule:** BR-NN` — which business rules govern the interaction (or `—` if none)
  - `**Host:** [Screen ID] [Screen Name]` — which screen(s) this spec applies to

  These fields are consumed by canvas briefs and validated by the traceability script.

## BRD enrichment

After completing interaction artifacts:
1. **Acceptance criteria** — for each story with behavioral specs, append new bullet points to the BRD User Stories sheet AC field. Each bullet captures one state or behavior requirement, with the source tag inline at the end:
   - `User receives confirmation with reference number after successful submission  [STATE]`
   - `System prevents submission when required fields are incomplete  [BEHAVIOR]`
2. **Notification Mapping sheet** — populate from the error strategy and notification flows: trigger events, recipients, notification channels

Update `design/BRD_manifest.md` after enrichment.

## Feeds into

- **[Content Strategy](08-content.md)** — error messages and empty states need content
- **[Accessibility](09-accessibility.md)** — every interaction needs a keyboard equivalent
- **[Canvas Briefs](12-canvas.md)** — states and behavioral specs are core brief sections
- **Figma Components** — each state becomes a component variant
