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
- `design/06_INFORMATION_ARCHITECTURE/*` — defines what screens exist and their content
- `design/05_STORIES/story-map.md` — stories define what interactions each screen must support
- `design/02_USER_MODELS/behavioral-archetypes.md` — archetype tensions inform state priorities and error strategy
- Spec state machines or workflow rules (if applicable)

---

## Upstream sync (step 0)

Before starting this mode's workflow:

0. **Value alignment check:** If `design/01_DISCOVERY/value-framework.md` exists, verify that this mode's outputs can be traced to a vision element, driver, or lever defined there. If an output cannot be connected to a documented user need or a value lever, question whether it belongs. If no value framework exists yet, proceed — but flag any outputs whose purpose is unclear.
1. Check `design/07_INTERACTION/_upstream.md` for the dependency manifest
2. Compare recorded upstream versions against current artifact files
3. If upstream has changed, report what changed (additive / corrective / structural) and ask the designer: re-process or proceed?
4. If re-processing, update incrementally — process the delta, don't rebuild from scratch

After completing this mode's workflow:

1. Add or increment `<!-- artifact: ... -->` version headers on all changed output files
2. Update `design/07_INTERACTION/_upstream.md` with consumed and produced artifact versions
3. Report which downstream modes are now potentially stale

### Script commands
```bash
# On entry — check staleness:
node design/scripts/sync-status.js

# After completing — version and manifest:
node design/scripts/sync-version.js init <file> design-interaction   # first time
node design/scripts/sync-version.js bump <file>                      # subsequent updates
node design/scripts/sync-manifest.js interaction                     # update manifest
```

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

Write to `design/07_INTERACTION/interaction-model.md`.

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

Write to `design/07_INTERACTION/state-inventory.md`.

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

Write to `design/07_INTERACTION/behavioral-spec.md`.

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

Write to `design/07_INTERACTION/error-strategy.md`.

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

Add to `design/07_INTERACTION/interaction-model.md` or write separately.

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

- [ ] `design/07_INTERACTION/interaction-model.md` — per-screen interaction patterns + feedback/transitions
- [ ] `design/07_INTERACTION/state-inventory.md` — all states for every screen and major component
- [ ] `design/07_INTERACTION/behavioral-spec.md` — given/when/then specs for key interactions
- [ ] `design/07_INTERACTION/error-strategy.md` — unified error handling approach

---

### BRD enrichment

After completing interaction artifacts:
1. **Acceptance criteria** — for each story with behavioral specs, append `[STATE]` and `[BEHAVIOR]` tagged entries to the BRD acceptance criteria (e.g., `[STATE] User receives confirmation with reference number`)
2. **Notification Mapping sheet** — populate from the error strategy and notification flows

Update `design/BRD_manifest.md` after enrichment.

---

## Rules

- Every screen must have at minimum: Empty, Loading, Populated, and Error states defined. No screen is "always populated."
- Behavioral specs use given/when/then format — this is non-negotiable. It ensures testability.
- Error messages always include: what happened, why, and what to do next.
- Destructive actions always require confirmation. Define the confirmation pattern once, reuse everywhere.
- State transitions must be defined — don't just define states in isolation, define how the system moves between them.
- The state inventory maps 1:1 to Figma component variants. If a state is in the inventory, it must be built as a variant.
- **Traceability headers are mandatory.** Every interaction spec file MUST include these header fields:
  - `**Story references:** DS-NNN, DS-NNN` — which stories this spec covers
  - `**Business rule:** BR-NN` — which business rules govern the interaction (or `—` if none)
  - `**Host:** [Screen ID] [Screen Name]` — which screen(s) this spec applies to

  These fields are consumed by canvas briefs and validated by the traceability script.
