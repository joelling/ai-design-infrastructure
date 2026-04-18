<!-- artifact: design/12_GOVERNANCE/versioning.md | version: 1 | mode: design-governance | updated: [DATE] -->

# Design System Versioning

## Scheme

Semantic versioning: **major.minor.patch**

| Increment | When | Example |
|---|---|---|
| **Major** | Breaking change — existing usage breaks | Property renamed, variant removed, structural change that breaks consumers |
| **Minor** | Additive change — existing usage unaffected | New variant, new property, new state added |
| **Patch** | Fix — no behavioral or structural change | Visual fix, token rebinding, description update |

## Library versioning

- The library follows the same semver scheme as individual components
- A library version bump is triggered by the highest-level component bump in a release
- Version is tracked in `design/12_GOVERNANCE/changelog.md`

## When to bump

| Change type | Version bump |
|---|---|
| New component added | Minor |
| Component property renamed | Major |
| Component property removed | Major |
| New variant added | Minor |
| New state added | Minor |
| Visual fix (no structural change) | Patch |
| Token value adjusted | Patch |
| New token added | Minor |
| Token removed | Major |
| Component removed | Major |
| Spacing scale extended | Minor |

## Project examples

<!-- PROJECT-SPECIFIC: Add real examples from this project's changelog as they accumulate -->
<!-- Format: "[Date] [Component] — [what changed] was a [major/minor/patch] bump because [reason]" -->
