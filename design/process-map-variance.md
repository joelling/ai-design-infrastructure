# FigJam Process Map — Variance Analysis

> **Source:** [AI-Design-process FigJam board](https://www.figma.com/board/y0kFjCV8UaqcKjZgR75TEL/AI-Design-process?node-id=0-1)
> **Compared against:** `design/process/*.md`, `.claude/skills/*/SKILL.md`, `CLAUDE.md`
> **Date:** 2026-04-03
> **Status:** ✅ All 11 variances resolved — FigJam board updated 2026-04-03

The FigJam board is a service blueprint of the design process with four swimlanes (Designer, Claude AI, Scripts, Artefacts) across four tiers. This document catalogues where the board has drifted from the authoritative process documentation.

---

## Critical — Structural inaccuracies

These variances would mislead someone following the process map. They represent missing workflow steps or incorrect process structure.

### 1. Missing mode: Wireframe (M14)

| | FigJam | Process docs |
|---|---|---|
| Total modes | 15 (01–15) | 16 (01–16) |
| After Canvas (M13) | Figma Pipeline (M14) | **Wireframe (M14)** → Figma Pipeline (M15) |

The entire wireframe validation gate is absent from the board. In the current process, canvas briefs feed into clickable ASCII wireframes (`design-wireframe`) for structural and flow validation before Figma execution begins. This is a defined mode with its own skill, artifact directory (`design/14_WIREFRAME/`), and upstream/downstream dependencies.

**Impact:** Someone following the FigJam board would skip wireframe review entirely, moving straight from canvas briefs to Figma — bypassing the structural validation gate.

**Reference:** `design/process/14-wireframe.md`, `.claude/skills/design-wireframe/SKILL.md`

### 2. Mode numbering shift (cascading from #1)

| Mode | FigJam label | Process docs label |
|---|---|---|
| Wireframe | *(absent)* | **14** — Clickable ASCII Wireframe |
| Figma Pipeline | **14** Figma Pipeline | **15** — Figma Pipeline |
| Coded Prototype | **15** Coded Prototype | **16** — Coded Prototype |

All references to mode numbers 14 and 15 in the FigJam board are off by one.

**Impact:** Cross-referencing between the board and process files will produce incorrect matches for Tier 4 modes.

**Reference:** `design/process/15-figma-pipeline.md`, `design/process/16-prototype.md`

### 3. Missing Figma pipeline skills

The FigJam board shows 8 sub-steps (①–⑧) in the Figma pipeline. The process docs define 11 mandatory-order skills. Three skills are missing from the board:

| Missing skill | Should be step | Purpose |
|---|---|---|
| `figma-handoff` | 2 (after connect) | Detect and harmonise designer changes made outside the AI workflow since last session |
| `figma-inventory` | 8 (after parking-lot) | Update the structured inventory log after any component or token lifecycle change |
| `figma-docs` | 10 (after audit) | Create documentation pages for tokens and components |

**FigJam shows:**
① connect → ② file-setup → ③ tokens → ④ page-setup → ⑤ component → ⑥ parking-lot → ⑦ audit → ⑧ library-mode

**Process docs define:**
① connect → ② handoff → ③ file-setup → ④ tokens → ⑤ page-setup → ⑥ component → ⑦ parking-lot → ⑧ inventory → ⑨ audit → ⑩ docs → ⑪ library-mode

**Impact:** Skipping `figma-handoff` means designer edits made in Figma between sessions would go undetected — the most likely source of design system drift. Skipping `figma-inventory` means the component lifecycle log falls out of sync. Skipping `figma-docs` means documentation pages are never created.

**Reference:** `design/process/15-figma-pipeline.md` lines 9–19, `.claude/skills/figma-handoff/SKILL.md`, `.claude/skills/figma-inventory/SKILL.md`, `.claude/skills/figma-docs/SKILL.md`

### 4. Audit check count

| | FigJam | Process docs |
|---|---|---|
| Number of checks | 7 | **10** |

**FigJam lists:** hardcoded colours, hardcoded spacing, hardcoded radius, non-auto-layout frames, detached components, missing properties, unpublished components.

**Process docs add three more:**
- **Check 8 — Orphan inventory entries:** components in the inventory that no longer exist in the file
- **Check 9 — Ghost components:** components in the file not tracked in the inventory
- **Check 10 — Lifecycle consistency:** inventory status doesn't match actual component location

**Impact:** The three missing checks are specifically about inventory-to-file reconciliation. Without them, the inventory (which `figma-inventory` maintains) would never be validated against reality.

**Reference:** `.claude/skills/figma-audit/SKILL.md` lines 29–84

---

## Moderate — Inaccurate details

These variances could cause confusion during execution but don't represent missing workflow steps.

### 5. Prototype artifact path

| | FigJam | Process docs |
|---|---|---|
| Prototype directory | `15_PROTOTYPE/` | `16_PROTOTYPE/` |

The FigJam board references `15_PROTOTYPE/manifest.md`, `15_PROTOTYPE/drift-log.md`, and `15_PROTOTYPE/[source files]`. The correct path is `design/16_PROTOTYPE/` (shifted by the wireframe insertion).

**Impact:** File path references in the board point to a non-existent directory.

**Reference:** `.claude/skills/design-prototype/SKILL.md` lines 191–193, `CLAUDE.md` line 134

### 6. Canvas brief section count

| | FigJam | CLAUDE.md | Process file 13-canvas.md |
|---|---|---|---|
| Section count | "13 sections each" | Sections 1–12 (12 total) | Header says "Sections 3–13" but defines sections 3–12 |

The actual brief structure is:
- Section 1: Frame inventory
- Section 2: Traceability
- Sections 3–12: Brief body (purpose, layout, components, states, content, visual, a11y, behavioural, AC, breakpoints)

Total: **12 sections**. The process file has an internal inconsistency (header says "3–13" but only defines through section 12). The FigJam inherited or amplified this.

**Impact:** Minor confusion when counting sections. No missing content — the same 12 sections are described everywhere.

**Reference:** `design/process/13-canvas.md` lines 99–112, `CLAUDE.md` "Canvas brief structure"

### 7. BRD enrichment tag notation

The FigJam BRD node states:
> Enriched by modes: 04 [BR-NN] · 05 [STORY] · 06 [Feature/Touchpoint, RBAC, Data Fields] · 07 [STATE, BEHAVIOR, Notification Mapping] · 09 [LOV] · 13 [CANVAS]

The notation "05 [STORY]" implies a `[STORY]` inline tag in acceptance criteria. In the process docs, story-origin AC bullets carry **no tag** — they are untagged by convention (the story origin is implied). Only downstream modes append tags: `[BR-NN]`, `[FLOW]`, `[STATE]`, `[BEHAVIOR]`, `[A11Y]`, `[CANVAS]`.

**Impact:** Someone reading the FigJam board might look for `[STORY]` tags in the BRD and not find them, or worse, start adding them.

**Reference:** `CLAUDE.md` "BRD AC uses bullet points" rule, `design/process/05-stories.md`

### 8. Wireframe soft gate missing from Figma hard block

The FigJam's Figma pipeline hard block node states:
> ⛔ HARD BLOCK: no canvas brief = no screen build

The process docs define an additional **soft gate** at this point: if `design/14_WIREFRAME/manifest.md` exists and the screen's wireframe review status is "pending" or absent, the system warns the designer before proceeding. The designer can override, but the warning is documented.

**Impact:** The wireframe review checkpoint (even as a soft gate) is invisible on the board.

**Reference:** `design/process/15-figma-pipeline.md` line 23

---

## Minor — Omissions and simplifications

These don't actively mislead but represent incomplete representation.

### 9. Figma sub-step numbering range

FigJam numbers the Figma pipeline ①–⑧. The correct range is ①–⑪ (11 steps). This is a direct consequence of variance #3 (three missing skills).

### 10. Designer research role split

FigJam's M01 Designer swimlane shows two separate nodes: "Conduct interview, user research notes" and "Provide raw inputs (interviews, surveys, docs, briefs, competitive data)". The process docs treat input provision as a single step — the designer provides whatever raw inputs exist (which may include self-conducted research).

**Impact:** None functionally. The FigJam representation is arguably more granular about the designer's research role, which is a reasonable visual choice for a service blueprint.

### 11. Develop loop sync diagram

The FigJam correctly represents the three-node sync loop (Canvas ↔ Figma ↔ Prototype) with drift detection diamonds. However, the wireframe validation gate that sits between Canvas and Figma (create → review → archive) is absent, consistent with variance #1.

---

## Summary

| Severity | Count | Root cause |
|---|---|---|
| **Critical** | 4 | Wireframe mode addition (M14) not propagated to FigJam; Figma pipeline skills added after board creation |
| **Moderate** | 4 | Cascading path/numbering errors from M14 insertion; internal section count inconsistency; tag notation imprecision |
| **Minor** | 3 | Simplifications and visual choices that don't affect process correctness |

**Primary action:** Update the FigJam board to add the wireframe column (M14), renumber modes 14→15 and 15→16, add the three missing Figma sub-steps (handoff, inventory, docs), and correct the audit check count from 7 to 10.
