---
name: figma-screen-compose
description: >
  Composes a Figma screen by placing published-library component instances into
  the empty Header/Content/Footer frames produced by figma-page-setup, per the
  canvas brief. Two-phase: Phase A plans the composition and surfaces gaps without
  touching Figma; Phase B mutates Figma section-by-section with per-section
  screenshot review. Use this skill whenever a canvas brief and a set-up page exist
  and the screen needs to be filled with components. Triggers on: "compose [screen]",
  "build the screen", "place components", "fill the page", "render the brief in
  Figma", "execute the canvas brief", "assemble [screen]", "wire up [screen] in
  Figma", or whenever a canvas brief exists and the artboards are empty. Run AFTER
  figma-page-setup and AFTER any required components exist in the published
  Components DLS library. Do NOT use raw figma_execute for this — that bypasses
  composition logging, screenshot review, and back-pressure to upstream.
---

# Screen Composition — Canvas Brief → Figma Screens

> **Required reading:** Before any `figma_execute` call, follow the rules in [_figma-api-rules.md](../_figma-api-rules.md).

This skill fills the gap between `figma-page-setup` (which scaffolds empty frames) and `design-prototype` (which assumes screens are already composed). It places published-library component instances into the screen frames per the canvas brief, with formal traceability and a designer checkpoint between intent reconciliation and visual execution.

## Mental model

```
Canvas brief MD ──► [Phase A: Plan] ──► designer review ──► [Phase B: Execute]
       ▲                  │                    │                   │
       │                  ▼                    ▼                   ▼
   edit MD if       gap report           approve / edit       Figma mutations
   gaps surface     + missing-comp       brief / accept        + per-section
                    + token gaps         deviation             screenshots
                    + brief contradictions                          │
                                                                    ▼
                                                            composition log
                                                            + back-pressure to:
                                                            - governance inventory
                                                            - figma-parking-lot
                                                            - canvas brief (proposals)
```

Phase A is read-only on Figma. Phase B mutates. The split mirrors `design-canvas`, `design-research`, `design-governance`, `design-query` — designer reviews intent reconciliation before any shared state is touched.

---

## Hard rules (read before invoking)

These are non-negotiable. Most are inherited from existing figma-* skills; the rest are lifted from public prior-art pitfall lists ([Figma's own skill](https://github.com/figma/mcp-server-guide/blob/main/skills/figma-generate-design/SKILL.md), [Bitovi](https://www.bitovi.com/blog/figma-just-opened-the-canvas-to-agents.-heres-what-actually-happens), [Mejba](https://www.mejba.me/blog/ai-design-system-workflow-claude-figma)).

- **Library instances only.** Only instantiate components with a valid `componentKey` from the published Components DLS library. Inventory status must be `published`. **Never** local components, **never** parking-lot (`staged` / `audited`) components.
- **No hardcoded values.** Every fill / spacing / radius / typography value is inherited from variables on the published component. Do not override with raw values.
- **Parent and child auto-layout everywhere.** No absolute x/y positioning. Hug vs fill per breakpoint per brief Section 12.
- **Linked-library token discovery.** When checking tokens, query linked-library variable collections, not just local. Calling `getLocalVariableCollectionsAsync()` alone is the canonical trap — agents conclude "no variables exist" when only local was checked.
- **Wrapper frame first.** In Phase B, create a per-screen wrapper frame inside the artboard's Content frame **before any other mutation**. Reparenting children across separate `figma_execute` calls silently fails and produces orphans.
- **Property overrides via `setProperties`** — never raw `.characters`. Skipping `setProperties` lets placeholder text ("Title", "Heading", "Button") leak into composed screens.
- **Per-section screenshots, not full-page.** Full-page screenshots hide truncation, overlap, and placeholder leakage. Screenshot each section group as it lands.
- **No new components.** Composition skill never builds components — it delegates to `figma-component`. When a needed component is missing, **drop a labeled placeholder + write a `draft` inventory entry + queue to `figma-parking-lot`**. Do not block.
- **No brief auto-edit.** All proposed brief changes (including trivial content/label drift) are written as commented-out blocks at the end of the brief MD for designer approval. Composition log is evidence; brief is intent; the two are kept structurally separate.
- **No token modification.** Delegates to `figma-tokens`. Token gaps are flagged, not fixed.
- **No moving components out of staging.** Delegates to `figma-parking-lot`.
- **Composition log is append-only.** Corrections are new entries that reference and supersede the old one.
- **3-iteration cap per section.** After three failed screenshot review iterations on a single section, force designer review — do not loop further (prevents agent thrash).
- **Visibility-of-incompleteness preferred.** Missing components leave `[MISSING] {ID}` placeholders rather than silent omissions. Composition is honest about what couldn't be built.

---

## Step 0 — Staleness check

Before either phase, verify upstream sync hashes:

| Artifact | Check |
|---|---|
| Canvas brief (`design/13_CANVAS/{ScreenID}_*.md`) | Sync hash present, brief version current |
| Inventory (`design/12_GOVERNANCE/inventory.md`) | Last-updated timestamp newer than last composition for this screen |
| Page setup (target Figma page) | Header/Content/Footer sub-frames exist, [STAGING] frame present |
| Token catalogue (linked-library variables) | `figma_get_variables` returns expected collections (Foundation DLS) |
| Wireframe (`design/14_WIREFRAME/{ScreenID}.txt`) | **Soft warn** if absent — wireframe gate has not run |

Report any mismatches and ask the designer whether to proceed, refresh upstream, or abort.

---

## Phase A — Plan (read-only on Figma)

### A.1 — Ingest

Read in order:

1. Canvas brief — focus on:
   - **Section 1 (Frame inventory)** — counts the artboards/states to compose (1.1, 1.2, …)
   - **Section 2 (Traceability)** — story IDs, business rules, interaction specs (used for the optional [ANNOTATION] Stories sidebar)
   - **Section 4 (Layout & content hierarchy)** — drives section order inside Content frame
   - **Section 5 (Components needed)** — the instance list, with variants
   - **Section 6 (States)** — drives VARIANT property selection per frame
   - **Section 7 (Content specification)** — drives TEXT property overrides
   - **Section 8 (Visual specification)** — density target, key tokens (sanity check)
   - **Section 12 (Breakpoint notes)** — drives hug/fill per breakpoint
2. `design/12_GOVERNANCE/inventory.md` — filter to `status: published` rows. **Staged / audited / draft components are not eligible for instantiation.**
3. Token catalogue — `figma_get_variables` with explicit linked-library inclusion. Build a quick map of what semantic tokens exist.
4. Current Figma page state — read existing artboards, sub-frames, staging area contents (`figma-component` output) so the plan respects what's already there.

### A.2 — Build the composition plan

For each frame in Section 1, for each section in Section 4 hierarchy, for each breakpoint in Section 12:

```
Frame 1.1 — Dashboard (Empty state) — Desktop
  [SECTION] PageHeader (Header sub-frame)
    Instance: Navigation/TopBar  [componentKey: ...]
      properties:
        TEXT pageTitle = "Dashboard"          (from brief §7)
        VARIANT density = comfortable          (from brief §8)
        BOOLEAN showSearch = true              (from brief §6 default state)
      sizing: fill horizontal, hug vertical
  [SECTION] Hero (Content sub-frame, position 1)
    Instance: State/Empty       [componentKey: ...]
      properties:
        TEXT headline = "No data yet"         (from brief §7)
        INSTANCE_SWAP icon = Icon/Database     (from brief §5)
      sizing: fill horizontal, hug vertical
  [SECTION] PrimaryAction (Content sub-frame, position 2)
    Instance: Button/Primary    [componentKey: ...]
      properties:
        TEXT label = "Add your first record"   (from brief §7)
      sizing: hug horizontal, hug vertical
```

### A.3 — Build the gap report

Surface every gap that would cause Phase B to compromise:

| Gap type | What to record | What designer does |
|---|---|---|
| **Missing component** | Brief Section 5 names a component not in inventory at `published` status | Designer accepts placeholder route OR halts to invoke `figma-component` first |
| **Token gap** | Brief Section 8 references a token not in the linked Foundation collection | Flag for `figma-tokens`; placeholder uses nearest available token |
| **Brief contradiction** | Section 4 conflicts with Section 6 / 7 (e.g., references content for a state that doesn't exist) | Designer edits brief in Claude Code; re-run Phase A |
| **Ambiguous brief** | Section 4 lists "elements" without explicit order; or Section 12 silent on breakpoint adaptation | Designer disambiguates inline OR accepts agent's stated assumption as deviation |
| **Visually-plausible-but-semantically-wrong risk** | Brief Section 6 silent on which variant maps to which state (e.g., Button/Primary vs Button/Neutral for "Save") | Plan flags as deviation; never guess silently |
| **Wireframe absent** | `design/14_WIREFRAME/{ScreenID}.txt` not found | Soft warn; designer chooses |

### A.4 — Batch-mode pattern report (optional)

If invoked across N screens (`figma-screen-compose for screens P-04 through P-17`):

- After per-screen plans, scan for repeated section patterns.
- Surface a **pattern report**: "12 of 14 list views share Header → Filter → ListItem composition; consider promoting to a Template component."
- Designer can: approve all → Phase B; accept pattern → trigger `design-governance` Phase B + `figma-component` to build a Template, then re-run Phase A; reject batch → drop to per-screen flow.

### A.5 — Designer checkpoint

Render plan + gap report in Claude Code. Four exits:

- **Approve as-is** → proceed to Phase B.
- **Edit canvas brief MD** in Claude Code (preferred — preserves intent traceability) → re-run Phase A.
- **Accept deviation** (mark specific gap as intentional override) → proceed to Phase B; deviation will be logged.
- **Abort** → no Figma mutations.

---

## Phase B — Execute (mutates Figma)

### B.1 — Create the per-screen wrapper frame first

Inside the artboard's Content sub-frame, create a wrapper frame **before any other mutation**:

```
[SECTION] {ScreenID} — Composition Wrapper
  Auto-layout: vertical
  Width: fill container
  Height: hug contents
  Padding: 0
  Gap: semantic/spacing/lg
```

This is the parent for everything Phase B places. **Do not skip this step.** Reparenting later (across `figma_execute` boundaries) silently fails.

### B.2 — Optional: place [ANNOTATION] Stories sidebar

If brief Section 2 traceability is populated and the project has not opted out:

```
[ANNOTATION] Stories — {ScreenID}
  Position: to the right of the rightmost artboard, semantic/spacing/2xl gap
  Auto-layout: vertical
  Padding: semantic/spacing/sm
  Gap: semantic/spacing/xs
  Fill: semantic/color/surface/raised
  Radius: semantic/radius/sm

  Contents:
  - "Stories: DS-NNN, DS-NNN" (from brief §2a)
  - "Brief: <one-line excerpt from brief §3 purpose>"
  - "Brief sync-hash: {hash}"
```

This is a designer review aid. It is the **only artifact** this skill creates outside the Content wrapper frame. It is never published, never instantiated, never referenced by other skills.

### B.3 — Compose section by section

For each `[SECTION]` in the Phase A plan, in Section 4 order:

1. **Validate component is `published`** — re-check inventory just before instantiation (inventory may have changed since Phase A).
2. **`figma_instantiate_component`** with the published `componentKey`. Place inside the wrapper at the correct position.
3. **`figma_set_instance_properties`** for all property overrides (TEXT, VARIANT, BOOLEAN, INSTANCE_SWAP). **Never** use `node.characters` — it bypasses the component property system and lets placeholder text leak.
4. **Apply sizing per Section 12** — `layoutSizingHorizontal` and `layoutSizingVertical` per breakpoint. Default: hug both unless brief specifies fill.
5. **Verify token inheritance** — confirm no raw value overrides leaked in. If a variable mode mismatch is detected, call `setExplicitVariableModeForCollection` recursively (see `_figma-api-rules.md`).
6. **`figma_take_screenshot`** of the section just composed (not the full page). Render in Claude Code.
7. **Designer review** — accept / nudge / re-plan-section / abort. Hard cap: **3 iterations per section**, then forced designer review.

### B.4 — Missing-component handling (no block)

If a component referenced by the plan is no longer `published` (or never was):

1. **Place a labeled placeholder frame** in the slot where the instance would have gone:
   ```
   [MISSING] {Category/ComponentName} variant={X}
     Auto-layout: vertical
     Width: fill container
     Height: 80px (semantic/sizing/placeholder)
     Padding: semantic/spacing/md
     Fill: semantic/color/surface/error-subtle
     Radius: semantic/radius/sm
     Contents:
       - Text: "MISSING: {Category/ComponentName} variant={X}"
       - Text: "Needed for {ScreenID} — see inventory CMP-NNN"
   ```
2. **Append to `design/12_GOVERNANCE/inventory.md`**:
   ```
   | CMP-NNN | Category/ComponentName | component | draft | Working / [Page Name] | Needed for {ScreenID} — {one-line desc from brief §5} | triggering_screen: {ScreenID} | requested_by: figma-screen-compose | requested_at: {sync-hash} |
   ```
   Two new fields beyond the existing schema: `triggering_screen` and `requested_by`. These let `design-governance` Phase B aggregate "what is the design system being asked for, and for which screens" — a roadmap signal.
3. **Continue composing** the rest of the section. Do **not** halt. Designer resolves the queue in batch via `figma-component` later.

`figma-parking-lot` reads the `draft` entries with `requested_by: figma-screen-compose` and surfaces them as a needed-but-missing queue at the start of each session.

### B.5 — Visually-plausible-but-semantically-wrong detection

For every VARIANT property selection, cross-check against brief Section 6's explicit state-to-variant mapping. If the brief is silent on which variant matches the state, **flag as a deviation in the plan rather than guessing**. The canonical failure case: composing Button/Neutral for a "Save" action when brief intent (and design system convention) is Button/Primary.

### B.6 — Write the composition log

After each frame is composed, append to `design/15_FIGMA/composition-logs/{ScreenID}_composition-log.md`:

```markdown
<!-- artifact: design/15_FIGMA/composition-logs/{ScreenID}_composition-log.md | version: N | mode: figma-screen-compose | updated: YYYY-MM-DD | evidence: design/13_CANVAS/{ScreenID}_*.md@vM -->

# Composition Log — {ScreenID}

## Frame 1.1 — {Frame name}

**Composed at:** YYYY-MM-DD HH:MM
**Brief sync-hash at composition:** {hash}
**Composition sync-hash:** {hash}
**Wrapper node:** {nodeId}

### Sections placed
| Section | Component | componentKey | nodeId | Property overrides | Source brief sections |
|---|---|---|---|---|---|
| PageHeader | Navigation/TopBar | ... | ... | TEXT pageTitle="Dashboard"; VARIANT density=comfortable; BOOLEAN showSearch=true | §4, §7, §8 |
| Hero | State/Empty | ... | ... | TEXT headline="No data yet"; INSTANCE_SWAP icon=Icon/Database | §4, §5, §7 |

### Deviations accepted by designer
- (None) | OR | Brief §6 silent on Save button variant → composed as Button/Primary per design system convention. Designer accepted YYYY-MM-DD.

### Designer overrides accepted (post-composition, from figma-handoff)
- (None) | OR | YYYY-MM-DD: Designer changed Hero gap from semantic/spacing/lg to semantic/spacing/xl in Figma. Recorded as one-off; brief not updated.

### Missing components flagged
- (None) | OR | CMP-NNN ListItem variant=destructive — placeholder dropped, queued to inventory + parking-lot.

### Token gaps flagged
- (None) | OR | brief §8 references semantic/color/feedback/warning-strong — not in current Foundation collection. Composed with semantic/color/feedback/warning. Flagged for figma-tokens.

### Proposed brief edits (NOT auto-applied — designer must accept in brief MD)
- (None) | OR | Section 7 currently reads "Add record"; composed instance uses "Add your first record" per brief §6 empty-state language. Recommend Section 7 update.

---

<!-- composition-sync-hash: {hash} -->
```

The log is **append-only**. Re-running composition for this screen appends a new "Frame 1.X" block; old entries stay.

### B.7 — Back-pressure (none auto-applied)

After Phase B completes a screen, surface in Claude Code:

- Inventory `draft` entries written this run → "{N} components flagged as needed-but-missing. Run `figma-component` when ready."
- Token gaps flagged → "{N} token gaps. Run `figma-tokens` when ready."
- Brief edit proposals → "{N} brief edits proposed in commented blocks at the bottom of `design/13_CANVAS/{ScreenID}_*.md`. Review and accept manually."
- Story orphans (Section 2 references story IDs not in story map) → "Run `node design/scripts/sync-traceability.js`."

---

## Sync versioning

After Phase B writes or updates the composition log:

```bash
node design/scripts/sync-version.js init <log-file> figma-screen-compose   # first time
node design/scripts/sync-version.js bump <log-file>                         # subsequent updates
node design/scripts/sync-manifest.js figma-screen-compose                   # update manifest
node design/scripts/sync-composition.js                                     # validate composition ↔ brief ↔ inventory
```

---

## Develop loop sync — asymmetric direction rules

This skill participates in the Tier 4 Develop sync loop, but introduces an **asymmetry**:

| Direction | Trivial change (content/label) | Structural change |
|---|---|---|
| **Canvas → Figma → Prototype** | Auto-sync (existing rule) | Flag drift, designer approves |
| **Figma → Canvas (via composition log)** | **Always require approval** — proposed brief edit written as commented block | **Always require approval** |

Why the asymmetry: composition log is *evidence* of what got built; brief is the *intent ledger*. Conflating them erodes the brief's role as single source of truth. Trivial drift is recorded but never silently merged upward into the brief.

---

## Designer-in-the-loop checkpoints

| Where | What designer does | Why this checkpoint |
|---|---|---|
| End of Phase A | Reviews plan + gap report in Claude Code | Catches brief gaps before any Figma mutation |
| Per section in Phase B | Reviews per-section screenshot in Claude Code | Catches visual issues before they cascade |
| 3-iteration cap | Forced designer review | Prevents agent thrash on persistent failures |
| End of Phase B | Reviews back-pressure summary in Claude Code | Decides which downstream skills to invoke |
| Brief edit proposals | Edits brief MD directly to accept proposals | Keeps brief as a curated artifact |
| Inventory `draft` queue | Invokes `figma-component` to resolve missing components | Composition does not block on missing components |
| Designer fine-tunes in Figma directly | Next session, `figma-handoff` classifies as designer override on logged composition | Handoff feeds back into the composition log |

---

## Inputs / outputs summary

**Reads:**
- `design/13_CANVAS/{ScreenID}_*.md` — canvas brief
- `design/12_GOVERNANCE/inventory.md` — filter to `status: published`
- Linked-library variable collections via `figma_get_variables`
- Current Figma page state (artboards, sub-frames, staging area)
- `design/14_WIREFRAME/{ScreenID}.txt` — soft-gate check

**Writes:**
- Figma file mutations (within wrapper frame inside Content sub-frame)
- Optional `[ANNOTATION] Stories` frame next to the rightmost artboard
- `design/15_FIGMA/composition-logs/{ScreenID}_composition-log.md` (append-only)
- `design/12_GOVERNANCE/inventory.md` — `draft` entries for missing components (with `triggering_screen` and `requested_by` fields)
- Commented-block proposed edits at the bottom of canvas brief MD (never auto-applied)

**Never writes:**
- Tokens / variables (delegate to `figma-tokens`)
- New components (delegate to `figma-component`)
- Brief body sections (proposes edits as comments only)
- Parking-lot moves (delegate to `figma-parking-lot`)

---

## Anti-patterns

- **Bypassing this skill with raw `figma_execute`** — loses composition logging, screenshot review, back-pressure. Use this skill instead.
- **Instantiating local or staged components** — they have no `componentKey` discipline; downstream library updates won't propagate.
- **Calling `node.characters` instead of `setProperties`** — bypasses component property system; lets placeholder text leak.
- **Full-page screenshots** — hide truncation, overlap, missing instances.
- **Skipping the wrapper frame** — guarantees orphan nodes when later mutations try to reparent.
- **Auto-applying proposed brief edits** — erodes the brief's intent ledger.
- **Blocking on missing components** — kills batch-workload throughput. Use placeholder + queue.
- **Looping past 3 iterations on a single section** — the issue is not iteration; force designer review.

---

## Position in the Figma pipeline

| # | Skill | Status |
|---|---|---|
| 1 | `figma-connect` | Always first |
| 2 | `figma-handoff` | Detect designer changes |
| 3 | `figma-file-setup` | If new file |
| 4 | `figma-tokens` | Tokens before elements |
| 5 | `figma-page-setup` | Per new page |
| 6 | `figma-component` | Per new component |
| **7** | **`figma-screen-compose`** | **Per screen — places instances into the page-setup frames** |
| 8 | `figma-parking-lot` | End of completed page |
| 9 | `figma-inventory` | After lifecycle changes |
| 10 | `figma-audit` | Before library migration |
| 11 | `figma-docs` | After audit |
| 12 | `figma-library-mode` | Migration phase only |
