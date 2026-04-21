---
name: design-discovery
description: >
  Processes raw project inputs — interviews, surveys, analytics, briefs, specs,
  regulatory docs — into structured design knowledge using a three-tier intake
  model: per-input cleaning, per-type synthesis, and cross-type project context
  assembly. First design mode — everything downstream builds on its outputs.
  Triggers on: "discovery", "design brief", "stakeholder map", "competitive
  analysis", "problem framing", "start design process", "understand the
  problem", "design principles", "domain glossary", "interview transcripts",
  "research synthesis", "process inputs", "clean up transcripts", or when
  beginning upstream design work for a new spec or project.
---

<!-- mirror: bob | SSOT: design/process/01-discovery.md -->

# design-discovery — Three-Tier Intake (Bob)

## Purpose

Turn raw inputs into structured design knowledge. Three tiers of processing: clean each input individually, synthesize across inputs of the same type, then assemble the project context layer that everything downstream consumes.

## Workflow

### Step 0 — Upstream check

No upstream. Discovery is the first mode. Warn only if prior discovery outputs exist (the designer may want to append rather than overwrite).

### Step 1 — Tier 1: Per-input cleaning

For each raw input the designer provides:

1. Classify by type: interview transcript, survey data, analytics extract, existing brief/spec, regulatory document, competitive screenshot, sales collateral.
2. Clean per type:
   - **Interview transcripts** → anonymize, correct typos, tag speaker turns, extract quotes worth citing.
   - **Surveys** → normalize scales, tag open-ended responses by theme.
   - **Analytics** → extract signal (usage patterns, drop-off rates); discard noise.
   - **Briefs / specs** → extract stated goals, constraints, assumptions; flag what's unsubstantiated.
   - **Regulatory docs** → extract binding requirements with authority citations.
3. Write cleaned file to `design/01_DISCOVERY/01_INPUTS/{type}/{filename}_cleaned.md` with a version header and a provenance block (source file, date received, cleaning log).

### Step 2 — Tier 2: Per-type synthesis

For each input type that has ≥2 cleaned inputs, produce a synthesis document:

- `design/01_DISCOVERY/02_SYNTHESIS/interviews-synthesis.md` — themes, quotes, tensions.
- `design/01_DISCOVERY/02_SYNTHESIS/survey-synthesis.md` — headline findings + significance notes.
- `design/01_DISCOVERY/02_SYNTHESIS/analytics-synthesis.md` — behavioral signal.
- `design/01_DISCOVERY/02_SYNTHESIS/competitive-analysis.md` — strengths / gaps / patterns per competitor.
- `design/01_DISCOVERY/02_SYNTHESIS/regulatory-synthesis.md` — binding requirements register.

### Step 3 — Tier 3: Cross-type project context

Produce the project's foundational documents:

- `design/01_DISCOVERY/03_CONTEXT/stakeholder-map.md`
- `design/01_DISCOVERY/03_CONTEXT/domain-glossary.md`
- `design/01_DISCOVERY/03_CONTEXT/design-brief.md` (problem statement, constraints, success criteria)
- `design/01_DISCOVERY/03_CONTEXT/initial-principles.md` (hypothetical; governance Phase B will codify later)

### Step 4 — Manifest + version bump

Update `design/01_DISCOVERY/_upstream.md` (none — this is tier 1). Write a manifest block to `design/01_DISCOVERY/_manifest.md` listing every artifact and its current version.

### Step 5 — Notify downstream

List downstream modes whose upstream is now current:

- `design-user-models` can run.
- `design-journeys` can run once user models exist.
- `design-governance` Phase A can run.
- `design-research` Phase A can run once user models exist.

## Rules

- Never overwrite a raw input. Cleaned copies are separate files with provenance.
- Never invent data. If the input is ambiguous, flag it and ask the user.
- Quotes used in downstream artifacts must cite back to a cleaned input with a line anchor.
- Confidence labels on anything derived from analytics: "observed" (direct behavior) vs. "inferred" (interpretation) vs. "hypothesized" (no evidence yet).
- If the designer only provides one input of a type, skip Tier 2 for that type — synthesis requires ≥2 data points.
