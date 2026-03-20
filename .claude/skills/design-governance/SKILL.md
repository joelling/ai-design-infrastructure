---
name: design-governance
description: >
  Establishes design system governance — versioning scheme, contribution guidelines,
  deprecation policy, change management process, and naming authority. Use this skill
  when the design system needs lifecycle management rules. Triggers on: "governance",
  "design system versioning", "contribution guide", "deprecation", "component lifecycle",
  "naming convention authority", "change management", "design system rules", "component
  ownership", or when establishing how the design system evolves over time. Can run at
  any point once components exist or are planned.
---

# Design System Governance — Lifecycle & Change Management

## Purpose

Define the rules for how the design system evolves — how components are versioned, who can contribute, how changes are proposed and approved, and how deprecated components are sunset. Without governance, design systems drift into inconsistency.

---

## Dependency check

**Soft dependencies** (warn if missing, don't block):
- `design/07-visual/visual-language.md` — establishes the visual rules governance enforces
- Existing component inventory (from Figma or design artifacts)

---

## Workflow

### Step 1 — Versioning scheme

```markdown
## Versioning

### Component versioning
- **Scheme:** Semantic versioning (major.minor.patch)
  - **Major** (breaking): renamed properties, removed variants, structural changes that break existing usage
  - **Minor** (additive): new variants, new properties, new states
  - **Patch** (fix): visual fixes, token rebinding, description updates

### Library versioning
- **[Project] - Core Library:** follows same semver scheme
- **Version tracking:** changelog maintained in `design/11-governance/changelog.md`

### When to bump
| Change type | Version bump | Example |
|-------------|-------------|---------|
| New component added | Minor | Button/Tertiary added |
| Component property renamed | Major | `isDisabled` → `disabled` |
| Color token value changed | Patch | blue/500 adjusted for contrast |
| New variant added | Minor | Button gets "danger" variant |
| Component removed | Major | Badge component deprecated and removed |
| Spacing token scale extended | Minor | spacing/3xl added |
```

Write to `design/11-governance/versioning.md`.

### Step 2 — Contribution guidelines

```markdown
## Contribution Guidelines

### Who can contribute
- [Define roles: maintainer, contributor, consumer]

### Proposing a new component
1. Check if the need can be met by an existing component with different properties
2. Check if the need can be met by composing existing components
3. If neither, create a proposal:
   - **Name:** [proposed component name following Category/Name convention]
   - **Purpose:** [what it does, when to use it]
   - **Existing alternatives considered:** [what you checked]
   - **Personas who need it:** [who benefits]
   - **Proposed variants/states:** [list]
4. Review against naming conventions and visual language
5. Build following `figma-component` skill workflow
6. Place in Parking Lot for review

### Modifying an existing component
1. Document the reason for the change
2. Assess impact: how many screens/instances use this component?
3. Determine version bump (see versioning scheme)
4. Make the change following `figma-component` skill workflow
5. Update changelog
6. If breaking change: provide migration guidance

### Naming authority
- Component names follow `Category/ComponentName` convention
- Category list is fixed: Atoms, Molecules, Organisms, Templates, States, Annotations
- New categories require explicit approval
- Hidden components use `.` prefix — no exceptions

### Quality gate
Before a component enters the library, it must pass:
- [ ] `figma-audit` — zero violations
- [ ] All states from `design-interaction` state inventory represented
- [ ] Content follows `design-content` patterns
- [ ] Accessibility patterns from `design-accessibility` applied
- [ ] Description filled in Properties panel
```

Write to `design/11-governance/contribution-guide.md`.

### Step 3 — Deprecation policy

```markdown
## Deprecation Policy

### Deprecation process
1. **Mark as deprecated:** Add "[DEPRECATED]" prefix to component description
2. **Provide alternative:** Document what to use instead
3. **Sunset period:** [N weeks/sprints] — deprecated components remain available but flagged
4. **Migration support:** Provide step-by-step migration from old to new
5. **Removal:** After sunset period, remove from library; bump major version

### Deprecation notice format
```
[DEPRECATED — use [Alternative] instead]
Sunset date: [date]
Migration: [link or instructions]
```

### Never deprecate without
- A documented alternative
- A migration path
- A sunset timeline
- Notification to all consumers
```

Write to `design/11-governance/deprecation-policy.md`.

### Step 4 — Changelog

Initialize a changelog:

```markdown
## Design System Changelog

### Format
Each entry:
- **Date:** [YYYY-MM-DD]
- **Version:** [semver]
- **Type:** [Added / Changed / Deprecated / Removed / Fixed]
- **Component:** [name]
- **Description:** [what changed and why]

---

### [Current entries below]
```

Write to `design/11-governance/changelog.md`.

---

## Output checklist

- [ ] `design/11-governance/versioning.md` — semver scheme, bump rules
- [ ] `design/11-governance/contribution-guide.md` — proposal process, modification rules, quality gate, naming authority
- [ ] `design/11-governance/deprecation-policy.md` — deprecation process, sunset timelines, migration requirements
- [ ] `design/11-governance/changelog.md` — initialized changelog

---

## Rules

- Every component change must be logged in the changelog. No silent updates.
- Breaking changes always require a major version bump and migration guidance.
- New components must pass the quality gate before entering the library.
- Deprecated components are never just deleted — they follow the deprecation process.
- Naming authority is centralized — no ad-hoc component names. Follow `Category/ComponentName`.
- Governance rules apply to tokens as well as components — token changes follow the same versioning scheme.
