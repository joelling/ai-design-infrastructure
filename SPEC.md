# Design OS — Technical Specification

**Version**: 1.0
**Runtime**: Claude Code (claude-sonnet-4-6 minimum)
**Figma integration**: Figma Console MCP
**Project root**: `/[project-root]/AI Design Infrastructure/`

---

## 1. What Was Built

A design operations system implemented as a Claude Code project. It consists of:

1. **A process specification** — 13 markdown chapter files in `design/process/`, defining a complete design methodology from discovery through Figma execution
2. **A skill library** — 21 SKILL.md files in `.claude/skills/`, each an executable workflow for one design mode or Figma operation
3. **A configuration file** — `CLAUDE.md` at project root, containing all system rules, trigger logic, pipeline order, and cross-references
4. **An artifact directory tree** — `design/` subdirectories where all process outputs are written

The system has no application code, no build system, and no runtime dependencies beyond Claude Code and the Figma Console MCP.

---

## 2. Directory Structure

```
[project-root]/
├── CLAUDE.md
├── SPEC.md
├── design-os-brief.md
├── design/
│   ├── process/
│   │   ├── README.md
│   │   ├── 01-discovery.md
│   │   ├── 02-user-models.md
│   │   ├── 03-journeys.md
│   │   ├── 04-stories.md
│   │   ├── 05-ia.md
│   │   ├── 06-interaction.md
│   │   ├── 07-visual.md
│   │   ├── 08-content.md
│   │   ├── 09-accessibility.md
│   │   ├── 10-validation.md
│   │   ├── 11-governance.md
│   │   ├── 12-canvas.md
│   │   └── 13-figma-pipeline.md
│   ├── discovery/
│   ├── user-models/
│   │   ├── personas/
│   │   └── empathy-maps/
│   ├── journeys/
│   │   └── task-flows/
│   ├── stories/
│   ├── information-architecture/
│   ├── interaction/
│   ├── visual/
│   ├── content/
│   ├── accessibility/
│   ├── validation/
│   ├── governance/
│   └── canvas/
└── .claude/
    └── skills/
        ├── design-discovery/SKILL.md
        ├── design-user-models/SKILL.md
        ├── design-journeys/SKILL.md
        ├── design-stories/SKILL.md
        ├── design-ia/SKILL.md
        ├── design-interaction/SKILL.md
        ├── design-visual/SKILL.md
        ├── design-content/SKILL.md
        ├── design-accessibility/SKILL.md
        ├── design-validation/SKILL.md
        ├── design-governance/SKILL.md
        ├── design-canvas/SKILL.md
        ├── figma-connect/SKILL.md
        ├── figma-file-setup/SKILL.md
        ├── figma-tokens/SKILL.md
        ├── figma-page-setup/SKILL.md
        ├── figma-component/SKILL.md
        ├── figma-parking-lot/SKILL.md
        ├── figma-audit/SKILL.md
        ├── figma-library-mode/SKILL.md
        └── workflow-update/SKILL.md
```

---

## 3. CLAUDE.md

Located at project root. Loaded into every Claude Code session automatically.

**Purpose**: Defines the entire system's rules, pipeline order, trigger conditions, and cross-references. All other files are governed by this.

**Sections**:

1. **Design Playbook — Single Source of Truth**
   Declares `design/process/` as the single source of truth. Defines how changes work: designer tells Claude → Claude edits relevant `design/process/*.md` → Claude immediately propagates to affected `SKILL.md` files, `CLAUDE.md`, and `design/process/README.md` → Claude summarizes propagation → Git records history.

2. **Design Process Pipeline — Upstream Design Modes**
   Lists all 13 modes in 4 tiers with trigger rules. States:
   - Modes CAN be invoked in any order
   - Each mode warns if upstream dependencies have no artifacts yet
   - Designer decides whether to proceed or complete upstream first
   - **Hard block**: `design-canvas` requires IA + interaction + visual + content artifacts
   - **Hard block**: Figma execution requires canvas briefs for the screen being built

3. **Figma Workflow — Mandatory Skill Pipeline**
   Lists 8 Figma skills in mandatory execution order. States non-negotiable rules:
   - ZERO hardcoded values — every fill, spacing, radius must reference a Figma variable
   - ALL frames use auto-layout — no absolute x/y positioning
   - Every reusable UI element must be a Figma component (`createComponent`, not `createFrame`)
   - Page naming: `[NN] - [Screen Name]`
   - Component staging area: to the left of every artboard, cleared to Parking Lot when done

4. **Cross-reference table**: Design artifact → Figma skill → method of connection

---

## 4. Process Files (`design/process/`)

13 numbered chapter files plus one README. These are the authoritative specification for the methodology. Skills execute what these files describe.

**File naming**: `NN-description.md` (two-digit zero-padded number, hyphen, lowercase description)

**Each chapter contains**: Why this matters, mental model, inputs, process steps, outputs (table of file paths and contents), rules, feeds-into (downstream connections)

---

### 4.1 Chapter Index

| File | Mode | Tier |
|------|------|------|
| `01-discovery.md` | `design-discovery` | 1 — Discovery |
| `02-user-models.md` | `design-user-models` | 1 — Discovery |
| `03-journeys.md` | `design-journeys` | 2 — Definition |
| `04-stories.md` | `design-stories` | 2 — Definition |
| `05-ia.md` | `design-ia` | 2 — Definition |
| `06-interaction.md` | `design-interaction` | 3 — Design |
| `07-visual.md` | `design-visual` | 3 — Design |
| `08-content.md` | `design-content` | 3 — Design |
| `09-accessibility.md` | `design-accessibility` | 3 — Design |
| `10-validation.md` | `design-validation` | 3 — Design |
| `11-governance.md` | `design-governance` | 3 — Design |
| `12-canvas.md` | `design-canvas` | 4 — Synthesis |
| `13-figma-pipeline.md` | `figma-*` | 5 — Execution |

---

### 4.2 Per-Chapter Specification

#### `01-discovery.md`
**Inputs**: Project brief or problem statement provided by the team; existing research, interviews, or domain documentation; stakeholder knowledge brought into the session; relevant external references
**Process**:
1. Review all available project context. Extract: problem statement, user roles, domain constraints, technical boundaries, success criteria
2. Map stakeholders: primary users (daily), secondary users (occasional), stakeholders (non-users who shape it)
3. Analyze 3+ analogous systems (not direct competitors). Focus on information density, data hierarchy, role-based access, how they handle complexity
4. Build domain glossary: every domain-specific term, plain-language definition, UI implications, role-specific display rules
5. Write design brief: problem statement (1–2 paragraphs), design principles (3–5, actionable and testable, project-specific), constraints (regulatory/technical/organizational/accessibility), user summary, success metrics, scope boundaries

**Outputs**:
- `design/discovery/stakeholder-map.md`
- `design/discovery/competitive-analysis.md`
- `design/discovery/domain-glossary.md`
- `design/discovery/design-brief.md`

**Rules**: Discovery is observation and synthesis only — no UI solutions. Principles must be project-specific. Glossary is a living document. If context is incomplete, note gaps explicitly rather than guessing.

---

#### `02-user-models.md`
**Inputs**: `design/discovery/stakeholder-map.md`, `design/discovery/design-brief.md`
**Soft dependencies** (warn if missing, do not block)
**Process**:
1. Identify distinct user roles: different goals, permissions, frequency of use, domain expertise
2. Build persona per primary user role: demographics, goals (primary/secondary/tertiary), frustrations, context of use (environment/time pressure/multitasking/data sensitivity), key behaviors, representative quote
3. Create empathy map per primary persona: thinks, feels, says, does, pain points, gains
4. Build JTBD matrix: functional jobs (table), emotional jobs (table), social jobs (table)
5. Document edge cases: multi-role users, new vs power users, accessibility needs, unusual contexts

**Outputs**:
- `design/user-models/personas/[role-name].md` — one per primary role, minimum 2
- `design/user-models/empathy-maps/[role-name]-empathy.md` — one per primary persona
- `design/user-models/jtbd.md`

**Rules**: Grounded in discovery artifacts and designer-provided context. JTBD format: "When [situation], I want to [motivation], so I can [outcome]." Personas are one page each. Update when new information emerges.

---

#### `03-journeys.md`
**Inputs**: Personas, design brief
**Process**:
1. Identify 2–4 primary journeys covering all key user types and workflows
2. For each journey: map stages (awareness/initiation/execution/outcome), user actions per stage, thoughts, feelings, pain points, moments of delight, touchpoints
3. Build service blueprint: all journeys on one map, frontstage actions, backstage actions, support processes, system dependencies, failure points
4. Decompose into task flows: sequence of steps to complete a discrete task, decision points, alternative paths, error conditions, exit criteria

**Outputs**:
- `design/journeys/[journey-name]-journey.md` — minimum 2
- `design/journeys/service-blueprint.md`
- `design/journeys/task-flows/[task-name].md` — minimum 4

**Rules**: **ZERO UI references.** No screen names, button labels, form fields, modals, pages, clicks. Describe experience only. Use agnostic language: "initiates action" not "clicks button", "reviews status" not "sees dashboard", "provides information" not "fills out form".

---

#### `04-stories.md`
**Inputs**: Journeys, personas, task flows
**Process**:
1. Identify backbone: 5–8 high-level activities covering entire user experience
2. Decompose backbone into tasks: 3–7 tasks per backbone activity
3. Write user stories per task: format "As a [persona], I want [goal] so that [outcome]"; include acceptance criteria
4. Prioritize vertically: must-have (MVP), should-have, nice-to-have, future
5. Define walking skeleton: thinnest end-to-end slice that delivers value
6. Cut release slices: Release 1 (walking skeleton), Release 2–N (incremental value additions)
7. Define MVP scope: explicit boundaries (in scope / out of scope)

**Outputs**:
- `design/stories/backbone.md`
- `design/stories/story-map.md`
- `design/stories/walking-skeleton.md`
- `design/stories/release-slices.md`
- `design/stories/mvp-scope.md`

**Rules**: Tech/UI agnostic. Stories describe goals, not implementations. Format strictly enforced. Walking skeleton must be deliverable end-to-end. MVP is explicitly bounded.

---

#### `05-ia.md`
**Inputs**: Task flows, story map, personas
**Process**:
1. Build screen inventory from task flows and stories
2. Design navigation model: global navigation structure, role-based variations, entry points, navigation patterns
3. Map content hierarchy per screen: primary (immediately visible), secondary (one interaction away), tertiary (progressive disclosure)
4. Define taxonomy: how content is categorized, labelled, and organized

**Outputs**:
- `design/information-architecture/sitemap.md`
- `design/information-architecture/navigation-model.md`
- `design/information-architecture/content-inventory.md`
- `design/information-architecture/taxonomy.md`

**Rules**: Every screen traces to at least one story. Navigation accounts for all user roles. Content hierarchy uses exactly 3 levels. IA sitemap becomes the Figma Sitemap page. Each screen becomes one numbered Figma page.

---

#### `06-interaction.md`
**Inputs**: IA sitemap, story map
**Process**:
1. Categorize each screen by interaction pattern: data display, data entry, workflow/process, navigation/wayfinding
2. Build state inventory: for every screen and component, list all states — Empty, Loading, Populated, Error, Success, Disabled, Active, Hover, Focus
3. Write behavioral specs per state using given/when/then format
4. Define unified error strategy: error categories, message format, recovery mechanisms
5. Define micro-interactions: feedback timing, transition types, loading indicators, success confirmations

**Outputs**:
- `design/interaction/interaction-model.md`
- `design/interaction/state-inventory.md`
- `design/interaction/behavioral-spec.md`
- `design/interaction/error-strategy.md`

**Rules**: Every screen has minimum 4 states: Empty, Loading, Populated, Error. Specs use given/when/then only. Error messages: what happened + why + what to do. State inventory maps 1:1 to Figma component variants.

---

#### `07-visual.md`
**Inputs**: Design brief, personas
**Process**:
1. Define brand attributes: personality spectrum (pairs of adjectives at opposite poles), visual principles
2. Choose color palette with explicit rationale: primary, secondary, neutral, semantic, surface. Note WCAG contrast ratio for each text color combo
3. Select typography: font family with rationale, type scale, hierarchy rules
4. Define visual language: spacing scale (multiples of 4 or 8), elevation system, corner radius values, iconography style, layout grid

**Outputs**:
- `design/visual/brand-attributes.md`
- `design/visual/color-rationale.md`
- `design/visual/typography-rationale.md`
- `design/visual/visual-language.md`

**Rules**: Every color choice has documented rationale. All text color combinations note WCAG contrast ratio. Spacing scale is mathematical. Dark mode requires separate semantic token strategy, not color inversion. Visual rationale values become `figma-tokens` input directly.

---

#### `08-content.md`
**Inputs**: Personas, error strategy, state inventory, domain glossary
**Process**:
1. Define voice and tone: voice principles (consistent), tone shifts by context
2. Build terminology guide: canonical terms with definition, correct form, incorrect forms, UI display rules, abbreviation rules, capitalization, number formatting
3. Create microcopy patterns: button labels, form labels and placeholders, validation messages, empty states, status messages, loading copy
4. Write content templates: notification, dialog, help text, timestamp format

**Outputs**:
- `design/content/voice-tone.md`
- `design/content/terminology.md`
- `design/content/microcopy-patterns.md`
- `design/content/content-templates.md`

**Rules**: Terminology guide is canonical — one term, one form, everywhere. Error messages: [what happened] + [what to do]. Button labels are specific verbs. Placeholder text is examples only, not field labels.

---

#### `09-accessibility.md`
**Inputs**: Color spec, interaction model, navigation model
**Process**:
1. Define requirements: WCAG target level (AA minimum), assistive technology support matrix
2. Run color contrast audit: every foreground/background combination tested against 4.5:1 (normal text), 3:1 (large text and UI)
3. Define ARIA patterns per component: roles, states, properties, live regions, landmark usage
4. Plan keyboard navigation: tab order per screen, focus management rules, keyboard shortcut map, skip navigation links

**Outputs**:
- `design/accessibility/accessibility-requirements.md`
- `design/accessibility/color-contrast-audit.md`
- `design/accessibility/aria-patterns.md`
- `design/accessibility/keyboard-nav-plan.md`

**Rules**: WCAG 2.1 AA minimum. Color is never the only indicator. Every interactive element is keyboard-operable. Focus is always visible. Modals trap focus. Feeds directly into `figma-component` as focus states and ARIA annotations.

---

#### `10-validation.md`
**Inputs**: Whatever design artifacts exist (flexible). More artifacts = more thorough.
**Process**:
1. Heuristic evaluation against Nielsen's 10 heuristics: Good/Needs attention/Violation with evidence and recommendation
2. Write usability test plan: objectives, participant criteria, method, metrics table, analysis plan with decision criteria
3. Write scenario scripts: persona context + setup + goal-phrased task + success criteria + test data reference + observed metrics. Include edge cases: error recovery, permission boundary, empty state
4. Create per-screen design review checklist: information hierarchy, interaction completeness, visual consistency, content correctness, accessibility, completeness against canvas brief

**Outputs**:
- `design/validation/heuristic-evaluation.md`
- `design/validation/test-plan.md`
- `design/validation/scenario-scripts.md`
- `design/validation/review-checklist.md`

**Rules**: Evaluation must flag real issues. Scenarios require persona context. Review checklist extends `figma-audit` with UX-specific checks. Post-build issues are fixed upstream before fixing Figma.

---

#### `11-governance.md`
**Inputs**: Visual language, existing component inventory
**Process**:
1. Define versioning scheme: semantic versioning (MAJOR.MINOR.PATCH) with explicit bump rules
2. Write contribution guidelines: proposal template, review gates, quality criteria, naming authority
3. Establish deprecation policy: stages (Active → Deprecated → Sunset), notice format, sunset timeline, migration guide requirement
4. Initialize changelog: format (version/date/added/changed/deprecated/removed/fixed), append-only

**Outputs**:
- `design/governance/versioning.md`
- `design/governance/contribution-guide.md`
- `design/governance/deprecation-policy.md`
- `design/governance/changelog.md`

**Rules**: Every change logged. Breaking changes require major bump + migration guide. New components pass quality gate before publishing. Naming: `Category/ComponentName`. Governance applies to tokens as well as components.

---

#### `12-canvas.md`
**Hard dependencies** (blocks if missing):
- `design/information-architecture/sitemap.md`
- `design/interaction/interaction-model.md`
- Any visual spec artifact
- `design/content/terminology.md`

**Soft dependencies** (used if available): personas, story map, state inventory, behavioral specs, error strategy, microcopy patterns, ARIA patterns, keyboard nav plan, contrast audit, review checklist

**Process**: Validate hard dependencies → for each screen in IA sitemap, compose a canvas brief aggregating all upstream artifacts

**Canvas brief structure** (11 sections per screen):
1. Purpose & context
2. Stories served
3. Layout & content hierarchy
4. Components needed
5. States
6. Content specification (exact labels, messages, button text)
7. Visual specification (tokens to use, grid, spacing notes)
8. Accessibility specification (ARIA roles, keyboard interactions, focus management)
9. Behavioral specifications (given/when/then)
10. Acceptance criteria
11. Breakpoint notes

**Outputs**: `design/canvas/[screen-name]-brief.md` — one per screen in IA sitemap

**Rules**: Hard dependencies non-negotiable. Brief is single source of truth for Figma on that screen. Briefs are self-contained — no cross-references to other docs. Update brief if upstream artifacts change before Figma starts.

---

#### `13-figma-pipeline.md`
Summary document. Lists the 8 Figma skills in mandatory order. Restates non-negotiable rules and file architecture. No original content — exists for pipeline orientation.

---

## 5. Skill Files (`.claude/skills/*/SKILL.md`)

21 files. Each is a complete Claude workflow guide for one design mode or Figma operation.

### 5.1 Frontmatter Format

```yaml
---
name: [skill-name-kebab-case]
description: >
  [Multi-line description. Used by Claude Code to match invocation triggers.
   Includes what the skill does, when to use it, and specific trigger phrases.]
---
```

### 5.2 Standard Sections

Every SKILL.md contains:
- `# [Title]`
- `## Purpose`
- `## Dependency check` — upstream files required; soft vs hard
- `## Workflow` — numbered steps with exact markdown templates for outputs
- `## Output checklist` — checkbox list of files to create
- `## Rules`

### 5.3 Figma Skill Details

**Mandatory execution order**:

1. **`figma-connect`** — Validate MCP connection, confirm active file. Tools: `figma_reconnect`, `figma_get_status`, `figma_list_open_files`

2. **`figma-file-setup`** — Create: Cover page, Sitemap page (from IA sitemap), screen pages (`[NN] - [Screen Name]`), Parking Lot page. File architecture: `[Project] - Working`, `[Project] - Core Library`, `[Project] - Patterns`

3. **`figma-tokens`** — Build 3-level token system:
   - Level 1 — Primitives: Collection `Primitives`, Mode `Value`, prefix `primitive/`. Examples: `primitive/color/blue/500`, `primitive/spacing/16`, `primitive/radius/8`
   - Level 2 — Semantic: Collection `Semantic`, Modes `Light` + `Dark`, prefix `semantic/`. Examples: `semantic/color/background/primary`, `semantic/spacing/md`
   - Level 3 — Component: Collection `Component`, Mode `Value`, prefix `component/`. Example: `component/button/padding-x`. Created sparingly.
   - Tools: `figma_batch_create_variables` (preferred), `figma_create_variable_collection`, `figma_add_mode`

4. **`figma-page-setup`** — Create numbered screen page, artboard frame with auto-layout, component staging area (left of artboard), annotation frame. Breakpoint defaults: 1440px desktop, 768px tablet, 375px mobile.

5. **`figma-component`** — `createComponent` only (never `createFrame` for reusable elements). Auto-layout on all nested frames. All values variable-bound. States from state inventory become variants. Text content becomes TEXT properties. Focus state variant required on every interactive component. ARIA annotation in component description.

6. **`figma-parking-lot`** — Move all frames from staging area (left of artboard) to Parking Lot page at end of each completed page.

7. **`figma-audit`** — Check: zero hardcoded fills, zero hardcoded spacing, all auto-layout, no detached instances, all components have descriptions, naming conventions correct, publication readiness. Extends `design/validation/review-checklist.md`.

8. **`figma-library-mode`** — Move atoms/molecules from Parking Lot to `[Project] - Core Library`. Move organisms/templates to `[Project] - Patterns`. Relink variable references. Publish Core Library.

### 5.4 Meta-Skill

**`workflow-update`** — Triggered by any process change request. Edits the relevant `design/process/*.md` chapter, then immediately propagates to all affected SKILL.md files, `CLAUDE.md`, and `design/process/README.md`. Reports all changed files.

---

## 6. Artifact Output Map

```
design/discovery/
  stakeholder-map.md          ← design-discovery
  competitive-analysis.md     ← design-discovery
  domain-glossary.md          ← design-discovery
  design-brief.md             ← design-discovery

design/user-models/
  personas/[role-name].md     ← design-user-models (one per primary role, min 2)
  empathy-maps/[role]-empathy.md ← design-user-models (one per primary persona)
  jtbd.md                     ← design-user-models

design/journeys/
  [journey-name]-journey.md   ← design-journeys (min 2)
  service-blueprint.md        ← design-journeys
  task-flows/[task-name].md   ← design-journeys (min 4)

design/stories/
  backbone.md                 ← design-stories
  story-map.md                ← design-stories
  walking-skeleton.md         ← design-stories
  release-slices.md           ← design-stories
  mvp-scope.md                ← design-stories

design/information-architecture/
  sitemap.md                  ← design-ia
  navigation-model.md         ← design-ia
  content-inventory.md        ← design-ia
  taxonomy.md                 ← design-ia

design/interaction/
  interaction-model.md        ← design-interaction
  state-inventory.md          ← design-interaction
  behavioral-spec.md          ← design-interaction
  error-strategy.md           ← design-interaction

design/visual/
  brand-attributes.md         ← design-visual
  color-rationale.md          ← design-visual
  typography-rationale.md     ← design-visual
  visual-language.md          ← design-visual

design/content/
  voice-tone.md               ← design-content
  terminology.md              ← design-content
  microcopy-patterns.md       ← design-content
  content-templates.md        ← design-content

design/accessibility/
  accessibility-requirements.md ← design-accessibility
  color-contrast-audit.md     ← design-accessibility
  aria-patterns.md            ← design-accessibility
  keyboard-nav-plan.md        ← design-accessibility

design/validation/
  heuristic-evaluation.md     ← design-validation
  test-plan.md                ← design-validation
  scenario-scripts.md         ← design-validation
  review-checklist.md         ← design-validation

design/governance/
  versioning.md               ← design-governance
  contribution-guide.md       ← design-governance
  deprecation-policy.md       ← design-governance
  changelog.md                ← design-governance

design/canvas/
  [screen-name]-brief.md      ← design-canvas (one per screen in IA sitemap)
```

---

## 7. Dependency Graph

```
design-discovery
  └─→ design-user-models (soft: stakeholder-map, design-brief)
       └─→ design-journeys (soft: personas, design-brief)
            └─→ design-stories (soft: journeys, personas)
                 └─→ design-ia (soft: task-flows, story-map, personas)
                      ├─→ design-interaction (soft: sitemap, stories)
                      ├─→ design-visual (soft: design-brief, personas)
                      ├─→ design-content (soft: personas, error-strategy, glossary)
                      ├─→ design-accessibility (soft: color-spec, interaction-model)
                      ├─→ design-validation (flexible: uses whatever exists)
                      ├─→ design-governance (soft: visual-language)
                      └─→ design-canvas [HARD BLOCK: sitemap + interaction + visual + terminology]
                           └─→ figma-connect [ALWAYS FIRST]
                                └─→ figma-file-setup [if new/blank file]
                                     └─→ figma-tokens [before any design element]
                                          └─→ figma-page-setup [before each screen]
                                               └─→ figma-component [for each UI element]
                                                    └─→ figma-parking-lot [end of each page]
                                                         └─→ figma-audit [before library migration]
                                                              └─→ figma-library-mode [library phase only]
```

Soft dependency: warn if missing, designer decides whether to proceed
Hard dependency: system blocks, cannot proceed without

---

## 8. Cross-Reference: Design Artifact → Figma

| Design artifact | Figma destination | Connection method |
|----------------|-------------------|-------------------|
| `design/information-architecture/sitemap.md` | Figma Sitemap page | Screen list → page list |
| IA screen inventory | Figma page names | Each screen → `[NN] - [Screen Name]` |
| `design/visual/color-rationale.md` | `figma-tokens` Level 1+2 | Color values → primitive + semantic variables |
| `design/visual/typography-rationale.md` | `figma-tokens` Level 1+2 | Type scale → typography variables |
| `design/visual/visual-language.md` | `figma-tokens` Level 1+2 | Spacing, radius, elevation → variables |
| `design/interaction/state-inventory.md` | `figma-component` variants | Each state → component variant |
| `design/content/terminology.md` | `figma-component` TEXT properties | Canonical labels → component properties |
| `design/accessibility/aria-patterns.md` | `figma-component` descriptions + focus variants | ARIA roles → component metadata |
| `design/canvas/[screen]-brief.md` | All figma-* skills | Single source of truth per screen |
| `design/validation/review-checklist.md` | `figma-audit` | Extends audit with UX-specific checks |

---

## 9. Naming Conventions

```
design/process/NN-description.md         Two-digit number, hyphen, lowercase
.claude/skills/[skill-name]/SKILL.md     Kebab-case directory, SKILL.md uppercase
design/[tier-dir]/[artifact-name].md     Lowercase, hyphens
design/user-models/personas/[role].md    Lowercase, hyphens

Figma pages:
  [NN] - [Screen Name]     Two-digit number, space-dash-space, title case
  Cover                    Exact string
  Sitemap                  Exact string
  Parking Lot              Exact string

Figma components:
  Category/ComponentName   PascalCase both segments, forward slash separator
  .CategoryName            Period prefix = hidden from publishing

Figma tokens:
  primitive/color/[hue]/[shade]        e.g. primitive/color/blue/500
  primitive/spacing/[value]            e.g. primitive/spacing/16
  semantic/color/[role]/[variant]      e.g. semantic/color/background/primary
  semantic/spacing/[size]              e.g. semantic/spacing/md
  component/[name]/[property]          e.g. component/button/padding-x
```

---

## 10. Non-Negotiable System Rules

1. `design/process/` is the single source of truth. Designers do not edit it directly.
2. All process changes go through `workflow-update` and propagate to all affected files immediately.
3. Journeys and stories are tech and UI agnostic. No screen names, button labels, or UI patterns in these artifacts.
4. Canvas briefs are the single source of truth for Figma execution. Figma does not improvise beyond the brief.
5. No Figma screen without a canvas brief (exception: exploratory prototyping, explicitly labeled).
6. `design-canvas` hard-blocks if IA sitemap, interaction artifact, visual artifact, or terminology guide are missing.
7. `figma-connect` runs first, every Figma session, without exception.
8. Zero hardcoded values in Figma. Every fill, spacing, and radius references a variable.
9. All Figma frames use auto-layout. No absolute x/y positioning.
10. Every reusable Figma element is a component (`createComponent`). `createFrame` is for layout only.
11. Accessibility is WCAG 2.1 AA minimum. Color is never the only indicator. Focus is always visible. Modals trap focus.
12. Every design decision traces to a persona, user story, or design principle.
13. Git tracks all changes. Full audit trail exists for every process and artifact modification.

---

## 11. Replication Checklist

To replicate this system from scratch:

- [ ] Create `CLAUDE.md` at project root with: design playbook section, process pipeline (4 tiers, 13 modes, trigger rules, hard blocks), Figma workflow (8 skills, mandatory order, non-negotiables), artifact storage declaration, cross-reference table
- [ ] Create `design/process/` with 13 chapter files (01–13) and README. Each chapter: why, mental model, inputs, process steps, outputs table, rules, feeds-into
- [ ] Create `.claude/skills/` with 21 skill subdirectories, each containing one `SKILL.md` with YAML frontmatter (name, description) and sections: purpose, dependency check, workflow with output templates, output checklist, rules
- [ ] Create `design/` artifact directory tree with all 13 subdirectories listed in section 6
- [ ] Confirm Figma Console MCP is available and connected
- [ ] No application code required. No build system required. No external dependencies beyond Claude Code + Figma Console MCP.
