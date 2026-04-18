<!-- artifact: design/12_GOVERNANCE/deprecation-policy.md | version: 1 | mode: design-governance | updated: [DATE] -->

# Deprecation Policy

## Process

1. **Mark as deprecated** — add `[DEPRECATED — use [Alternative] instead]` to the component description in Figma
2. **Provide alternative** — document what to use instead (required before marking deprecated)
3. **Set sunset date** — based on the timeline below
4. **Provide migration path** — step-by-step instructions or script
5. **Remove** — after sunset date, remove from library, bump major version, update changelog

## Deprecation notice format

```
[DEPRECATED — use [Alternative] instead]
Sunset date: [YYYY-MM-DD]
Migration: [link or inline instructions]
```

## Sunset timeline

<!-- PROJECT-SPECIFIC -->
[N sprints / N weeks] between deprecation notice and removal

## Migration support commitment

<!-- PROJECT-SPECIFIC -->
[Migration script provided / One-to-one replacement documented with step-by-step / Notice only]

## Non-negotiables

- Never deprecate without a documented alternative
- Never deprecate without a migration path
- Never deprecate without a sunset timeline
- Notify all consumers before the sunset date

## Token deprecation

Tokens follow the same process. A replacement token must be defined and published before the deprecation notice is issued for the old token.
