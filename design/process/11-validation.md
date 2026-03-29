# Design Validation

> **Tier 3 — Design** | Mode: `design-validation`

## Why this matters

Validation catches design issues before they become expensive Figma rework or, worse, usability failures. Without structured validation, quality depends on whoever happens to review the work.

## Two invocation modes

This mode can run at two distinct points in the process — and both are valid:

**Pre-build validation** (after canvas briefs exist, before Figma execution): Evaluates the design *plan* — are the intentions correct, complete, and consistent? Inputs are upstream design artifacts (IA, interaction specs, canvas briefs, accessibility specs). Output is a heuristic evaluation and test plan for planned screens.

**Post-build validation** (after Figma screens exist): Reviews the *execution* — does the built screen match the design intent and pass UX quality checks? Inputs add completed Figma screens to the above. Output is a completed review checklist with per-screen findings.

Both runs produce artifacts in `design/11_VALIDATION/`. Post-build artifacts supplement (don't replace) pre-build artifacts.

## The mental model

You are a design critic and usability evaluator. Your job is to stress-test the design against established heuristics, walk through it as each persona, and create test plans for empirical validation. Treat every finding as a gift — an issue caught here costs a comment, not a sprint.

## Inputs

This mode is flexible — it uses whatever design artifacts exist. More artifacts = more thorough evaluation.

**Pre-build:** canvas briefs, interaction specs, state inventory, content strategy, accessibility specs, persona and archetype documents.

**Post-build:** all of the above, plus completed Figma screens.

## Upstream sync

**On entry:** Check `design/11_VALIDATION/_upstream.md` (if it exists). If upstream has changed since last run:

1. Report what changed and classify severity (additive / corrective / structural)
2. Ask the designer: re-process with new data, or proceed with current outputs?
3. If re-processing, update incrementally — revise evaluation and checklist items affected by upstream changes

**On completion:** After producing or updating artifacts:

1. Add or increment version headers on all changed output files
2. Update `design/11_VALIDATION/_upstream.md` with consumed artifact versions
3. Report which downstream modes are now potentially stale (canvas, figma-audit)

## Process

**0. Check upstream sync.** Run the upstream sync check described above. If this is a first run, note which upstream artifacts are available and which are absent.

---

**1. Heuristic evaluation.**

Evaluate the design against Nielsen's 10 usability heuristics. Document every heuristic, even passing ones — a passing rating with evidence is as useful as a finding.

**Rating scale:**
| Score | Meaning |
|-------|---------|
| 0 | Not a problem — heuristic is satisfied |
| 1 | Cosmetic — fix if time allows, low priority |
| 2 | Minor — causes friction, should be fixed |
| 3 | Major — causes task failure or significant confusion, must be fixed |
| 4 | Catastrophic — blocks task completion or violates trust, fix before release |

**Finding format** (one row per finding, findings only — passing heuristics are noted with score 0 and a brief evidence statement):

| Heuristic | Screen / component | Severity (0–4) | Evidence | Recommendation |
|-----------|-------------------|---------------|---------|---------------|

**The 10 heuristics to evaluate:**
1. Visibility of system status — does the UI always keep users informed of what's happening?
2. Match between system and real world — does the language and model match the user's mental model?
3. User control and freedom — can users undo, cancel, or escape unwanted states?
4. Consistency and standards — are conventions followed within the product and with platform norms?
5. Error prevention — does the design prevent errors before they occur?
6. Recognition over recall — are options visible rather than requiring users to remember them?
7. Flexibility and efficiency — are shortcuts available for expert users without hindering novices?
8. Aesthetic and minimalist design — is irrelevant or low-priority information absent?
9. Help users recognize, diagnose, and recover from errors — are error messages clear and constructive?
10. Help and documentation — if users need help, is it findable and task-focused?

---

**2. Usability test plan.**

Define the structure for an empirical validation study. Required fields:

- **Objectives:** What specific questions does this test answer? (e.g., "Can a new user with the Processor archetype complete the submission flow without assistance?")
- **Participant criteria:** Role, domain experience level, archetype match, minimum sample size (typically 5 per archetype in scope)
- **Method:** Moderated vs. unmoderated; remote vs. in-person; think-aloud protocol yes/no
- **Session length:** Estimated total including intro, tasks, and debrief
- **Task list:** Ordered list of tasks from the scenario scripts (reference SCN-NNN IDs)
- **Metrics per task:** Task completion rate (pass/fail), time on task (target vs. observed), error count, satisfaction rating (post-task Likert)
- **Global metrics:** System Usability Scale (SUS) score target, Net Promoter Score (NPS) if applicable
- **Analysis plan:** How findings are categorized (by heuristic, by severity, by persona), who reviews results, what severity threshold triggers a redesign cycle

---

**3. Write scenario scripts.**

Task-based scenarios that give participants a realistic context without prescribing UI steps. Each scenario must be written in the user's language, not system language.

**Format per scenario:**

```
**SCN-NNN**
Persona: [Persona name]
Archetype: [Archetype name]
Story reference: DS-NNN

Context: [1–2 sentence setup describing the realistic situation]
Task: [The action the participant is asked to perform, written neutrally — no UI hints]
Success criteria: [Observable outcome that confirms task completion]
Edge case variation: [An alternate starting condition or boundary case to test]
```

**Minimum coverage:**
- At least one scenario per primary story per persona in scope
- At least one archetype-specific path per archetype (the same task should have distinct variations for different archetypes where behavior differs — e.g., a field archetype doing the same task offline vs. a desk archetype doing it in a browser)
- At least one error recovery scenario for every form/submit interaction
- At least one permission boundary scenario if RBAC is in scope (e.g., a user attempts an action their role doesn't allow)
- At least one empty state scenario (first-time user, no data yet)

---

**4. Create the design review checklist.**

A per-screen structured checklist for post-build review. Run this after Figma screens are built. Each item is evaluated as Pass / Fail / N/A with brief evidence.

**Checklist structure per screen:**

```
## [Screen Name] — [SCR-NNN]
Stories served: DS-NNN, DS-NNN

### Information hierarchy
- [ ] Primary content is visually dominant and immediately scannable
- [ ] Secondary content is accessible but not competing with primary
- [ ] Tertiary content requires deliberate action to surface (drawer, tooltip, expand)
- [ ] Visual weight matches content priority

### Interaction completeness
- [ ] All states defined in the state inventory are built (empty, loading, populated, error, at minimum)
- [ ] Every action in the behavioral spec has a visible affordance
- [ ] State transitions are visible (loading indicators, confirmations, feedback)
- [ ] Destructive actions have confirmation steps

### Visual consistency
- [ ] All fills reference Figma variables (zero hardcoded colors)
- [ ] All spacing references Figma variables (zero hardcoded values)
- [ ] Typography matches the type scale
- [ ] Component instances are used (no detached or re-created elements)
- [ ] Naming matches the screen naming convention

### Content accuracy
- [ ] Labels match the terminology guide
- [ ] Error messages follow the error message format (what + why + what to do)
- [ ] Empty state copy is present and matches the content strategy
- [ ] Microcopy is present for all interactive elements

### Accessibility
- [ ] Color contrast passes WCAG AA (4.5:1 body text, 3:1 large/UI)
- [ ] Focus order is logical (left-to-right, top-to-bottom)
- [ ] Focus indicators are visible in all interactive states
- [ ] Non-text content has text alternatives (icon labels, image alt text)
- [ ] Color is not the sole indicator of state or meaning

### Story coverage
- [ ] Every DS-NNN in "Stories served" is addressed by at least one visible element or interaction
- [ ] No features are present that don't trace back to a story
```

**Relationship to figma-audit:** The `figma-audit` skill runs a technical audit (token bindings, auto-layout, component detachment, publishing). This review checklist extends it with UX-specific checks. Both should be run and their findings reconciled.

## Outputs

| File | What it contains |
|------|-----------------|
| `design/11_VALIDATION/heuristic-evaluation.md` | 10-heuristic evaluation table with severity ratings and evidence |
| `design/11_VALIDATION/test-plan.md` | Usability test structure, participant criteria, metrics, analysis plan |
| `design/11_VALIDATION/scenario-scripts.md` | Task-based scenarios using personas, archetypes, and mock data |
| `design/11_VALIDATION/review-checklist.md` | Per-screen post-build review checklist with pass/fail findings |
| `design/11_VALIDATION/_upstream.md` | Upstream dependency manifest — consumed and produced artifact versions |

## Rules

- Heuristic evaluation must be honest — flag real issues, not just confirm the design. A heuristic evaluation with no findings above severity 1 is a red flag, not a green light.
- Test scenarios must use persona context and mock data, not abstract instructions. "Click the submit button" is not a scenario. "You've finished entering your report — submit it for review" is.
- The review checklist extends `figma-audit` with UX-specific checks. Both should be run and findings reconciled before library migration.
- Post-build issues feed back into upstream modes. Fix the design artifact first (canvas brief, interaction spec), then fix Figma. Don't fix Figma directly and leave the artifact stale.
- Never skip error/edge-case scenarios. The happy path is the easiest path — errors reveal the real design.
- Severity 3 or 4 findings must be resolved before canvas briefs are finalized for affected screens.

## Feeds into

- **[Canvas Briefs](13-canvas.md)** — severity 3–4 heuristic findings and checklist failures feed back as corrections to canvas brief acceptance criteria
- **Figma Audit** — extends the technical audit with UX checks; both run before library migration
