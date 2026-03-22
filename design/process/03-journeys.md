# Chapter 3: Journey Mapping

> **Tier 2 — Definition** | Mode: `design-journeys`
>
> Everything in Tier 2 is **technology and UI agnostic**. No screen names, no button labels, no UI patterns. Describe what users do and experience, not how the interface works.

## Why this matters

Journeys reveal the complete human experience — not just the moments inside your product, but the full arc of how a person moves through a process. Without journey maps, designers optimize individual screens without understanding the transitions between them, the emotional arc of the experience, or the cross-system handoffs where context is lost.

## The mental model

You are a documentary filmmaker following one person through their entire experience with a process. You record everything: what they do, what they think, how they feel, where they get stuck, where they hand off to someone else. You never suggest what they should click — you observe the experience as it unfolds.

The critical lens: **technology and UI agnostic**. Describe "provides the required information" not "fills in the form." Describe "reviews the current status" not "sees the dashboard." This forces you to understand the user's goal before jumping to solutions.

## Agnostic language rules

| Instead of... | Write... |
|---------------|----------|
| "clicks the button" | "initiates the action" |
| "sees the dashboard" | "reviews the current status" |
| "fills in the form" | "provides the required information" |
| "navigates to the page" | "moves to the next activity" |
| "the system displays" | "the information becomes available" |
| "dropdown menu" | "selects from available options" |
| "modal dialog" | "is prompted for confirmation" |

## Inputs

- `design/user-models/personas/*` — journeys are persona-specific
- `design/user-models/behavioral-archetypes.md` — annotate where archetype-specific experience diverges along the journey
- `design/discovery/design-brief.md` — provides scope boundaries
- Spec workflow descriptions (state machines, process flows)

## Upstream sync

**On entry:** Before starting this mode's process, check `design/journeys/_upstream.md` (if it exists). Compare recorded upstream artifact versions against current files. If upstream has changed since last run:

1. Report what changed and classify severity (additive / corrective / structural)
2. Ask the designer: re-process with new data, or proceed with current outputs?
3. If re-processing, update incrementally — revise affected journeys and task flows, don't rebuild from scratch

**On completion:** After producing or updating artifacts:

1. Add or increment version headers on all changed output files
2. Update `design/journeys/_upstream.md` with consumed artifact versions
3. Report which downstream modes are now potentially stale (stories, ia, interaction)

## Process

**0. Check upstream sync.** Run the upstream sync check described above. If this is a first run, note which upstream artifacts are available and which are absent.

**1. Identify journeys.** From personas and spec workflows, identify distinct end-to-end journeys. A journey has a clear trigger (what starts it), a clear outcome (what success looks like), follows one persona, and may cross system boundaries.

**2. Map each journey.** For each journey, map stages sequentially. Each stage captures: the user's goal in that stage, their actions (agnostic), their thoughts, their emotional state (frustrated through confident), pain points, opportunities for improvement, and handoffs to other people or systems.

**3. Build a service blueprint.** Show the full system behind the experience: user actions (frontstage), what the system presents (still agnostic), backstage processes (APIs, data processing), support processes (infrastructure, third parties), and physical evidence (documents, notifications).

**4. Decompose into task flows.** Break journeys into granular task flows — one per discrete user activity. Each flow has a trigger, success criteria, step-by-step actions with outcomes, decision points, and error/edge case paths.

## Outputs

| File | What it contains |
|------|-----------------|
| `design/journeys/[journey-name]-journey.md` | One per primary journey (minimum 2) |
| `design/journeys/service-blueprint.md` | Full service blueprint |
| `design/journeys/task-flows/[task-name].md` | One per discrete user task (minimum 4) |
| `design/journeys/_upstream.md` | Upstream dependency manifest — consumed and produced artifact versions |

## Rules

- **TECH AND UI AGNOSTIC** is the most important rule. Zero references to screens, buttons, forms, modals, or any UI element.
- Every pain point must be grounded in persona context, not assumed.
- Error and edge-case paths are as important as happy paths — map them explicitly.
- Cross-system handoffs are critical moments — always note what information transfers and what context is lost.

## Feeds into

- **[Story Mapping](04-stories.md)** — journeys provide the raw material for user stories
- **[Information Architecture](05-ia.md)** — task flows reveal what screens are needed
- **[Interaction Design](06-interaction.md)** — task flows inform behavioral specifications
