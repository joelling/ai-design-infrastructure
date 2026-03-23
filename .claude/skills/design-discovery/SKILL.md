---
name: design-discovery
description: >
  Processes raw project inputs — interviews, surveys, analytics, briefs, specs, regulatory docs —
  into structured design knowledge using a three-tier intake model: per-input cleaning,
  per-type synthesis, and cross-type project context assembly. Use this skill at the start of
  any design process, or when new research or documents are provided. Triggers on:
  "discovery", "design brief", "stakeholder map", "competitive analysis", "problem framing",
  "start design process", "understand the problem", "design principles", "domain glossary",
  "interview transcripts", "research synthesis", "process inputs", "clean up transcripts",
  or when beginning upstream design work for a new spec or project.
  This is the first design mode — everything else builds on its outputs.
---

# Discovery — Signal Processing & Project Context

> **Quick reference**
> - **Purpose:** Transform raw inputs into structured design knowledge
> - **Inputs:** Interviews, surveys, analytics, briefs, specs, regulatory docs
> - **Outputs:** Stakeholder map, domain glossary, competitive analysis, design brief → `design/01_DISCOVERY/`
> - **Hard rules:** Clean each input individually (Tier 1) before synthesizing (Tier 2). Note contradictions, don't reconcile silently. No UI solutions here.
> - **Common mistake:** Skipping Tier 1 (per-input cleaning) and jumping straight to synthesis, losing source provenance

## Purpose

Transform raw, messy project inputs into structured design knowledge. Inputs come in many formats — Teams transcripts, handwritten notes, survey CSVs, regulatory PDFs. This skill classifies each input, cleans it individually, synthesizes by type, then assembles cross-type project context artifacts that feed all downstream design modes.

---

## Dependency check

**Requires:** At least one input from the designer or team. Inputs may include:
- Qualitative research (interview transcripts, usability notes, field observations)
- Quantitative research (survey results, analytics, usage metrics)
- Project / client documents (briefs, specs, regulatory docs, meeting notes)

If no documentation exists, **warn** the user and ask them to describe the project context verbally. Capture what they provide and treat it as a project/client document input.

---

## Extraction radar

Applied to EVERY input before cleaning. Regardless of input type, always look for:

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

---

## Project relevance filter

Applied to EVERY input after the extraction radar. Before routing signals to synthesis artifacts, evaluate each finding:

| # | Question | If YES | If NO |
|---|----------|--------|-------|
| 1 | Does this finding advance a stated capability in the project design brief or value framework? | Route to the relevant capability's design artifacts | Go to question 2 |
| 2 | Does this finding describe a **documented user's** workflow, pain point, or need? | Capture in the relevant persona, journey, or JTBD | Go to question 3 |
| 3 | Does this finding connect to a **value lever** defined in the project value framework? | Capture with explicit value linkage | Go to question 4 |
| 4 | Could this finding be framed as a **scope expansion signal** for a future capability? | Flag as scope expansion signal in design-brief.md; do not design for it now | Go to question 5 |
| 5 | Is this finding about **the vendor's or implementor's delivery process** (sprint planning, environment setup, team coordination, development methodology)? | **Not a design input.** Discard from design artifacts. Note as project context only. | Go to question 6 |
| 6 | Is this finding about **technical implementation** (model architecture, database choice, API design)? | Capture ONLY if it creates a **design constraint** for end users (e.g., "max 300 documents" constrains ingestion UI). Otherwise discard. | Discard — not relevant to product design. |

### Framing guidance

When a finding is borderline, ask: **"Does this help documented users do their jobs better through this product?"**

- Vendor or implementor delivery details (who is building what, sprint velocity, environment bugs) are project management signals, not design signals
- Technical architecture details are design-relevant ONLY when they create end-user constraints
- User workflows, pain points, and value outcomes are ALWAYS design-relevant

---

## Downstream notification

After producing or updating artifacts:

1. Add `<!-- artifact: [path] | version: [N] | mode: design-discovery | updated: [date] -->` headers to all output files
2. Update `design/01_DISCOVERY/_upstream.md` manifest with produced artifact versions
3. Report which downstream modes are now potentially stale

### Script commands
```bash
# After producing/updating outputs:
node design/scripts/sync-version.js init <file> design-discovery   # first time
node design/scripts/sync-version.js bump <file>                    # subsequent updates
node design/scripts/sync-manifest.js discovery                     # update manifest
node design/scripts/sync-status.js                                 # check pipeline
```

---

## Workflow

### Step 1 — Document inventory

Catalog everything provided. Classify each input:
- **Qualitative research** — interviews, observations, field notes, focus groups
- **Quantitative research** — surveys, analytics, NPS, A/B data
- **Project / client documents** — briefs, BRDs, specs, regulatory, meeting notes, org charts

Note gaps explicitly (e.g. "no quantitative data provided") — gaps become evidence limitations in the design brief.

---

### Step 2 — Per-input cleaning (Tier 1)

Clean and structure each raw input individually. Write to `design/01_DISCOVERY/inputs/[type]/[name].md`. These feed Tier 2 — they are not final outputs.

**Interview / transcript template:**
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

**Survey / analytics template:**
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

**Project / client document template:**
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

---

### Step 3 — Per-type synthesis (Tier 2)

Aggregate across all cleaned inputs of the same type. Must note contradictions, not just agreements.

**Qualitative synthesis** → `design/01_DISCOVERY/qualitative-synthesis.md`
```markdown
## Qualitative Synthesis

### Themes
| Theme | Evidence count | Sources |
|-------|----------------|---------|

### Key quotes
- "[quote]" — [source]

### Consolidated pain signals
- [pain]: observed in [n] sources

### Mental models observed
[How users conceptualize the domain — their internal logic]

### Open questions
[Where qualitative evidence is absent or conflicting]
```

**Quantitative synthesis** → `design/01_DISCOVERY/quantitative-synthesis.md`
```markdown
## Quantitative Synthesis

### Behavioral patterns
[What data shows users actually do]

### Key metrics
| Metric | Value | Source |
|--------|-------|--------|

### Statistical signals
[Correlations, drop-off points, completion rates]

### Contradictions with qualitative findings
[Where numbers and words disagree — flag these explicitly]

### Open questions
[Where quantitative data is silent]
```

**Document synthesis** → `design/01_DISCOVERY/document-synthesis.md`
```markdown
## Document Synthesis

### Unified problem statement
[Reconciled across all documents — note if documents conflict]

### Consolidated constraints
- Regulatory: [list]
- Technical: [list]
- Organizational: [list]

### Agreed success criteria
[What the documents collectively define as success]

### Scope boundaries
- In: [list]
- Out: [list]
- Unresolved: [list]

### Contradictions between documents
[Flagged explicitly — do not silently reconcile]
```

---

### Step 4 — Cross-type assembly (Tier 3)

Scan ALL cleaned inputs and ALL type syntheses. Assemble project context artifacts by routing signals to the correct output. These are NOT derived from a single source.

**Stakeholder map** → `design/01_DISCOVERY/stakeholder-map.md`

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

**Domain glossary** → `design/01_DISCOVERY/domain-glossary.md`

For each term: full name, abbreviation, plain-language definition, UI implications (does the user see this term? abbreviated? role-dependent?).

**Competitive analysis** → `design/01_DISCOVERY/competitive-analysis.md`

All analogous system references from inputs + web research on similar systems. What they do well, what they do poorly, key patterns. Focus on: information density, data hierarchy, role-based access patterns.

**Value framework** → `design/01_DISCOVERY/value-framework.md`

Synthesize all strategic value signals from across all inputs into the vision → driver → lever → metric hierarchy:

```markdown
## Value Framework — [Project Name]

### Vision
[1-2 sentences: what transformation does this product enable for users? Aspirational, qualitative.]

### Strategic drivers
[Why value is expected to accrue — structural factors that make value creation possible. No metrics yet.]
| Driver | Description | User impact |
|--------|-------------|-------------|

### Value levers
[Specific mechanisms through which the product creates measurable value.]
| Lever | Description | Evidence | Target metric | Evidence tier |
|-------|-------------|----------|---------------|---------------|

### Priority ranking
[Which levers are highest priority and why — informed by commercial context, user needs, feasibility.]

### User outcomes by lever
[Which user roles realize which levers. Maps levers to the personas/roles who experience them.]
| Lever | User role | How they experience it |
|-------|-----------|----------------------|

### Commercial hypothesis
[The core bet: if this product solves X, then Y value accrues because Z.]

### Evidence record
[Sources supporting each lever — interviews, documents, quantitative data. Note evidence tier: committed KPI / validated / evidence-grounded / hypothetical.]

### Design decision filter
[Practical question: can this design decision be traced to at least one lever above? If not — is it justified by a driver or vision element? If neither, flag for review.]
```

**Design brief** → `design/01_DISCOVERY/design-brief.md`

```markdown
## Design Brief — [Project Name]

### Problem statement
[1-2 paragraphs: what problem does this solve for users?]

### Design principles
[3-5 principles that will guide all design decisions. Project-specific and testable.]

### Constraints
- Regulatory: [list]
- Technical: [list]
- Organizational: [list]
- Accessibility: [list]

### Users (summary)
[Brief summary of who uses this, pointing to full stakeholder map]

### Success metrics
[How will we know the design is working? Measurable outcomes. Reference value-framework.md for quantified levers.]

### Scope boundaries
[What are we designing? What are we NOT designing?]

### Evidence gaps
[Input categories not provided — quantitative data, existing research, etc.]
```

---

## Output checklist

**Tier 1 — Per-input cleaned artifacts**
- [ ] `design/01_DISCOVERY/inputs/interviews/[name].md` — one per interview/transcript
- [ ] `design/01_DISCOVERY/inputs/surveys/[name].md` — one per survey/analytics report
- [ ] `design/01_DISCOVERY/inputs/documents/[name].md` — one per client/project document

**Tier 2 — Per-type synthesis**
- [ ] `design/01_DISCOVERY/qualitative-synthesis.md` — if qualitative inputs were provided
- [ ] `design/01_DISCOVERY/quantitative-synthesis.md` — if quantitative inputs were provided
- [ ] `design/01_DISCOVERY/document-synthesis.md` — if 2+ project/client documents were provided

**Tier 3 — Cross-type project context**
- [ ] `design/01_DISCOVERY/value-framework.md` — vision, drivers, levers, metrics — strategic foundation for all design decisions
- [ ] `design/01_DISCOVERY/stakeholder-map.md` — all actors assembled cross-type
- [ ] `design/01_DISCOVERY/domain-glossary.md` — all domain terms assembled cross-type
- [ ] `design/01_DISCOVERY/competitive-analysis.md` — analogous systems analyzed
- [ ] `design/01_DISCOVERY/design-brief.md` — problem statement, principles, constraints, metrics, scope

---

## Rules

- Discovery is **signal extraction and synthesis**, not solution design. Do not propose UI solutions here.
- Per-input cleaning preserves source provenance. Never skip Tier 1 — clean each input individually before synthesizing.
- Per-type synthesis must note contradictions between inputs of the same type, not just agreements.
- Cross-type assembly draws signals from ALL input types. Stakeholder map and domain glossary are not derived from a single document.
- Design principles must be specific to this project, not generic ("be user-friendly" is not a principle; "surface PES status within 2 seconds of screen load" is).
- The domain glossary is a living document — update it whenever new terms are encountered in later modes.
- If a category of input is absent, note the gap in the design brief as an evidence limitation rather than guessing or fabricating.
- Discovery does NOT produce: personas (Ch 2), journey maps (Ch 3), user stories (Ch 4), voice & tone or terminology guide (Ch 8 — domain glossary is the raw source only), visual rationale (Ch 7), heuristic evaluation (Ch 10).
