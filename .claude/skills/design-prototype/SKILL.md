---
name: design-prototype
description: >
  Builds coded prototypes from Figma screens, canvas briefs, and story maps. Technology
  agnostic — adapts to the project's chosen stack. Part of the Tier 4 Develop sync loop:
  canvas briefs define intent, Figma defines visuals, the prototype makes it interactive.
  Includes drift detection and bidirectional sync with Figma and canvas briefs.
  Triggers on: "prototype", "code prototype", "build prototype", "interactive prototype",
  "wire flows", "make it interactive", "coded prototype", "prototype this", "bring to life",
  or when Figma screens are ready to be turned into a running, interactive experience.
  Upstream dependencies: canvas briefs, Figma screens (via MCP), walking skeleton,
  interaction model.
---

# Coded Prototype — Making Designs Interactive

## Purpose

Translate Figma screens into a running, interactive prototype that can be navigated, tested, and validated. The prototype is technology agnostic — it adapts to the project's chosen stack. Its job is to prove that the design works as an experience, not just as static screens.

---

## Position in the Develop loop

This mode is one of three nodes in the Tier 4 sync loop:

```
Canvas Brief ◄──sync──► Figma Screens ◄──sync──► Prototype
     ▲                                                │
     └────────────────── sync ────────────────────────┘
```

- **Canvas Brief** owns intent (structure, content, accessibility, behavior)
- **Figma Screens** own visual execution (layout, components, tokens)
- **Prototype** owns interaction fidelity (flows, transitions, responsive behavior)

---

## Dependency check

### Hard dependencies (blocks if missing)

| Required | What it provides | How to check |
|----------|-----------------|-------------|
| Canvas briefs | Per-screen spec | `design/canvas/[screen]-brief.md` exists |
| Figma screens | Visual reference | Figma MCP connection live, screens built |
| Walking skeleton | Flow order | `design/stories/walking-skeleton.md` exists |
| Interaction model | Behavioral specs | `design/interaction/interaction-model.md` exists |

### Soft dependencies (used if available)

- `design/stories/release-slices.md` — scope boundaries
- `design/interaction/behavioral-spec.md` — detailed given/when/then
- `design/interaction/error-strategy.md` — error handling patterns
- `design/accessibility/keyboard-nav-plan.md` — keyboard navigation
- `design/content/microcopy-patterns.md` — dynamic content patterns

---

## Workflow

### Step 1 — Technology selection and scaffold

Choose a stack appropriate for the project. Common options:
- Vanilla HTML/CSS/JS — simplest, fastest iteration
- React/Next.js — component-based, closest to production
- Svelte/Vue — lightweight component model
- Any framework — the process doesn't prescribe

Scaffold in `design/prototype/`. Create the manifest file.

### Step 2 — Build screen by screen

For each screen in scope (following canvas brief priority):

1. **Read the canvas brief** — structure, content, components, states, a11y
2. **Capture Figma screenshot** via MCP — visual reference for layout and styling
3. **Inspect Figma components** via MCP — extract exact values, properties, variants
4. **Implement the screen** — match the brief's layout, content hierarchy, and component inventory
5. **Apply visual tokens** — colors, spacing, typography from the brief's visual specification
6. **Implement all states** — empty, loading, populated, error, etc. as defined in the brief
7. **Update manifest** — add screen-to-file mapping and sync hash

### Step 3 — Wire flows

Using the walking skeleton as the primary flow:

1. **Connect screens** — navigation matching the IA navigation model
2. **Implement transitions** — micro-interactions from the interaction model
3. **Wire behavioral specs** — given/when/then as interactive behaviors
4. **Add secondary flows** — from the story map, in release slice priority order

### Step 4 — Validate

For each screen:
- Check acceptance criteria from the canvas brief
- Verify keyboard navigation matches the a11y specification
- Test responsive behavior at breakpoints noted in the brief
- Verify all defined states render correctly
- Run the walking skeleton flow end-to-end

### Step 5 — Sync check

Run drift detection (see below). Resolve any flagged drifts before marking the screen complete.

---

## Sync rules

### Change classification

| Change type | Examples | Behavior |
|---|---|---|
| Content/label | Button text, error message, placeholder | **Auto-sync** all three nodes |
| State change | New empty state, removed loading state | **Auto-sync** all three nodes |
| Visual tweak | Color, spacing, radius, font size | **Auto-sync** Figma → Prototype. Brief notes delta. |
| Structural | New section, reordered layout, new/removed component | **Flag drift** — designer approves, canvas brief updates first |

### Drift detection process

When this mode runs, perform drift detection:

1. **Figma → Prototype:** Capture Figma screenshot via MCP. Compare against prototype render. Flag visual discrepancies.
2. **Brief → Prototype:** Check that all components, states, and content strings in the brief exist in the prototype. Flag missing or extra elements.
3. **Prototype → Brief:** If prototype has evolved (e.g., interaction improvements discovered during prototyping), flag additions that need to flow back to the brief.

### Drift log

Log all drifts to `design/prototype/drift-log.md`:

```markdown
## Drift Log

| Date | Source | Type | Description | Resolution |
|------|--------|------|-------------|------------|
| [date] | [which node changed] | [auto-sync/structural] | [what changed] | [auto-applied/approved/pending] |
```

### Sync hash

Each screen in the manifest carries a sync hash. When any node changes, hashes are compared. Mismatches trigger drift detection.

---

## Outputs

| File | What it contains |
|------|-----------------|
| `design/prototype/manifest.md` | Screen-to-file mapping, tech stack, sync hashes, build/run instructions |
| `design/prototype/drift-log.md` | Record of detected drifts and resolutions |
| `design/prototype/[project files]` | The prototype source code |

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

---

## Rules

- **Technology is a project decision, not a process decision.** This skill defines workflow, not stack.
- **Canvas briefs are authoritative for intent.** If the prototype diverges from the brief, either update the brief (designer approval for structural changes) or revert the prototype.
- **Figma is authoritative for visual execution.** The prototype matches Figma's visual output, not the other way around — unless a prototype-discovered improvement is approved to flow back.
- **Prototype improvements flow upstream.** Interaction discoveries made during prototyping must be captured in the drift log and, once approved, propagated back to the canvas brief and Figma.
- **Walking skeleton first.** Always wire the walking skeleton flow before branching into secondary flows.
- **Every prototype screen traces to a brief.** No prototype screen without a canvas brief (except clearly labeled exploratory spikes).
- **Manifest stays current.** Update the manifest after every screen addition or sync resolution.

---

## Output checklist

- [ ] `design/prototype/manifest.md` — complete with all screen mappings and sync hashes
- [ ] `design/prototype/drift-log.md` — all drifts logged and resolved
- [ ] Walking skeleton flow works end-to-end
- [ ] All screens match their canvas briefs (content, states, components)
- [ ] All screens visually match their Figma implementations
- [ ] Keyboard navigation works per a11y specification
- [ ] Responsive behavior verified at defined breakpoints
