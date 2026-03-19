# Chapter 4: User Story Mapping

> **Tier 2 — Definition** | Mode: `design-stories`
>
> Everything in Tier 2 is **technology and UI agnostic**. Stories describe what users want to accomplish, never how the interface works.

## Why this matters

Stories translate the observed human experience (journeys) into a structured backlog that answers: what do we build, in what order, and what's the minimum viable slice? Without story mapping, teams either build everything at once or pick features arbitrarily. The story map makes prioritization visible and forces the team to define "done" at each increment.

## The mental model

You are using Jeff Patton's story mapping methodology. Imagine a wall with sticky notes:
- **Horizontal backbone** (top row) = major user activities, left to right in workflow order
- **Under each activity** = user tasks, then individual stories arranged vertically by priority
- **Horizontal lines** across the wall = release slices, each delivering incremental end-to-end value
- **Walking skeleton** = the thinnest line that touches every backbone activity

The critical discipline: stories describe **what users want to accomplish**, never how the interface works. "I want to review the patient's status" not "I want to see the patient dashboard."

## Agnostic language rules

Same as journey mapping — stories describe goals and outcomes, not implementations.

## Inputs

- `design/journeys/*` — journeys provide the raw material for stories
- `design/user-models/personas/*` — stories reference personas
- Spec user stories (if they exist, decompose them further)

## Process

**1. Identify the backbone.** The backbone represents major user activities in chronological or logical order. These come from journey stages. The backbone answers: "What are the big things users do?"

**2. Decompose into user tasks.** Under each backbone activity, list the tasks that make up that activity. Tasks are more granular but still high-level.

**3. Write user stories.** Under each task, write stories in standard format: "As a [persona], I want to [goal] so that [outcome]." Arrange vertically by priority (most important at top). Include UX-focused acceptance criteria.

**4. Define the walking skeleton.** The thinnest possible end-to-end slice — one story from each backbone activity that together form a complete (if minimal) journey. Document what it proves and what it defers.

**5. Cut release slices.** Draw horizontal lines across the story map. Each slice adds incremental value. Define which slices constitute MVP.

**6. Consolidate MVP scope.** Document what's included, what's deferred (with rationale), what's out of scope, and the MVP acceptance criteria from a UX perspective.

## Outputs

| File | What it contains |
|------|-----------------|
| `design/stories/backbone.md` | Backbone activities + task decomposition |
| `design/stories/story-map.md` | Full story map with all stories, prioritized vertically |
| `design/stories/walking-skeleton.md` | Thinnest end-to-end slice identified |
| `design/stories/release-slices.md` | Incremental release slices with MVP boundary |
| `design/stories/mvp-scope.md` | Consolidated MVP definition |

## Rules

- **TECH AND UI AGNOSTIC** — stories describe user goals, not screens or interactions.
- Stories use the format: "As a [persona], I want to [goal] so that [outcome]."
- Acceptance criteria are UX-focused: "information is available within 2 seconds" not "API returns 200."
- The walking skeleton must touch EVERY backbone activity — if it doesn't, it's not a skeleton.
- Story IDs should be traceable — use a consistent scheme (e.g., DS-001, DS-002).
- If spec user stories exist, decompose them into finer-grained design stories.

## Feeds into

- **[Information Architecture](05-ia.md)** — stories define what each screen must support
- **[Interaction Design](06-interaction.md)** — stories define what interactions each screen needs
- **[Canvas Briefs](12-canvas.md)** — each screen lists the stories it serves
