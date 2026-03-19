---
name: workflow-update
description: >
  Edits the design process specification and propagates changes to all affected SKILL.md files
  and CLAUDE.md. The process directory (design/process/) is the single source of truth for the
  design process — one numbered chapter file per mode, plus a README overview. Designers never
  edit these files directly — they describe what to change, and this skill handles the edit
  plus full propagation. Triggers on: "update the workflow", "change the process",
  "edit the playbook", "tweak the design process", "update a mode", "add a mode",
  "change dependencies", "update triggers", "fix the process", "workflow change",
  "process improvement", "process update", or when any design process change is requested.
---

# Workflow Update — Process Edit + Propagation

## Purpose

Handle all changes to the design process. The designer identifies what needs to change, this skill edits the relevant process chapter file(s) and immediately propagates the change to every affected downstream file — SKILL.md files and CLAUDE.md — so that the infrastructure stays in sync with the process specification.

---

## Process files

The design process is defined in `design/process/`:

| File | Mode |
|------|------|
| `README.md` | Overview, chapter index, principles |
| `01-discovery.md` | `design-discovery` |
| `02-user-models.md` | `design-user-models` |
| `03-journeys.md` | `design-journeys` |
| `04-stories.md` | `design-stories` |
| `05-ia.md` | `design-ia` |
| `06-interaction.md` | `design-interaction` |
| `07-visual.md` | `design-visual` |
| `08-content.md` | `design-content` |
| `09-accessibility.md` | `design-accessibility` |
| `10-validation.md` | `design-validation` |
| `11-governance.md` | `design-governance` |
| `12-canvas.md` | `design-canvas` |
| `13-figma-pipeline.md` | `figma-*` |

---

## Workflow

### Step 1 — Understand the change

Read the designer's request. Identify:
- Which chapter file(s) are affected
- What specifically is changing (process step, rule, dependency, output, mental model, ordering)
- What downstream files will be affected

### Step 2 — Read current state

Read the affected `design/process/NN-*.md` chapter file(s).
Read the corresponding `.claude/skills/*/SKILL.md` file(s) that will need updates.
Read `CLAUDE.md` if the change affects ordering, triggers, or cross-references.

### Step 3 — Edit the process chapter

Make the requested change in the relevant `design/process/*.md` file. Ensure:
- The change is consistent with the rest of the process
- Cross-references to other chapters (via relative links) still hold
- The "Feeds into" section is updated if downstream connections changed
- Output file paths are updated if artifact locations changed

If the change affects the overall process (new mode, reordering, principles): also update `design/process/README.md`.

### Step 4 — Propagate to SKILL.md

For each affected skill, update its SKILL.md to reflect the process change:
- **If process steps changed:** Update the Workflow section
- **If rules changed:** Update the Rules section
- **If dependencies changed:** Update the Dependency check section
- **If outputs changed:** Update the Output checklist
- **If triggers changed:** Update the frontmatter description
- **If bridge connections changed:** Update the Bridge to Figma table

### Step 5 — Propagate to CLAUDE.md

If the change affects any of these, update CLAUDE.md:
- Mode ordering or tiers → update the pipeline list
- Trigger phrases → update the trigger rules
- Cross-references to Figma → update the cross-reference table
- Non-negotiable rules → update the rules section
- New or removed modes → update tier listings

### Step 6 — Summarize

Tell the designer:
- What was changed in which process chapter(s)
- Which SKILL.md files were updated and how
- Whether CLAUDE.md was updated
- Suggest reviewing `git diff` to confirm the changes

---

## Rules

- **Never skip propagation.** Every process edit MUST be followed by updates to affected SKILL.md files and CLAUDE.md. A process change without propagation creates drift.
- **The process files are the authority.** If there's a conflict between a process chapter and a SKILL.md, the process chapter wins. Update the SKILL.md to match.
- **Preserve hand-authored detail.** SKILL.md files may have more detailed templates, code examples, and formatting than the process chapter. When propagating, update the relevant section without destroying surrounding detail.
- **One change, one propagation.** Don't batch unrelated changes. Each change request should be a clean edit → propagate → review cycle.
- **New modes need full scaffolding.** If the designer adds a new mode:
  1. Create a new numbered chapter file in `design/process/`
  2. Update `design/process/README.md` chapter index
  3. Create the corresponding `.claude/skills/[mode-name]/SKILL.md` with full skill structure
  4. Update `CLAUDE.md` tier listings
