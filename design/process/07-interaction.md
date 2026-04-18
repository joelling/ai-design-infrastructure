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

**1. Categorize each screen by interaction pattern.** Each pattern implies a default set of required states — these are the *minimum* state inventory for that screen type. Custom states extend this baseline.

| Pattern | Description | Required states (minimum) |
|---------|------------|--------------------------|
| Browse & filter | A list or grid of items users can search, filter, and sort | Loading, Populated, Filtered (has results), Filtered (no results), Error |
| Form & submit | One or more fields leading to a submission action | Empty, Partially filled, Validation error, Submitting, Success, System error |
| Dashboard | Overview of aggregated data from multiple sources | Loading, Populated, Stale data warning, Empty (no data yet), Widget-level error |
| Wizard / stepper | A multi-step flow with a defined sequence | Per step: Empty, Filled, Step error — Global: In progress, Review, Submitted, Abandoned |
| Detail view | Focused view of a single record or item | Loading, Populated, Not found, Unauthorized, Read-only |
| Review & decide | Presenting a record or request for a human decision | Loading, Populated (pending), Decided (approved / rejected / deferred), Expired |

A screen may combine patterns (e.g., a dashboard with a filterable list widget). In that case, apply both pattern baselines and merge the state inventories.

**2. Build the state inventory.** For every screen and major component, enumerate all possible states: empty, loading, populated, error, partial, filtered (no results), unauthorized, read-only, stale. For each state, document: when it occurs, what the user sees, and what actions are available.

**3. Write behavioral specifications.** For each key interaction, write given/when/then specs. Include variations (different preconditions leading to different outcomes) and error paths (what happens when things go wrong).

**4. Define the error strategy.** Copy `design/templates/error-strategy.tpl.md` to `design/07_INTERACTION/error-strategy.md` if the file does not already exist. The template pre-seeds the 5 error categories, display patterns, and `aria-live` defaults. Fill the PROJECT-SPECIFIC sections: validation timing rules, recovery actions per category, destructive action confirmation patterns, and project-specific error examples.

**5. Define feedback and micro-interactions.** Transition and feedback specs belong in this artifact, not in Figma. Figma implements what the interaction spec defines.

**Feedback types and their implications:**
| Feedback trigger | Expected feedback | Figma implication |
|-----------------|------------------|------------------|
| Action success | Confirmation message or state change | Component variant: Success |
| Submission in progress | Progress indicator (spinner, skeleton, progress bar) | Component variant: Loading |
| Destructive action | Confirmation dialog before execution | Modal overlay component |
| State change (data updates) | Subtle visual change + optional toast | Component variant change |
| Background process | Persistent status indicator (not blocking) | Non-modal status component |

**Transition principles** — document these decisions explicitly:
- **Standard duration:** Choose a default (e.g., 150ms). Applied to small state changes (button state, tooltip appear).
- **Expansive duration:** Choose a default (e.g., 300ms). Applied to panel opens, modal appear, page transitions.
- **Instant:** Applied to tab switches, dropdown open, focus ring — anything where animation would feel like lag.
- **Easing:** Enter animations use ease-out (fast start, soft stop). Exit animations use ease-in (gradual start, fast stop).
- **Reduced motion:** Classify every animation as either *decorative* (can be removed without loss of meaning) or *essential* (conveys state information). Decorative animations are suppressed when `prefers-reduced-motion: reduce` is set. Essential animations are replaced with instant transitions that still convey the state change (e.g., a loading spinner replaced by a static indicator).

**Prototype note:** Transition specs in this artifact inform prototype connector settings in `design-prototype`. The prototype author consumes this file to configure timing and easing in the coded prototype.

## Outputs

| File | Type | What it contains |
|------|------|-----------------|
| `design/07_INTERACTION/interaction-model.md` | synthesis | Per-screen interaction patterns + feedback/transitions |
| `design/07_INTERACTION/state-inventory.md` | synthesis | All states for every screen and major component |
| `design/07_INTERACTION/behavioral-spec.md` | synthesis | Given/when/then specs for key interactions |
| `design/07_INTERACTION/error-strategy.md` | hybrid template | Error taxonomy, display patterns, `aria-live` defaults pre-seeded; project examples filled by mode |

*`_upstream.md` is maintained by `sync-manifest.js` and is not a mode deliverable.*

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
