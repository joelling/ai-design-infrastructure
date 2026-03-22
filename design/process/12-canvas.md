# Chapter 12: Design-to-Canvas Synthesis

> **Tier 4 — Develop** | Mode: `design-canvas`

## Why this matters

This is the critical bridge. Without canvas briefs, someone must mentally aggregate 10+ design artifact files while working in Figma — pulling screen purpose from IA, states from interaction design, labels from content, ARIA patterns from accessibility, all simultaneously. Canvas briefs do that aggregation once, into a self-contained document per screen.

## The mental model

You are a project manager assembling a construction package. The architect (IA) designed the floor plan. The interior designer (visual) chose the finishes. The engineer (interaction) specified the electrical and plumbing. The accessibility consultant wrote the compliance requirements. Your job is to compile a single document that the construction crew (Figma) can follow without needing to read any upstream documents.

## Hard dependencies

This mode **blocks** if these artifacts are missing:

| Required | What it provides | Path |
|----------|-----------------|------|
| IA sitemap | Screen inventory and purpose | `design/information-architecture/sitemap.md` |
| Interaction model | States, behaviors, patterns | `design/interaction/interaction-model.md` |
| Visual spec | Tokens, hierarchy, density | `design/visual/visual-language.md` |
| Content terminology | Labels, microcopy | `design/content/terminology.md` |

Additional artifacts are used if available (personas, behavioral archetypes, story map, state inventory, behavioral specs, error strategy, microcopy patterns, ARIA patterns, keyboard nav plan, contrast audit, review checklist). Each enriches the brief. Missing ones are noted.

## Upstream sync

Canvas briefs aggregate ALL upstream artifacts. The sync protocol here is especially important — a change in any Tier 1-3 mode can affect briefs.

**On entry:** Check `design/canvas/_upstream.md` (if it exists). Compare recorded upstream artifact versions against current files across all upstream modes (IA, interaction, visual, content, accessibility, validation, user-models, stories). If upstream has changed since last run:

1. Report what changed, which briefs are affected, and classify severity (additive / corrective / structural)
2. Ask the designer: update affected briefs, or proceed with current outputs?
3. If updating, revise only the affected sections of affected briefs — don't rebuild all briefs from scratch

**On completion:** After producing or updating briefs:

1. Add or increment version headers and sync hashes on all changed briefs
2. Update `design/canvas/_upstream.md` with consumed artifact versions
3. Report which downstream modes are now potentially stale (figma skills, prototype)

### Artifact version header for briefs

Every canvas brief carries a version comment and sync hash:

```markdown
<!-- artifact: design/canvas/profile-view-brief.md | version: 2 | mode: design-canvas | updated: 2026-03-21 | evidence: sitemap.md@v3, interaction-model.md@v2, visual-language.md@v1, terminology.md@v2 -->
<!-- sync-hash: [hash-value] -->
```

## Process

**0. Check upstream sync.** Run the upstream sync check described above. If this is a first run, note which upstream artifacts are available and identify any gaps.

**1. Select screens to brief.** From the IA sitemap, identify which screens need canvas briefs. Brief one or batch multiple.

**2. Compose the canvas brief.** For each screen, pull from all upstream artifacts and assemble:

- **Purpose and context** — what this screen does, primary persona, serving archetype(s), entry/exit points (from IA)
- **Stories served** — which user stories this screen fulfills, with acceptance criteria (from story map)
- **Layout and content hierarchy** — what information appears and in what order, with actions (from IA content inventory)
- **Components needed** — what components this screen requires, with variants, categorized by atom/molecule/organism (from interaction model + IA)
- **States** — all states this screen can be in, with conditions and user actions (from state inventory)
- **Content specification** — exact labels, button text, empty state messages, error messages (from content artifacts)
- **Visual specification** — density, key tokens, special treatments (from visual language)
- **Accessibility specification** — tab order, ARIA landmarks, key patterns, screen reader flow (from a11y artifacts)
- **Behavioral specifications** — key given/when/then interactions (from behavioral spec)
- **Acceptance criteria** — aggregated from stories and validation checklist
- **Breakpoint notes** — responsive adaptations (from visual language grid)

**3. Cross-reference check.** After writing, verify: every story ID references a real story, every component is either existing or flagged for creation, every content string comes from content artifacts, every state matches the inventory.

## Outputs

| File | What it contains |
|------|-----------------|
| `design/canvas/[screen-name]-brief.md` | One complete brief per screen |
| `design/canvas/_upstream.md` | Upstream dependency manifest — consumed and produced artifact versions |

## Rules

- **Hard dependencies are non-negotiable.** Do not produce briefs without IA, interaction, visual, and content artifacts.
- Canvas briefs are the **single source of truth** for Figma execution. If the brief says "Save changes," Figma uses "Save changes."
- One brief per screen. Sub-views (tabs, panels) are sections within the same brief.
- Briefs must be **self-contained** — a reader can build the screen from the brief alone.
- When upstream artifacts conflict, flag and resolve the conflict in the brief before proceeding.
- Update briefs when upstream artifacts change. Briefs are living documents.

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
