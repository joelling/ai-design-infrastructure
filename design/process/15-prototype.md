# Coded Prototype

> **Tier 4 — Develop** | Mode: `design-prototype`

## Why this matters

Figma screens show what a design looks like. A coded prototype shows what it *feels* like. Transitions, responsive behavior, real data flow, keyboard navigation, screen reader announcements — these can only be validated in a running environment. The prototype closes the gap between static mockups and user testing.

## The mental model

You are translating a visual blueprint into a living, interactive experience. The canvas brief tells you *what* each screen contains and *why*. The Figma screens show you *how it looks*. The story map tells you *what order users move through it*. Your job is to make it real enough that someone can use it, break it, and give feedback — without building production infrastructure.

## Position in the Develop loop

This mode is one of three nodes in the Tier 4 sync loop:

```
Canvas Brief ◄──sync──► Figma Screens ◄──sync──► Prototype
     ▲                                                │
     └────────────────── sync ────────────────────────┘
```

Each node owns different concerns:
- **Canvas Brief** — intent, structure, content, accessibility (aggregated from upstream)
- **Figma Screens** — visual execution, layout, component implementation
- **Prototype** — interaction fidelity, flow validation, responsive behavior

Changes propagate between all three. See **Sync rules** below.

## Inputs

| Artifact | What it provides | Path |
|----------|-----------------|------|
| Canvas briefs | Per-screen spec (structure, content, states, a11y, behavior) | `design/13_CANVAS/[screen]-brief.md` |
| Figma screens | Visual reference via MCP (screenshot, inspect, component details) | Figma MCP tools |
| Walking skeleton | Flow order — which screens to wire first | `design/05_STORIES/walking-skeleton.md` |
| Story map + release slices | Scope — which stories are in this prototype round | `design/05_STORIES/story-map.md`, `release-slices.md` |
| Interaction model | Behavioral specs (given/when/then) for wiring interactions | `design/07_INTERACTION/interaction-model.md` |
| Behavioral specs | Detailed interaction patterns | `design/07_INTERACTION/behavioral-spec.md` |

## Upstream sync

The prototype consumes canvas briefs, Figma screens, and story/interaction artifacts. The Tier 4 sync loop handles drift between the three Develop nodes. The upstream sync protocol extends awareness to changes in the briefs' upstream sources.

**On entry:** Check `design/15_PROTOTYPE/_upstream.md` (if it exists, separate from the manifest). Compare recorded canvas brief versions and upstream artifact versions. If briefs or their upstream sources have changed since last run:

1. Report what changed, which prototype screens are affected, and classify severity
2. Ask the designer: update affected screens, or proceed with current prototype?
3. If updating, revise only affected screens — don't rebuild the entire prototype

**On completion:** After producing or updating prototype screens:

1. Update the prototype manifest with current sync hashes
2. Update `design/15_PROTOTYPE/_upstream.md` with consumed artifact versions
3. Report any drift discovered during prototyping back to canvas briefs (via drift log)

## Process

**0. Check upstream sync.** Run the upstream sync check described above. If this is a first run, note which canvas briefs and Figma screens are available.

**1. Choose technology and scaffold.** Select a stack appropriate for the project (vanilla HTML/CSS/JS, React, Next.js, Svelte, etc.). The process is technology agnostic — what matters is that the prototype can render screens, handle navigation, and respond to interactions. Scaffold the project in `design/15_PROTOTYPE/`.

**2. Build screen by screen.** For each screen in scope:
   - Read the canvas brief for structure, content, and states
   - Capture a Figma screenshot via MCP for visual reference
   - Implement the screen matching the brief's layout, content, and component inventory
   - Apply visual tokens (colors, spacing, typography) from the brief's visual specification
   - Implement all states defined in the brief (empty, loading, populated, error, etc.)

**3. Wire flows.** Using the walking skeleton as the primary flow and story map for secondary flows:
   - Connect screens with navigation matching the IA navigation model
   - Implement transitions and micro-interactions from the interaction model
   - Wire behavioral specs (given/when/then) as interactive behaviors

**4. Validate against acceptance criteria.** For each screen:
   - Check acceptance criteria from the canvas brief
   - Verify keyboard navigation matches the a11y specification
   - Test responsive behavior at breakpoints noted in the brief
   - Verify all states render correctly

**5. Sync check.** Run drift detection (see Sync rules below). Resolve any flagged drifts before considering the screen complete.

## Outputs

| File | What it contains |
|------|-----------------|
| `design/15_PROTOTYPE/manifest.md` | Screen-to-file mapping, tech stack, sync hashes, build/run instructions |
| `design/15_PROTOTYPE/drift-log.md` | Record of detected drifts and resolutions |
| `design/15_PROTOTYPE/[project files]` | The prototype source code |

### Manifest format

```markdown
# Prototype Manifest

## Tech stack
- Framework: [chosen framework]
- Build: [build command]
- Run: [run command]
- Preview: [URL or method]

## Screen mapping

| Screen | Canvas brief | Figma page | Prototype file | Sync hash |
|--------|-------------|------------|----------------|-----------|
| [name] | [brief path] | [Figma page name] | [file path] | [hash] |

## Flow mapping

| Flow | Story IDs | Screens (in order) |
|------|-----------|-------------------|
| Walking skeleton | [IDs] | [screen list] |
| [secondary flow] | [IDs] | [screen list] |
```

## Sync rules

### Change classification

| Change type | Examples | Behavior |
|---|---|---|
| Content/label | Button text, error message, placeholder | **Auto-sync** — propagate to all three nodes |
| State change | New empty state, removed loading state | **Auto-sync** — propagate to all three nodes |
| Visual tweak | Color, spacing, radius, font size | **Auto-sync** — Figma → Prototype. Brief notes delta. |
| Structural | New section, reordered layout, added/removed component | **Flag drift** — designer approves direction, canvas brief updates first, then propagates |

### Drift detection

When this mode runs, it performs drift detection:

1. **Compare Figma → Prototype:** Capture Figma screenshot via MCP, compare against prototype render. Flag visual discrepancies.
2. **Compare Brief → Prototype:** Check that all components, states, and content strings in the brief exist in the prototype. Flag missing or extra elements.
3. **Compare Prototype → Brief:** If prototype has evolved (e.g., interaction improvements discovered during prototyping), flag additions that need to flow back to the brief.

Drifts are logged to `design/15_PROTOTYPE/drift-log.md` with:
- Timestamp
- Source node (which changed)
- Change type (auto-sync or structural)
- Description
- Resolution (auto-applied, designer-approved, or pending)

### Sync hash

Each screen entry in the manifest carries a sync hash — a fingerprint of the last-known aligned state across all three nodes. When any node changes, the hash is compared. Mismatches trigger drift detection.

## Rules

- **Technology is a project decision, not a process decision.** This mode defines workflow, not stack.
- **Canvas briefs are authoritative for intent.** If the prototype diverges from the brief, either update the brief (with designer approval for structural changes) or revert the prototype.
- **Figma is authoritative for visual execution.** The prototype matches Figma's visual output, not the other way around — unless a prototype-discovered improvement is approved to flow back.
- **Prototype improvements flow upstream.** Interaction discoveries made during prototyping (e.g., "this flow needs an intermediate confirmation step") must be captured in the drift log and, once approved, propagated back to the canvas brief and Figma.
- **Walking skeleton first.** Always wire the walking skeleton flow before branching into secondary flows.
- **Every screen traces to a brief.** No prototype screen without a canvas brief (except clearly labeled exploratory spikes).

## Feeds into

- **Design Validation** — prototype is the test subject for usability testing and heuristic evaluation
- **Canvas Brief** — prototype discoveries flow back as brief updates (via drift log)
- **Figma Screens** — approved prototype improvements propagate to Figma
