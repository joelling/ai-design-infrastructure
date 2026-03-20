# Chapter 00 — Skill Architecture Principles

> When should a process chapter map to one skill or many? These seven principles govern skill granularity decisions across the design process.

---

## The seven principles

### P1 — External Tool Boundary

**Split when sub-steps talk to different external systems.**

Each external system (Figma plugin SDK, browser preview, REST API) has distinct failure modes, authentication, and retry logic. Isolating them into separate skills prevents one system's instability from blocking another.

*Example:* `figma-connect` (connection management) is separate from `figma-tokens` (variable CRUD) because they use different API surfaces and fail independently.

### P2 — Independent Re-invocation

**Split when a designer routinely re-runs step N without re-running steps 1 through N-1.**

If a step is frequently called on its own — as a spot check, a cleanup pass, or a late-stage addition — it should be independently invocable without loading the full pipeline context.

*Example:* `figma-audit` runs on demand before library migration. It doesn't require re-running file setup, tokens, or component creation.

### P3 — Hard Data Dependency Gate

**Split when step B literally cannot execute until step A's output exists as a stored artifact.**

If intermediate outputs must be persisted (as files on disk or nodes in Figma) before the next step can reference them, the boundary between those steps is a natural skill boundary. Conversely, if intermediate products are in-memory within a single session, keep them together.

*Example:* Tokens must exist as Figma variables before components can bind to them — hence `figma-tokens` before `figma-component`. But within `design-discovery`, the three intake tiers (clean → synthesize → assemble) flow within one session.

### P4 — Context Window Budget

**Split when a skill would exceed ~400 lines of meaningful, non-repetitive instruction.**

Each skill's SKILL.md loads into the AI context when invoked. Oversized skills dilute focus and risk the AI losing track of critical rules buried in the middle. If a skill approaches 400 lines, evaluate whether it contains genuinely distinct responsibilities that could be separated.

*Current state:* The largest skill is `design-discovery` at ~290 lines. All skills are within budget.

### P5 — Artifact Coherence

**Keep together when outputs form a single logical deliverable.**

If a skill produces one document (even multi-section), or a set of tightly coupled artifacts that are always consumed together by downstream skills, it should remain one skill. Split only when outputs are independent deliverables consumed by different skills at different times.

*Example:* `design-visual` produces one `visual-language.md` covering color, typography, spacing, and iconography rationale. These sections are consumed together by `figma-tokens`. Splitting them would fragment a cohesive artifact.

### P6 — Failure Blast Radius

**Split when early steps produce durable artifacts that survive later-step failures.**

If steps 1-2 produce persisted artifacts and step 3 failing does not invalidate them, splitting at the boundary protects completed work. If the entire sequence is atomic (failure anywhere invalidates everything), keep it together.

*Example:* A failed `figma-component` call doesn't invalidate the token system created by `figma-tokens`. The tokens are durable. But within `design-stories`, a failed release-slicing step means the backbone and walking skeleton may need revision — the sequence is more atomic.

### P7 — Distinct Timing or Trigger

**Split when sub-steps happen at different project phases or are triggered by different events.**

If one sub-step runs "at the start of every session" and another runs "once during library migration," they belong in separate skills even if they operate on the same system.

*Example:* `figma-connect` runs every session. `figma-library-mode` runs once during migration. Same Figma system, different lifecycle moments.

---

## Decision flowchart

```
Does the step use a different external system? ──YES──► Split (P1)
                     │ NO
Is it routinely re-invoked independently? ──YES──► Split (P2)
                     │ NO
Does it require a persisted artifact gate? ──YES──► Split (P3)
                     │ NO
Would the combined skill exceed ~400 lines? ──YES──► Split (P4)
                     │ NO
Are outputs consumed independently by different skills? ──YES──► Split (P5)
                     │ NO
Do early steps produce durable artifacts? ──YES──► Split (P6)
                     │ NO
Do sub-steps happen at different project phases? ──YES──► Split (P7)
                     │ NO
Keep as one skill.
```

---

## Current assessment

| Chapter | Skills | Principles triggered | Verdict |
|---------|--------|---------------------|---------|
| 01-11, 14 (design-*) | 1 each | None triggered | Correctly single-skill |
| 13 (Figma pipeline) | 8 skills | P1, P2, P3, P6, P7 | Correctly multi-skill |

### Watch list

| Skill | Condition for split | Principle |
|-------|-------------------|-----------|
| `design-validation` | If pre-build and post-build phases diverge enough to need independent invocation | P2, P7 |
| `design-prototype` | If drift-sync logic becomes complex enough for independent re-invocation | P2, P6 |

### Anti-patterns

- **Don't split for size alone.** A 350-line skill with cohesive content is better than two 175-line skills that fragment a workflow.
- **Don't merge for proximity.** Two skills that operate on the same system but at different lifecycle phases (P7) should stay separate.
- **Don't create one-shot utility skills.** If a step only runs once and is always part of a larger sequence, it doesn't need its own skill.
