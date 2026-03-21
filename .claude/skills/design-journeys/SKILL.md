---
name: design-journeys
description: >
  Maps end-to-end user journeys, service blueprints, and task flows using user story mapping
  methodology. All outputs are technology and UI agnostic — they describe the human experience,
  not screens or buttons. Use this skill to understand how users move through processes, where
  they feel pain, and where opportunities exist. Triggers on: "user journey", "journey map",
  "service blueprint", "task flow", "user flow", "map the experience", "end to end flow",
  "process map", "touchpoints", or when you need to understand the full experience before
  designing any screens. Upstream dependency: design-user-models.
---

# Journey Mapping — User Story Mapping Methodology (Tech/UI Agnostic)

## Purpose

Map the complete human experience of each user through their workflows. Journeys describe stages, actions, thoughts, feelings, pain points, and opportunities — **never screens, buttons, or UI patterns**. This mode is deliberately technology-agnostic to prevent premature solution design.

---

## Dependency check

**Soft dependencies** (warn if missing, don't block):
- `design/02-user-models/personas/*` — journeys are persona-specific
- `design/01-discovery/design-brief.md` — provides scope boundaries
- Spec workflow descriptions (e.g., state machines, process flows)

---

## Agnostic language rules

These rules are **non-negotiable** for all journey artifacts:

| Instead of... | Write... |
|---------------|----------|
| "clicks the button" | "initiates the action" |
| "sees the dashboard" | "reviews the current status" |
| "fills in the form" | "provides the required information" |
| "navigates to the page" | "moves to the next activity" |
| "the system displays" | "the information becomes available" |
| "dropdown menu" | "selects from available options" |
| "modal dialog" | "is prompted for confirmation" |

---

## Upstream sync (step 0)

Before starting this mode's workflow:

1. Check `design/journeys/_upstream.md` for the dependency manifest
2. Compare recorded upstream versions against current artifact files
3. If upstream has changed, report what changed (additive / corrective / structural) and ask the designer: re-process or proceed?
4. If re-processing, update incrementally — process the delta, don't rebuild from scratch

After completing this mode's workflow:

1. Add or increment `<!-- artifact: ... -->` version headers on all changed output files
2. Update `design/journeys/_upstream.md` with consumed and produced artifact versions
3. Report which downstream modes are now potentially stale

### Script commands
```bash
# On entry — check staleness:
node design/scripts/sync-status.js

# After completing — version and manifest:
node design/scripts/sync-version.js init <file> design-journeys   # first time
node design/scripts/sync-version.js bump <file>                    # subsequent updates
node design/scripts/sync-manifest.js journeys                      # update manifest
```

---

## Workflow

### Step 1 — Identify journeys

From personas and spec workflows, identify distinct end-to-end journeys. A journey:
- Has a clear trigger (what starts it?)
- Has a clear outcome (what does success look like?)
- Follows one persona through one goal
- May cross system boundaries (e.g., starts in one system, continues in another)

### Step 2 — Map each journey

For each journey, create a structured map:

```markdown
## Journey: [Journey Name]
**Persona:** [Name]
**Trigger:** [What starts this journey]
**Desired outcome:** [What success looks like]

### Stages

#### Stage 1: [Stage Name]
- **Goal:** [What the user is trying to accomplish in this stage]
- **Actions:** [What they do — technology agnostic]
- **Thinks:** [Internal thoughts]
- **Feels:** [Emotional state — use a spectrum: frustrated ↔ confident]
- **Pain points:** [What makes this hard]
- **Opportunities:** [How this could be better]
- **Handoffs:** [Does this involve another person or system?]

#### Stage 2: [Stage Name]
...

### Journey summary
| Metric | Value |
|--------|-------|
| Total stages | N |
| Critical pain points | [list] |
| Highest-value opportunities | [list] |
| Cross-system handoffs | [list] |
```

Write each to `design/03-journeys/[journey-name]-journey.md`.

### Step 3 — Service blueprint

Create a service blueprint that shows the full system behind the user experience:

```markdown
## Service Blueprint — [Process Name]

### Lanes

#### 1. User actions (frontstage)
[What the user does — visible to them]

#### 2. Frontstage interactions
[What the system presents to the user — still agnostic: "information is provided", not "screen shows"]

#### 3. Backstage processes
[What happens behind the scenes — API calls, data processing, message routing]

#### 4. Support processes
[Infrastructure, third-party systems, manual processes]

#### 5. Physical evidence
[Tangible artifacts — documents, notifications, reports]

### Sequence
| Step | User action | Frontstage | Backstage | Support | Evidence |
|------|-------------|------------|-----------|---------|----------|
```

Write to `design/03-journeys/service-blueprint.md`.

### Step 4 — Task flows

Decompose journeys into granular task flows. Each task flow covers one discrete user activity:

```markdown
## Task Flow: [Task Name]
**Persona:** [Name]
**Parent journey:** [Journey name, stage]
**Trigger:** [What initiates this task]
**Success criteria:** [How the user knows they're done]

### Flow
1. [Action] → [Outcome]
2. [Action] → [Outcome]
   - If [condition]: [Alternative path]
   - If [error]: [Recovery path]
3. [Action] → [Outcome]

### Decision points
- [Decision 1]: [Options and criteria for choosing]

### Error & edge cases
- [What can go wrong and how the user recovers]
```

Write each to `design/03-journeys/task-flows/[task-name].md`.

---

## Output checklist

- [ ] `design/03-journeys/[journey-name]-journey.md` — one per primary user journey (minimum 2)
- [ ] `design/03-journeys/service-blueprint.md` — at least one service blueprint
- [ ] `design/03-journeys/task-flows/[task-name].md` — one per discrete user task (minimum 4)
- [ ] All artifacts are tech/UI agnostic — no screen names, no button labels, no UI patterns

---

## Rules

- **TECH AND UI AGNOSTIC** — this is the most important rule. Zero references to screens, buttons, forms, modals, or any UI element. Describe what the user does and experiences, not how the interface works.
- Journeys follow user story mapping methodology — organized by user activities (horizontal backbone) and priority (vertical).
- Every pain point must be grounded in persona context, not assumed.
- Error and edge-case paths are as important as happy paths — map them explicitly.
- Cross-system handoffs are critical moments — always note what information transfers and what context is lost.
- Service blueprints must show the relationship between user-visible actions and backend processes without prescribing implementation.
