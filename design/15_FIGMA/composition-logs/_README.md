# Composition Logs

Append-only, per-screen evidence of `figma-screen-compose` Phase B execution.

## Purpose

Every Figma screen composed by `figma-screen-compose` writes a markdown log here capturing **what was placed, where, with which property overrides, and why**. Composition logs are *evidence*; canvas briefs in `design/13_CANVAS_BRIEFS/` remain *intent*.

Downstream skills consume these logs:
- `design-prototype` — disambiguates "why this layout" when Figma + brief don't fully agree
- `figma-handoff` — classifies designer overrides against logged compositions
- `figma-audit` — audits Figma against composition log + brief acceptance criteria
- `design-lint` — checks brief↔composition log sync, deviation backlog age, missing-component queue age
- `design-query` — composition logs are part of the queryable corpus
- `design-governance` Phase B — pattern reports and missing-component clusters feed Template promotion

## Naming

`{ScreenID}_composition-log.md` — one file per screen.

`{ScreenID}` matches the canvas brief filename root (e.g. `PES-001_composition-log.md` for `PES-001_pes-profile-view.md`).

## Format

Each file is created on first composition and **appended to** on every subsequent re-run (additive only — never edit or delete prior entries).

```markdown
<!-- artifact: design/15_FIGMA/composition-logs/{ScreenID}_composition-log.md | version: N | mode: figma-screen-compose | updated: YYYY-MM-DD | evidence: design/13_CANVAS_BRIEFS/{ScreenID}_*.md@vN -->

# Composition Log — {ScreenID}

## Run YYYY-MM-DD HH:MM — sync-hash {hash}

**Brief sync-hash at composition:** {hash}
**Page setup sync-hash:** {hash}
**Inventory sync-hash:** {hash}
**Token catalogue sync-hash:** {hash}

### Wrapper frame
- nodeId: `{node:abc}`
- name: `{ScreenID}-wrapper`
- placed inside: `[FRAME] Content` of `[ARTBOARD] Desktop`

### Sections composed

| Section | Component | componentKey | nodeId | Property overrides | Source (brief section) |
|---|---|---|---|---|---|
| Header | PageHeader/Default | `pageHeader_v3` | `{node:def}` | TEXT title="Profile", VARIANT density=compact | §4 line 12; §7 line 4 |
| Hero | Hero/CenteredAction | `hero_v2` | `{node:ghi}` | TEXT headline="…", INSTANCE_SWAP cta=PrimaryAction | §4 line 14; §6 default state |
| List | ListItem × 6 | `listItem_v4` | `{node:jkl…}` | TEXT (per-row content from §7), VARIANT state=resting | §4 line 18; §7 line 11–17 |

### Accepted deviations
- `Hero` density set to `comfortable` (brief said `compact`) — designer accepted because the hero contains an illustration that needs vertical breathing room. (Phase A flag #2)

### Designer overrides accepted from prior session
- (none this run)

### Missing components placed as `[MISSING]`
- `[MISSING] CMP-047 ListItem variant=destructive` in slot `List > row 3` — inventory entry added (`requested_by: figma-screen-compose`, `triggering_screen: {ScreenID}`)

### Brief edit proposals (commented at end of brief MD — never auto-applied)
- §6 contradicts §4 on "filter visibility in default state"; proposed edit attached to brief.

### Screenshots
- `Header` — accepted run 1
- `Hero` — accepted run 2 (designer nudged padding)
- `List` — accepted run 1

### Back-pressure summary
- 1 missing component → inventory `draft` queue
- 0 token gaps
- 1 brief contradiction → proposal at end of brief MD
- 0 story orphans

---
```

## Hard rules

- **Append-only.** Never edit or delete prior runs.
- **Sync-hash required.** Every run records the brief, page-setup, inventory, and token sync-hashes at composition time.
- **Versioned via `sync-version.js`.** Each new run bumps the file version header.
- **One file per screen.** Multiple screens in one composition session produce multiple log files.
- **Evidence only.** Logs do not modify the brief — proposed brief edits are written as commented-out blocks at the end of the brief MD for designer approval.

## Validation

Run `node design/scripts/sync-composition.js` to validate:
- every composition log references a real canvas brief
- every `[MISSING] CMP-NNN` placeholder has a matching inventory `draft` entry
- every brief edit proposal is still commented (not yet accepted)
- brief sync-hash at composition time matches a real brief revision
