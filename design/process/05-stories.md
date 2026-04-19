---
operation: ingest
---

# User Stories

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

**7. Author AC bullets in story-map.md.** `story-map.md` is the canonical source for both the stories themselves and their acceptance criteria. The BRD User Stories sheet is generated from this file by `sync-brd.py` — never authored directly.

For each story in `story-map.md`, capture:

- **DS-NNN** — stable story ID
- **Epic** — backbone activity name
- **User Story** — full "As a [persona], I want to [goal] so that [outcome]" text
- **Acceptance Criteria** — multiple bullet points, one testable requirement per bullet. Use UI-agnostic language (see rules below). Include specific business logic values where known. Story-origin bullets carry no source tag — it is implied. Downstream-enriched bullets carry inline source tags (see "Foreign-key tags" below).

After updating `story-map.md`, run `python design/scripts/sync-brd.py` to regenerate the BRD User Stories sheet. The script:
- Joins each `[BR-NN]` tag in an AC bullet against `04_PROCESS_FLOWS/business-rules-register.md` and **inline-expands the rule text** into the BRD AC cell, producing the combined AC+BR view that the BRD has historically shown
- Preserves other tag families (`[STATE]`, `[BEHAVIOR]`, `[A11Y]`, `[CANVAS]`, `[NOTIF-NNN]`) as in-cell references without expansion
- Derives the Feature/Touchpoint column by reverse lookup against `06_INFORMATION_ARCHITECTURE/sitemap.md` (which screens serve this DS-NNN)
- Preserves any existing values in Priority and Release columns (these are PM concerns, out of sync-brd.py's regeneration scope)

### Acceptance criteria language rules

Acceptance criteria in `story-map.md` (and therefore the BRD) must be **UI agnostic** — describe what the system must enable, not how the interface implements it:

| Instead of | Write |
|---|---|
| "Show dropdown menu showing a list of countries" | "Allow user to select from a list of countries" |
| "Display error toast" | "Inform user of the error with corrective guidance" |
| "Click the Save button" | "User confirms the save action" |
| "Pagination with 10 rows per page" | "Information presented in manageable sets with navigation to view more" |

Include specific business logic values where applicable: "If country is Singapore, validate NRIC format (S/T followed by 7 digits and a letter)."

### Foreign-key tags in AC bullets

Downstream modes enrich AC by appending new bullets with inline source tags. Tags appear at the end of the bullet they belong to. Story-origin bullets carry no tag.

| Tag | Foreign key resolves to | Owner | sync-brd.py behaviour |
|---|---|---|---|
| `[BR-NN]` | Business rule entry in `04_PROCESS_FLOWS/business-rules-register.md` | `design-process-flows` | **Inline-expand** rule text into BRD AC cell |
| `[NOTIF-NNN]` | Notification in `06_INFORMATION_ARCHITECTURE/notifications.md` | `design-ia` | Preserve as in-cell reference |
| `[STATE]` | Interaction state in `07_INTERACTION/state-inventory.md` | `design-interaction` | Preserve as in-cell reference |
| `[BEHAVIOR]` | Behavioral spec in `07_INTERACTION/behavioral-spec.md` | `design-interaction` | Preserve as in-cell reference |
| `[A11Y]` | Accessibility pattern in `10_ACCESSIBILITY/` | `design-accessibility` | Preserve as in-cell reference |
| `[CANVAS]` | Gap surfaced during canvas synthesis | `design-canvas` | Preserve as in-cell reference |
| `[FLOW]` | Process flow step in `04_PROCESS_FLOWS/index.md` | `design-process-flows` | Preserve as in-cell reference |

Example AC bullet with foreign keys:
- `User receives confirmation [NOTIF-012] after submission completes  [STATE]`
- `Submission rejected when account balance below threshold [BR-07]  [BEHAVIOR]`

The `[BR-NN]` inline-expansion is the only tag that materially changes the BRD cell text — it preserves the historical BRD behaviour where AC and the governing business rule sit together under each story.

## Outputs

| File | What it contains |
|------|-----------------|
| `design/05_STORIES/backbone.md` | Backbone activities + task decomposition |
| `design/05_STORIES/story-map.md` | Canonical source for stories AND acceptance criteria (BRD User Stories sheet derives from this) |
| `design/05_STORIES/walking-skeleton.md` | Thinnest end-to-end slice identified |
| `design/05_STORIES/release-slices.md` | Incremental release slices with MVP boundary (PM-owned; not aggregated by sync-brd.py) |
| `design/05_STORIES/mvp-scope.md` | Consolidated MVP definition |

*`_upstream.md` is maintained by `sync-manifest.js` and is not a mode deliverable.*

`design/BRD.xlsx` is **generated**, not authored — `sync-brd.py` aggregates this mode's `story-map.md` (with `[BR-NN]` inline-expansion from the business rules register) plus IA's `rbac.md`, `notifications.md`, `data-dictionary.md`, and content's `terminology.md`. See [README.md → BRD SSOT mapping](README.md#brd-ssot-mapping) for the full sheet-by-sheet ownership table.

## Rules

- **TECH AND UI AGNOSTIC** — stories describe user goals, not screens or interactions.
- Stories use the format: "As a [persona], I want to [goal] so that [outcome]."
- Acceptance criteria are UX-focused: "information is available within 2 seconds" not "API returns 200."
- The walking skeleton must touch EVERY backbone activity — if it doesn't, it's not a skeleton.
- Story IDs should be traceable — use a consistent scheme (e.g., DS-001, DS-002).
- **Story IDs are stable.** Once assigned, a story ID is permanent. If a story is split, the original ID is retired with a note pointing to its successors. If merged, the surviving ID is kept and the retired one noted. Canvas briefs, interaction specs, and the traceability script depend on stable IDs.
- If spec user stories exist, decompose them into finer-grained design stories.
- **story-map.md is the canonical source for AC; the BRD is a generated rendering.** Never hand-edit the BRD User Stories sheet — edit `story-map.md` and run `sync-brd.py`. Hand-edits to the BRD will be overwritten on the next regeneration.
- **`[BR-NN]` is a foreign key, not a copy.** AC bullets reference business rules by id; the rule text lives only in `04_PROCESS_FLOWS/business-rules-register.md`. `sync-brd.py` does the inline-expansion at BRD render time. Never copy rule text into AC bullets.
- **`[NOTIF-NNN]` references replace inline notification copy.** Notification message text lives only in `06_INFORMATION_ARCHITECTURE/notifications.md`. AC bullets reference the id.
- **Acceptance criteria are UI agnostic.** No screen names, no button labels, no UI patterns. Describe what the system enables, not how the interface works.

## Feeds into

- **[Information Architecture](06-ia.md)** — stories define what each screen must support
- **[Interaction Design](07-interaction.md)** — stories define what interactions each screen needs
- **[Canvas Briefs](13-canvas.md)** — each screen lists the stories it serves
- **BRD** (`design/BRD.xlsx`) — stories, acceptance criteria, priority, and release slices feed the master BRD for cross-track collaboration
