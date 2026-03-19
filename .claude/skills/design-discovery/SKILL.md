---
name: design-discovery
description: >
  Frames the design problem space by synthesizing spec documents, stakeholder landscape,
  competitive/analogous systems, and domain terminology into a design brief. Use this skill
  at the start of any design process, or when entering a new project domain. Triggers on:
  "discovery", "design brief", "stakeholder map", "competitive analysis", "problem framing",
  "start design process", "understand the problem", "design principles", "domain glossary",
  or when beginning upstream design work for a new spec. This is the first design mode —
  everything else builds on its outputs.
---

# Discovery — Problem Framing & Design Brief

## Purpose

Translate engineering specs and project context into a design-oriented problem frame. The output is a **design brief** that serves as the north star for all downstream design modes, plus supporting artifacts (stakeholder map, competitive analysis, domain glossary).

---

## Dependency check

**Requires:** Project context from the designer or team. This may include:
- A project brief or problem statement
- Existing research, user interviews, or domain documentation
- Stakeholder knowledge and constraints

If no documentation exists, **warn** the user and ask them to describe the project context verbally — proceed by capturing what they provide.

---

## Workflow

### Step 1 — Read & absorb

Review all available project context provided by the team. Extract:
- Problem statement (what's broken or missing today?)
- User roles mentioned (who interacts with the system?)
- Domain constraints (regulatory, compliance, security, organizational)
- Technical boundaries (what's in scope, what's out)
- Success criteria (how do stakeholders measure success?)

### Step 2 — Stakeholder map

Identify every actor in the system and map them:

```markdown
## Stakeholder Map

### Primary users (interact daily)
| Role | Goal | Pain point | Influence |
|------|------|------------|-----------|

### Secondary users (interact occasionally)
| Role | Goal | Pain point | Influence |
|------|------|------------|-----------|

### Stakeholders (don't use the system, but shape it)
| Role | Interest | Decision authority |
|------|----------|-------------------|
```

Write to `design/discovery/stakeholder-map.md`.

### Step 3 — Competitive / analogous analysis

Research analogous systems — not direct competitors, but systems solving similar problems in similar domains. For each:
- What they do well (design patterns worth adopting)
- What they do poorly (pitfalls to avoid)
- Key UI/UX patterns observed

Focus on: information density, data hierarchy, role-based access patterns, clinical/military dashboard patterns.

Write to `design/discovery/competitive-analysis.md`.

### Step 4 — Domain glossary

Extract all domain-specific terms from the spec and define them in plain language as they affect design decisions. For each term:
- Full name and abbreviation
- Plain-language definition
- How it manifests in the UI (does the user see this term? is it hidden?)
- Role-specific display rules (who sees what level of detail?)

Write to `design/discovery/domain-glossary.md`.

### Step 5 — Design brief

Synthesize everything into the master design brief:

```markdown
## Design Brief — [Project Name]

### Problem statement
[1-2 paragraphs: what problem does this solve for users?]

### Design principles
[3-5 principles that will guide all design decisions. Derived from domain constraints,
user needs, and project values. Each principle should be actionable and testable.]

### Constraints
- Regulatory: [list]
- Technical: [list]
- Organizational: [list]
- Accessibility: [list]

### Users (summary)
[Brief summary of who uses this, pointing to full stakeholder map]

### Success metrics
[How will we know the design is working? Measurable outcomes.]

### Scope boundaries
[What are we designing? What are we NOT designing?]
```

Write to `design/discovery/design-brief.md`.

---

## Output checklist

- [ ] `design/discovery/stakeholder-map.md` — all actors mapped with goals and pain points
- [ ] `design/discovery/competitive-analysis.md` — 3+ analogous systems analyzed
- [ ] `design/discovery/domain-glossary.md` — all domain terms defined with UI implications
- [ ] `design/discovery/design-brief.md` — problem statement, principles, constraints, success metrics

---

## Rules

- Discovery is **observation and synthesis**, not solution design. Do not propose UI solutions here.
- Design principles must be specific to this project, not generic ("be user-friendly" is not a principle; "surface PES status within 2 seconds of screen load" is).
- The domain glossary is a living document — update it whenever new terms are encountered in later modes.
- If the spec is incomplete, note gaps explicitly in the design brief rather than guessing.
