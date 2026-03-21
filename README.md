# AI Design Infrastructure

A structured, AI-assisted design process built on Claude Code. 22 executable skills, a four-tier pipeline, and a sync loop that keeps canvas briefs, Figma screens, and coded prototypes in alignment.

---

## The big idea

Most AI-assisted design work is ad hoc. You ask, Claude answers, you figure out what to do with it. This repo inverts that. Claude is the executor. You are the design director. The process is the contract between you.

The pipeline flows through four tiers:

```
TIER 1: DISCOVERY    → Understand the problem and who has it
TIER 2: DEFINITION   → Structure what to build (tech and UI agnostic)
TIER 3: DESIGN       → Decide how it looks, feels, behaves, and reads
TIER 4: DEVELOP      → Build screens, prototype, and keep everything in sync
```

Tier 4 is a sync loop between three nodes:

```
Canvas Brief ◄──sync──► Figma Screens ◄──sync──► Prototype
     ▲                                                │
     └────────────────── sync ────────────────────────┘
```

Each node owns different concerns. Changes propagate bidirectionally. Small changes auto-sync. Structural changes flag drift and require approval before propagating.

---

## How it works

**Process chapters** (`design/process/`) are the single source of truth. 14 numbered markdown files define each design mode: its mental model, process steps, outputs, rules, and downstream connections. You never edit these directly; you tell Claude what to change and it propagates updates to all affected skill files and `CLAUDE.md`.

**Skills** (`.claude/skills/`) are the executable layer. Each skill corresponds to a design mode and contains a `SKILL.md` that Claude reads as a workflow specification when invoked. There are 22 skills total: one per design mode, plus 8 specialized Figma pipeline skills.

**Artifact versioning** keeps the pipeline honest. Every output file carries a version header. Every mode directory contains `_upstream.md`, a manifest tracking which upstream artifacts were consumed and at which versions. When upstream changes, the affected mode reports staleness on next invocation and asks whether to re-process.

---

## Repo structure

```
.
├── CLAUDE.md                    ← master orchestration document
├── design/
│   ├── process/                 ← process specification (source of truth)
│   │   ├── README.md            ← chapter index + ordering philosophy
│   │   ├── 01-discovery.md
│   │   ├── 02-user-models.md
│   │   └── ...through 14
│   ├── scripts/                 ← sync automation (version, manifest, status)
│   ├── viewer/                  ← local reading UI for process docs (Vite)
│   └── [01-14]-*/               ← artifact output directories (per mode)
└── .claude/
    └── skills/                  ← 22 skill definitions (SKILL.md per skill)
```

---

## Getting started

### Requirements

- [Claude Code](https://claude.ai/code) (CLI)
- Figma desktop app + the Figma Console plugin (for Tier 4 only)
- Node.js v18+ (for the process viewer)

### Setup

```bash
git clone <repo-url>
cd ai-design-infrastructure
```

Open the project in Claude Code:

```bash
claude
```

Claude will load `CLAUDE.md` automatically. From there, invoke any skill by describing what you want to do. Claude matches the intent to the right skill and executes the workflow.

### Run the process viewer

A local reading interface for the design process documentation. Renders all 14 chapters with navigation, keyboard shortcuts, and live reload:

```bash
cd design/viewer
npm install
npm run dev
```

Opens at `http://localhost:5200`. Use `←` / `→` arrow keys to move between chapters.

---

## Principles

**Journeys and stories are tech and UI agnostic.** Tiers 1 and 2 describe what users do and experience: no screen names, no button labels, no UI patterns. This keeps upstream thinking portable.

**Canvas briefs are the single source of truth for intent.** No Figma screen gets built without a canvas brief. No prototype screen without a Figma implementation. The brief says it, Figma builds it, the prototype implements it.

**Zero hardcoded values in Figma.** Every color, spacing, and radius references a variable. Audits fail on any hardcoded value found.

**Every design decision traces back.** To a persona, a story, or a design principle. If you can't trace it, question it.

**Staleness is visible.** Every mode checks upstream on entry, artifact versions are tracked, and post-change notifications list affected downstream modes. No mode silently operates on outdated inputs.

---

## Skill list

| Tier | Skill | Purpose |
|------|-------|---------|
| 1 | `design-discovery` | Process raw inputs into structured design knowledge |
| 1 | `design-user-models` | Personas, empathy maps, jobs-to-be-done |
| 2 | `design-journeys` | User journeys, service blueprints |
| 2 | `design-stories` | Story mapping, MVP scope, walking skeleton |
| 2 | `design-ia` | Sitemap, navigation model, content hierarchy |
| 3 | `design-interaction` | Behavioral specs, state inventory, error strategy |
| 3 | `design-visual` | Brand, color, typography rationale |
| 3 | `design-content` | Voice & tone, microcopy, terminology |
| 3 | `design-accessibility` | WCAG, ARIA, keyboard nav, contrast |
| 3 | `design-validation` | Heuristic evaluation, usability test plans |
| 3 | `design-governance` | Design system versioning, contribution rules |
| 4 | `design-canvas` | Aggregate all upstream into per-screen briefs |
| 4 | `figma-connect` | Establish and verify Figma session |
| 4 | `figma-file-setup` | Initialize file structure and page layout |
| 4 | `figma-tokens` | 3-level token system (Primitives → Semantic → Component) |
| 4 | `figma-page-setup` | Set up artboards and auto-layout for a new screen |
| 4 | `figma-component` | Build components with variants, properties, variable bindings |
| 4 | `figma-parking-lot` | Stage completed components for library migration |
| 4 | `figma-audit` | Audit for hardcoded values, detached components, non-auto-layout |
| 4 | `figma-library-mode` | Migrate components to the master library file |
| 4 | `design-prototype` | Coded interactive prototype from Figma screens |
| — | `workflow-update` | Edit process chapters and propagate changes |
