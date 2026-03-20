---
name: design-stories
description: >
  Creates user story maps following Jeff Patton's methodology — backbone activities, walking
  skeleton, and release slices. All stories are technology and UI agnostic, describing user
  goals and outcomes, not implementation. Use this skill to structure what to build, define
  MVP scope, and prioritize features. Triggers on: "story map", "user stories", "MVP scope",
  "feature priority", "backlog", "walking skeleton", "backbone", "release slices", "what to
  build first", "prioritize features", "scope", or when translating journeys into a buildable
  backlog. Upstream dependency: design-journeys.
---

# User Story Mapping — Jeff Patton Methodology (Tech/UI Agnostic)

> **Quick reference**
> - **Purpose:** Structure what to build — backbone, walking skeleton, release slices, MVP scope
> - **Inputs:** Journeys, personas, spec user stories (soft deps)
> - **Outputs:** Backbone, story map, walking skeleton, release slices, MVP scope → `design/04-stories/`
> - **Hard rules:** TECH AND UI AGNOSTIC. Walking skeleton must touch EVERY backbone activity. Story format: "As a [persona], I want to [goal] so that [outcome]."
> - **Common mistake:** Making the walking skeleton too thick — it should be the thinnest possible end-to-end slice, not an MVP

## Purpose

Organize user needs into a structured story map that reveals the backbone of the product, defines the thinnest viable end-to-end slice (walking skeleton), and cuts release slices that deliver incremental value. All stories describe **user goals and outcomes, never implementation details**.

---

## Dependency check

**Soft dependencies** (warn if missing, don't block):
- `design/03-journeys/*` — journeys provide the raw material for stories
- `design/02-user-models/personas/*` — stories reference personas
- Spec user stories (if they exist, decompose them further)

---

## Agnostic language rules

Same as `design-journeys` — stories describe what users want to accomplish, not how the UI works.

| Instead of... | Write... |
|---------------|----------|
| "click submit" | "complete the action" |
| "view the table" | "review the information" |
| "use the filter" | "narrow down results" |
| "the page loads" | "the information is available" |

---

## Workflow

### Step 1 — Identify the backbone

The backbone is the horizontal top row of the story map — it represents the major **user activities** in chronological or logical order. These come from journey stages.

```markdown
## Story Map Backbone

### Activities (left to right, in order of user workflow)
1. [Activity 1] — [brief description of what the user is doing]
2. [Activity 2] — [brief description]
3. [Activity 3] — [brief description]
...
```

Write the backbone to `design/04-stories/backbone.md`.

### Step 2 — Decompose into user tasks

Under each backbone activity, list the user tasks that make up that activity. Tasks are the second row — more granular than activities but still high-level.

```markdown
## Backbone Decomposition

### Activity 1: [Name]
Tasks:
- [Task 1.1] — [what the user does]
- [Task 1.2] — [what the user does]

### Activity 2: [Name]
Tasks:
- [Task 2.1]
- [Task 2.2]
...
```

Add to `design/04-stories/backbone.md`.

### Step 3 — Write user stories

Under each task, write user stories in standard format. Stories go below their parent task, arranged **vertically by priority** (most important at top).

```markdown
## Story Map

### [Activity 1]
#### [Task 1.1]
- **US-xx**: As a [persona], I want to [goal] so that [outcome]
  - Acceptance: [UX-focused acceptance criteria]
- **US-xx**: As a [persona], I want to [goal] so that [outcome]
  - Acceptance: [criteria]

#### [Task 1.2]
- **US-xx**: ...
```

Write the full story map to `design/04-stories/story-map.md`.

### Step 4 — Define the walking skeleton

The walking skeleton is the **thinnest possible end-to-end slice** — one story from each backbone activity that, together, form a complete (if minimal) user journey.

```markdown
## Walking Skeleton

### Principle
The thinnest slice that touches every backbone activity and delivers
a complete (if minimal) end-to-end experience.

### Selected stories
| Activity | Task | Story | Why this one? |
|----------|------|-------|---------------|

### What it proves
[What questions does the walking skeleton answer? What risks does it retire?]

### What it defers
[What important functionality is intentionally left out of the skeleton?]
```

Write to `design/04-stories/walking-skeleton.md`.

### Step 5 — Cut release slices

Draw horizontal lines across the story map to define release slices. Each slice adds incremental value on top of the previous one.

```markdown
## Release Slices

### Slice 1: [Name] (Walking Skeleton)
**Value delivered:** [what users can do after this slice]
**Stories included:**
- US-xx, US-xx, US-xx

### Slice 2: [Name]
**Value delivered:** [incremental value]
**Stories included:**
- US-xx, US-xx

### Slice 3: [Name]
**Value delivered:** [incremental value]
**Stories included:**
- US-xx, US-xx

### MVP boundary
[Which slices constitute MVP? Draw the line here.]
```

Write to `design/04-stories/release-slices.md`.

### Step 6 — MVP scope document

Consolidate the MVP definition:

```markdown
## MVP Scope

### Included (must have)
| Story ID | Description | Persona | Rationale |
|----------|-------------|---------|-----------|

### Deferred (important but not MVP)
| Story ID | Description | Target slice | Rationale for deferral |
|----------|-------------|--------------|----------------------|

### Out of scope
| Item | Reason |
|------|--------|

### MVP acceptance criteria (UX perspective)
- [ ] [End-to-end criteria 1]
- [ ] [End-to-end criteria 2]
```

Write to `design/04-stories/mvp-scope.md`.

---

## Output checklist

- [ ] `design/04-stories/backbone.md` — backbone activities + task decomposition
- [ ] `design/04-stories/story-map.md` — full story map with all stories, prioritized vertically
- [ ] `design/04-stories/walking-skeleton.md` — thinnest end-to-end slice identified
- [ ] `design/04-stories/release-slices.md` — incremental release slices with MVP boundary
- [ ] `design/04-stories/mvp-scope.md` — consolidated MVP definition
- [ ] All stories are tech/UI agnostic — no implementation language

---

## Rules

- **TECH AND UI AGNOSTIC** — stories describe user goals and outcomes, not screens or interactions. "I want to review the patient's status" not "I want to see the patient dashboard."
- Stories use the format: "As a [persona], I want to [goal] so that [outcome]."
- Acceptance criteria are UX-focused: "information is available within 2 seconds", "user can complete the task without training", not "API returns 200."
- The walking skeleton must touch EVERY backbone activity — if it doesn't, it's not a skeleton, it's a slice.
- Prioritization is vertical within each task column — top = most important.
- If spec user stories exist, decompose them into finer-grained design stories rather than duplicating them.
- Story IDs should be traceable — use a consistent numbering scheme (e.g., DS-001, DS-002).
