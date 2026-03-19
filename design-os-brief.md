# Design OS — Marketing Brief

## The Problem with Design at Scale

Enterprise design teams are losing the war on their own process.

Decisions get made in workshops, then forgotten. Design rationale scatters across Figma comments, Slack threads, and shared docs nobody reads. Accessibility gets added at the end when it's expensive and wrong. Component libraries grow wild — hardcoded values, abandoned variants, no governance, no deprecation plan. And when a screen needs to be redesigned, nobody can answer the one question that matters: *why was it built this way in the first place?*

The tools are not the problem. The system is.

---

## What This Is

**Design OS** is a complete design operating system — not a component library, not a design system kit, not a process deck. It is the infrastructure for how design decisions are made, documented, governed, and executed at scale, from first problem framing through production-ready Figma components.

It runs natively in Claude Code as an AI-assisted workflow: 13 structured design modes, 21 executable skills, and a Figma execution pipeline — all connected by a single source of truth that propagates changes automatically across the entire system.

Everything that happens inside Design OS is traceable. Every design decision connects back to a persona, a story, or a principle. Every token references a semantic variable. Every component has documented intent. Every screen has a canvas brief before Figma touches it.

---

## The Architecture

### Four Tiers of Design Thinking

```
TIER 1 — DISCOVERY          Understand the problem before solving it
TIER 2 — DEFINITION         Decide what to build (technology-agnostic)
TIER 3 — DESIGN             Decide how it works, looks, and reads
TIER 4 — SYNTHESIS          Translate all decisions into Figma execution
```

Each tier builds on the last. Canvas briefs — the Tier 4 output — are the single source of truth for Figma. No screen is built without one. No decision is made without tracing back to a tier above it.

---

### Tier 1: Discovery

Two modes establish the complete picture of the problem space before any solution thinking begins.

**Design Discovery** synthesises everything the team brings into a single design brief: problem statement, design principles (specific and testable, not generic), constraints (regulatory, technical, organisational, accessibility), user summary, and success metrics. Supporting artifacts include a stakeholder map, competitive analysis of analogous systems, and a domain glossary that becomes the canonical reference for all content decisions downstream.

**User Models** builds detailed representations of each user type: personas grounded in discovery findings, empathy maps (what users think, feel, say, and do), and a jobs-to-be-done matrix covering functional, emotional, and social jobs. Every downstream design decision can be validated against these.

---

### Tier 2: Definition

Three modes define what to build — entirely technology and UI agnostic. No screen names, no button labels, no UI patterns. Just human experience.

**User Journeys** maps end-to-end experiences as service blueprints and task flows. Identifies where users feel pain, where they gain value, and where the system must respond.

**User Stories** applies Jeff Patton's story mapping methodology: backbone activities, a walking skeleton, and release slices. The output is a prioritised backlog with a defined MVP scope, traced to user goals — not feature requests.

**Information Architecture** defines the screen inventory, navigation model, content hierarchy, and taxonomy. The IA sitemap directly becomes the Figma file's page structure.

---

### Tier 3: Design

Six parallel modes define the complete design specification for the system.

**Interaction Design** produces a state inventory and behavioral specification for every screen — given/when/then format. Every state (empty, loading, error, populated), every error strategy, every feedback pattern is documented before Figma opens.

**Visual Design** establishes the visual language and brand expression: color palette with rationale, typography system, spacing philosophy, iconography, visual hierarchy. This answers *why* specific values were chosen — so the token system knows exactly *what* to create.

**Content Strategy** defines voice and tone, microcopy patterns, terminology guide, and content templates. Labels, error messages, empty states, button copy — every word is decided before it enters a component.

**Accessibility** defines WCAG compliance targets, ARIA patterns per component, keyboard navigation plans, focus management rules, and a full contrast audit. Accessibility is built into the process from Tier 3, not retrofitted after Figma.

**Design Validation** runs heuristic evaluation against Nielsen's 10 heuristics, produces a usability test plan with participant criteria and measurable metrics, writes task-based scenario scripts grounded in persona context, and generates a per-screen post-build review checklist.

**Design Governance** establishes the constitution for system evolution: semantic versioning scheme, contribution guidelines with review gates, deprecation process with migration paths, and an immutable changelog.

---

### Tier 4: Synthesis

One mode. One hard rule.

**Design Canvas** aggregates every artifact from Tiers 1–3 into per-screen canvas briefs. Each brief is a self-contained build document: what users need this screen to do, which personas interact with it, what states it has, what content it displays, what accessibility requirements apply, and what success looks like.

**Canvas briefs are the single source of truth for Figma execution.** The Figma pipeline does not improvise. It executes the brief.

If Tier 3 is incomplete, Design Canvas blocks. There are no shortcuts.

---

### The Figma Pipeline

Eight skills execute the canvas briefs into production-ready Figma files, in mandatory order:

| Skill | What it does |
|-------|-------------|
| `figma-connect` | Validates the MCP connection and confirms the active file. Runs first, every session. |
| `figma-file-setup` | Creates the canonical file architecture: Cover, Sitemap, screen pages, Parking Lot. |
| `figma-tokens` | Builds the three-level token system — Primitives → Semantic → Component — as Figma variables. Zero hardcoded values. |
| `figma-page-setup` | Creates the numbered screen page with frames, breakpoints, and component staging area. |
| `figma-component` | Builds every UI element as a true component: auto-layout, variable-bound, properties-enabled, state-complete, WCAG-audited. |
| `figma-parking-lot` | Archives the staging area to the Parking Lot at the end of each completed page. |
| `figma-audit` | Pre-migration quality check: tokens, auto-layout, detached components, publishing readiness. |
| `figma-library-mode` | Reorganises from Parking Lot into the Core Library and Patterns files, relinks variables, publishes. |

**Non-negotiables enforced by the pipeline:**
- Zero hardcoded values — every fill, spacing, and radius references a Figma variable
- All frames use auto-layout — no absolute positioning
- Every reusable element is a component (`createComponent`, not `createFrame`)
- Page naming follows the convention: `[NN] - [Screen Name]`

---

## The Governance Model

### Process as the Authority

`design/process/` contains 13 numbered chapter files — one per design mode. This directory is the single source of truth for the entire methodology.

Designers do not edit process files. They describe what to change. Claude edits the relevant chapter and immediately propagates to every affected skill, configuration file, and index. Git tracks every change with full version history.

This is not documentation. It is infrastructure.

### Traceability by Default

Every design decision in the system traces back to upstream artifacts. Visual token values trace to Visual Design rationale. Component states trace to the Interaction state inventory. Screen labels trace to the Content terminology guide. Canvas briefs trace to personas, stories, and principles.

When a stakeholder asks "why was it built this way?", the answer is in the artifact chain.

---

## What It Produces

### Design Artifacts

A complete project running through Design OS produces:

**Discovery layer:** Design brief, stakeholder map, competitive analysis, domain glossary, personas, empathy maps, JTBD matrix

**Definition layer:** User journey maps, service blueprints, story map with walking skeleton and release slices, IA sitemap, navigation model, content inventory, taxonomy

**Design layer:** Interaction models with state inventories and behavioral specs, visual language documentation, voice and tone guide, terminology guide, microcopy pattern library, WCAG contrast audit, ARIA pattern library, keyboard navigation plan, heuristic evaluation, usability test plan, scenario scripts, post-build review checklist, versioning scheme, contribution guidelines, deprecation policy, changelog

**Synthesis layer:** Per-screen canvas briefs (one per screen in the IA inventory)

### Figma Artifacts

**File architecture:**
- `[Project] - Working` — active design canvas with numbered screen pages
- `[Project] - Core Library` — all tokens, atoms, and molecules (published)
- `[Project] - Patterns` — organisms and templates (created when Core Library matures)

**Within each file:** Cover page, Sitemap page, numbered screen pages, Parking Lot staging page

**Token system:** Three-level hierarchy with light and dark mode semantic aliases, enforced across all components

**Components:** Auto-layout, variable-bound, multi-property, multi-state, WCAG-audited, accessibility-annotated, publication-ready

---

## Who It's For

**Design system teams** maintaining complex, multi-product design languages who need governance, traceability, and a repeatable contribution model.

**Enterprise product teams** in regulated industries — healthcare, finance, defence, legal — where design decisions must be documented, auditable, and traceable to compliance requirements.

**Cross-functional teams** where designers, engineers, and product managers need a shared source of truth and a handoff model that eliminates ambiguity.

**Accessibility-first organisations** where WCAG compliance must be built in from the start, not retrofitted — and where accessible patterns need to be documented at the system level, not decided screen by screen.

**Teams scaling beyond a single designer** where informal process breaks down and explicit, versioned methodology is the only way to maintain quality and consistency.

---

## The Differentiator

Most design systems solve a *component problem* — a consistent set of atoms and molecules with documented usage guidelines.

Design OS solves a *decision problem* — how you decide what to build, why you build it that way, and how you prove it was the right call.

The component library is an output of the system. The system is the thinking infrastructure that makes that library trustworthy.

---

## Technical Specification

| Dimension | Detail |
|-----------|--------|
| **Runtime** | Claude Code (claude-sonnet-4-6 or higher) |
| **Design execution** | Figma via Figma Console MCP |
| **Skill count** | 21 (11 design, 8 Figma, 1 maintenance, 1 connection) |
| **Process modes** | 13 (Tiers 1–4, plus Figma pipeline) |
| **Token architecture** | 3-level (Primitive → Semantic → Component) |
| **Accessibility baseline** | WCAG 2.1 AA (contrast, keyboard, ARIA, screen reader) |
| **Version control** | Git — full audit trail on all process and artifact changes |
| **File architecture** | Working file + Core Library file + Patterns file |
| **Propagation** | Automatic — process changes cascade to all skills and config |

---

## Summary

Design OS is the infrastructure layer beneath great design work. It enforces the discipline of decision-making before Figma opens. It ensures accessibility is never an afterthought. It makes every component traceable to the user need it serves. It gives design teams the governance model to evolve a system without breaking it.

Process first. Decisions traceable. Execution precise.
