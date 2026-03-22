# Chapter 2: User Models

> **Tier 1 — Discovery** | Mode: `design-user-models`

## Why this matters

Personas, empathy maps, and jobs-to-be-done transform abstract "user roles" into concrete people with goals, frustrations, and contexts. Without them, designers optimize for an imaginary average user who doesn't exist. Every design decision should be answerable with: "This serves [persona]'s need to [goal] in the context of [situation]."

User models are **living artifacts** — they start as hypotheses and evolve as evidence accumulates. A persona built from a project brief alone is still useful; it just carries lower confidence than one grounded in three interviews and survey data. The goal is progressive refinement, not perfection-at-first-pass.

## The mental model

You are building empathy artifacts. The goal is to internalize who each user is deeply enough that when you're designing an interaction three chapters from now, you instinctively know: "Dr. Martinez would find this confusing because she's under time pressure and multitasking."

Think in four layers:
- **Persona** = who they are (demographics, goals, frustrations, context of use)
- **Empathy map** = what they think, feel, say, and do (internal experience)
- **JTBD** = what they're trying to accomplish (functional, emotional, social jobs)
- **Behavioral archetype** = how they behave under constraint (cross-role clusters derived from tension dimensions)

And one meta-layer:
- **Confidence** = how much evidence supports each model (see confidence tiers below) — applies to behavioral archetypes too

## Inputs

- `design/discovery/stakeholder-map.md` — identifies who needs personas
- `design/discovery/qualitative-synthesis.md` — evidence base for grounding personas in real user data (pain signals, goals, mental models)
- `design/discovery/quantitative-synthesis.md` — behavioral patterns and metrics that inform usage frequency and context of use
- `design/discovery/design-brief.md` — provides problem context
- Spec user stories — ground personas in documented needs, not imagination

Not all inputs may be available. See **Progressive confidence model** for how to proceed at different evidence levels.

## Upstream sync

**On entry:** Before starting this mode's process, check `design/user-models/_upstream.md` (if it exists). Compare recorded upstream artifact versions against current files. If upstream has changed since last run:

1. Report what changed and classify severity:
   - **Additive** — new artifacts exist upstream that weren't consumed (e.g., new interview cleaned)
   - **Corrective** — existing upstream artifacts were revised (e.g., pain signal updated)
   - **Structural** — upstream fundamentals shifted (e.g., new user role discovered, problem reframed)
2. Ask the designer: re-process with new data, or proceed with current outputs?
3. If re-processing, follow the **Incremental update process** (process the delta, not a full rebuild)

**On completion:** After producing or updating artifacts:

1. Increment artifact version headers on all changed files
2. Update `design/user-models/_upstream.md` with consumed artifact versions
3. Report which downstream modes are now potentially stale (journeys, stories, content, visual, canvas)

## Progressive confidence model

User models carry an explicit confidence tier based on the evidence behind them. Confidence determines how much weight downstream modes should place on the model and how aggressively it should be revised when new evidence arrives.

| Tier | Evidence base | How the model is built |
|---|---|---|
| **Hypothetical** | No discovery artifacts — only project brief, domain knowledge, or designer intuition | Clearly labeled as assumed. Every claim flagged for validation. Treat as a starting hypothesis, not a fact. |
| **Evidence-thin** | Partial discovery (e.g., 1 interview, no quantitative data) | Built on available evidence, with gaps explicitly noted per persona. Useful for direction, not for final decisions. |
| **Evidence-grounded** | Full discovery synthesis available (qualitative + quantitative + documents) | Grounded in cross-referenced data. Goals, frustrations, and behaviors are triangulated across sources. |
| **Validated** | Post-validation feedback incorporated (usability testing, stakeholder review, or real usage data) | Updated after real-world validation. Highest confidence — but still revisable. |

Each persona, empathy map, and JTBD statement carries its confidence tier and evidence trace:

```markdown
## Dr. Martinez — Clinical Reviewer
**Confidence:** Evidence-grounded
**Evidence base:** 3 interviews (I-01, I-03, I-07), survey Q12-Q18, stakeholder map role R-02
**Evidence gaps:** No direct observation data; usage frequency inferred from survey, not analytics
**Last updated:** 2026-03-21 (v3, incorporated interview I-07)
```

## Process

**0. Check upstream sync.** Run the upstream sync check described above. If this is a first run (no manifest exists), note which discovery artifacts are available and which are absent. Proceed at the appropriate confidence tier.

**1. Identify distinct user roles.** A role is distinct if it has different goals, permissions, usage frequency, or domain expertise. Don't over-segment — 3-5 personas is usually enough. More than that and they stop being memorable.

**2. Build personas.** For each primary role, document: demographics (title, organization, experience, usage frequency), goals (primary through tertiary), frustrations (what slows them down, causes errors, requires workarounds), context of use (environment, time pressure, multitasking, data sensitivity), key behaviors (how they currently accomplish their goals), and a representative quote that captures their mindset. Include the confidence tier and evidence trace.

**3. Create empathy maps.** For each primary persona, map what they think, feel, say, and do. This surfaces the emotional dimension that personas alone miss. What's their internal monologue during key tasks? Are they confident or anxious? What do they complain about to colleagues?

**4. Build the jobs-to-be-done matrix.** Map functional jobs (tasks they need to accomplish), emotional jobs (how they want to feel), and social jobs (how they want to be perceived). Use the format: "When [situation], I want to [motivation], so I can [outcome]."

**5. Map behavioral dimensions.** From discovery synthesis (qualitative pain signals, behavioral patterns, contextual observations), identify 2–5 sets of opposing tensions that produce different design implications at each pole. Each dimension is an axis — e.g., "Physical environment ↔ Platform/system" or "Information gap ↔ Process friction." For each dimension, document: the two poles, evidence from discovery, and why this tension matters for design decisions. Discard any dimension where both poles lead to the same design response. More than 5 dimensions dilutes focus — prioritize by design impact.

**6. Derive behavioral archetypes.** Plot research participants or evidence clusters onto the dimension space. Name the clusters that emerge at intersections — e.g., "The Wayfinder" (navigates physical environments by situational awareness), "The Synthesiser" (draws meaning from fragmented organisational signals). Each archetype gets: a name, a one-line behavioral description, the dimension coordinates it occupies, which personas map to it (many-to-many — a persona may appear in multiple archetypes across contexts), and design implications (what this archetype needs that others don't). Not every intersection will have occupants — only name clusters backed by evidence. With 2 dimensions you get up to 4 archetypes; with 3 you get up to 8. Only codify those with real participants.

**7. Document edge cases.** Users who hold multiple roles simultaneously, new users vs. power users, users with accessibility needs, users in unusual contexts (field use, emergency situations). Include archetype edge cases: participants who sit between clusters, or whose archetype shifts by context. These edge cases often reveal the most important design constraints.

**8. Update manifest.** Write or update `design/user-models/_upstream.md` with all consumed artifact paths and versions. Add version headers to all produced/updated output files.

## Incremental update process

When re-invoked after upstream changes, do NOT rebuild from scratch:

1. **Detect delta** — Compare current upstream versions to manifest. Identify what's new or changed.
2. **Process the delta** — Extract new signals from changed artifacts only. Note which personas/models are affected.
3. **Revise affected models** — Update personas, empathy maps, and JTBDs that are impacted by new signals. Leave unaffected models unchanged.
4. **Promote confidence** — If new evidence strengthens a hypothetical model, promote it (e.g., hypothetical → evidence-thin, evidence-thin → evidence-grounded).
5. **Re-evaluate dimensions** — Check whether existing behavioral dimensions still hold. New data may shift poles, add dimensions, or redistribute participants across archetypes. Update archetype mappings accordingly.
6. **Log the evolution** — Add a revision entry to each updated model's evolution log (see below).
7. **Update manifest** — Record new upstream versions consumed. Increment version headers on changed outputs.

## Model evolution tracking

User models track how they evolve over time. Each persona file includes an evolution log:

```markdown
### Evolution log
- v1 (2026-03-15): Created from project brief. Hypothetical.
- v2 (2026-03-18): Grounded with interview I-01, I-03. Discovered time pressure is primary frustration (was assumed to be data complexity). Promoted to evidence-thin.
- v3 (2026-03-21): Incorporated I-07 + survey data. Confirmed time pressure. Added multitasking context from survey Q14. Promoted to evidence-grounded.
```

The evolution log serves two purposes:
- **Traceability** — any downstream decision can trace back to when and why a persona changed
- **Learning** — reveals which assumptions were wrong, helping the team calibrate intuition

## Outputs

| File | What it contains |
|------|-----------------|
| `design/user-models/personas/[role-name].md` | One per primary user role (minimum 2), with confidence tier, evidence trace, and evolution log |
| `design/user-models/empathy-maps/[role-name]-empathy.md` | One per primary persona |
| `design/user-models/jtbd.md` | Complete JTBD matrix + edge cases |
| `design/user-models/behavioral-dimensions.md` | 2–5 tension axes with poles, evidence, and design relevance per dimension |
| `design/user-models/behavioral-archetypes.md` | Named archetypes with dimension coordinates, participant mapping, persona cross-reference, and design implications |
| `design/user-models/_upstream.md` | Upstream dependency manifest — consumed and produced artifact versions |

### Artifact version header

Every output file carries a version comment as its first line:

```markdown
<!-- artifact: design/user-models/personas/reviewer.md | version: 3 | mode: design-user-models | updated: 2026-03-21 | evidence: stakeholder-map.md@v2, qualitative-synthesis.md@v3 -->
```

## Rules

- Personas must be grounded in available evidence, not invented from imagination. Every goal and frustration should trace to a documented source. When evidence is absent, label the claim as hypothetical.
- Avoid stereotyping. Personas represent role archetypes, not demographic stereotypes.
- JTBD statements use the format: "When [situation], I want to [motivation], so I can [outcome]."
- Keep personas concise — one page each. Detail goes into empathy maps.
- Every persona carries a confidence tier. Do not present hypothetical models as grounded.
- When re-processing with new data, update incrementally — don't discard prior work unless structurally invalidated.
- The evolution log is mandatory. Every version change is recorded with date, evidence source, and what changed.
- Behavioral archetypes are evidence-derived, not invented. Each dimension must produce different design implications at each pole.
- Archetypes complement personas, not replace them. Personas represent roles; archetypes represent cross-role behavioral patterns.
- Cap behavioral dimensions at 5. If more emerge, prioritize by design impact.
- Do not force 1:1 mapping between archetypes and personas. The relationship is many-to-many.

## Feeds into

- **[Journey Mapping](03-journeys.md)** — journeys are persona-specific
- **[Story Mapping](04-stories.md)** — stories reference personas
- **[Content Strategy](08-content.md)** — content adapts to audience expertise
- **[Interaction Design](06-interaction.md)** — archetype tensions inform state priorities and error strategy
- **[Visual Design](07-visual.md)** — user context and archetype patterns affect density and complexity decisions
- **[Validation](10-validation.md)** — scenario scripts cover archetype-specific paths
- **[Canvas Briefs](12-canvas.md)** — each screen identifies its primary persona and serving archetype(s)
