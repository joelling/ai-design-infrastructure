---
name: design-user-models
description: >
  Creates detailed user representations — personas, empathy maps, and jobs-to-be-done —
  to drive empathy-informed design decisions. Use this skill when you need to understand
  who the users are, what they care about, and what drives their behavior. Triggers on:
  "personas", "empathy map", "user models", "jobs to be done", "JTBD", "who are the users",
  "user profiles", "user needs", "user goals", or when any design decision requires
  understanding the user's perspective. Upstream dependency: design-discovery.
---

# User Models — Personas, Empathy Maps & JTBD

## Purpose

Build detailed representations of each user type so that every downstream design decision can be validated against real user needs, not assumptions. Personas answer "who"; empathy maps answer "what do they think and feel"; JTBD answers "what are they trying to accomplish."

---

## Dependency check

**Soft dependencies** (warn if missing, don't block):
- `design/discovery/stakeholder-map.md` — identifies who the users are
- `design/discovery/design-brief.md` — provides problem context

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

Write each to `design/user-models/personas/[role-name].md`.

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

Write each to `design/user-models/empathy-maps/[role-name]-empathy.md`.

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

Write to `design/user-models/jtbd.md`.

### Step 5 — Edge cases & composite users

Document edge-case users who don't fit neatly into primary personas:
- Users who hold multiple roles simultaneously
- New users vs. power users of the same role
- Users with accessibility needs
- Users in unusual contexts (field use, emergency situations)

Add these as a section at the bottom of `jtbd.md` or as separate lightweight persona files.

---

## Output checklist

- [ ] `design/user-models/personas/[role].md` — one per primary user role (minimum 2)
- [ ] `design/user-models/empathy-maps/[role]-empathy.md` — one per primary persona
- [ ] `design/user-models/jtbd.md` — complete JTBD matrix + edge cases

---

## Rules

- Personas must be grounded in discovery artifacts and designer-provided context, not invented from imagination. Every goal and frustration should trace to a stakeholder need or design brief finding.
- Avoid stereotyping. Personas represent role archetypes, not demographic stereotypes.
- JTBD statements use the format: "When [situation], I want to [motivation], so I can [outcome]."
- Keep personas concise — one page each. Detail goes into empathy maps.
- Update personas when new information emerges in later design modes.
