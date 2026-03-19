# Chapter 2: User Models

> **Tier 1 — Discovery** | Mode: `design-user-models`

## Why this matters

Personas, empathy maps, and jobs-to-be-done transform abstract "user roles" into concrete people with goals, frustrations, and contexts. Without them, designers optimize for an imaginary average user who doesn't exist. Every design decision should be answerable with: "This serves [persona]'s need to [goal] in the context of [situation]."

## The mental model

You are building empathy artifacts. The goal is to internalize who each user is deeply enough that when you're designing an interaction three chapters from now, you instinctively know: "Dr. Martinez would find this confusing because she's under time pressure and multitasking."

Think in three layers:
- **Persona** = who they are (demographics, goals, frustrations, context of use)
- **Empathy map** = what they think, feel, say, and do (internal experience)
- **JTBD** = what they're trying to accomplish (functional, emotional, social jobs)

## Inputs

- `design/discovery/stakeholder-map.md` — identifies who needs personas
- `design/discovery/design-brief.md` — provides problem context
- Spec user stories — ground personas in documented needs, not imagination

If discovery hasn't been done, warn and proceed with available context.

## Process

**1. Identify distinct user roles.** A role is distinct if it has different goals, permissions, usage frequency, or domain expertise. Don't over-segment — 3-5 personas is usually enough. More than that and they stop being memorable.

**2. Build personas.** For each primary role, document: demographics (title, organization, experience, usage frequency), goals (primary through tertiary), frustrations (what slows them down, causes errors, requires workarounds), context of use (environment, time pressure, multitasking, data sensitivity), key behaviors (how they currently accomplish their goals), and a representative quote that captures their mindset.

**3. Create empathy maps.** For each primary persona, map what they think, feel, say, and do. This surfaces the emotional dimension that personas alone miss. What's their internal monologue during key tasks? Are they confident or anxious? What do they complain about to colleagues?

**4. Build the jobs-to-be-done matrix.** Map functional jobs (tasks they need to accomplish), emotional jobs (how they want to feel), and social jobs (how they want to be perceived). Use the format: "When [situation], I want to [motivation], so I can [outcome]."

**5. Document edge cases.** Users who hold multiple roles simultaneously, new users vs. power users, users with accessibility needs, users in unusual contexts (field use, emergency situations). These edge cases often reveal the most important design constraints.

## Outputs

| File | What it contains |
|------|-----------------|
| `design/user-models/personas/[role-name].md` | One per primary user role (minimum 2) |
| `design/user-models/empathy-maps/[role-name]-empathy.md` | One per primary persona |
| `design/user-models/jtbd.md` | Complete JTBD matrix + edge cases |

## Rules

- Personas must be grounded in spec data, not invented from imagination. Every goal and frustration should trace to a documented need.
- Avoid stereotyping. Personas represent role archetypes, not demographic stereotypes.
- JTBD statements use the format: "When [situation], I want to [motivation], so I can [outcome]."
- Keep personas concise — one page each. Detail goes into empathy maps.
- Update personas when new information emerges in later modes.

## Feeds into

- **[Journey Mapping](03-journeys.md)** — journeys are persona-specific
- **[Story Mapping](04-stories.md)** — stories reference personas
- **[Content Strategy](08-content.md)** — content adapts to audience expertise
- **[Visual Design](07-visual.md)** — user context affects density and complexity decisions
- **[Canvas Briefs](12-canvas.md)** — each screen identifies its primary persona
