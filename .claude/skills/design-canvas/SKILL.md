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
> - **Inputs:** IA sitemap, interaction model, visual spec, content terminology (hard deps) + personas, stories, states, a11y, validation (soft deps)
> - **Outputs:** `design/12-canvas/[screen-name]-brief.md` — one self-contained brief per screen
> - **Hard rules:** HARD BLOCK if IA, interaction, visual, or content artifacts are missing. Briefs must be self-contained. One brief per screen.
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
| IA sitemap | Screen inventory and purpose | `design/05-ia/sitemap.md` |
| Interaction model | States, behaviors, patterns | `design/06-interaction/interaction-model.md` |
| Visual spec | Tokens, hierarchy, density | `design/07-visual/visual-language.md` |
| Content terminology | Labels, microcopy | `design/08-content/terminology.md` |

**Soft dependencies** (used if available, warned if missing):
- `design/02-user-models/personas/*` — persona context for each screen
- `design/04-stories/story-map.md` — stories served by each screen
- `design/06-interaction/state-inventory.md` — per-screen states
- `design/06-interaction/behavioral-spec.md` — given/when/then specs
- `design/06-interaction/error-strategy.md` — error handling approach
- `design/08-content/microcopy-patterns.md` — button labels, validation messages
- `design/09-accessibility/aria-patterns.md` — ARIA roles per component
- `design/09-accessibility/keyboard-nav-plan.md` — tab order per screen
- `design/09-accessibility/color-contrast-audit.md` — contrast-safe combinations
- `design/10-validation/review-checklist.md` — post-build verification criteria

---

## Workflow

### Step 1 — Select screen(s) to brief

From the IA sitemap, identify which screen(s) need canvas briefs. You can brief one screen at a time or batch multiple screens.

### Step 2 — Compose the canvas brief

For each screen, pull from all upstream artifacts and compose:

```markdown
## Canvas Brief — [Screen Name]
**Page number:** [NN] (from IA sitemap)
**Last updated:** [date]

---

### 1. Purpose & context
- **What this screen does:** [from IA sitemap — purpose column]
- **Primary persona:** [from IA — who uses this screen most]
- **Entry points:** [from IA — how users arrive here]
- **Exit points:** [where users go from here]

### 2. Stories served
[From story map — list all stories this screen fulfills]
| Story ID | Story | Acceptance criteria |
|----------|-------|-------------------|

### 3. Layout & content hierarchy
[From IA content inventory — what information appears and in what order]

#### Primary content (above the fold)
1. [Element] — [data source] — [display format]
2. [Element] — ...

#### Secondary content (on scroll / interaction)
1. [Element] — ...

#### Tertiary content (on demand)
1. [Element] — ...

#### Actions
| Action | Label | Persona | Interaction pattern | Confirmation needed? |
|--------|-------|---------|--------------------|--------------------|

### 4. Components needed
[From interaction model + IA — what components this screen requires]
| Component | Category | Exists? | Variants needed | Notes |
|-----------|----------|---------|----------------|-------|
| [Name] | [Atom/Molecule/etc.] | [Y/N] | [list states] | [any special requirements] |

### 5. States
[From state inventory — all states this screen can be in]
| State | Condition | What is shown | User action |
|-------|-----------|---------------|-------------|
| Empty | [when] | [content from design-content] | [CTA] |
| Loading | [when] | [skeleton/spinner] | [wait] |
| Populated | [when] | [full content] | [all actions] |
| Error | [when] | [error message from design-content] | [retry] |
| [others] | ... | ... | ... |

### 6. Content specification
[From terminology + microcopy patterns]
| Element | Label/Text | Source |
|---------|-----------|--------|
| Page title | "[exact text]" | terminology.md |
| [Button 1] | "[exact label]" | microcopy-patterns.md |
| [Empty state] | "[exact message]" | microcopy-patterns.md |
| [Error message] | "[exact message]" | microcopy-patterns.md |
| [Field labels] | "[exact labels]" | terminology.md |

### 7. Visual specification
[From visual language + color rationale]
- **Density:** [compact / comfortable / spacious]
- **Key tokens:** [which semantic tokens are most relevant to this screen]
- **Special visual treatments:** [any screen-specific visual needs]

### 8. Accessibility specification
[From a11y artifacts]
- **Tab order:** [numbered sequence from keyboard-nav-plan.md]
- **ARIA landmarks:** [roles for major sections]
- **Key ARIA patterns:** [from aria-patterns.md for components on this screen]
- **Screen reader flow:** [what gets announced in what order]

### 9. Behavioral specifications
[From behavioral-spec.md — key interactions on this screen]
| Interaction | Given | When | Then |
|------------|-------|------|------|

### 10. Acceptance criteria
[Aggregated from stories + validation checklist]
- [ ] [criterion 1]
- [ ] [criterion 2]
- [ ] [criterion 3]

### 11. Breakpoint notes
[Any responsive-specific considerations for this screen]
| Breakpoint | Adaptation |
|-----------|-----------|
| Mobile (390px) | [what changes] |
| Tablet (768px) | [what changes] |
| Desktop (1440px) | [default] |
| Wide (1920px) | [what changes] |
```

Write to `design/12-canvas/[screen-name]-brief.md`.

### Step 3 — Cross-reference check

After writing the brief, verify:
- Every story ID references a real story in `design/04-stories/story-map.md`
- Every component listed is either in the existing Figma inventory or flagged as "needs creation"
- Every content string comes from `design/08-content/` artifacts
- Every state listed matches `design/06-interaction/state-inventory.md`

---

## Bridge to the Develop loop

The canvas brief feeds both Figma execution and the coded prototype:

| Brief section | Figma skill | Prototype | How it's consumed |
|--------------|------------|-----------|-------------------|
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

- [ ] `design/12-canvas/[screen-name]-brief.md` — one complete brief per screen
- [ ] All cross-references verified (stories, components, content, states)
- [ ] Brief is self-contained — a reader can build the Figma screen from this document alone

---

## Rules

- **Hard dependencies are non-negotiable.** Do not produce canvas briefs without IA, interaction, visual, and content artifacts. The brief would be guesswork.
- Canvas briefs are the **single source of truth** for Figma execution. If the brief says "Button label: Save changes", Figma uses "Save changes" — not a variation.
- One brief per screen. If a screen has sub-views (tabs, panels), they're sections within the same brief, not separate briefs.
- Briefs must be **self-contained** — a reader should be able to build the screen from the brief alone, without needing to read upstream artifacts. Pull the relevant information in, don't just link to it.
- When upstream artifacts conflict (e.g., IA says one thing, interaction model says another), flag the conflict in the brief and resolve it before proceeding to Figma.
- Update briefs when upstream artifacts change. Briefs are living documents, not snapshots.
- Components flagged as "needs creation" in the brief must be built via `figma-component` before the screen is assembled.

---

## Sync workflow

Canvas briefs participate in the Develop sync loop. When re-entering a brief after Figma or prototype work:

### Detecting incoming changes

1. **From Figma:** Check if Figma screens have diverged from the brief (new components, layout changes, visual tweaks). Use Figma MCP to inspect current screen state.
2. **From Prototype:** Check `design/13-prototype/drift-log.md` for pending drifts flagged by the prototype mode.

### Applying changes

| Change type | Action |
|---|---|
| Content/label (auto-sync) | Update content specification section to match |
| State change (auto-sync) | Update states section to match |
| Visual tweak | Note delta in visual specification section |
| Structural (flagged) | Present to designer for approval. If approved, update brief sections, then propagate to the other node. |

### Sync hash

Append a sync hash comment at the bottom of each brief:

```markdown
<!-- sync-hash: [hash-value] -->
```

Update the hash after every sync resolution.
