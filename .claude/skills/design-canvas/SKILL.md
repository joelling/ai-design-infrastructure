---
name: design-canvas
description: >
  The critical synthesis mode that bridges upstream design artifacts to Figma execution.
  Aggregates all upstream design decisions — IA, personas, stories, interaction models,
  visual specs, content, accessibility — into a single per-screen canvas brief that tells
  the Develop loop exactly what to build. Part of the Tier 4 Develop sync loop —
  canvas briefs define intent, Figma executes visually, the prototype makes it interactive.
  Triggers on: "canvas brief", "screen brief", "design to canvas", "translate to UI",
  "build screen", "compose screen", "prepare for figma", "screen spec", "canvas spec",
  "aggregate design", "synthesis", or when ready to translate design decisions into
  executable instructions. This mode has hard dependencies — it requires IA, interaction,
  visual, and content artifacts to exist.
---

# Design-to-Canvas Synthesis — The Bridge to Develop

> **Quick reference**
> - **Purpose:** Aggregate all upstream artifacts into per-screen canvas briefs
> - **Inputs:** Screen inventory, interaction model, visual spec, content terminology (hard deps) + personas, stories, business rules, states, a11y, validation (soft deps)
> - **Outputs:** `design/13_CANVAS/{ScreenID}_{screen-name}.md` — one self-contained brief per screen, states as sections
> - **Hard rules:** HARD BLOCK if screen inventory, interaction, visual, or content artifacts are missing. Briefs must be self-contained. One brief per screen. Frame inventory and traceability block are mandatory.
> - **Common mistake:** Linking to upstream artifacts instead of pulling the relevant information into the brief — briefs must stand alone

## Purpose

Aggregate ALL upstream design artifacts into **per-screen canvas briefs** — structured documents that serve as the single source of truth for intent in the Develop loop. Each canvas brief tells Figma skills exactly what to build and the prototype exactly what to implement.

---

## Position in the Develop loop

```
Canvas Brief ◄──sync──► Figma Screens ◄──sync──► Prototype
     ▲                                                │
     └────────────────── sync ────────────────────────┘
```

The canvas brief is authoritative for **intent**. Figma and the prototype must align to it. But the loop is bidirectional — improvements discovered during execution or prototyping flow back into the brief via the drift log.

---

## Dependency check — HARD REQUIREMENTS

Unlike other design modes, `design-canvas` has **hard dependencies**. It will **block** if these artifacts are missing:

| Required artifact | What it provides | Checked path |
|------------------|-----------------|-------------|
| Screen inventory | Canonical screen list, story-to-screen mapping | `design/06_INFORMATION_ARCHITECTURE/screen-inventory.md` |
| Interaction model | States, behaviors, patterns | `design/07_INTERACTION/interaction-model.md` |
| Visual spec | Tokens, hierarchy, density | `design/08_VISUAL/visual-language.md` |
| Content terminology | Labels, microcopy | `design/09_CONTENT/terminology.md` |

**Soft dependencies** (used if available, warned if missing):
- `design/02_USER_MODELS/personas/*` — persona context for each screen
- `design/02_USER_MODELS/behavioral-archetypes.md` — serving archetype(s) per screen
- `design/05_STORIES/*story-map*.md` — stories served by each screen
- `design/04_PROCESS_FLOWS/business-rules-register.md` — business rules active on each screen
- `design/04_PROCESS_FLOWS/*-flow.md` — process flow steps covered by each screen
- `design/07_INTERACTION/state-inventory.md` — per-screen states
- `design/07_INTERACTION/behavioral-spec.md` — given/when/then specs
- `design/07_INTERACTION/error-strategy.md` — error handling approach
- `design/07_INTERACTION/*.md` — individual interaction specs (matched via `Host:` header)
- `design/09_CONTENT/microcopy-patterns.md` — button labels, validation messages
- `design/10_ACCESSIBILITY/aria-patterns.md` — ARIA roles per component
- `design/10_ACCESSIBILITY/keyboard-nav-plan.md` — tab order per screen
- `design/10_ACCESSIBILITY/color-contrast-audit.md` — contrast-safe combinations
- `design/11_VALIDATION/review-checklist.md` — post-build verification criteria

---

## Upstream sync (step 0)

Before starting this mode's workflow:

0. **Value alignment check:** If `design/01_DISCOVERY/value-framework.md` exists, verify that this mode's outputs can be traced to a vision element, driver, or lever defined there. If an output cannot be connected to a documented user need or a value lever, question whether it belongs. If no value framework exists yet, proceed — but flag any outputs whose purpose is unclear.
1. Check `design/13_CANVAS/_upstream.md` for the dependency manifest
2. Compare recorded upstream versions against current artifact files (including `story-map.md`, `business-rules-register.md`, and `screen-inventory.md`)
3. If upstream has changed, report what changed (additive / corrective / structural) and ask the designer: re-process or proceed?
4. If re-processing, update incrementally — process the delta, don't rebuild from scratch
5. **Backward propagation check:** For any canvas brief being created or updated, verify that every story ID in Section 2a exists in the story map with a matching definition. If not, classify the gap using the depth-of-reach matrix in `design/process/13-canvas.md` and present options to the designer before proceeding:
   - AC gap only → auto-add `[CANVAS]` bullet to BRD; continue
   - Missing story → propose new DS-NNN; designer approves before proceeding
   - Missing journey stage → propose stage addition; designer approves before proceeding
   - New persona behavior → propose user model update; designer approves before proceeding
   - New persona → HARD BLOCK until discovery runs

After completing this mode's workflow:

1. Add or increment `<!-- artifact: ... -->` version headers on all changed output files
2. Update `design/13_CANVAS/_upstream.md` with consumed and produced artifact versions
3. Report which downstream modes are now potentially stale

### Script commands
```bash
# On entry — check staleness:
node design/scripts/sync-status.js

# After completing — version and manifest:
node design/scripts/sync-version.js init <file> design-canvas   # first time
node design/scripts/sync-version.js bump <file>                  # subsequent updates
node design/scripts/sync-manifest.js canvas                      # update manifest
```

---

## Workflow

### Step 1 — Select screen(s) to brief

From `screen-inventory.md`, identify which screen(s) need canvas briefs. You can brief one screen at a time or batch multiple screens.

### Step 2 — Compose the canvas brief

For each screen, pull from all upstream artifacts and compose. **One file per screen** — states/frames are sections within the file, not separate files.

```markdown
# Canvas Brief — [Screen Name] ([ScreenID])

**Screen ID:** [P-01, OV-01, etc. from screen-inventory.md]
**Last updated:** [date]

---

## 1. Frame inventory

| # | Frame | Figma node | Description |
|---|-------|-----------|-------------|
| 1.1 | [Screen — State A] | [node ID if known] | [what this frame shows] |
| 1.2 | [Screen — State B] | [node ID if known] | [what this frame shows] |

---

## 2. Traceability

### 2a. Stories served
[From screen-inventory.md story-to-screen mapping, validated against story map]
| Story | Description | Business rules | Interaction spec |
|-------|-------------|---------------|-----------------|
| DS-NNN | [from story map] | BR-NN | [spec-file.md] |

### 2b. Process flow coverage
[From design/04_PROCESS_FLOWS/ — which flow steps this screen implements]
| Flow step | Business rule | What this screen implements |
|-----------|--------------|---------------------------|

### 2c. Interaction specs referenced
[From design/07_INTERACTION/*.md — matched via Host: header]
| Spec file | Component | Stories |
|-----------|-----------|---------|

---

## 3. Purpose & context
- **What this screen does:** [from screen-inventory.md — purpose column]
- **Primary persona:** [from IA — who uses this screen most]
- **Entry points:** [from IA — how users arrive here]
- **Exit points:** [where users go from here]

## 4. Layout & content hierarchy
[From IA content inventory — what information appears and in what order]
[Reference frame numbers where layout differs per frame, e.g. "Frame 1.2 only: ..."]

#### Primary content (above the fold)
1. [Element] — [data source] — [display format]

#### Secondary content (on scroll / interaction)
1. [Element] — ...

#### Tertiary content (on demand)
1. [Element] — ...

#### Actions
| Action | Label | Persona | Interaction pattern | Confirmation needed? |
|--------|-------|---------|--------------------|--------------------|

## 5. Components needed
[From interaction model + IA — what components this screen requires]
| Component | Category | Exists? | Variants needed | Notes |
|-----------|----------|---------|----------------|-------|

## 6. States
[From state inventory — all states this screen can be in]
| State | Frame | Condition | What is shown | User action |
|-------|-------|-----------|---------------|-------------|
| Empty | 1.1 | [when] | [content] | [CTA] |
| Loading | — | [when] | [skeleton] | [wait] |
| Populated | 1.2 | [when] | [full content] | [all actions] |
| Error | — | [when] | [error message] | [retry] |

## 7. Content specification
[From terminology + microcopy patterns]
| Element | Label/Text | Source |
|---------|-----------|--------|

## 8. Visual specification
[From visual language + color rationale]
- **Density:** [compact / comfortable / spacious]
- **Key tokens:** [which semantic tokens are most relevant]
- **Special visual treatments:** [any screen-specific visual needs]

## 9. Accessibility specification
[From a11y artifacts]
- **Tab order:** [numbered sequence]
- **ARIA landmarks:** [roles for major sections]
- **Key ARIA patterns:** [from aria-patterns.md]
- **Screen reader flow:** [what gets announced in what order]

## 10. Behavioral specifications
[From behavioral-spec.md — key interactions on this screen]
| Interaction | Given | When | Then |
|------------|-------|------|------|

## 11. Acceptance criteria
[Aggregated from stories + validation checklist]
- [ ] [criterion 1]
- [ ] [criterion 2]

## 12. Breakpoint notes
[Any responsive-specific considerations for this screen]
| Breakpoint | Adaptation |
|-----------|-----------|
```

Write to `design/13_CANVAS/{ScreenID}_{screen-name}.md`.

### Step 3 — Cross-reference check

After writing the brief, verify:
- Every story ID in the traceability block exists in the story map
- Every story assigned to this screen in `screen-inventory.md` appears in the brief (no orphans)
- Every business rule referenced by those stories is listed in the traceability block
- Every interaction spec file whose `Host:` header references this screen ID is listed
- Every component listed is either in the existing Figma inventory or flagged as "needs creation"
- Every content string comes from `design/09_CONTENT/` artifacts
- Every state listed matches `design/07_INTERACTION/state-inventory.md`
- Warn if a story has no interaction spec coverage (acceptable for simple browse screens)

---

## Bridge to the Develop loop

The canvas brief feeds both Figma execution and the coded prototype:

| Brief section | Figma skill | Prototype | How it's consumed |
|--------------|------------|-----------|-------------------|
| Frame inventory | `figma-page-setup` | Screen scaffold | Number of artboards to create per screen |
| Traceability | — | — | Validation reference; not consumed directly by Figma |
| Purpose & context | `figma-page-setup` | Screen scaffold | Page name, annotation, screen purpose |
| Layout & hierarchy | `figma-page-setup` | Screen structure | Sub-frame structure, content order |
| Components needed | `figma-component` | UI implementation | What to build, with which variants |
| States | `figma-component` | State handling | State variants / conditional rendering |
| Content specification | `figma-component` | Text content | TEXT property defaults / string values |
| Visual specification | `figma-tokens` | Style application | Which tokens to apply |
| Accessibility | `figma-component` | A11y implementation | Focus states, ARIA, keyboard nav |
| Behavioral specs | — | Interaction logic | Given/when/then as interactive behavior |
| Acceptance criteria | `figma-audit` + `design-validation` | Validation | Post-build verification |

---

## Output checklist

- [ ] `design/13_CANVAS/{ScreenID}_{screen-name}.md` — one complete brief per screen
- [ ] Frame inventory (section 1) lists all frames to visualize
- [ ] Traceability block (section 2) maps stories, business rules, flow steps, and interaction specs
- [ ] All cross-references verified (stories, components, content, states, business rules, interaction specs)
- [ ] Brief is self-contained — a reader can build the Figma screen from this document alone

---

## Rules

- **Hard dependencies are non-negotiable.** Do not produce canvas briefs without screen inventory, interaction, visual, and content artifacts. The brief would be guesswork.
- Canvas briefs are the **single source of truth** for Figma execution. If the brief says "Button label: Save changes", Figma uses "Save changes" — not a variation.
- **One brief per screen.** States/frames are sections within the same brief, not separate files. Each brief is named `{ScreenID}_{screen-name}.md`.
- **Frame inventory is mandatory.** Section 1 of every brief lists all frames to visualize with numbered identifiers (1.1, 1.2, etc.).
- **Traceability is mandatory.** Section 2 of every brief maps stories, business rules, process flow steps, and interaction specs. No brief without traceability.
- Briefs must be **self-contained** — a reader should be able to build the screen from the brief alone, without needing to read upstream artifacts. Pull the relevant information in, don't just link to it.
- When upstream artifacts conflict (e.g., IA says one thing, interaction model says another), flag the conflict in the brief and resolve it before proceeding to Figma.
- Update briefs when upstream artifacts change. Briefs are living documents, not snapshots.
- Components flagged as "needs creation" in the brief must be built via `figma-component` before the screen is assembled.
- **Traceability validation:** Run `node design/scripts/sync-traceability.js` to verify bidirectional consistency between canvas briefs, story map, screen inventory, interaction specs, and business rules.

---

## Sync workflow

Canvas briefs participate in the Develop sync loop. When re-entering a brief after Figma or prototype work:

### Detecting incoming changes

1. **From Figma:** Check if Figma screens have diverged from the brief (new components, layout changes, visual tweaks). Use Figma MCP to inspect current screen state.
2. **From Prototype:** Check `design/15_PROTOTYPE/drift-log.md` for pending drifts flagged by the prototype mode.

### Applying changes

| Change type | Action |
|---|---|
| Content/label (auto-sync) | Update content specification section to match |
| State change (auto-sync) | Update states section to match |
| Visual tweak | Note delta in visual specification section |
| Structural (flagged) | Present to designer for approval. If approved, update brief sections, then propagate to the other node. |
| AC gap discovered during synthesis | Canvas mode | **Flag** — add `[CANVAS]` tagged AC to BRD User Stories sheet, notify stories mode. Update `design/BRD_manifest.md`. |

### Sync hash

Append a sync hash comment at the bottom of each brief:

```markdown
<!-- sync-hash: [hash-value] -->
```

Update the hash after every sync resolution.
