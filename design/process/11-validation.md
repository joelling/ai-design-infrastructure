---
operation: [ingest, lint]
---

# Research

> **Tier 3 — Design (init) | Lifecycle — all tiers (synthesis)** | Mode: `design-research`

## Why this matters

Design decisions rest on assumptions about user behavior. Phase A turns those assumptions into testable research instruments before building begins. Phase B is institutional memory for what actually happened when real users encountered the design — and routes what was learned back into the project's model of its users. Without this loop, the project never updates its understanding of people.

## The mental model

**Phase A:** You are a research architect. You translate personas, archetypes, and story map into research instruments — scenario scripts that ground testing in real contexts, and a test plan that gives the team a structured methodology. These are planning artifacts: they exist before testing, making testing possible.

**Phase B:** You are a synthesizer, not a judge. You read completed research outputs (usability test results, session notes, field research) and extract what was learned. You do not produce design principles — that is governance's job. You produce findings, update confidence in user models, and flag which prior assumptions need revision. You are the pipeline between what was observed and what the project believes about its users.

## Inputs

### Phase A
- `design/02_USER_MODELS/personas/` — participant criteria and scenario context
- `design/02_USER_MODELS/behavioral-archetypes.md` — archetype-specific scenario variations
- `design/05_STORIES/story-map.md` — task list and story coverage requirements
- `design/01_DISCOVERY/design-brief.md` — success metrics for test thresholds
- `design/07_INTERACTION/state-inventory.md` — edge case and error scenario coverage

### Phase B
- Completed research output (session notes, test results, field observations) — provided by designer
- `design/11_RESEARCH/scenario-scripts.md` — to interpret findings against intended tasks
- `design/02_USER_MODELS/personas/` — to assess confidence change
- `design/05_STORIES/story-map.md` — to identify story gaps or revisions

## Upstream sync

**Phase A (first run):**
1. Note which upstream artifacts are available. Proceed regardless.
2. Value alignment check: if `design/01_DISCOVERY/value-framework.md` exists, verify that scenario scripts trace to documented user needs.

**Phase B (synthesis runs):**
0. Check `design/11_RESEARCH/_research-log.md` for the last synthesis run date.
1. Confirm that research output (session notes, test results) has been provided since the last run. If none, exit — do not synthesize without evidence.
2. Report accumulation scope (sessions, participants, scenarios tested) before proceeding.

After completing either phase:
1. Add or increment `<!-- artifact: ... -->` version headers on all changed output files
2. Update `design/11_RESEARCH/_upstream.md` with consumed and produced artifact versions
3. Report which downstream modes are now potentially stale

### Script commands
```bash
node design/scripts/sync-status.js
node design/scripts/sync-version.js init <file> design-research    # first time
node design/scripts/sync-version.js bump <file>                    # subsequent updates
node design/scripts/sync-manifest.js research                      # update manifest
```

---

## Process

### Phase A — Init (run once, Tier 3, before build)

**0. Check upstream.** Note available artifacts. Proceed regardless.

**1. Copy the test plan template.** Copy `design/templates/test-plan.tpl.md` to `design/11_RESEARCH/test-plan.md` if it does not already exist. The template pre-seeds methodology structure, metric frameworks, and analysis plan format. Fill the `<!-- PROJECT-SPECIFIC -->` sections:

- **Participant criteria** — from in-scope personas and archetypes
- **Task list** — reference SCN-NNN IDs from scenario scripts (written in step 2 below)
- **Success thresholds** — from `design-brief.md` success metrics and archetype expertise expectations

**2. Write scenario scripts.** Task-based scenarios grounded in persona context. Each scenario must use user language — not system or UI language.

**Format per scenario:**

```
**SCN-NNN**
Persona: [Persona name]
Archetype: [Archetype name]
Story reference: DS-NNN

Context: [1–2 sentence setup describing the realistic situation]
Task: [The action the participant is asked to perform, written as a goal — no UI hints]
Success criteria: [Observable outcome confirming task completion]
Edge case variation: [Alternate starting condition or boundary case to test]
```

**Minimum coverage:**
- At least one scenario per primary story per persona in scope
- At least one archetype-specific path per archetype where behavior differs
- At least one error recovery scenario for every form/submit interaction
- At least one permission boundary scenario if RBAC is in scope
- At least one empty state scenario (first-time user, no data yet)

Write to `design/11_RESEARCH/scenario-scripts.md`.

---

### Phase B — Synthesis (run after research completes)

**0. Scope the accumulation.** Check `_research-log.md` for last synthesis run date. Confirm new research output exists since then. If not, exit. Report to designer: sessions available, participants, scenarios tested.

**1. Read all research output.** Session notes, recordings, survey results, field observations. Cross-reference against scenario scripts — which tasks succeeded, which failed, which produced unexpected behavior.

**2. Document findings (RF-NNN).** For each distinct behavioral pattern or usability issue:

```markdown
## RF-[NNN] — [Finding statement — specific and observable]

**Type:** behavioral | usability | preference | gap
**Frequency:** [N of N participants encountered this]
**Severity:** critical | major | minor | observation
**Scenario reference:** SCN-NNN
**Story reference:** DS-NNN (if applicable)
**Evidence:** [direct quotes, observed actions, error patterns]
**Implication:** [what this means for the design or the user model]
```

Write all RF-NNN entries to `design/11_RESEARCH/research-findings.md`.

**3. Write persona increment flags.** For each persona whose model is challenged, confirmed, or extended by research:

```markdown
## Increment flag — [Persona name] — [Date]
Mode: design-research Phase B
Confidence change: up | down | gap revealed
Evidence: RF-NNN — [brief summary]
Recommended action: [what the user-models mode should update — a confidence level, behavioral note, or assumption revision]
Status: pending
```

Write to `design/11_RESEARCH/_increment-flags/user-models-[YYYYMMDD].md`.

**4. Write story increment flags.** For each finding that reveals a gap, a failed assumption, or a deprioritization candidate:

```markdown
## Increment flag — [Story ID or gap label] — [Date]
Mode: design-research Phase B
Type: gap | assumption-change | deprioritize-candidate
Evidence: RF-NNN — [brief summary]
Recommended action: [what the stories mode should update]
Status: pending
```

Write to `design/11_RESEARCH/_increment-flags/stories-[YYYYMMDD].md`.

**5. Write governance input.** Prepare behavioral evidence for governance Phase B:

```markdown
## Research → Governance Input — [Date]

### Behavioral patterns (3+ participants)
- [Pattern description] — RF-NNN, RF-NNN, RF-NNN

### Contradictions to current model
- [Description] — affects [persona/story/assumption]

### Conventions observed in user behavior
- [Description] — [frequency, context]
```

Write to `design/11_RESEARCH/governance-input-[YYYYMMDD].md`. This file is governance's input. Governance decides whether patterns here qualify as design principles.

**6. Write the research findings document.** Compile all RF-NNN entries, persona confidence assessments, and story implications into `design/11_RESEARCH/research-findings.md`.

**7. Update the research log.** Append to `design/11_RESEARCH/_research-log.md`:

```markdown
## Research synthesis — [Date]

**Sessions synthesized:** [N]
**Findings documented:** RF-[first] through RF-[last]
**Personas assessed:** [list]
**Increment flags written:** user-models ([N] flags), stories ([N] flags)
**Governance input written:** governance-input-[date].md
```

## Outputs

| File | Type | What it contains |
|------|------|-----------------|
| `design/11_RESEARCH/scenario-scripts.md` | synthesis | Task-based scenarios using personas, archetypes, and story references |
| `design/11_RESEARCH/test-plan.md` | hybrid template | Methodology, participant criteria (project-filled), task list, metrics |
| `design/11_RESEARCH/research-findings.md` | synthesis | Compiled RF-NNN findings from completed research sessions |
| `design/11_RESEARCH/_increment-flags/` | synthesis | Per-mode increment flags for user-models and stories |
| `design/11_RESEARCH/governance-input-[date].md` | synthesis | Behavioral evidence stream for governance Phase B |
| `design/11_RESEARCH/_research-log.md` | synthesis | Per-synthesis-run record of sessions, findings, and flags |

*`_upstream.md` is maintained by `sync-manifest.js` and is not a mode deliverable.*

## Rules

- design-research writes findings and increment flags. It never writes principles. Only governance Phase B codifies conventions as GP-NNN design principles.
- Phase B requires actual research output. Do not synthesize without evidence.
- Increment flags are delivered to the relevant mode owner. They decide whether to apply them.
- Scenario scripts use persona context and mock data — not abstract instructions. "Click submit" is not a scenario. "You've finished your report — submit it for review" is.
- RF-NNN IDs are stable and never reused. Retired findings retain their ID with a `[RETIRED]` marker.
- Every Phase B run must produce a governance-input file, even if it contains no codifiable patterns. The absence of patterns is also evidence.
- design-research does NOT produce or update `design-principles.md`. That file is governance's exclusive responsibility.

## Feeds into

- **`design-user-models`** — increment flags update persona confidence levels and behavioral notes
- **`design-stories`** — increment flags identify story gaps and story refinement candidates
- **`design-governance` (Phase B)** — behavioral evidence stream for principle codification; governance checks convergence with structural evidence from figma-audit before codifying any principle
- **`design-canvas`** — RF-NNN critical findings feed back as corrections to canvas brief acceptance criteria
