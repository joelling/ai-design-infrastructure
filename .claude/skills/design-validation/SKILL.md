---
name: design-validation
description: >
  Validates design decisions through heuristic evaluation, cognitive walkthroughs, usability
  test planning, and post-build review checklists. Can run before Figma (evaluating the
  design plan) or after Figma (reviewing built screens). Triggers on: "validation",
  "heuristic evaluation", "usability test", "design review", "QA the design", "test plan",
  "cognitive walkthrough", "review checklist", "design critique", "expert review",
  "usability scenarios", or when checking whether the design meets user needs. Runs at
  any point — uses whatever design artifacts exist so far.
---

# Design Validation — Evaluation & Testing

## Purpose

Validate design decisions through structured evaluation methods. This mode runs at two points: (1) **pre-build** — evaluating the design plan before Figma work begins, and (2) **post-build** — reviewing completed Figma screens against design requirements. It produces test plans, evaluation results, and review checklists.

---

## Dependency check

This mode is **flexible** — it uses whatever design artifacts exist. More artifacts = more thorough evaluation.

**Uses if available:**
- `design/discovery/design-brief.md` — success metrics to evaluate against
- `design/user-models/personas/*` — scenarios grounded in persona context
- `design/journeys/*` — task flows for cognitive walkthroughs
- `design/interaction/*` — behavioral specs to verify
- `design/content/*` — content patterns to check
- `design/accessibility/*` — accessibility requirements to verify
- Designer-provided or project-generated test data for scenarios

---

## Workflow

### Step 1 — Heuristic evaluation (pre-build or post-build)

Evaluate the design against Nielsen's 10 usability heuristics (or equivalent):

```markdown
## Heuristic Evaluation — [Date]

### Evaluation scope
- [What is being evaluated: design artifacts / Figma screens / both]

### Results

#### 1. Visibility of system status
- **Rating:** [Good / Needs attention / Violation]
- **Evidence:** [specific examples]
- **Recommendation:** [if needed]

#### 2. Match between system and real world
- **Rating:** [Good / Needs attention / Violation]
- **Evidence:** [does terminology match user expectations? domain glossary alignment?]

#### 3. User control and freedom
- **Rating:** [Good / Needs attention / Violation]
- **Evidence:** [undo, cancel, escape routes?]

#### 4. Consistency and standards
- **Rating:** [Good / Needs attention / Violation]
- **Evidence:** [consistent patterns? platform conventions?]

#### 5. Error prevention
- **Rating:** [Good / Needs attention / Violation]
- **Evidence:** [confirmation dialogs? constraints? defaults?]

#### 6. Recognition rather than recall
- **Rating:** [Good / Needs attention / Violation]
- **Evidence:** [visible options? contextual help?]

#### 7. Flexibility and efficiency of use
- **Rating:** [Good / Needs attention / Violation]
- **Evidence:** [shortcuts? customization? progressive disclosure?]

#### 8. Aesthetic and minimalist design
- **Rating:** [Good / Needs attention / Violation]
- **Evidence:** [information hierarchy? noise reduction?]

#### 9. Help users recognize, diagnose, and recover from errors
- **Rating:** [Good / Needs attention / Violation]
- **Evidence:** [error messages follow content patterns?]

#### 10. Help and documentation
- **Rating:** [Good / Needs attention / Violation]
- **Evidence:** [contextual help available?]

### Summary
- **Passed:** [count] / 10
- **Needs attention:** [count] / 10
- **Violations:** [count] / 10
- **Top 3 issues to address:** [list]
```

Write to `design/validation/heuristic-evaluation.md`.

### Step 2 — Usability test plan

```markdown
## Usability Test Plan

### Objectives
1. [What questions are we trying to answer?]
2. [What assumptions are we validating?]

### Participants
- **Count:** [5-8 recommended]
- **Criteria:** [role, experience level, domain knowledge]
- **Recruitment:** [how to find participants]

### Method
- **Format:** [moderated / unmoderated / remote / in-person]
- **Duration:** [per session]
- **Tool:** [prototype / live system / Figma prototype]

### Metrics
| Metric | How measured | Target |
|--------|-------------|--------|
| Task completion rate | [method] | [target %] |
| Time on task | [method] | [target seconds] |
| Error rate | [method] | [target] |
| Satisfaction (SUS/CSAT) | [method] | [target score] |

### Tasks
[See scenario scripts]

### Analysis plan
- [How will results be synthesized?]
- [Decision criteria: what score triggers redesign?]
```

Write to `design/validation/test-plan.md`.

### Step 3 — Scenario scripts

Write task-based scenarios using personas and mock data:

```markdown
## Usability Test Scenarios

### Scenario 1: [Task name]
**Persona context:** You are [persona name], a [role] at [context].
**Setup:** [What state the system is in when the scenario starts]
**Task:** [What the participant needs to accomplish — phrased as a goal, not instructions]
**Success criteria:** [How we know they succeeded]
**Data to use:** [Reference to project-provided test data if applicable]
**Observed metrics:** [time, errors, path taken]

### Scenario 2: [Task name]
...

### Edge case scenarios
**Scenario E1:** [Error recovery scenario]
**Scenario E2:** [Permission boundary scenario]
**Scenario E3:** [Empty state scenario]
```

Write to `design/validation/scenario-scripts.md`.

### Step 4 — Design review checklist (post-build)

Create a per-screen checklist for reviewing completed Figma screens:

```markdown
## Design Review Checklist

### For every screen, verify:

#### Information hierarchy
- [ ] Primary information is immediately visible without scrolling
- [ ] Secondary information is accessible within one interaction
- [ ] Information density is appropriate for the persona's expertise level
- [ ] Visual hierarchy matches content priority from IA

#### Interaction
- [ ] All states from state inventory are represented (empty, loading, error, populated)
- [ ] Interactive elements have visible affordances
- [ ] Feedback patterns match interaction model
- [ ] Error states show helpful messages following content patterns

#### Visual consistency
- [ ] All values reference tokens (no hardcoded colors, spacing, radius)
- [ ] Typography follows the type scale — no off-scale sizes
- [ ] Spacing is consistent and follows the grid
- [ ] Color usage matches semantic intent (not decorative)

#### Content
- [ ] All labels use canonical terminology from terminology guide
- [ ] Button labels are specific verbs
- [ ] Empty states have helpful messages and CTAs
- [ ] Error messages follow [what happened] + [what to do] pattern

#### Accessibility
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 UI)
- [ ] No information conveyed by color alone
- [ ] Focus state visible on all interactive elements
- [ ] Tab order follows logical reading order
- [ ] ARIA roles match component patterns

#### Completeness
- [ ] Screen serves all stories listed in canvas brief
- [ ] All personas who use this screen are accounted for
- [ ] Edge cases and error paths are designed, not just happy path
```

Write to `design/validation/review-checklist.md`.

---

## Output checklist

- [ ] `design/validation/heuristic-evaluation.md` — 10-heuristic evaluation with ratings
- [ ] `design/validation/test-plan.md` — usability test structure, metrics, analysis plan
- [ ] `design/validation/scenario-scripts.md` — task-based scenarios using personas and mock data
- [ ] `design/validation/review-checklist.md` — per-screen post-build review checklist

---

## Rules

- Heuristic evaluation should be honest — flag real issues, not just confirm the design is good.
- Test scenarios must use persona context and mock data — not abstract instructions.
- The review checklist extends `figma-audit` (which checks tokens/auto-layout) with UX-specific checks (hierarchy, content, a11y). Both should be run.
- Post-build validation feeds back into upstream modes. If issues are found, update the relevant design artifact (interaction model, content patterns, etc.) before fixing Figma.
- Never skip error/edge-case scenarios — these are where most usability issues hide.
