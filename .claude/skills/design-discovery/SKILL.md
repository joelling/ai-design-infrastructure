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

Clean and structure each raw input individually. Write to `design/discovery/inputs/[type]/[name].md`. These feed Tier 2 — they are not final outputs.

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

**Qualitative synthesis** → `design/discovery/qualitative-synthesis.md`
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

**Quantitative synthesis** → `design/discovery/quantitative-synthesis.md`
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

**Document synthesis** → `design/discovery/document-synthesis.md`
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

**Stakeholder map** → `design/discovery/stakeholder-map.md`

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

**Domain glossary** → `design/discovery/domain-glossary.md`

For each term: full name, abbreviation, plain-language definition, UI implications (does the user see this term? abbreviated? role-dependent?).

**Competitive analysis** → `design/discovery/competitive-analysis.md`

All analogous system references from inputs + web research on similar systems. What they do well, what they do poorly, key patterns. Focus on: information density, data hierarchy, role-based access patterns.

**Design brief** → `design/discovery/design-brief.md`

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
[How will we know the design is working? Measurable outcomes.]

### Scope boundaries
[What are we designing? What are we NOT designing?]

### Evidence gaps
[Input categories not provided — quantitative data, existing research, etc.]
```

---

## Output checklist

**Tier 1 — Per-input cleaned artifacts**
- [ ] `design/discovery/inputs/interviews/[name].md` — one per interview/transcript
- [ ] `design/discovery/inputs/surveys/[name].md` — one per survey/analytics report
- [ ] `design/discovery/inputs/documents/[name].md` — one per client/project document

**Tier 2 — Per-type synthesis**
- [ ] `design/discovery/qualitative-synthesis.md` — if qualitative inputs were provided
- [ ] `design/discovery/quantitative-synthesis.md` — if quantitative inputs were provided
- [ ] `design/discovery/document-synthesis.md` — if 2+ project/client documents were provided

**Tier 3 — Cross-type project context**
- [ ] `design/discovery/stakeholder-map.md` — all actors assembled cross-type
- [ ] `design/discovery/domain-glossary.md` — all domain terms assembled cross-type
- [ ] `design/discovery/competitive-analysis.md` — analogous systems analyzed
- [ ] `design/discovery/design-brief.md` — problem statement, principles, constraints, metrics, scope

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
