# Chapter 1: Design Discovery

> **Tier 1 — Discovery** | Mode: `design-discovery`

## Why this matters

Every design decision downstream is shaped by how well you understand the problem space. Without discovery, designers make assumptions about who the users are, what constraints exist, and what success looks like. Those assumptions compound — a misunderstood constraint in discovery becomes a broken interaction model in Tier 3 and a redesigned screen in Figma.

Discovery is not about generating solutions. It is about absorbing context, mapping the landscape, and articulating the problem clearly enough that solutions can be evaluated against it.

## The mental model

Think of yourself as a journalist entering a new beat. You don't know the domain yet. Your job is to:
- Understand who the players are and what they care about
- Understand what's been tried before and what worked or failed
- Understand the rules of the domain (regulatory, organizational, technical)
- Articulate the problem in a way that everyone agrees on

You are building a **shared understanding**, not a solution.

## Inputs

- Project brief or problem statement provided by the team
- Any existing research, interviews, or domain documentation
- Stakeholder knowledge brought into the session
- Any relevant external references (regulatory docs, technical constraints)

If no prior documentation exists, work from what the designer or team provides verbally and note gaps explicitly in the design brief.

## Process

**1. Read and absorb.** Review all available project context provided by the team. Extract the problem statement, user roles, domain constraints, technical boundaries, and success criteria. Don't skim — the details matter. A regulatory constraint buried in paragraph 12 could reshape the entire navigation model.

**2. Map the stakeholders.** Identify every actor in the system. Distinguish between primary users (interact daily), secondary users (interact occasionally), and stakeholders (don't use it but shape it). For each, document their goal, their pain point, and their influence on design decisions.

**3. Analyze analogous systems.** Research systems solving similar problems in similar domains. Not direct competitors — analogous systems. What do they do well? What do they do poorly? What patterns emerge? Focus on information density, data hierarchy, role-based access patterns, and how they handle complexity.

**4. Build a domain glossary.** Extract every domain-specific term from the specs. Define each in plain language. Note how it should appear in the UI — does the user see this term? Is it abbreviated? Do different roles see different levels of detail? This glossary becomes the canonical reference for all content decisions downstream.

**5. Write the design brief.** Synthesize everything into a single document: problem statement (1-2 paragraphs), design principles (3-5, actionable and testable, specific to this project), constraints (regulatory, technical, organizational, accessibility), user summary, success metrics, and scope boundaries.

## Outputs

| File | What it contains |
|------|-----------------|
| `design/discovery/stakeholder-map.md` | All actors mapped with goals, pain points, and influence |
| `design/discovery/competitive-analysis.md` | 3+ analogous systems analyzed with patterns and pitfalls |
| `design/discovery/domain-glossary.md` | All domain terms with plain-language definitions and UI implications |
| `design/discovery/design-brief.md` | Problem statement, design principles, constraints, success metrics |

## Rules

- Discovery is observation and synthesis, not solution design. Do not propose UI solutions here.
- Design principles must be specific to this project. "Be user-friendly" is not a principle. "Surface PES status within 2 seconds of screen load" is.
- The domain glossary is a living document — update it whenever new terms emerge in later modes.
- If the spec is incomplete, note gaps explicitly in the design brief rather than guessing.

## Feeds into

- **[User Models](02-user-models.md)** — stakeholder map identifies who needs personas
- **[Visual Design](07-visual.md)** — design principles guide visual direction
- **[Content Strategy](08-content.md)** — domain glossary is the terminology source of truth
- **All downstream modes** — the design brief is the north star
