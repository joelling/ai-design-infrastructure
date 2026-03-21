# Chapter 11: Design System Governance

> **Tier 3 — Design** | Mode: `design-governance`

## Why this matters

Without governance, design systems drift. Components get named inconsistently, modifications happen without documentation, deprecated components linger, and no one knows which version of a component is current. Governance is the set of rules that keeps the system healthy as it grows.

## The mental model

You are establishing the constitution for the design system. Who can change what, through what process, with what documentation. The goal is sustainable evolution — making it easy to improve the system while preventing uncontrolled drift.

## Inputs

- `design/visual/visual-language.md` — the visual rules governance enforces
- Existing component inventory (from Figma or design artifacts)

## Upstream sync

**On entry:** Check `design/governance/_upstream.md` (if it exists). If upstream has changed since last run:

1. Report what changed and classify severity (additive / corrective / structural)
2. Ask the designer: re-process with new data, or proceed with current outputs?
3. If re-processing, update incrementally — revise affected governance rules

**On completion:** After producing or updating artifacts:

1. Add or increment version headers on all changed output files
2. Update `design/governance/_upstream.md` with consumed artifact versions
3. Report which downstream modes are now potentially stale (figma-library-mode, figma-audit)

## Process

**0. Check upstream sync.** Run the upstream sync check described above. If this is a first run, note which upstream artifacts are available and which are absent.

**1. Define the versioning scheme.** Semantic versioning for components: major (breaking changes), minor (additive), patch (fixes). Define what constitutes each type of change with examples.

**2. Write contribution guidelines.** Who can contribute (maintainer, contributor, consumer). How to propose a new component (check alternatives first, create proposal, review, build, stage). How to modify an existing component (document reason, assess impact, determine version bump, update changelog).

**3. Establish deprecation policy.** The process: mark as deprecated, provide alternative, set sunset period, provide migration path, remove after sunset. Never deprecate without a documented alternative and migration path.

**4. Initialize the changelog.** Standard format: date, version, type (added/changed/deprecated/removed/fixed), component, description.

## Outputs

| File | What it contains |
|------|-----------------|
| `design/governance/versioning.md` | Semver scheme, bump rules |
| `design/governance/contribution-guide.md` | Proposal process, modification rules, quality gate, naming authority |
| `design/governance/deprecation-policy.md` | Deprecation process, sunset timelines, migration requirements |
| `design/governance/changelog.md` | Initialized changelog |
| `design/governance/_upstream.md` | Upstream dependency manifest — consumed and produced artifact versions |

## Rules

- Every component change must be logged in the changelog. No silent updates.
- Breaking changes always require a major version bump and migration guidance.
- New components must pass the quality gate before entering the library.
- Naming authority is centralized — follow Category/ComponentName.
- Governance rules apply to tokens as well as components.

## Feeds into

- **Figma Library Mode** — governance rules guide library organization
- **Figma Audit** — quality gate criteria inform audit checks
