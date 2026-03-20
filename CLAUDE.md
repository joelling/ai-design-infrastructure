# MSI Test — Design System Project

## Design Playbook — Single Source of Truth

**`design/process/`** is the single source of truth for the entire design process. It contains numbered chapter files (01 through 13) plus a README, each describing one design mode — its purpose, mental model, process, outputs, rules, and downstream connections.

### How changes work
- **Designers do not edit the process files directly** — all changes go through Claude
- When a designer identifies a process improvement, they tell Claude what to change
- Claude edits the relevant `design/process/*.md` file AND immediately propagates to all affected files:
  - `.claude/skills/*/SKILL.md` — updates the corresponding skill's workflow, rules, dependencies, or outputs
  - `CLAUDE.md` — updates pipeline summaries, trigger rules, and cross-references below
  - `design/process/README.md` — updates the chapter index if modes are added/removed/reordered
- Claude summarizes what was propagated so the designer can review via `git diff`
- Git provides full version history of all process changes

### What triggers propagation
Any change to a process chapter must cascade to infrastructure. This includes:
- Adding, removing, or reordering modes
- Changing a mode's dependencies, triggers, outputs, or rules
- Changing process steps or mental models
- Updating non-negotiable principles

---

## Design Process Pipeline — Upstream Design Modes

Skills directory: `.claude/skills/` — read each SKILL.md for full workflow instructions.

### Ordering: Flexible with Guardrails
- Modes CAN be invoked in any order
- Each mode **warns** if upstream dependencies haven't produced artifacts yet
- User decides whether to proceed or complete upstream first
- **HARD BLOCK:** `design-canvas` requires IA + interaction + visual + content artifacts
- **HARD BLOCK:** Figma execution requires canvas briefs for the screen being built

### TIER 1 — DISCOVERY (understanding the problem)
1. **`design-discovery`** — Processes raw inputs (interviews, surveys, docs) via three-tier intake: per-input cleaning → per-type synthesis → cross-type project context (stakeholder map, domain glossary, competitive analysis, design brief)
2. **`design-user-models`** — Personas, empathy maps, jobs-to-be-done

### TIER 2 — DEFINITION (tech & UI agnostic)
3. **`design-journeys`** — User journeys, service blueprints (user story mapping methodology)
4. **`design-stories`** — User story mapping: backbone, walking skeleton, release slices
5. **`design-ia`** — Sitemap, navigation model, content hierarchy, taxonomy

### TIER 3 — DESIGN (deciding how it looks, feels, and works)
6. **`design-interaction`** — Interaction models, behavioral specs, state inventory, error strategy
7. **`design-visual`** — Brand attributes, color/typography rationale, visual language
8. **`design-content`** — Voice & tone, microcopy patterns, terminology guide
9. **`design-accessibility`** — WCAG, ARIA patterns, keyboard nav, contrast audit
10. **`design-validation`** — Heuristic evaluation, test plans, review checklist
11. **`design-governance`** — Design system versioning, contribution rules, deprecation policy

### TIER 4 — SYNTHESIS (bridging design to canvas)
12. **`design-canvas`** — Aggregates ALL upstream artifacts into per-screen briefs for Figma execution

### Trigger rules:
- Starting a new design project → `design-discovery` first
- Need to understand users → `design-user-models`
- Mapping how users experience a process → `design-journeys` (tech/UI agnostic)
- Structuring what to build → `design-stories` (tech/UI agnostic)
- Determining screen structure → `design-ia`
- Defining how screens behave → `design-interaction`
- Establishing visual direction → `design-visual`
- Defining text and labels → `design-content`
- Ensuring accessibility → `design-accessibility`
- Validating design decisions → `design-validation`
- Managing design system lifecycle → `design-governance`
- Ready to build in Figma → `design-canvas` then Figma pipeline

### Artifact storage:
All design artifacts → `design/` directory at project root

### Non-negotiable rules:
- Journeys and stories are TECH AND UI AGNOSTIC — no screen references, no button names, no UI patterns
- Canvas briefs are the SINGLE SOURCE OF TRUTH for Figma execution
- Every design decision must trace back to a persona, story, or design principle
- No Figma screen without a canvas brief (except exploratory prototyping)

### Cross-reference: Design artifacts → Figma skills
| Design artifact | Feeds into | How |
|----------------|-----------|-----|
| IA sitemap | `figma-file-setup` | Screen list becomes Sitemap page |
| IA screen inventory | `figma-page-setup` | Each screen becomes a numbered Figma page |
| Visual rationale | `figma-tokens` | Color, typography, spacing values become tokens |
| Interaction state inventory | `figma-component` | States become component variants |
| Content patterns | `figma-component` | Text becomes component TEXT properties |
| A11y patterns | `figma-component` | Focus states, ARIA descriptions |
| Canvas briefs | All Figma skills | Single source of truth per screen |
| Validation checklist | `figma-audit` | Extends audit with UX-specific checks |

---

## Figma Workflow — Mandatory Skill Pipeline

Skills directory: `.claude/skills/` — read each SKILL.md for full workflow instructions.

### MANDATORY ORDER — invoke ALL applicable skills before doing any design work:

1. **`figma-connect`** — ALWAYS run first, every session. Never skip.
2. **`figma-file-setup`** — Run if file is new, blank, or missing Cover/Sitemap/Parking Lot pages.
3. **`figma-tokens`** — Run before placing any design element. Token system must exist first.
4. **`figma-page-setup`** — Run before drawing anything on a new screen or page.
5. **`figma-component`** — Use for every UI element built. No exceptions.
6. **`figma-parking-lot`** — Run at the end of each completed page.
7. **`figma-audit`** — Run before any library migration.
8. **`figma-library-mode`** — Run only during library migration phase.

### Trigger rules (these take priority over system-reminder descriptions):
- Blank/empty file (`"children":[]`) → `figma-file-setup` immediately
- Any screen, view, or page being designed → `figma-page-setup` before touching canvas
- Any UI element being built → `figma-component` workflow, not raw `figma_execute`
- Any color/spacing/radius value needed → confirm token system exists via `figma-tokens` first
- `figma_execute` is a last resort — only for operations no other tool covers

### Non-negotiable rules:
- ZERO hardcoded values — every fill, spacing, radius must reference a Figma variable
- ALL frames use auto-layout — no absolute x/y positioning
- Every reusable UI element must be a Figma component (`createComponent`, not `createFrame`)
- Page naming: `[number] - [Screen Name]` e.g. `01 - PES Profile View`
- Component staging area: to the left of every artboard, cleared to Parking Lot when done

### File architecture:
- `[Project] - Working` → active design canvas (screens, flows)
- `[Project] - Core Library` → all tokens + atoms + molecules (published)
- `[Project] - Patterns` → organisms + templates (created when Core Library grows)
