---
name: design-user-models
description: >
  Creates detailed user representations — personas, empathy maps, jobs-to-be-done, and
  behavioral archetypes — to drive empathy-informed design decisions. Use this skill when
  you need to understand who the users are, what they care about, what drives their behavior,
  or how they behave under constraint. Triggers on: "personas", "empathy map", "user models",
  "jobs to be done", "JTBD", "who are the users", "user profiles", "user needs", "user goals",
  "behavioral archetypes", "behavioral dimensions", "tension mapping", "archetype matrix",
  or when any design decision requires understanding the user's perspective. Upstream
  dependency: design-discovery.
---

# User Models — Personas, Empathy Maps & JTBD

## Purpose

Build detailed representations of each user type so that every downstream design decision can be validated against real user needs, not assumptions. Personas answer "who"; empathy maps answer "what do they think and feel"; JTBD answers "what are they trying to accomplish"; behavioral archetypes answer "how do they behave under constraint" — revealing cross-role behavioral patterns derived from tension dimensions.

---

## Dependency check

**Soft dependencies** (warn if missing, don't block):
- `design/01-discovery/stakeholder-map.md` — identifies who the users are
- `design/01-discovery/design-brief.md` — provides problem context

---

## Upstream sync (step 0)

Before starting this mode's workflow:

1. Check `design/user-models/_upstream.md` for the dependency manifest
2. Compare recorded upstream versions against current artifact files
3. If upstream has changed, report what changed (additive / corrective / structural) and ask the designer: re-process or proceed?
4. If re-processing, update incrementally — process the delta, don't rebuild from scratch

After completing this mode's workflow:

1. Add or increment `<!-- artifact: ... -->` version headers on all changed output files
2. Update `design/user-models/_upstream.md` with consumed and produced artifact versions
3. Report which downstream modes are now potentially stale

### Script commands
```bash
# On entry — check staleness:
node design/scripts/sync-status.js

# After completing — version and manifest:
node design/scripts/sync-version.js init <file> design-user-models   # first time
node design/scripts/sync-version.js bump <file>                      # subsequent updates
node design/scripts/sync-manifest.js user-models                     # update manifest
```

---

## Progressive confidence

User models carry a confidence tier reflecting evidence strength:

| Tier | Evidence base |
|---|---|
| **Hypothetical** | No discovery — project brief or domain knowledge only |
| **Evidence-thin** | Partial discovery (1 interview, no quant) |
| **Evidence-grounded** | Full discovery synthesis (qual + quant + docs) |
| **Validated** | Post-validation feedback incorporated |

Each persona and behavioral archetype carries: confidence tier, evidence base, evidence gaps, evolution log.

---

## Incremental updates

When re-invoked with new upstream data, do NOT rebuild from scratch:
1. Detect delta — what's new/changed in upstream
2. Process delta — extract signals from changed artifacts only
3. Revise affected models — update impacted personas/empathy maps/JTBDs
4. Re-evaluate dimensions — check whether existing behavioral dimensions still hold; new data may shift poles, add dimensions, or redistribute participants across archetypes
5. Promote confidence — if new evidence strengthens a model, promote its tier
6. Log evolution — add revision entry to each updated model's evolution log
7. Update manifest — record new upstream versions

---

## Workflow

### Step 1 — Identify distinct user roles

From the stakeholder map and spec user stories, list every distinct user role. A role is distinct if it has different:
- Goals (what they're trying to achieve)
- Permissions (what they can see/do)
- Frequency of use (daily vs. occasional)
- Domain expertise (clinical vs. administrative)

### Step 2 — Build personas

For each primary user role, create a persona document:

```markdown
## [Persona Name] — [Role Title]

### Demographics
- Role: [formal title]
- Organization: [where they sit]
- Experience: [years in role, tech comfort level]
- Frequency: [how often they use this system]

### Goals
1. [Primary goal — the #1 thing they need from this system]
2. [Secondary goal]
3. [Tertiary goal]

### Frustrations
1. [What slows them down today]
2. [What causes errors]
3. [What they work around]

### Context of use
- Environment: [where they use the system — office, field, mobile?]
- Time pressure: [high/medium/low — how rushed are they?]
- Multitasking: [are they doing other things simultaneously?]
- Data sensitivity: [how careful must they be with information?]

### Key behaviors
- [How they currently accomplish their goals]
- [Workarounds they've developed]
- [Information they look for first]

### Quote (fictional but representative)
> "[A sentence that captures their mindset]"
```

Write each to `design/02-user-models/personas/[role-name].md`.

### Step 3 — Create empathy maps

For each primary persona, create an empathy map:

```markdown
## Empathy Map — [Persona Name]

### Thinks
- [Internal thoughts during key tasks]

### Feels
- [Emotional state — confident? anxious? bored? pressured?]

### Says
- [What they say to colleagues about the system/process]

### Does
- [Observable actions and behaviors]

### Pain points
- [Specific frustrations mapped to system touchpoints]

### Gains
- [What would delight them or make their job easier]
```

Write each to `design/02-user-models/empathy-maps/[role-name]-empathy.md`.

### Step 4 — Jobs-to-be-done matrix

Create a JTBD matrix covering all personas:

```markdown
## Jobs-to-be-Done Matrix

### Functional jobs (tasks they need to accomplish)
| Job statement | Persona(s) | Current solution | Desired outcome |
|--------------|------------|-----------------|-----------------|

### Emotional jobs (how they want to feel)
| Job statement | Persona(s) | Current feeling | Desired feeling |
|--------------|------------|----------------|-----------------|

### Social jobs (how they want to be perceived)
| Job statement | Persona(s) | Current perception | Desired perception |
|--------------|------------|-------------------|-------------------|
```

Write to `design/02-user-models/jtbd.md`.

### Step 5 — Map behavioral dimensions

From discovery synthesis (qualitative pain signals, behavioral patterns, contextual observations), identify 2–5 sets of opposing tensions that produce different design implications at each pole. Each dimension is an axis — e.g., "Physical environment ↔ Platform/system" or "Information gap ↔ Process friction."

For each dimension, document:
- The two poles (tensions)
- Evidence from discovery supporting this dimension
- Why this tension matters for design decisions (what changes at each pole)

Discard any dimension where both poles lead to the same design response. More than 5 dimensions dilutes focus — prioritize by design impact.

Write to `design/02-user-models/behavioral-dimensions.md`:

```markdown
## Behavioral Dimensions

### Dimension 1: [Pole A] ↔ [Pole B]
**Evidence:** [discovery sources]
**Design relevance:** [what changes at each pole — e.g., "Pole A users need offline-first; Pole B users need batch operations"]

### Dimension 2: [Pole A] ↔ [Pole B]
...
```

### Step 6 — Derive behavioral archetypes

Plot research participants or evidence clusters onto the dimension space. Name the clusters that emerge at intersections. Not every intersection will have occupants — only name clusters backed by evidence.

Each archetype gets:

```markdown
## [Archetype Name] — e.g., "The Wayfinder"
**Description:** [one-line behavioral description]
**Dimension coordinates:** [which quadrant/intersection it occupies]
**Participants/evidence:** [who maps here]
**Persona cross-reference:** [which personas appear in this archetype — many-to-many]
**Design implications:** [what this archetype needs that others don't]
**Confidence:** [tier, same as personas]
```

Write to `design/02-user-models/behavioral-archetypes.md`.

With 2 dimensions you get up to 4 archetypes; with 3 you get up to 8. Only codify those with real participants.

### Step 7 — Edge cases & composite users

Document edge-case users who don't fit neatly into primary personas:
- Users who hold multiple roles simultaneously
- New users vs. power users of the same role
- Users with accessibility needs
- Users in unusual contexts (field use, emergency situations)
- Participants who sit between archetype clusters or whose archetype shifts by context

Add these as a section at the bottom of `jtbd.md` or as separate lightweight persona files.

---

## Output checklist

- [ ] `design/02-user-models/personas/[role].md` — one per primary user role (minimum 2)
- [ ] `design/02-user-models/empathy-maps/[role]-empathy.md` — one per primary persona
- [ ] `design/02-user-models/jtbd.md` — complete JTBD matrix + edge cases
- [ ] `design/02-user-models/behavioral-dimensions.md` — 2–5 tension axes with poles, evidence, and design relevance
- [ ] `design/02-user-models/behavioral-archetypes.md` — named archetypes with dimension coordinates, participant mapping, persona cross-reference, and design implications

---

## Rules

- Personas must be grounded in discovery artifacts and designer-provided context, not invented from imagination. Every goal and frustration should trace to a stakeholder need or design brief finding.
- Avoid stereotyping. Personas represent role archetypes, not demographic stereotypes.
- JTBD statements use the format: "When [situation], I want to [motivation], so I can [outcome]."
- Keep personas concise — one page each. Detail goes into empathy maps.
- Update personas when new information emerges in later design modes.
- Behavioral archetypes are evidence-derived, not invented. Each dimension must produce different design implications at each pole.
- Archetypes complement personas, not replace them. Personas represent roles; archetypes represent cross-role behavioral patterns.
- Cap behavioral dimensions at 5. If more emerge, prioritize by design impact.
- Do not force 1:1 mapping between archetypes and personas. The relationship is many-to-many.
