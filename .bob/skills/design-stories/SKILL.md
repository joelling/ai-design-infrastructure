---
name: design-stories
description: >
  Creates user story maps following Jeff Patton's methodology — backbone
  activities, walking skeleton, and release slices. All stories are tech- and
  UI-agnostic, describing user goals and outcomes, not implementation. Use this
  skill to structure what to build, define MVP scope, and prioritize features.
  Triggers on: "story map", "user stories", "MVP scope", "feature priority",
  "backlog", "walking skeleton", "backbone", "release slices", "what to build
  first", "prioritize features", "scope", or when translating journeys into a
  buildable backlog. Upstream: design-journeys, design-process-flows (business
  rules and exception paths reveal hidden backbone activities and scope
  constraints).
---

<!-- mirror: bob | SSOT: design/process/05-stories.md -->

# design-stories — User Story Mapping (Bob)

## Purpose

Translate journeys + process flows into a buildable, prioritized story map. Backbone (activities) and walking skeleton (minimum thread of stories per activity) drive scope; release slices define iteration cuts.

## Workflow

### Step 0 — Upstream check

- `design/03_JOURNEYS/` exists with at least one journey map.
- `design/04_PROCESS_FLOWS/` exists with swimlane diagrams and `business-rules-register.md`.
- `design/02_USER_MODELS/` exists with personas.

Warn if any is stale.

### Step 1 — Derive the backbone

From journey stages + process-flow phases, extract activities the user performs. Each activity becomes a backbone cell. Keep backbone UI-agnostic ("submit a claim", not "fill out the claim form").

### Step 2 — Populate stories per activity

For each backbone activity, enumerate stories (DS-NNN IDs — stable, never reused). Each story:

- Role + goal + outcome: `As a {persona}, I want to {goal} so that {outcome}.`
- Acceptance criteria in bullet form. Bullets are UI-agnostic. Tag with `[BR-NN]` to cross-reference business rules (inline-expanded at BRD generation time).
- Priority hint (not release assignment — that's PM scope).

Cross-check against `business-rules-register.md`: every BR-NN must appear in ≥1 story's AC.
Cross-check against `process-flows.md`: every user-action exception path must map to either a story or an explicit out-of-scope note.

### Step 3 — Walking skeleton

Mark the thinnest possible thread through the map that delivers end-to-end value. One story per backbone cell, highest priority. This is the walking skeleton — the primary flow that `design-prototype` wires first.

### Step 4 — Release slices

Horizontal cuts across the map defining iteration boundaries. NOTE: priority and release columns are PM-owned; the story map can propose them, but `sync-brd.py` preserves PM edits.

### Step 5 — Write outputs

- `design/05_STORIES/story-map.md` — backbone + stories + walking skeleton marker.
- `design/05_STORIES/walking-skeleton.md` — the thinnest thread as an ordered list (used by `design-prototype`).
- `design/05_STORIES/_manifest.md` — version + downstream list.

Regenerate BRD User Stories sheet via `python design/scripts/sync-brd.py`.

### Step 6 — Notify downstream

- `design-ia` may proceed (or re-run if story map changed).
- `design-canvas` references DS-NNN in traceability.
- BRD User Stories sheet is now current.

## Rules

- **Tech and UI agnostic.** No screen names, no button names, no UI patterns.
- **Story IDs (DS-NNN) are stable and never reused.** Splits retire the original with a pointer (see retire-vs-edit rule).
- **One outcome per story.** If a story has "and" in its outcome, consider splitting.
- **Tag AC bullets** — `[BR-NN]` for business rules, other tags added by downstream modes (`[STATE]`, `[BEHAVIOR]`, `[A11Y]`, `[NOTIF-NNN]`, `[CANVAS]`). Story-origin bullets are untagged (implied).
- **Walking skeleton is not MVP.** It's the thinnest end-to-end thread; MVP may include several slices beyond it.
- **Priority/release edits in BRD are preserved** — do not overwrite them on regeneration.
