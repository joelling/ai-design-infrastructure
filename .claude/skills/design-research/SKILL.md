---
name: design-research
description: >
  Two-phase research mode. Phase A (init): writes scenario scripts and test plan —
  research planning instruments derived from personas, archetypes, and story map. Runs
  once in Tier 3 before build begins. Phase B (synthesis): synthesizes completed
  usability test results and field research into research-findings.md, writes increment
  flags to user-models and stories, and prepares behavioral evidence for governance
  Phase B. Triggers on: "research", "scenario scripts", "test plan", "usability scenarios",
  "test planning", "usability testing", "research synthesis", "findings", "user research",
  "what did we learn from testing", "persona confidence", "story gap from research", or
  when usability research has been completed and findings need to be synthesized back
  into the design model. Never codifies design principles — that is governance's job.
---

# Design Research — Planning + Synthesis

> **Quick reference**
> - **Phase A:** Scenario scripts + test plan — research instruments derived from personas and stories. Runs once before build.
> - **Phase B:** Synthesizes completed research into findings, flags persona/story revisions, feeds governance Phase B. Requires actual research output.
> - **Hard rule:** design-research never writes principles. Only governance Phase B writes GP-NNN entries.

## Purpose

**Phase A:** Translate personas, archetypes, and story map into research instruments before building begins. Scenario scripts ground testing in real user context. The test plan gives the team a structured methodology with participant criteria and success thresholds.

**Phase B:** Synthesize what was actually observed when real users encountered the design. Produce findings (RF-NNN), update confidence in user models, flag story gaps and assumption changes, and prepare behavioral evidence for governance Phase B to evaluate as potential design principles.

---

## Dependency check

### Phase A — warn if missing, don't block
- `design/02_USER_MODELS/personas/` — participant criteria and scenario context
- `design/02_USER_MODELS/behavioral-archetypes.md` — archetype-specific scenario variations
- `design/05_STORIES/story-map.md` — task list and story coverage requirements
- `design/01_DISCOVERY/design-brief.md` — success metrics for test thresholds
- `design/07_INTERACTION/state-inventory.md` — error and edge case coverage

### Phase B — exit if absent
- Completed research output (session notes, test results, field observations) — provided by designer
- `design/11_RESEARCH/scenario-scripts.md` — to interpret findings against intended tasks
- `design/02_USER_MODELS/personas/` — to assess confidence change
- `design/05_STORIES/story-map.md` — to identify story gaps or revisions

---

## Upstream sync (step 0)

**Phase A (first run):**
1. Note which upstream artifacts are available. Proceed regardless.
2. Value alignment check: if `design/01_DISCOVERY/value-framework.md` exists, verify scenario scripts trace to documented user needs.

**Phase B (synthesis runs):**
0. Check `design/11_RESEARCH/_research-log.md` for the last synthesis run date.
1. Confirm research output (session notes, test results) has been provided since last run. If none, exit.
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

## Workflow — Phase A: Init

### Step 1 — Copy the test plan template

Copy `design/templates/test-plan.tpl.md` to `design/11_RESEARCH/test-plan.md` if the file does not already exist. The template pre-seeds methodology structure, metric frameworks, and analysis plan format. Fill the `<!-- PROJECT-SPECIFIC -->` sections:

- **Participant criteria** — from in-scope personas and archetypes
- **Task list** — reference SCN-NNN IDs from scenario scripts (written in Step 2)
- **Success thresholds** — from `design-brief.md` success metrics and archetype expertise expectations

### Step 2 — Write scenario scripts

Task-based scenarios grounded in persona context. Each scenario must use user language — not system or UI language.

**Format per scenario:**

```markdown
**SCN-NNN**
Persona: [Persona name]
Archetype: [Archetype name]
Story reference: DS-NNN

Context: [1–2 sentence setup — the realistic situation the user is in]
Task: [The action to perform, written as a goal — no UI hints]
Success criteria: [Observable outcome confirming task completion]
Edge case variation: [Alternate starting condition or boundary case to test]
```

**Minimum coverage:**
- At least one scenario per primary story per persona in scope
- At least one archetype-specific path per archetype where behavior differs
- At least one error recovery scenario per form/submit interaction
- At least one permission boundary scenario if RBAC is in scope
- At least one empty state scenario (first-time user, no data yet)

Write to `design/11_RESEARCH/scenario-scripts.md`.

---

## Workflow — Phase B: Synthesis

### Step 0 — Confirm accumulation

Check `_research-log.md` for last synthesis run date. Confirm new research output exists since then. If not, exit. Report: sessions available, participants, scenarios covered.

### Step 1 — Read all research output

Session notes, recordings, survey results, field observations. Cross-reference against scenario scripts — which tasks succeeded, which failed, which produced unexpected behavior.

### Step 2 — Document findings (RF-NNN)

For each distinct behavioral pattern or usability issue:

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

### Step 3 — Write persona increment flags

For each persona whose model is challenged, confirmed, or extended:

```markdown
## Increment flag — [Persona name] — [Date]
Mode: design-research Phase B
Confidence change: up | down | gap revealed
Evidence: RF-NNN — [brief summary]
Recommended action: [what user-models should update — confidence level, behavioral note, assumption revision]
Status: pending
```

Write to `design/11_RESEARCH/_increment-flags/user-models-[YYYYMMDD].md`.

### Step 4 — Write story increment flags

For each finding that reveals a story gap, failed assumption, or deprioritization candidate:

```markdown
## Increment flag — [Story ID or gap label] — [Date]
Mode: design-research Phase B
Type: gap | assumption-change | deprioritize-candidate
Evidence: RF-NNN — [brief summary]
Recommended action: [what the stories mode should update]
Status: pending
```

Write to `design/11_RESEARCH/_increment-flags/stories-[YYYYMMDD].md`.

### Step 5 — Write governance input

Prepare behavioral evidence for governance Phase B:

```markdown
## Research → Governance Input — [Date]

### Behavioral patterns (3+ participants)
- [Pattern description] — RF-NNN, RF-NNN, RF-NNN

### Contradictions to current model
- [Description] — affects [persona/story/assumption]

### Conventions observed in user behavior
- [Description] — [frequency, context]
```

Write to `design/11_RESEARCH/governance-input-[YYYYMMDD].md`. Governance decides whether patterns here qualify as design principles — design-research never makes that call.

### Step 6 — Update the research log

Append to `design/11_RESEARCH/_research-log.md`:

```markdown
## Research synthesis — [Date]

**Sessions synthesized:** [N]
**Findings documented:** RF-[first] through RF-[last]
**Personas assessed:** [list]
**Increment flags written:** user-models ([N] flags), stories ([N] flags)
**Governance input written:** governance-input-[date].md
```

---

## Output checklist

### Phase A
- [ ] `design/11_RESEARCH/test-plan.md` — template copied, participant criteria + task list + thresholds filled [hybrid template]
- [ ] `design/11_RESEARCH/scenario-scripts.md` — SCN-NNN scenarios with persona context, story refs, and edge cases [synthesis]

### Phase B
- [ ] `design/11_RESEARCH/research-findings.md` — RF-NNN findings with severity, evidence, and implications [synthesis]
- [ ] `design/11_RESEARCH/_increment-flags/user-models-[date].md` — per-persona confidence and behavioral flags [synthesis]
- [ ] `design/11_RESEARCH/_increment-flags/stories-[date].md` — story gap and assumption-change flags [synthesis]
- [ ] `design/11_RESEARCH/governance-input-[date].md` — behavioral evidence stream for governance Phase B [synthesis]
- [ ] `design/11_RESEARCH/_research-log.md` — run record updated [synthesis]

---

## Rules

- design-research writes findings and increment flags. It never writes principles. Only governance Phase B codifies conventions as GP-NNN design principles.
- Phase B requires actual research output. Do not synthesize without evidence — check the research log.
- Increment flags are delivered to the mode owner. They decide whether to apply the flag.
- Scenario scripts use persona context and mock data — not abstract instructions. "Click submit" is not a scenario. "You've finished your report — submit it for review" is.
- RF-NNN IDs are stable and never reused. Retired findings retain their ID with a `[RETIRED]` marker.
- Every Phase B run must produce a governance-input file, even if it contains no codifiable patterns. The absence of patterns is also evidence.
- design-research does NOT produce or update `design-principles.md`. Ever.
