---
name: design-interaction
description: >
  Defines interaction models, behavioral specifications, state inventories, error strategies,
  and feedback patterns for each screen. Translates abstract user stories into concrete
  behavioral specs (given/when/then) that describe how the system responds to user actions.
  Triggers on: "interaction design", "interaction model", "states", "behavioral spec",
  "error handling", "form behavior", "state machine UI", "micro-interactions", "feedback
  patterns", "loading states", "empty states", or when determining how a screen behaves
  in response to user actions. Upstream dependencies: design-ia, design-stories.
---

# Interaction Design — Behavioral Models & State Inventory

## Purpose

Define **how** the product behaves in response to user actions. For each screen, specify: what interaction pattern it uses, what states it can be in, how transitions happen, how errors are handled, and what feedback the user receives. Output behavioral specs in given/when/then format that bridge directly to component states in Figma.

---

## Dependency check

**Soft dependencies** (warn if missing, don't block):
- `design/05-ia/*` — defines what screens exist and their content
- `design/04-stories/story-map.md` — stories define what interactions each screen must support
- Spec state machines or workflow rules (if applicable)

---

## Workflow

### Step 1 — Interaction model per screen type

Categorize each screen by its interaction pattern:

```markdown
## Interaction Models

| Screen | Pattern | Description |
|--------|---------|-------------|
| [Name] | **Browse & filter** | Scan a list/grid, narrow with filters, select to drill in |
| [Name] | **Form & submit** | Fill fields, validate, submit, receive confirmation |
| [Name] | **Dashboard** | Scan metrics at a glance, drill into detail on demand |
| [Name] | **Wizard/stepper** | Multi-step sequential process with progress indication |
| [Name] | **Detail view** | Display comprehensive information with expand/collapse |
| [Name] | **Review & decide** | Review information, make a decision, provide rationale |
```

Write to `design/06-interaction/interaction-model.md`.

### Step 2 — State inventory

For every screen and major component, enumerate all possible states:

```markdown
## State Inventory

### [Screen Name]

| State | Condition | What the user sees | User action available |
|-------|-----------|-------------------|----------------------|
| Empty | No data exists | [description] | [what they can do] |
| Loading | Data is being fetched | [description] | [wait / cancel] |
| Populated | Data loaded successfully | [description] | [full actions] |
| Error | Data fetch failed | [description] | [retry / report] |
| Partial | Some data loaded, some failed | [description] | [partial actions] |
| Filtered (no results) | Filters applied, 0 matches | [description] | [clear filters] |
| Unauthorized | User lacks permission | [description] | [request access] |
| Read-only | User can view but not edit | [description] | [view only] |
| Stale | Data may be outdated | [description] | [refresh] |
```

Write to `design/06-interaction/state-inventory.md`.

### Step 3 — Behavioral specifications

For each key interaction, write a behavioral spec in given/when/then format:

```markdown
## Behavioral Specifications

### [Screen Name] — [Interaction]

**Given** [precondition — what state is the system in]
**When** [trigger — what the user does]
**Then** [outcome — what happens]
**And** [side effect — any additional consequences]

#### Variations
- **Given** [alternative precondition] **When** [same trigger] **Then** [different outcome]

#### Error paths
- **Given** [precondition] **When** [trigger] **And** [error condition] **Then** [error handling]
```

Write to `design/06-interaction/behavioral-spec.md`.

### Step 4 — Error strategy

Define a unified error handling approach:

```markdown
## Error Strategy

### Error categories
| Category | Severity | Example | Display pattern | Recovery action |
|----------|----------|---------|----------------|-----------------|
| Validation | Low | Invalid input | Inline, next to field | Fix and resubmit |
| Network | Medium | Request timeout | Banner/toast | Retry |
| Permission | Medium | Unauthorized action | Inline message | Request access |
| System | High | Server error | Full-screen or modal | Retry later / contact support |
| Data conflict | Medium | Stale data / conflict | Modal with options | Choose version |

### Validation timing
- [When does validation happen? On blur? On submit? Real-time?]

### Error message format
- Structure: [What happened] + [Why] + [What to do]
- Tone: [Reference design-content voice & tone when available]

### Destructive action protection
- [Which actions require confirmation? How is confirmation presented?]
```

Write to `design/06-interaction/error-strategy.md`.

### Step 5 — Feedback & micro-interactions

Define feedback patterns and transitions:

```markdown
## Feedback & Micro-interactions

### Feedback patterns
| Trigger | Feedback type | Duration | Example |
|---------|--------------|----------|---------|
| Action success | Toast/snackbar | 4 seconds, auto-dismiss | "Record saved" |
| Action in progress | Loading indicator | Until complete | Spinner / progress bar |
| Destructive action | Confirmation dialog | Until user responds | "Are you sure?" |
| State change | Inline update | Immediate | Status badge changes color |
| Background process | Notification | Persistent until acknowledged | "Import complete" |

### Transition principles
- [How do elements enter/exit? Fade? Slide? Instant?]
- [What's the default transition duration?]
- [When should motion be reduced (prefers-reduced-motion)?]
```

Add to `design/06-interaction/interaction-model.md` or write separately.

---

## Bridge to Figma

| Interaction artifact | Figma skill | How it's used |
|---------------------|------------|---------------|
| State inventory | `figma-component` | Each state becomes a component variant (Default, Loading, Error, Empty) |
| Interaction models | `figma-page-setup` | Determines page structure and sub-frame organization |
| Error strategy | `figma-component` | Error states, validation patterns become reusable State components |
| Behavioral specs | `design-canvas` | Canvas briefs reference behavioral specs for each screen |

---

## Output checklist

- [ ] `design/06-interaction/interaction-model.md` — per-screen interaction patterns + feedback/transitions
- [ ] `design/06-interaction/state-inventory.md` — all states for every screen and major component
- [ ] `design/06-interaction/behavioral-spec.md` — given/when/then specs for key interactions
- [ ] `design/06-interaction/error-strategy.md` — unified error handling approach

---

## Rules

- Every screen must have at minimum: Empty, Loading, Populated, and Error states defined. No screen is "always populated."
- Behavioral specs use given/when/then format — this is non-negotiable. It ensures testability.
- Error messages always include: what happened, why, and what to do next.
- Destructive actions always require confirmation. Define the confirmation pattern once, reuse everywhere.
- State transitions must be defined — don't just define states in isolation, define how the system moves between them.
- The state inventory maps 1:1 to Figma component variants. If a state is in the inventory, it must be built as a variant.
