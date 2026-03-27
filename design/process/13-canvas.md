# Design-to-Canvas Synthesis

> **Tier 4 — Develop** | Mode: `design-canvas`

## Why this matters

This is the critical bridge. Without canvas briefs, someone must mentally aggregate 10+ design artifact files while working in Figma — pulling screen purpose from IA, states from interaction design, labels from content, ARIA patterns from accessibility, all simultaneously. Canvas briefs do that aggregation once, into a self-contained document per screen.

## The mental model

You are a project manager assembling a construction package. The architect (IA) designed the floor plan. The interior designer (visual) chose the finishes. The engineer (interaction) specified the electrical and plumbing. The accessibility consultant wrote the compliance requirements. Your job is to compile a single document that the construction crew (Figma) can follow without needing to read any upstream documents.

## Hard dependencies

This mode **blocks** if these artifacts are missing:

| Required | What it provides | Path |
|----------|-----------------|------|
| Screen inventory | Canonical screen list, story-to-screen mapping | `design/06_INFORMATION_ARCHITECTURE/screen-inventory.md` |
| Interaction model | States, behaviors, patterns | `design/07_INTERACTION/interaction-model.md` |
| Visual spec | Tokens, hierarchy, density | `design/08_VISUAL/visual-language.md` |
| Content terminology | Labels, microcopy | `design/09_CONTENT/terminology.md` |

Additional artifacts are used if available (personas, behavioral archetypes, story map, business rules register, state inventory, behavioral specs, error strategy, microcopy patterns, ARIA patterns, keyboard nav plan, contrast audit, review checklist). Each enriches the brief. Missing ones are noted.

## Upstream sync

Canvas briefs aggregate ALL upstream artifacts. The sync protocol here is especially important — a change in any Tier 1-3 mode can affect briefs.

**On entry:** Check `design/13_CANVAS/_upstream.md` (if it exists). Compare recorded upstream artifact versions against current files across all upstream modes (IA, interaction, visual, content, accessibility, validation, user-models, stories, process-flows). If upstream has changed since last run:

1. Report what changed, which briefs are affected, and classify severity (additive / corrective / structural)
2. Ask the designer: update affected briefs, or proceed with current outputs?
3. If updating, revise only the affected sections of affected briefs — don't rebuild all briefs from scratch

**On completion:** After producing or updating briefs:

1. Add or increment version headers and sync hashes on all changed briefs
2. Update `design/13_CANVAS/_upstream.md` with consumed artifact versions
3. Report which downstream modes are now potentially stale (figma skills, prototype)

### Artifact version header for briefs

Every canvas brief carries a version comment and sync hash:

```markdown
<!-- artifact: design/13_CANVAS/P-02_project-space.md | version: 2 | mode: design-canvas | updated: 2026-03-21 | evidence: screen-inventory.md@v3, interaction-model.md@v2, visual-language.md@v1, terminology.md@v2 -->
<!-- sync-hash: [hash-value] -->
```

## Process

**0. Check upstream sync.** Run the upstream sync check described above. If this is a first run, note which upstream artifacts are available and identify any gaps. Explicitly check `story-map.md` and `business-rules-register.md` versions alongside the other upstream artifacts.

**1. Select screens to brief.** From `screen-inventory.md`, identify which screens need canvas briefs. Brief one or batch multiple.

**2. Compose the canvas brief.** For each screen, pull from all upstream artifacts and assemble the following sections. One file per screen — states/frames are sections within the file, not separate files.

### Section 1 — Frame inventory

Every brief opens with a numbered list of all Figma frames (states/variants) that need to be visualized for this screen. This tells the designer at a glance how many frames to build.

```markdown
## 1. Frame inventory

| # | Frame | Description |
|---|-------|-------------|
| 1.1 | Ask — Empty | Default state, no query submitted |
| 1.2 | Ask — Generating | Query submitted, response streaming |
| 1.3 | Ask — Response | Full response with inline citations |
| 1.4 | Ask — Citations expanded | Citation panel open alongside response |
| 1.5 | Ask — Source panel | Full source document viewer |
```

Each frame maps to a distinct visual state worth a separate Figma artboard. Include the Figma node ID if known. Subsequent sections reference frame numbers where behavior differs (e.g., "Frame 1.2 only: show skeleton loader").

### Section 2 — Traceability

Replace the old flat "Stories served" table with a structured traceability block that maps stories, business rules, process flow steps, and interaction specs to this screen.

**2a. Stories served** — pulled from `screen-inventory.md`, validated against story map:

| Story | Description | Business rules | Interaction spec |
|-------|-------------|---------------|-----------------|
| DS-017 | ...confirm or override disposition... | BR-06 | compliance-disposition-gate.md |

**2b. Process flow coverage** — which steps from `design/04_PROCESS_FLOWS/` this screen implements:

| Flow step | Business rule | What this screen implements |
|-----------|--------------|---------------------------|
| Compliance disposition check | BR-06 | ComplianceDispositionGate component |

**2c. Interaction specs referenced** — which files in `design/07_INTERACTION/` govern this screen:

| Spec file | Component | Stories |
|-----------|-----------|---------|
| compliance-disposition-gate.md | ComplianceDispositionGate | DS-017, DS-021 |

### Sections 3–13 — Brief body

The remaining sections, each referencing frame numbers where behavior differs per frame:

- **3. Purpose and context** — what this screen does, primary persona, serving archetype(s), entry/exit points (from IA)
- **4. Layout and content hierarchy** — what information appears and in what order, with actions (from IA content inventory)
- **5. Components needed** — what components this screen requires, with variants, categorized by atom/molecule/organism (from interaction model + IA)
- **6. States** — all states this screen can be in, with conditions and user actions (from state inventory)
- **7. Content specification** — exact labels, button text, empty state messages, error messages (from content artifacts)
- **8. Visual specification** — density, key tokens, special treatments (from visual language)
- **9. Accessibility specification** — tab order, ARIA landmarks, key patterns, screen reader flow (from a11y artifacts)
- **10. Behavioral specifications** — key given/when/then interactions (from behavioral spec)
- **11. Acceptance criteria** — aggregated from stories and validation checklist
- **12. Breakpoint notes** — responsive adaptations (from visual language grid)

**3. Cross-reference check.** After writing, verify:

- Every story ID in the traceability block exists in the story map
- Every story assigned to this screen in `screen-inventory.md` appears in the brief (no orphans)
- Every business rule referenced by those stories is listed in the traceability block
- Every interaction spec file whose `Host:` header references this screen ID is listed
- Every component is either existing or flagged for creation
- Every content string comes from content artifacts
- Every state matches the inventory
- Warn if a story has no interaction spec coverage (acceptable for simple browse screens)

## Outputs

| File | What it contains |
|------|-----------------|
| `design/13_CANVAS/{ScreenID}_{screen-name}.md` | One complete brief per screen. Screen ID prefix from `screen-inventory.md`. States/frames are sections within the file. |
| `design/13_CANVAS/_upstream.md` | Upstream dependency manifest — consumed and produced artifact versions |

### Naming convention

Brief filenames follow the pattern `{ScreenID}_{screen-name}.md`:
- `P-01_projects-home.md` — full screen
- `P-04_ask.md` — full screen with multiple frame states as sections
- `OV-01_view-comments.md` — overlay with multiple states as sections

The Screen ID prefix (P-01, OV-01, DE-01) comes from `screen-inventory.md`. If IA renames or renumbers a screen, the canvas filename updates accordingly.

## Rules

- **Hard dependencies are non-negotiable.** Do not produce briefs without screen inventory, interaction, visual, and content artifacts.
- Canvas briefs are the **single source of truth** for Figma execution. If the brief says "Save changes," Figma uses "Save changes."
- **One brief per screen.** States/frames are sections within the same brief, each with its own frame number (1.1, 1.2, etc.).
- **Frame inventory is mandatory.** Section 1 of every brief lists all frames to visualize. This is the designer's at-a-glance scope.
- **Traceability is mandatory.** Section 2 of every brief maps stories, business rules, process flow steps, and interaction specs. No brief without traceability.
- Briefs must be **self-contained** — a reader can build the screen from the brief alone.
- When upstream artifacts conflict, flag and resolve the conflict in the brief before proceeding.
- Update briefs when upstream artifacts change. Briefs are living documents.
- **Traceability validation:** Run `node design/scripts/sync-traceability.js` after creating or updating any canvas brief to verify bidirectional consistency between canvas briefs, story map, screen inventory, interaction specs, and business rules. Also run after any story map or screen inventory change.

## Canvas-first backward propagation

Canvas-first is a **first-class workflow**, not an exception. When a designer is sketching with a client in real time — exploring a concept before the full upstream chain exists — the right move is to move fast on canvas and back-propagate afterward. The canvas brief captures the decisions made during that session, and backward propagation is the mechanism for retroactively grounding those decisions in the upstream chain: inferring and documenting which stories, journey stages, and behavioral patterns the sketch implies. The goal is not to block the sketch, but to ensure the sketch doesn't become invisible to the rest of the process.

When a canvas brief is initiated (or a screen idea arrives) before the full upstream chain exists, the traceability block (Section 2) cannot be filled without fabricating story IDs. This is the trigger for backward propagation.

### Depth-of-reach decision matrix

| Gap type | Depth of reach | Action type |
|----------|---------------|-------------|
| AC gap only — behavior exists in story map | BRD only | **Auto** — add `[CANVAS]` tagged AC bullet; no new story ID |
| Missing story — behavior not story-mapped | Story map + BRD | **Designer decision** — creates new stable DS-NNN |
| Missing journey stage — behavior not in journey | Journey + Story map + BRD | **Designer decision** — reorders backbone activities |
| New persona behavior or entry path | User Models + Journey + Story map + BRD | **Designer decision** — modifies validated user model findings |
| New persona entirely | HARD BLOCK | Discovery must run first; designer unblocks after discovery |

### What triggers backward propagation

- Canvas brief is initiated and Section 2 traceability cannot be filled without fabricating story IDs
- `node design/scripts/sync-traceability.js` reports orphan story IDs in a canvas brief

### Propagation stops when

- Every canvas brief story ID exists in the story map with a matching definition
- `sync-traceability.js` returns 0 errors, 0 warnings

### On entry: check for propagation debt

During Step 0 (upstream sync check), also check whether any canvas brief has story IDs that:
1. Do not exist in the story map, OR
2. Exist in the story map but with a definition that does not match the brief's description

If either condition is true, classify the gap using the matrix above and present the options to the designer before proceeding.

---

## Position in the Develop loop

Canvas briefs are one of three nodes in the Tier 4 sync loop:

```
Canvas Brief ◄──sync──► Figma Screens ◄──sync──► Prototype
     ▲                                                │
     └────────────────── sync ────────────────────────┘
```

The canvas brief is authoritative for **intent** — structure, content, accessibility, and behavioral requirements aggregated from upstream. When Figma or the prototype diverge, the brief is the reference for what was *intended*. But the loop is bidirectional: improvements discovered during Figma execution or prototyping flow back into the brief.

### Sync rules for canvas briefs

| Incoming change | Source | Behavior |
|---|---|---|
| Visual tweak (color, spacing) | Figma | Brief notes the delta in visual spec section. No structural change. |
| Content/label change | Figma or Prototype | **Auto-sync** — brief updates the content specification to match. |
| State addition/removal | Figma or Prototype | **Auto-sync** — brief updates the states section. |
| Structural change (new component, reordered layout) | Figma or Prototype | **Flag drift** — designer approves, then brief is updated first. |
| Interaction discovery (new flow, confirmation step) | Prototype | **Flag drift** — logged in drift log, designer approves, brief updated. |
| AC gap discovered during synthesis | Canvas mode | **Flag** — add `[CANVAS]` tagged acceptance criteria to BRD User Stories sheet, notify stories mode that acceptance criteria have expanded. Update `design/BRD_manifest.md`. |

### Sync hash

Each canvas brief includes a sync hash at the bottom — a fingerprint of the last-known aligned state. When Figma or the prototype reports a drift, the hash is compared to detect what changed.

```markdown
<!-- sync-hash: [hash-value] -->
```

## Feeds into

- **Figma Page Setup** — page name, sub-frame structure
- **Figma Components** — what to build, with which variants, states, and TEXT properties
- **Figma Tokens** — which tokens to apply
- **Figma Audit** — acceptance criteria become verification checks
- **Coded Prototype** — per-screen spec for building interactive screens
