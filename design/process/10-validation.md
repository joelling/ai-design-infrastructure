# Chapter 10: Design Validation

> **Tier 3 — Design** | Mode: `design-validation`

## Why this matters

Validation catches design issues before they become expensive Figma rework or, worse, usability failures. It can run twice: pre-build (evaluating the design plan) and post-build (reviewing completed screens). Without structured validation, quality depends on whoever happens to review the work.

## The mental model

You are a design critic and usability evaluator. Your job is to stress-test the design against established heuristics, walk through it as each persona, and create test plans for empirical validation.

## Inputs

This mode is flexible — it uses whatever design artifacts exist. More artifacts = more thorough evaluation. Also uses completed Figma screens for post-build review.

## Upstream sync

**On entry:** Check `design/validation/_upstream.md` (if it exists). If upstream has changed since last run:

1. Report what changed and classify severity (additive / corrective / structural)
2. Ask the designer: re-process with new data, or proceed with current outputs?
3. If re-processing, update incrementally — revise evaluation and checklist items affected by upstream changes

**On completion:** After producing or updating artifacts:

1. Add or increment version headers on all changed output files
2. Update `design/validation/_upstream.md` with consumed artifact versions
3. Report which downstream modes are now potentially stale (canvas, figma-audit)

## Process

**0. Check upstream sync.** Run the upstream sync check described above. If this is a first run, note which upstream artifacts are available and which are absent.

**1. Heuristic evaluation.** Evaluate against Nielsen's 10 usability heuristics: visibility of system status, match with real world, user control, consistency, error prevention, recognition over recall, flexibility, minimalist design, error recovery, help. Rate each and provide evidence.

**2. Usability test plan.** Define objectives, participant criteria, method (moderated/unmoderated), metrics (task completion rate, time on task, error rate, satisfaction), and analysis plan.

**3. Write scenario scripts.** Task-based scenarios using personas and mock data. Include edge-case scenarios (error recovery, permission boundaries, empty states).

**4. Create the design review checklist.** A per-screen post-build checklist covering: information hierarchy, interaction completeness, visual consistency, content accuracy, accessibility compliance, and story coverage.

## Outputs

| File | What it contains |
|------|-----------------|
| `design/validation/heuristic-evaluation.md` | 10-heuristic evaluation with ratings |
| `design/validation/test-plan.md` | Usability test structure, metrics, analysis plan |
| `design/validation/scenario-scripts.md` | Task-based scenarios using personas and mock data |
| `design/validation/review-checklist.md` | Per-screen post-build review checklist |
| `design/validation/_upstream.md` | Upstream dependency manifest — consumed and produced artifact versions |

## Rules

- Heuristic evaluation should be honest — flag real issues, not just confirm the design.
- Test scenarios must use persona context and mock data, not abstract instructions.
- The review checklist extends `figma-audit` with UX-specific checks. Both should be run.
- Post-build issues feed back into upstream modes. Fix the design artifact first, then fix Figma.
- Never skip error/edge-case scenarios.

## Feeds into

- **[Canvas Briefs](12-canvas.md)** — review checklist becomes acceptance criteria
- **Figma Audit** — extends the technical audit with UX checks
