# User Story Mapping

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

- `design/03_JOURNEYS/*` — journeys provide the raw material for stories
- `design/02_USER_MODELS/personas/*` — stories reference personas
- Spec user stories (if they exist, decompose them further)

## Upstream sync

**On entry:** Before starting this mode's process, check `design/05_STORIES/_upstream.md` (if it exists). Compare recorded upstream artifact versions against current files. If upstream has changed since last run:

1. Report what changed and classify severity (additive / corrective / structural)
2. Ask the designer: re-process with new data, or proceed with current outputs?
3. If re-processing, update incrementally — revise affected stories and slices, don't rebuild from scratch

**On completion:** After producing or updating artifacts:

1. Add or increment version headers on all changed output files
2. Update `design/05_STORIES/_upstream.md` with consumed artifact versions
3. Report which downstream modes are now potentially stale (ia, interaction, canvas)

## Process

**0. Check upstream sync.** Run the upstream sync check described above. If this is a first run, note which upstream artifacts are available and which are absent.

**1. Identify the backbone.** The backbone represents major user activities in chronological or logical order. These come from journey stages. The backbone answers: "What are the big things users do?"

**2. Decompose into user tasks.** Under each backbone activity, list the tasks that make up that activity. Tasks are more granular but still high-level.

**3. Write user stories.** Under each task, write stories in standard format: "As a [persona], I want to [goal] so that [outcome]." Arrange vertically by priority (most important at top). Include UX-focused acceptance criteria.

**4. Define the walking skeleton.** The thinnest possible end-to-end slice — one story from each backbone activity that together form a complete (if minimal) journey. Document what it proves and what it defers.

**5. Cut release slices.** Draw horizontal lines across the story map. Each slice adds incremental value. Define which slices constitute MVP.

**6. Consolidate MVP scope.** Document what's included, what's deferred (with rationale), what's out of scope, and the MVP acceptance criteria from a UX perspective.

**7. Consolidate into BRD.** After the story map is complete, consolidate all stories into the BRD (`design/BRD.xlsx`, User Stories sheet). For each story in `story-map.md`:

- **S/No.** — sequential row number
- **Epic** — backbone activity name
- **Feature / Touchpoint** — task name under the backbone activity (leave blank if IA hasn't assigned screens yet — IA mode will populate this later)
- **User Story ID** — DS-NNN from story-map.md (must match exactly)
- **User Story** — full "As a [persona], I want to [goal] so that [outcome]" text
- **Acceptance Criteria** — write as multiple bullet points, one testable requirement per bullet. Use UI-agnostic language (see rules below). Include specific business logic values where known. No source tag on story-origin bullets — it is implied.
- **Priority** — High / Medium / Low, derived from vertical position in story map and release slices
- **Release** — release slice name from `release-slices.md`

Leave estimation columns (I–P) and assumption columns (Q–V) empty — these are for track reviewers.

After populating, update `design/BRD_manifest.md` with the story-map version consumed and the story IDs written.

### Acceptance criteria language rules

Acceptance criteria in the BRD must be **UI agnostic** — describe what the system must enable, not how the interface implements it:

| Instead of | Write |
|---|---|
| "Show dropdown menu showing a list of countries" | "Allow user to select from a list of countries" |
| "Display error toast" | "Inform user of the error with corrective guidance" |
| "Click the Save button" | "User confirms the save action" |
| "Pagination with 10 rows per page" | "Information presented in manageable sets with navigation to view more" |

Include specific business logic values where applicable: "If country is Singapore, validate NRIC format (S/T followed by 7 digits and a letter)."

Downstream modes enrich AC by appending new bullets with inline source tags: `[BR-NN]` (business rule), `[FLOW]` (process flow), `[STATE]` (interaction state), `[BEHAVIOR]` (behavioral spec), `[A11Y]` (accessibility), `[CANVAS]` (canvas synthesis gap). Tags appear at the end of the bullet they belong to. Story-origin bullets carry no tag.

## Outputs

| File | What it contains |
|------|-----------------|
| `design/05_STORIES/backbone.md` | Backbone activities + task decomposition |
| `design/05_STORIES/story-map.md` | Full story map with all stories, prioritized vertically |
| `design/05_STORIES/walking-skeleton.md` | Thinnest end-to-end slice identified |
| `design/05_STORIES/release-slices.md` | Incremental release slices with MVP boundary |
| `design/05_STORIES/mvp-scope.md` | Consolidated MVP definition |
| `design/05_STORIES/_upstream.md` | Upstream dependency manifest — consumed and produced artifact versions |
| `design/BRD.xlsx` | Master BRD — User Stories sheet populated from story map; enriched by downstream modes |
| `design/BRD_manifest.md` | Tracks which modes have contributed to BRD and at what artifact versions |

## Rules

- **TECH AND UI AGNOSTIC** — stories describe user goals, not screens or interactions.
- Stories use the format: "As a [persona], I want to [goal] so that [outcome]."
- Acceptance criteria are UX-focused: "information is available within 2 seconds" not "API returns 200."
- The walking skeleton must touch EVERY backbone activity — if it doesn't, it's not a skeleton.
- Story IDs should be traceable — use a consistent scheme (e.g., DS-001, DS-002).
- **Story IDs are stable.** Once assigned, a story ID is permanent. If a story is split, the original ID is retired with a note pointing to its successors. If merged, the surviving ID is kept and the retired one noted. Canvas briefs, interaction specs, and the traceability script depend on stable IDs.
- If spec user stories exist, decompose them into finer-grained design stories.
- **BRD stays in sync with story-map.md.** Every story in story-map.md must have a corresponding row in the BRD. Every story ID in the BRD must exist in story-map.md. Run `python design/scripts/sync-brd.py` to validate.
- **Acceptance criteria are UI agnostic.** No screen names, no button labels, no UI patterns. Describe what the system enables, not how the interface works.

## Feeds into

- **[Information Architecture](06-ia.md)** — stories define what each screen must support
- **[Interaction Design](07-interaction.md)** — stories define what interactions each screen needs
- **[Canvas Briefs](13-canvas.md)** — each screen lists the stories it serves
- **BRD** (`design/BRD.xlsx`) — stories, acceptance criteria, priority, and release slices feed the master BRD for cross-track collaboration
