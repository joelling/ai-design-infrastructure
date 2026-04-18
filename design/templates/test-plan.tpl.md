<!-- artifact: design/11_RESEARCH/test-plan.md | version: 1 | mode: design-research | updated: [DATE] -->

# Usability Test Plan

## Objectives

What specific questions does this research answer?

1. [Can users in the [persona] role complete [primary task] without assistance?]
2. [Do users understand [concept or label] correctly?]
3. [What is the error rate on [specific interaction]?]

<!-- PROJECT-SPECIFIC: Replace example objectives with research questions from design brief and story map -->

---

## Participant criteria

<!-- PROJECT-SPECIFIC: Define based on in-scope personas and archetypes from design/02_USER_MODELS/ -->

| Criteria | Requirement |
|---|---|
| Role | [from persona definition] |
| Domain experience | [novice / experienced / expert] |
| Archetype match | [from behavioral-archetypes.md] |
| Prior product exposure | [first-time / returning] |
| Minimum sample | 5 per archetype in scope |

---

## Method

| Parameter | Selection |
|---|---|
| Format | Moderated / Unmoderated |
| Modality | Remote / In-person |
| Protocol | Think-aloud: Yes / No |
| Session length | [N] minutes (intro + tasks + debrief) |
| Tool | [Figma prototype / live system] |

---

## Task list

<!-- PROJECT-SPECIFIC: Reference SCN-NNN IDs from design/11_RESEARCH/scenario-scripts.md -->

| # | Scenario | Story reference | Archetype |
|---|---|---|---|
| 1 | SCN-001 | DS-NNN | [archetype] |
| 2 | SCN-002 | DS-NNN | [archetype] |
| E1 | SCN-E01 (error recovery) | DS-NNN | [archetype] |

---

## Metrics

### Per-task metrics

| Metric | Method | Target |
|---|---|---|
| Task completion rate | Pass / Fail | ≥ [N]% |
| Time on task | Seconds to completion | ≤ [N]s |
| Error count | Wrong actions before completion | ≤ [N] |
| Post-task satisfaction | 5-point Likert | ≥ [N] / 5 |

### Global metrics

| Metric | Method | Target |
|---|---|---|
| System Usability Scale (SUS) | 10-item questionnaire | ≥ 68 (industry average) |
| NPS (if applicable) | "Likely to recommend?" 0–10 | [target] |

### SUS scoring reference

| Score | Grade |
|---|---|
| ≥ 85 | Excellent |
| 72–84 | Good |
| 68–71 | Acceptable |
| 51–67 | Poor |
| < 51 | Failing |

---

## Analysis plan

<!-- PROJECT-SPECIFIC: Define thresholds and review process for this project -->

**Categorization:** Findings grouped by severity and mapped to SCN-NNN scenario scripts.

**Redesign threshold:** [e.g., "Any task with < 70% completion rate" or "SUS < 68"]

**Review process:** [Who reviews, format, timeline]

**Increment flags:** Findings challenging persona assumptions or revealing story gaps → flagged in `design-research` Phase B synthesis.
