# Design Discovery

> **Tier 1 — Discovery** | Mode: `design-discovery`

## Why this matters

Every design decision downstream is shaped by how well you understand the problem space. Without discovery, designers make assumptions about who the users are, what constraints exist, and what success looks like. Those assumptions compound — a misunderstood constraint in discovery becomes a broken interaction model in Tier 3 and a redesigned screen in Figma.

Discovery is not about generating solutions. It is about processing raw inputs into structured knowledge — so that everything downstream is built on evidence, not guesswork.

## The mental model

Think of yourself as a signal processor, not a journalist. Raw inputs arrive in many formats and qualities: a Teams call transcript, a handwritten interview note, a regulatory PDF, a survey CSV. Your job is not to read and summarize — it is to classify each input, extract signals, synthesize by type, and then assemble cross-type project context.

Three tiers:
1. **Per-input cleaning** — each raw file is individually structured into a consistent artifact
2. **Per-type synthesis** — cleaned inputs of the same type are aggregated into a unified view
3. **Cross-type assembly** — signals from all types are combined to build the project context artifacts

The same extraction logic applies to every input, regardless of format. A Teams transcript and a handwritten note are processed identically — the format is noise; the signals are what matter.

## Inputs

Three categories of inputs. If a category is absent (e.g. no quantitative data provided), note the gap explicitly in the design brief as an evidence limitation.

| Category | Examples |
|----------|----------|
| **Qualitative research** | Interview transcripts (Teams exports, handwritten notes, audio transcripts), focus group notes, usability test observations, field notes, diary study entries |
| **Quantitative research** | Survey results, analytics reports, usage metrics, NPS scores, A/B test data, heatmaps |
| **Project / client documents** | Project briefs, BRDs, technical specs, regulatory docs, meeting notes, org charts, OKR/KPI docs, existing system audits, brand guidelines, RFPs |

## Extraction radar

Regardless of input type, the mode is always looking for these signal types and routing each one to the correct output:

| Signal type | Example | Routes to |
|-------------|---------|-----------|
| **People / roles** | "the compliance officer approves all changes" | Stakeholder map |
| **Pain signals** | "we always have to work around this", "it's broken when…" | Qualitative synthesis |
| **Goals / intentions** | "I need to", "so that I can", "the goal is" | Qualitative synthesis |
| **Behavioral observations** | what they do vs. what they say | Qualitative synthesis |
| **Numeric patterns** | completion rates, drop-off percentages, NPS | Quantitative synthesis |
| **Terminology / jargon** | domain-specific words, abbreviations | Domain glossary |
| **Constraints** | must/must-not, regulatory limits, hard technical boundaries | Design brief — constraints |
| **Success criteria** | "success means", KPIs, acceptance thresholds | Design brief — success metrics |
| **Scope signals** | what's in/out, what exists today, what's being replaced | Design brief — scope |
| **Analogous system references** | "similar to X", competitor mentions | Competitive analysis |
| **Strategic value / commercial drivers** | quantified KPIs, value commitments, ROI claims, commercial outcomes | Value framework |

## Process

**Step 1 — Document inventory.** Catalog everything provided. Classify each input into one of the three categories. Note gaps explicitly — gaps go into the design brief as evidence limitations, not assumptions.

**Step 2 — Per-input cleaning (Tier 1).** Clean and structure each raw input individually into its own artifact under `design/01_DISCOVERY/inputs/[type]/[name].md`. These are intermediate artifacts that feed Tier 2, not final outputs.

*Interview / transcript template:*
```markdown
## [Interview Name] — [Date]
**Participant:** [role/title, anonymized if needed]
**Format:** [Teams transcript / handwritten notes / audio]

### Key moments
| Topic | What was said | Signal type |
|-------|---------------|-------------|
| | | pain / goal / behavior / terminology |

### Direct quotes (verbatim, worth preserving)
- "[quote]"

### Signals extracted
- Pain signals: [list]
- Goals: [list]
- Behaviors observed: [list]
- Terminology: [list]
- People/roles mentioned: [list]
```

*Survey / analytics template:*
```markdown
## [Survey / Report Name] — [Date / sample n=]

### Quantitative summary
| Question / Metric | Result |
|-------------------|--------|

### Qualitative open-text themes
- [Theme]: [description] (n=[count])

### Notable responses
- "[quote]"

### Signals extracted
- Behavioral patterns: [list]
- Pain signals: [list]
- Open questions surfaced: [list]
```

*Project / client document template:*
```markdown
## [Document Name] — [Type: brief / BRD / regulatory / meeting notes / other]

### Extracted signals
- Problem framing: [what the document says the problem is]
- Constraints: [regulatory / technical / org / timeline]
- Success criteria: [how success is measured]
- Scope: [in / out / ambiguous]
- People/roles mentioned: [names, titles, authority level]
- Terminology: [domain terms found]
- Analogous systems mentioned: [list]
```

**Step 3 — Per-type synthesis (Tier 2).** Aggregate across all cleaned inputs of the same type. Tier 2 produces three synthesis files.

*Qualitative synthesis* (`design/01_DISCOVERY/qualitative-synthesis.md`): themes (patterns appearing in 2+ sources, with evidence counts), key quotes (most representative verbatim evidence per theme), consolidated pain signals (de-duplicated), mental models observed (how users conceptualize the domain), open questions (where evidence is absent or conflicting).

*Quantitative synthesis* (`design/01_DISCOVERY/quantitative-synthesis.md`): behavioral patterns (what data shows users actually do), key metrics (headline numbers worth carrying into design), statistical signals (correlations, drop-off points, completion rates), contradictions with qualitative findings (where numbers and words disagree), open questions.

*Document synthesis* (`design/01_DISCOVERY/document-synthesis.md`): unified problem statement (reconciled across documents), consolidated constraints (regulatory / technical / org), agreed success criteria, scope boundaries (in / out / unresolved), contradictions between documents (flagged explicitly). Most useful when 3+ client documents are provided with potentially conflicting framing.

**Step 4 — Cross-type assembly (Tier 3).** Scan ALL cleaned inputs and ALL type syntheses for the relevant signal types and assemble the project context artifacts. These are NOT derived from a single input or type.

- **Stakeholder map** — every person/role signal found anywhere across all tiers. Classify as primary user (daily), secondary user (occasional), or stakeholder (shapes but doesn't use). Document goal, pain point, and influence.
- **Domain glossary** — every terminology signal found across all tiers. For each term: full name, abbreviation, plain-language definition, UI implications (does the user see this? abbreviated? role-dependent?).
- **Value framework** — synthesize all strategic value signals into the vision → driver → lever → metric hierarchy. Produces `design/01_DISCOVERY/value-framework.md`: vision statement, value drivers (structural factors enabling value), value levers (measurable mechanisms), priority ranking, user outcomes by lever, commercial hypothesis, evidence record. This becomes the decision filter for all downstream modes — every design decision should trace to at least one lever.
- **Competitive analysis** — all analogous system references from inputs + web research on similar systems. What they do well, what they do poorly, key patterns.
- **Design brief** — synthesize all constraint, success, and scope signals into: problem statement (1-2 paragraphs), design principles (3-5, project-specific and testable), constraints (regulatory/technical/org/accessibility), users summary, success metrics, scope boundaries. Cross-references `value-framework.md` for quantified value context.

## Downstream sync

Discovery has no upstream modes, but it is the origin of the artifact sync chain. After producing or updating artifacts:

1. Add version headers to all output files (see format below)
2. Write or update `design/01_DISCOVERY/_upstream.md` manifest listing all produced artifacts and their versions
3. Report which downstream modes are now potentially stale — check if `design/02_USER_MODELS/_upstream.md`, `design/08_VISUAL/_upstream.md`, `design/09_CONTENT/_upstream.md`, or any other downstream manifest references prior versions of discovery artifacts
4. Display: "Discovery artifacts updated. Downstream modes now potentially stale: [list]."

When new inputs are added to an existing discovery (e.g., a new interview transcript arrives after initial processing), follow an incremental approach:

1. Process the new input through Tier 1 (per-input cleaning)
2. Update the relevant Tier 2 synthesis (add new signals, don't rebuild from scratch)
3. Update affected Tier 3 artifacts (stakeholder map, glossary, brief) with new signals
4. Increment version headers on all changed files
5. Update the manifest

### Artifact version header

Every output file carries a version comment as its first line:

```markdown
<!-- artifact: design/01_DISCOVERY/stakeholder-map.md | version: 2 | mode: design-discovery | updated: 2026-03-21 -->
```

## Outputs

| File | What it contains | Tier |
|------|-----------------|------|
| `design/01_DISCOVERY/inputs/interviews/[name].md` | One per interview/transcript, cleaned and structured | 1 |
| `design/01_DISCOVERY/inputs/surveys/[name].md` | One per survey/analytics report, cleaned and structured | 1 |
| `design/01_DISCOVERY/inputs/documents/[name].md` | One per project/client document, cleaned | 1 |
| `design/01_DISCOVERY/qualitative-synthesis.md` | Themes, quotes, pain signals, mental models across all qualitative inputs | 2 |
| `design/01_DISCOVERY/quantitative-synthesis.md` | Behavioral patterns, metrics, statistical signals across all quantitative inputs | 2 |
| `design/01_DISCOVERY/document-synthesis.md` | Reconciled problem framing, constraints, success criteria across all client documents | 2 |
| `design/01_DISCOVERY/value-framework.md` | Vision, value drivers, levers, metrics — strategic foundation for all design decisions | 3 |
| `design/01_DISCOVERY/stakeholder-map.md` | All actors assembled cross-type — goals, pain points, decision authority | 3 |
| `design/01_DISCOVERY/domain-glossary.md` | All domain terms assembled cross-type — definitions and UI implications | 3 |
| `design/01_DISCOVERY/competitive-analysis.md` | Analogous systems — patterns and pitfalls | 3 |
| `design/01_DISCOVERY/design-brief.md` | Problem statement, design principles, constraints, success metrics, scope | 3 |
| `design/01_DISCOVERY/_upstream.md` | Produced artifact manifest — versions and downstream consumers | — |

## Rules

- Discovery is signal extraction and synthesis, not solution design. Do not propose UI solutions here.
- Per-input cleaning preserves source provenance. Never skip Tier 1 — clean each input individually before synthesizing.
- Per-type synthesis must note contradictions between inputs of the same type, not just agreements.
- Cross-type assembly (Tier 3) draws signals from ALL input types. Stakeholder map and domain glossary are not derived from a single document.
- Design principles must be specific to this project. "Be user-friendly" is not a principle. "Surface PES status within 2 seconds of screen load" is.
- The domain glossary is a living document — update it whenever new terms emerge in later modes.
- If a category of input is absent, note the gap in the design brief rather than guessing or fabricating evidence.
- Discovery does NOT produce: personas (Ch 2), journey maps (Ch 3), user stories (Ch 4), voice & tone or terminology guide (Ch 8 — domain glossary is the raw source only), visual rationale (Ch 7), heuristic evaluation (Ch 10).

## Feeds into

- **[User Models](02-user-models.md)** — stakeholder map identifies who needs personas; `qualitative-synthesis.md` provides the evidence base for grounding personas in real data
- **[Visual Design](07-visual.md)** — design principles guide visual direction; competitive analysis surfaces analogous patterns
- **[Content Strategy](08-content.md)** — domain glossary is the terminology source of truth
- **All downstream modes** — the design brief is the north star
