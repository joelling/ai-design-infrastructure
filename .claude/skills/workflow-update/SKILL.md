---
name: workflow-update
description: >
  Edits the design process specification and propagates every change to all affected
  SKILL.md files across every registered harness (.claude/ and .bob/), plus CLAUDE.md
  and BOB.md. The process directory (design/process/) is the single source of truth —
  one numbered chapter per mode, plus a README overview. Designers never edit chapters
  directly; they describe what to change and this skill handles the edit plus full
  propagation. Triggers on: "update the workflow", "change the process", "edit the
  playbook", "tweak the design process", "update a mode", "add a mode", "change
  dependencies", "update triggers", "fix the process", "workflow change", "process
  improvement", "process update", or any design process change.
---

# Workflow Update — Process Edit + Propagation

## Purpose

Handle all changes to the design process. The designer identifies what needs to change; this skill edits the relevant process chapter file(s) and propagates the change to every affected downstream file — SKILL.md files in every registered harness, orchestration docs (CLAUDE.md + BOB.md), and index / rules docs — so infrastructure stays in sync with the process specification.

---

## Propagation spec

`design/process/_propagation.yaml` is the machine-readable fan-out spec shared by every harness. It enumerates:

- **`harnesses`** — registered AI-assistant harnesses (`claude`, `bob`) with their `skills_dir` and `orchestration_doc`.
- **`chapters.map`** — chapter file → skill, with `__index__` for index chapters and `__umbrella__:name` for umbrellas.
- **`umbrellas`** — umbrella → sub-skill lists.
- **`harness_infra_skills`** — skills that live per harness but don't trace to a chapter (`workflow-update`, `design-validation`).
- **`targets`** — fan-out targets per change category (per-chapter, orchestration, index, mapping-table).

Always read this file FIRST — it is the authority on where to propagate. Adding a new harness later is one edit to this yaml; fan-out picks it up automatically.

---

## Workflow

### Step 1 — Understand the change

Read the designer's request. Identify:
- Which chapter file(s) are affected (match against `chapters.map`).
- What specifically is changing (process step, rule, dependency, output, mental model, ordering, trigger).
- What downstream files will be affected per the propagation spec.

### Step 2 — Read current state

For each affected chapter:
- Read the `design/process/NN-*.md` chapter file.
- Read the matching SKILL.md in EVERY harness enumerated in `_propagation.yaml` (`.claude/skills/{skill}/SKILL.md` and `.bob/skills/{skill}/SKILL.md`). For umbrella chapters, read every sub-skill.
- Read `CLAUDE.md` AND `BOB.md` if the change affects ordering, triggers, cross-references, or non-negotiable rules.
- Read `design/process/README.md` and `design/process/00-overview.md` if the change affects the chapter index, tier labels, or ordering.
- Read `.bob/rules/50-bob-adaptations.md` if the change introduces a new tool dependency requiring a primitive-mapping entry.

### Step 3 — Edit the process chapter

Make the requested change in the relevant `design/process/*.md` file. Ensure:
- The change is consistent with the rest of the process.
- Cross-references to other chapters (via relative links) still resolve.
- The "Feeds into" section is updated if downstream connections changed.
- Output file paths are updated if artifact locations changed.
- Tier labels and ordering match `00-overview.md` and `README.md`.

If the change affects the overall process (new mode, reordering, principles) also update `design/process/README.md` and `design/process/00-overview.md`.

### Step 4 — Propagate to every SKILL.md mirror

For each affected skill, update its SKILL.md in EVERY registered harness to reflect the process change:
- **If process steps changed:** Update the Workflow section.
- **If rules changed:** Update the Rules section.
- **If dependencies changed:** Update the Dependency / Upstream-check section.
- **If outputs changed:** Update the Output checklist.
- **If triggers changed:** Update the frontmatter `description:` (keep wording across harnesses aligned; trivial phrasing differences are OK as long as the trigger list matches).
- **If bridge connections changed:** Update Bridge-to-Figma or cross-reference tables.

**Per-harness preservation rules:**
- In `.bob/skills/*/SKILL.md` keep the `<!-- mirror: bob | SSOT: design/process/{chapter}.md -->` pointer comment immediately after the frontmatter. `sync-skills.js` validates this.
- In `.bob/skills/*/SKILL.md` keep any `{{MCP_PREFIX}}` placeholder unresolved unless the designer has explicitly confirmed the real namespace (and then resolve it everywhere in one pass).
- In `.bob/skills/*/SKILL.md` do NOT introduce `Skill` or `Agent` tool references — use prose ("run the `{name}` skill").

### Step 5 — Propagate to orchestration docs

If the change affects ordering, triggers, cross-references, or non-negotiable rules, update BOTH:
- `CLAUDE.md` (Claude-side orchestration)
- `BOB.md` (Bob-side orchestration)

Keep them aligned. Divergence between them is a bug.

### Step 6 — Mirror-parity check

Run `node design/scripts/sync-skills.js`. Zero errors = clean; warnings about unbuilt mirrors are acceptable during incremental harness build-out. Fix any reported errors before reporting the task done.

### Step 7 — Summarize

Tell the designer:
- Which chapter(s) changed.
- Which SKILL.md files were updated, grouped by harness.
- Whether orchestration docs (CLAUDE.md / BOB.md), index docs, or mapping-table docs (`.bob/rules/50-bob-adaptations.md`) were touched.
- Whether `sync-skills.js` was clean.
- Suggest reviewing `git diff` before committing.

---

## Rules

- **Never skip propagation.** Every process edit MUST fan out to every registered harness + orchestration doc. A process change without propagation creates drift.
- **Process chapters are the authority.** On conflict between a chapter and a SKILL.md, the chapter wins — update the SKILL.md.
- **Preserve hand-authored detail.** SKILL.md files may have richer templates, code examples, and formatting than the chapter. Update the relevant section without destroying surrounding detail.
- **One change, one propagation cycle.** Don't batch unrelated edits.
- **Keep harness mirrors in lockstep.** Claude and Bob SKILL.md files for the same skill should have matching `name:` frontmatter, matching workflow structure, and matching rule sets. Wording adjustments for Bob's invocation model (no `Skill`/`Agent` tool, `{{MCP_PREFIX}}` placeholder, sequential umbrella steps) are expected; semantic drift is not.
- **New modes need full scaffolding:**
  1. Create a new numbered chapter file in `design/process/`.
  2. Update `design/process/_propagation.yaml` (add to `chapters.map`; if it's a sub-skill, add it to the umbrella's `sub_skills`; if it's harness-infra-only, add to `harness_infra_skills`).
  3. Update `design/process/README.md` chapter index and `design/process/00-overview.md`.
  4. Create the corresponding SKILL.md in EVERY registered harness, with matching `name:` frontmatter and — for non-Claude harnesses — the `<!-- mirror: ... | SSOT: ... -->` pointer comment.
  5. Update `CLAUDE.md` and `BOB.md` tier listings and trigger rules.
  6. Run `node design/scripts/sync-skills.js` to confirm parity before committing.
- **New harness added:** one edit to `_propagation.yaml` under `harnesses:`. `sync-skills.js` will surface the full mirror gap as warnings; work through it skill by skill. Create the harness's own equivalents of `.bob/rules/` and the orchestration doc.
