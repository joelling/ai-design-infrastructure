<!-- artifact: design/16_PROTOTYPE/drift-log.md | version: 1 | mode: design-prototype | updated: [DATE] -->

# Prototype Drift Log

> Records drift detected between Figma screens and the prototype. Managed by `design-prototype` and `figma-audit`. Do not edit manually.

## Event schema

| Field | Values |
|---|---|
| ID | DRIFT-NNN (sequential, never reused) |
| Timestamp | YYYY-MM-DD HH:MM |
| Source node | Figma node ID or prototype route path |
| Change type | `content` / `state` / `visual` / `structural` |
| Description | What changed and in which direction (Figma → Prototype or vice versa) |
| Resolution | `pending` / `auto-synced` / `approved-propagate` / `accepted-divergence` |
| Resolved by | Mode or actor that resolved it |
| Resolved on | YYYY-MM-DD |

## Change type definitions

| Type | Meaning | Sync behavior |
|---|---|---|
| `content` | Label, text, or image changed | Auto-sync |
| `state` | State added or removed | Auto-sync |
| `visual` | Color, spacing, or visual treatment changed | Figma → Prototype auto-sync |
| `structural` | Layout, component, or navigation changed | Flag for designer approval before propagating |

---

## Entries

<!-- Populated by design-prototype drift detection. Schema above. -->

| ID | Date | Source | Type | Description | Resolution |
|---|---|---|---|---|---|
| | | | | | |
