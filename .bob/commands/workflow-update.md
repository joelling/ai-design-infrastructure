---
description: Edit a design process chapter and propagate to every harness
argument-hint: <what to change, in plain English>
---

Run the `workflow-update` skill using the user's description of the change ($1).

Specifically:

1. Identify which `design/process/*.md` chapter(s) are affected by the request.
2. Read the chapter, the matching `.claude/skills/{mode}/SKILL.md`, and the
   matching `.bob/skills/{mode}/SKILL.md` (if it exists).
3. Edit the process chapter to reflect the requested change, preserving
   cross-references, downstream links, and output-path declarations.
4. Propagate to every target listed in `design/process/_propagation.yaml`:
   - `.claude/skills/{mode}/SKILL.md` (both the workflow section and the
     frontmatter description if triggers changed)
   - `.bob/skills/{mode}/SKILL.md` (same updates; preserve the mirror comment)
   - `CLAUDE.md` (pipeline summaries, trigger rules, cross-reference table)
   - `BOB.md` (same cross-cutting updates)
   - `design/process/README.md` and `design/process/00-overview.md` (if the
     chapter index, ordering, or tier labels changed)
   - `.bob/rules/50-bob-adaptations.md` (if a new tool dependency was
     introduced)
5. Run `node design/scripts/sync-skills.js` to confirm the mirror is clean.
6. Summarise: which chapter changed, which SKILL.md files were updated, which
   orchestration docs were updated, whether any mapping-table entry was added.
   Ask the user to review `git diff` before committing.
