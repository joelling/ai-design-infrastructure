<!-- artifact: design/12_GOVERNANCE/contribution-guide.md | version: 1 | mode: design-governance | updated: [DATE] -->

# Contribution Guidelines

## Roles

- **Maintainer** — can approve and publish components, holds naming authority, owns the quality gate
- **Contributor** — can propose and build components, cannot publish independently
- **Consumer** — can use components, can file issues, cannot modify directly

## Proposing a new component

1. Check if the need can be met by an existing component with different properties
2. Check if the need can be met by composing existing components
3. If neither, create a proposal:
   - **Name:** proposed component name following Category/Name convention
   - **Purpose:** what it does and when to use it
   - **Existing alternatives considered:** what you checked and why it didn't work
   - **Personas who need it:** who benefits
   - **Proposed variants/states:** list
4. Review proposal against naming conventions and visual language
5. Build following `figma-component` skill workflow
6. Place in Parking Lot for review

## Modifying an existing component

1. Document the reason for the change
2. Assess impact: how many screens and instances use this component?
3. Determine version bump (see versioning scheme)
4. Make the change following `figma-component` skill workflow
5. Update changelog
6. If breaking change: provide migration guidance before publishing

## Naming authority

<!-- PROJECT-SPECIFIC -->
Category list: [fill from component inventory — e.g. Form/, Navigation/, Feedback/, Data/, Layout/]
Convention: Category/ComponentName — no exceptions
Hidden components: `.` prefix — no exceptions
New categories require approval from: [fill]

## Quality gate

<!-- PROJECT-SPECIFIC: fill based on design/08_VISUAL/visual-language.md rules -->
Before a component enters the library it must pass:
- [ ] `figma-audit` — zero violations
- [ ] All states from `design-interaction` state inventory represented
- [ ] Content follows `design-content` patterns
- [ ] Accessibility patterns from `design-accessibility` applied
- [ ] Auto-layout applied — no absolute x/y positioning
- [ ] ZERO hardcoded values — every fill, spacing, radius references a variable
- [ ] Description filled in Properties panel
- [ ] [Add project-specific visual language rules here]

## Approval roles

<!-- PROJECT-SPECIFIC -->
- Naming authority: [fill]
- Component review: [fill]
- Breaking change approval: [fill]
