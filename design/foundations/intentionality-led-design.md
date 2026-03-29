# Intentionality-Led Design: A Framework for Human-AI Collaboration

*2026-03-29*

---

## What Design Is (and Isn't)

Design is the human act of imposing meaning and values on a problem under conditions of irreducible uncertainty.

This definition holds regardless of the medium. You can design a user interface, a conversation, a system architecture, an API contract, a team structure, or an approach to a problem. What makes something "design" is not the artifact it produces — it is the presence of:

- **Intent** — a considered purpose, not just a preference
- **Tradeoff** — consciously choosing what to sacrifice
- **Accountability** — someone owns what it becomes
- **Judgment** — a decision that no rule could fully determine in advance

The toolchain in this project handles everything that comes *after* meaning has been imposed. It is a propagation and consistency engine. It can execute, synthesise, track, validate, and cascade. It cannot originate the "what" and "why." That is the designer's irreducible job.

The risk — and this framework exists to guard against it — is **execution creep**: designers drift into becoming output reviewers because the toolchain is productive. They stop designing and start approving. The artifacts get consistent but lose the human signal that makes them meaningful.

---

## The Philosophical Frame: The Intentionality Gradient

Every act in a design process can be positioned on two axes.

**Axis 1: Where does the decision criterion come from?**

| Source | Description |
|--------|-------------|
| Human values and context | No rule can substitute. The criterion lives in a specific person's judgment about what matters for this problem, user, and moment. |
| Established principles | A principle exists and guides the decision, but applying it requires interpretation in context. |
| Codified rules | The rules are clear and execution is essentially deterministic. |

**Axis 2: How reversible is the decision?**

| Reversibility | Description |
|---------------|-------------|
| Structural | Cascades widely, hard to undo. Changes the shape of upstream artifacts. |
| Corrective | Moderate effort to reverse, limited cascade. |
| Additive | Easy to undo, narrow impact. |

**The touch matrix:**

Where these axes intersect determines how present a designer needs to be.

|  | Judgment-requiring | Criteria-applying | Rule-following |
|--|--|--|--|
| **Structural** | High-touch | High-touch | Mid-touch |
| **Corrective** | High-touch | Mid-touch | Mid-touch |
| **Additive** | Mid-touch | Mid-touch | Low-touch |

Touch level tracks reversibility, not effort. A five-minute framing decision that locks in a system architecture needs more designer presence than a two-hour execution task that is easily revised.

---

## The Three Roles of a Designer in This System

### 1. Intent originator — irreplaceable

Only humans can generate genuine design intent. What matters, why, for whom, at what cost to what else. No mode in this toolchain produces this. Discovery, user models, process flows — these modes *capture and structure* intent. The designer must *bring* it.

If a designer enters a mode without genuine intent to contribute, the toolchain will produce a well-structured, internally consistent artifact that represents nobody's considered judgment. This is the most dangerous failure mode: outputs that look complete but are hollow.

### 2. Direction setter — gate-keeper

Given multiple valid paths, only humans can choose the right one for this context, user, and set of values. This is what decision gates in the process are really for — not bureaucratic checkpoints, but moments where the system pauses and says "there are several coherent answers here; which one is yours?"

Direction-setting is distinct from approving. Approving means checking whether something meets a standard. Direction-setting means choosing which standard applies.

### 3. Drift detector — integrity checker

As the system executes, the designer's job is to check whether the artifact has preserved intent or whether execution has diluted or distorted it. This is the staleness check applied to meaning, not just to file versions.

Drift is not always visible in the artifact. A component can be perfectly spec-compliant and still fail to express the design intent behind it. The designer must read outputs against the original purpose, not just against the rules.

---

## Touch Levels

### High-touch — slow down and think

These are moments where speed is the enemy. The designer needs to be genuinely present, not reviewing outputs. Rushing a high-touch moment produces low-touch results with high-touch consequences.

**When high-touch is required:**
- Problem framing: "What is this actually for? What are we not building?"
- User understanding: "Does this mental model match how people actually think, or how we want them to think?"
- Value tradeoffs: "We are optimising for X at the expense of Y, and we own that."
- Ethical and inclusion decisions: "Who does this exclude? Is that a considered choice or an oversight?"
- Structural direction: system architecture, conversation design, API constraint definition, IA backbone
- Any decision that will cascade — persona added or removed, journey reordered, scope changed
- Backward propagation decisions: new story IDs, new journey stages, model updates

**Examples across domains:**
- UX design: "What does success feel like for this user, not just what does task completion look like?"
- Conversation design: "What should this system never say, and why?"
- API design: "What constraint are we baking into this contract, and who is protected by it?"
- System architecture: "What are we making easy at the cost of what becoming harder?"

### Mid-touch — set intent, review for fidelity

The shape of the decision is known; the system can produce a draft. But the designer must check whether the execution preserved the intent, not just whether it is formally correct.

**When mid-touch is required:**
- Canvas brief review: "Does this brief reflect what I actually mean, or just what I said?"
- Interaction state review: "Are the states complete? Are the edge cases the right ones?"
- Drift resolution approvals: "The system flagged a conflict — here is what takes precedence."
- Reviewing AI synthesis of upstream artifacts for signal loss
- Visual direction: the system applies tokens, but the designer set the rationale
- Content voice: the system applies patterns, but the designer defined the adjectives

The question a designer should ask at mid-touch moments: "If the intent is X, does this output serve X, or does it serve a technically valid interpretation of X that I did not mean?"

### Low-touch — spot-check exceptions

Rules established, execution deterministic. The designer's role is exception detection, not active judgment.

**When low-touch is appropriate:**
- Version bumping and manifest updates
- Auto-sync of content, label, or state changes across nodes
- Traceability validation runs
- Token application in Figma
- Downstream staleness notifications
- Format consistency checks

Low-touch does not mean unobserved. It means the designer trusts the rules they set and reserves their attention for the cases where those rules surface a flag.

---

## The Seven Principles

### 1. Intent precedes execution

Never invoke a mode because the process says it is next. Invoke it because you have something to put into it. The toolchain has no ability to notice when it is running empty — that is the designer's job.

A process without intent behind it produces consistent noise.

### 2. Structural decisions are always human

The system can detect structural change. It cannot resolve it. Any decision that changes the shape of an upstream artifact requires a human to own the consequence. The cascade is real: a persona change ripples through user models, journeys, stories, canvas briefs, and Figma screens. A human must stand behind that ripple.

### 3. The system is a mirror, not a mind

The toolchain reflects what you put into it with higher fidelity and consistency than any human could maintain alone. But it cannot originate the "what" and "why." The quality of the output is bounded by the quality of the intent you bring.

Feeding a weak brief into a strong system produces a well-structured weak brief.

### 4. Slow down at tier seams

The transitions between tiers — Discovery to Definition, Definition to Design, Design to Develop — are where intentionality most easily leaks. A designer who moves from one tier to the next without a genuine synthesis moment is carrying forward the system's last output, not their own considered judgment.

Treat tier transitions as mandatory design moments, not handoffs.

### 5. Execution without intent is aesthetic production

If a designer is only reviewing the system's outputs without bringing independent judgment, they have become a quality checker. Quality checking is valuable but it is not designing. The framework must actively create space for genuine design thinking — pauses that are not about the process but about the problem.

The test: can the designer articulate *why* the output is right, in terms of user need and design intent, not just in terms of process compliance?

### 6. Touch level tracks reversibility, not effort

The amount of designer attention a decision deserves is proportional to how hard it is to undo, not how hard it is to make. A five-minute problem reframe that locks in the direction of twelve modes deserves more attention than a two-hour Figma execution task that can be revised in an afternoon.

Calibrate presence by consequence, not by complexity.

### 7. The process choice is itself a design act

Choosing which modes to run, in what order, at what depth, with what scope — that is a design decision. The process is a tool, not a contract. A designer who follows the process without asking whether the process serves the problem has outsourced their judgment to a framework.

The right process for a two-week MVP is not the right process for a five-year platform. Use the framework deliberately, not automatically.

---

## Applying the Framework Across Domains

The intentionality gradient applies regardless of design medium. The same three questions structure every domain:

| Question | Design act |
|----------|-----------|
| What is this for, and for whom? | Framing — always high-touch |
| What tradeoffs are we making? | Direction — always high-touch |
| What are the rules of the designed thing? | Specification — mid-touch |
| How is it executed consistently? | Production — low-touch |

**Conversation design:** High-touch on what the system should never say and why. Mid-touch on tone shifts per context. Low-touch on applying the voice guide to individual copy.

**System architecture:** High-touch on what the system is optimised for and what becomes harder as a result. Mid-touch on reviewing component boundaries against stated constraints. Low-touch on documentation format consistency.

**API design:** High-touch on which constraints are baked into the contract and who is protected by them. Mid-touch on reviewing endpoint structure against consumer mental models. Low-touch on naming convention enforcement.

**UX design (this toolchain's primary domain):** High-touch at problem framing, persona synthesis, journey emotional arc, story scope decisions, and canvas brief review. Mid-touch at interaction state review, visual direction approval, and drift resolution. Low-touch at token application, auto-sync, and format validation.

The framework does not change across domains. Only the vocabulary does.

---

## The Risk: Execution Creep

The most dangerous failure mode for AI-assisted design is not bad outputs. It is the slow disappearance of designer judgment from a process that continues to produce outputs.

Execution creep happens when:
- The designer starts invoking modes because the process says to, not because they have intent to contribute
- Reviews become format checks rather than intent checks
- The designer defers to the system's synthesis rather than testing it against their own understanding
- Productivity metrics (modes completed, artifacts produced, pipeline moving) substitute for design quality metrics (does this serve the user, does this reflect our values, does this solve the right problem)

The framework protects against this through three mechanisms:

**Explicit high-touch moments.** Every tier transition and every structural decision is explicitly marked as requiring genuine designer presence. These are not review gates — they are design moments. The process stops until the designer has contributed something only they can contribute.

**Intent articulation as a quality signal.** At each mode entry and mode exit, the designer should be able to articulate the intent behind what they are doing in one or two sentences. If they cannot, the mode should not run yet.

**Reversibility awareness.** Before approving any output, the designer should know how hard this decision is to undo. If it is structural and hard to reverse, it deserves a full high-touch moment regardless of how obvious the answer seems.

The toolchain is extraordinarily capable. The designer's job is to make sure that capability is in service of genuine intent — and to be the person who knows the difference.
