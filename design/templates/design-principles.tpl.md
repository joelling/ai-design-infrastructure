<!-- artifact: design/12_GOVERNANCE/design-principles.md | version: 1 | mode: design-governance | updated: [DATE] -->

# Design Principles

> Principles are codified by `design-governance` Phase B synthesis passes. They are not defined on day one — they emerge from accumulated design decisions across validation findings, audit results, canvas brief patterns, and designer behavior. This file starts empty and grows as the project matures.

## Principle lifecycle states

| State | Meaning |
|---|---|
| `emerging` | Codified from 3+ evidence sources; not yet tested at scale |
| `established` | Has held across 5+ subsequent decisions without contradiction |
| `canonical` | Explicitly ratified by the team; non-negotiable |
| `stressed` | A new screen type or scope change has revealed an edge case |
| `retired` | No longer applicable; archived with reason |

## Principle schema

```
## GP-[NNN] — [Principle statement — imperative, specific, actionable]

**State:** [lifecycle state]
**Emerged:** [YYYY-MM-DD]
**Confidence:** [emerging / established / canonical]
**Evidence:**
- [file@version] — [brief description of the signal]
- [file@version] — [brief description of the signal]
- [file@version] — [brief description of the signal]
**Downstream:** [which modes / Figma rules this affects]

**History:**
- [YYYY-MM-DD] → codified
```

## Principle ID sequence

Principle IDs (GP-NNN) are sequential and stable. Never reused. Retired principles retain their ID with a `[RETIRED]` marker and a reason. The next available ID when adding principles is noted below.

Next ID: GP-001

---

<!-- Governance initialized: [DATE] -->
<!-- No principles yet. Run design-governance Phase B synthesis after sufficient design decisions have accumulated (5+ canvas briefs, or after the first validation or audit pass). -->
