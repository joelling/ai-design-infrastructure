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

<!-- mirror: bob | SSOT: design/process/_propagation.yaml -->

# Workflow Update — Process Edit + Propagation (Bob)

## Purpose

Handle all changes to the design process. The designer identifies what needs to change; this skill edits the relevant process chapter file(s) and immediately propagates the change to every affected downstream file — SKILL.md files in every harness, orchestration docs (CLAUDE.md + BOB.md), and index / rules docs.

## Propagation spec

`design/process/_propagation.yaml` is the machine-readable fan-out spec. It enumerates:

- Registered harnesses (`claude`, `bob`) and their `skills_dir` + `orchestration_doc`.
- The chapter → skill map (`__index__` for index chapters; `__umbrella__:name` for umbrellas).
- Umbrella → sub-skill lists.
- Harness-infra skills (this one; `design-validation`).
- Fan-out targets per change category (per-chapter, orchestration, index, mapping-table).

Always read this file first. Adding a new harness = one edit to the yaml; all future propagation picks it up automatically.

---

## Workflow

### Step 1 — Understand the change

Read the designer's request. Identify:

- Which chapter file(s) are affected (match against `chapters.map`).
- What specifically is changing (process step, rule, dependency, output, trigger, ordering, principle).
- What downstream files will be affected per the propagation spec.

### Step 2 — Read current state

For each affected chapter:

- Read the chapter file.
- Read the matching SKILL.md in EVERY harness (`.claude/skills/{skill}/SKILL.md` and `.bob/skills/{skill}/SKILL.md`). For umbrella chapters, read every sub-skill.
- Read `CLAUDE.md` and `BOB.md` if the change affects ordering, triggers, or cross-references.
- Read `design/process/README.md` and `design/process/00-overview.md` if the change affects the chapter index or tier labels.
- Read `.bob/rules/50-bob-adaptations.md` if the change introduces a new tool dependency that needs a mapping entry.

### Step 3 — Edit the process chapter

Make the requested change. Ensure:

- Consistency with the rest of the process.
- Cross-chapter links still resolve.
- "Feeds into" and output-path declarations are current.
- Tier labels and ordering match `00-overview.md` and `README.md`.

If the change affects the overall process (new mode, reordering, principles), also update `README.md` and `00-overview.md`.

### Step 4 — Propagate to every SKILL.md mirror

For each affected skill in each harness's `skills_dir`:

- Update the Workflow section if process steps changed.
- Update Rules if rules changed.
- Update the Dependency check if dependencies changed.
- Update the Output checklist if outputs changed.
- Update the frontmatter `description:` if triggers changed.
- Update Bridge-to-Figma tables if bridge connections changed.

**Bob-specific preservation rules:**

- Keep the `<!-- mirror: bob | SSOT: design/process/{chapter}.md -->` pointer comment immediately after the frontmatter.
- Keep any `{{MCP_PREFIX}}` placeholder unresolved unless the designer has confirmed the real namespace.
- Do NOT introduce `Skill` or `Agent` tool references in Bob SKILL.md files — use prose ("run the `{name}` skill").

### Step 5 — Propagate to orchestration docs

If the change affects ordering, triggers, cross-references, or non-negotiable rules, update BOTH:

- `CLAUDE.md` (Claude-side orchestration)
- `BOB.md` (Bob-side orchestration)

Keep them aligned. Divergence between them is a bug.

### Step 6 — Mirror-parity check

Run `node design/scripts/sync-skills.js`. Fix any reported errors before reporting done. Warnings about unbuilt mirrors are acceptable during incremental build-out.

### Step 7 — Summarize

Tell the designer:

- Which chapter(s) changed.
- Which SKILL.md files were updated (by harness).
- Whether orchestration docs, index docs, or mapping-table docs were touched.
- Whether `sync-skills.js` was clean.
- Suggest `git diff` review before committing.

---

## Rules

- **Never skip propagation.** A process edit without fan-out creates drift.
- **Process chapters are the authority.** On conflict, the chapter wins; update mirrors.
- **Preserve hand-authored detail.** SKILL.md files may have richer templates than their chapter. Update the relevant section; don't destroy surrounding detail.
- **One change, one propagation cycle.** Don't batch unrelated edits.
- **New modes need full scaffolding:**
  1. Create a new numbered chapter.
  2. Update `_propagation.yaml` (add to `chapters.map`; add sub-skills to an umbrella if applicable).
  3. Update `README.md` chapter index and `00-overview.md`.
  4. Create `SKILL.md` in every registered harness, with matching `name:` frontmatter and — for non-Claude harnesses — the SSOT pointer comment.
  5. Update `CLAUDE.md` and `BOB.md` tier listings and trigger rules.
  6. Run `sync-skills.js` to confirm parity.
- **New harness added:** one edit to `_propagation.yaml` under `harnesses:`; `sync-skills.js` will surface the full mirror gap as warnings; work through it skill by skill.
