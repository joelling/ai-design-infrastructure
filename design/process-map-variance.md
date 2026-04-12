# FigJam Process Map — Variance Analysis

> **Source:** [AI-Design-process FigJam board](https://www.figma.com/board/y0kFjCV8UaqcKjZgR75TEL/AI-Design-process?node-id=0-1)
> **Canvas reviewed:** "Design Process — Service Blueprint + Human Intent Map — 2026-04-03"
> **Compared against:** `design/process/*.md`, `.claude/skills/*/SKILL.md`, `CLAUDE.md`
> **Board read via:** Figma Console MCP (`figjam_get_board_contents`, `figjam_get_connections`, `figma_execute`)
> **Date:** 2026-04-09
> **Method:** All 532 board nodes and 599 connectors extracted and reviewed programmatically

---

## Board state verified ✓

These items from the previous variance report were confirmed correct in the current board:

| Item | Board | Toolchain | Status |
|---|---|---|---|
| Mode count | 16 (M01–M16) | 16 | ✓ |
| Mode 14 | Clickable Wireframe | Clickable Wireframe | ✓ |
| Figma pipeline skills | ①–⑪ (11 steps) | 11 mandatory skills | ✓ |
| Artifact paths | `14_WIREFRAME`, `16_PROTOTYPE` | Same | ✓ |
| BRD story AC notation | "(untagged story AC)" for M05 | Untagged by convention | ✓ |
| Figma audit checks | 10 listed | 10 defined | ✓ |
| Missing skills (handoff, inventory, docs) | All present | All defined | ✓ |

---

## Section 1 — Structural variances (toolchain drift since April 5)

Six variances introduced by commit `58421a3` (2026-04-05): "Extend skills with screen reader specs, variable binding patterns, and token fallback chain."

---

### V-01 — M10 Accessibility: `screen-reader-specs/` output missing

| | Board | Toolchain |
|---|---|---|
| M10 artifact node | `accessibility-requirements.md · color-contrast-audit.md · aria-patterns.md · keyboard-nav-plan.md · _upstream.md` | Same files **plus** `design/10_ACCESSIBILITY/screen-reader-specs/[screen-name]-sr-spec.md` |

A new Step 5 was added to `design-accessibility` (lines 183–227) that produces per-screen screen reader specification files. Each file defines: navigation order table (element / role / announcement / notes), landmark structure, dynamic `aria-live` announcements, and 44×44px touch target validation.

**Why it matters:** These specs are consumed downstream by `figma-component` (to set ARIA role descriptions on components), `design-canvas` (to populate the a11y section of canvas briefs), and `design-prototype` (to implement ARIA attributes in the coded prototype). Without them in the board, someone following the diagram will not know to produce these files before entering the Figma pipeline.

**Reference:** `.claude/skills/design-accessibility/SKILL.md` lines 183–227

---

### V-02 — Figma component: variable binding enforcement not shown

| | Board | Toolchain |
|---|---|---|
| ⑥ figma-component node | "ALL values bound to variables" | Same, **plus** mandatory `setExplicitVariableModeForCollection` recursive call after every batch of bindings |

A new variable binding enforcement section was added (`.claude/skills/figma-component/SKILL.md` lines 157–171). After binding variables to any component, the function `applyMode()` must be called recursively on the node and all its children. Skipping this causes variables to appear unresolved in Figma's UI — a condition called "ghost mode." The same rule is codified in `_figma-api-rules.md` as Rule 15 (critical).

**Why it matters:** Without this step on the board, Claude will bind variables correctly but skip the recursive mode enforcement, producing components that appear broken in Figma's variable inspector.

**Reference:** `.claude/skills/figma-component/SKILL.md` lines 157–171; `.claude/skills/_figma-api-rules.md`

---

### V-03 — Figma tokens: three-level fallback chain not shown

| | Board | Toolchain |
|---|---|---|
| ④ figma-tokens node | Lists the three collections (Primitives, Semantic, Component) but shows no resolution order | Added three-level lookup: Component → Semantic → Primitive. If a token doesn't exist at a level, create it at that level first — never skip levels to use raw values. |

The token resolution fallback chain is now a mandatory decision before binding any value. A process engineer following the board will not know to check all three levels before creating a new token.

**Reference:** `.claude/skills/figma-tokens/SKILL.md` lines 30–39

---

### V-04 — Figma tokens: motion tokens collection absent

| | Board | Toolchain |
|---|---|---|
| ④ figma-tokens node | "Primitives collection: raw colors, spacing, radius" | `06_Motion` collection now active with duration and easing values |

The `06_Motion` collection was previously marked 🚧 (in progress). It is now fully documented with production values:

```
motion-duration/instant   "100ms"
motion-duration/fast      "200ms"
motion-duration/normal    "300ms"
motion-duration/slow      "500ms"
motion-easing/ease-out    "cubic-bezier(0.0, 0.0, 0.2, 1)"
motion-easing/ease-in     "cubic-bezier(0.4, 0.0, 1, 1)"
motion-easing/ease-in-out "cubic-bezier(0.4, 0.0, 0.2, 1)"
```

These are STRING type because Figma variables cannot natively store easing curves.

**Reference:** `.claude/skills/figma-tokens/SKILL.md` lines 419–438

---

### V-05 — Figma file-setup: build state persistence artifact missing

| | Board | Toolchain |
|---|---|---|
| ③ figma-file-setup node | No mention of multi-session state | New artifact `design/foundation-build-state.json` for Foundation DLS builds spanning 20–100+ `figma_execute` calls |

A new state persistence section was added (`.claude/skills/figma-file-setup/SKILL.md` lines 62–91). The state file tracks: `fileKey`, `currentStep`, `completedSteps`, entities (pages, collections, styles, doc components), and `lastUpdated`. A resume protocol recovers from mid-build session breaks.

**Why it matters:** Foundation DLS builds are long-running. Without state persistence, a session break forces a full restart, risking duplicate nodes or lost work.

**Reference:** `.claude/skills/figma-file-setup/SKILL.md` lines 62–91

---

### V-06 — Variable scopes enforcement absent from all board nodes

| | Board | Toolchain |
|---|---|---|
| Any Figma pipeline node | Not mentioned | Rule 18 (critical): Set `variable.scopes` explicitly on every variable — never leave as `ALL_SCOPES` |

The rule defines explicit scope types per variable purpose:
- Background fills → `FRAME_FILL, SHAPE_FILL`
- Text → `TEXT_FILL`
- Border/stroke → `STROKE_COLOR`
- Spacing → `GAP`
- Radii → `CORNER_RADIUS`
- Primitives (hidden from picker) → `[]`

**Reference:** `.claude/skills/_figma-api-rules.md` Rule 18

---

### V-07 — Develop loop drift sync: partial inaccuracy

| Change type | Board "Drift type?" diamond | CLAUDE.md toolchain |
|---|---|---|
| Content / label | "auto-sync brief" | Auto-sync **all three nodes** |
| State addition / removal | "auto-sync brief" | Auto-sync **all three nodes** |
| Visual tweak | "auto-sync prototype + note brief" | Figma → Prototype auto-syncs. Brief notes delta. ✓ |
| Structural | "FLAG DRIFT: approve direction → brief first → Figma → prototype" | Flag drift — designer approves, canvas brief updates first, then propagates. ✓ |

For content/label and state changes, the board implies only the canvas brief is auto-synced. The toolchain requires all three nodes (canvas brief, Figma screens, and prototype) to update automatically. This is compounded by a second node in M15 that says "Cosmetic (color, label, state): auto-syncs on next figma-connect · Brief notes the delta only" — contradicting the diamond and incorrectly placing "label" changes in the "brief only" category.

**Reference:** `CLAUDE.md` "Develop loop sync rules" table

---

## Section 2 — Decision node clarity (42 diamonds reviewed)

### D-01 — Systemic: all 599 connectors have empty text labels

Every connector on the board carries an empty `text` field. No connector is labelled "Yes", "No", "Proceed", "Approved", "Block", or any routing term.

**Impact:** Routing logic that belongs on connector labels has been embedded inside diamond text as a workaround. This makes every multi-way diamond node overloaded — it must state both the question AND the answer routing — which is the root cause of most issues in D-02 through D-13 below.

**Not a toolchain variance** — this is a diagram legibility issue that affects how the board communicates decisions to a process engineer.

---

### D-02 — Three-way routing inside a binary diamond shape (×12 occurrences)

> "Upstream changed? Additive → proceed / Corrective → re-process delta only / Structural → flag designer, may block"

This diamond appears identically in M01 through M12. A diamond shape visually communicates a binary decision (two outgoing paths). This decision has three mutually exclusive paths, and the routing is written inside the node text rather than on outgoing connectors.

**Suggested fix:** Keep the question "Upstream changed?" in the diamond. Move routing to three labeled outgoing connectors: "No change", "Additive (new inputs)", "Corrective or structural (existing inputs revised)".

---

### D-03 — Script name embedded in decision label

> "sync-traceability.js · Zero errors + zero warnings? YES → proceed to Figma / NO → orphan IDs found"

Three separate things are conflated: the name of the script that runs (belongs in a PREDEFINED\_PROCESS node before the diamond), the binary question, and the two connector labels.

**Suggested fix:** Preceding action node: "Run sync-traceability.js". Diamond: "Traceability validation passed?" Connectors: "Yes" / "No — orphan IDs found".

---

### D-04 — Ambiguous question without routing options

> "Changes existing findings?" *(M01, Designer swimlane)*

No routing options are visible. The actor, the change type, and the two possible paths are all absent.

**Suggested fix:** "Does the new input contradict existing findings?" → "Yes (investigate)" / "No (proceed)"

---

### D-05 — Non-binary routing presented without options

> "How far does the shift reach?" *(M02, Designer swimlane)*

Not a decision with discrete paths — closer to a rhetorical sub-heading. No options are listed. A process engineer cannot determine which connector to follow.

**Suggested fix:** "Does the change cascade beyond this mode?" → "Yes (structural cascade)" / "No (isolated fix)"

---

### D-06 — Vague categorisation with no options shown

> "Design issue or scope change?" *(M04)*

"Design issue" and "scope change" are not mutually exclusive. No routing options are listed.

**Suggested fix:** "What type of deviation was identified?" → two labeled connectors: "Design quality issue → M11" and "Scope change → M05"

---

### D-07 — Routing table masquerading as decision diamond

> "Issue routing: → design-interaction (state/behavior issues) → design-content (confusing labels) → design-accessibility (contrast/ARIA) → design-ia (missing screens/nav) → design-stories (goals not served) → design-visual (hierarchy unclear)" *(M11)*

This is a routing lookup table (six targets) inside a diamond shape that implies a binary decision. A process engineer will look for two outgoing connectors and find six.

**Suggested fix:** Change the shape to ROUNDED\_RECTANGLE (action box with title "Route issue to upstream mode") or a reference note. The six routing paths become connector targets or a text list, not diamond paths.

---

### D-08 — Five-way routing in a single diamond

> "Backward propagation depth? AC gap only → auto-add \[CANVAS\] bullet / Missing story → approve new DS-NNN / Missing journey stage → approve reorder / New persona behavior → approve model update / New persona entirely → HARD BLOCK" *(M13)*

Five discrete paths embedded in one diamond. The content is correct and valuable, but a process engineer cannot trace which outgoing connector maps to which path when all five are inside the node text.

**Suggested fix:** Diamond = "How far back does the implied change reach?" → five labeled outgoing connectors, one per path. Or keep the embedded text but add a note shape annotation marking this as a routing summary table, not a standard binary decision.

---

### D-09 — Ambiguous label for production intent

> "Real screen concept or exploratory only?" *(M13)*

"Real screen concept" is undefined. Does it mean stakeholder-confirmed? In sprint scope? Having a canvas brief?

**Suggested fix:** "Does this sketch become a production screen?" → "Yes → enter canvas-first workflow" / "No → mark as spike, no pipeline entry"

---

### D-10 — Terminology conflicts with the toolchain's defined terms

> "Cosmetic or structural change?" *(M15)*

The toolchain (CLAUDE.md) uses "visual tweak" for auto-sync changes and "structural" for designer-approval changes. "Cosmetic" is a synonym that does not appear in the glossary or toolchain documentation, creating a silent mismatch.

**Suggested fix:** Align terminology with CLAUDE.md: "Change type?" → "Visual tweak (auto-sync)" / "Structural (designer approval required)"

---

### D-11 — Double question

> "Prototype → Brief improvement? Better interaction discovered during prototyping?" *(M16)*

The arrow notation describes the check direction; the second sentence is the actual question. Redundant and ambiguous.

**Suggested fix:** "Better interaction discovered in prototype?" → "Yes (flag for brief update)" / "No"

---

### D-12 — Process step embedded in decision label

> "Brief → Prototype drift? Component / state / content check · Discrepancy found?" *(M16)*

"Component / state / content check" is the action that precedes the decision — it belongs in a prior action node, not inside the diamond.

**Suggested fix:** Preceding action: "Compare prototype against canvas brief (components, states, content)". Diamond: "Canvas brief diverges from prototype?"

---

### D-13 — Same pattern as D-12

> "Figma → Prototype drift? Screenshot compare · Visual discrepancy found?" *(M16)*

**Suggested fix:** Preceding action: "Screenshot-compare Figma screens against prototype". Diamond: "Figma screens diverge from prototype?"

---

## Section 3 — Action node label issues (107 nodes reviewed)

Nodes where the label describes a rule, state, or outcome rather than an action the actor takes.

---

### A-01 — Rule stated as action *(M04, Claude AI swimlane)*

> "One swimlane flow per JTBD · Swimlanes: User / System / External / Admin · Map full happy path first"

"One swimlane flow per JTBD" is a structural constraint, not an action. The node reads as a rule (what the output should look like) rather than something Claude does.

**Suggested fix:** "Create one swimlane diagram per JTBD · Swimlanes: User / System / External / Admin · Map happy path first, then exceptions"

---

### A-02 — Warning note in an action shape *(M03, Claude AI swimlane)*

> "⚠ NOTHING happens automatically · No watchers. No hooks. No AI trigger. Version header goes stale silently."

This is an advisory note about system behaviour, not an action Claude takes. Placing it in a ROUNDED\_RECTANGLE process box implies it is a step in the workflow when it is actually a caveat.

**Suggested fix:** Use a sticky note shape with ⚠ colour coding, placed as a floating annotation outside the swimlane. It should be visible near the _upstream.md database shape it pertains to, not in the process flow.

---

### A-03 — Reference matrix repeated as action across multiple modes *(M01–M12, Claude AI swimlane)*

> "Staleness severity matrix · Additive: ... / Corrective: ... / Structural: ..."

This lookup matrix appears repeatedly — once per mode — inside action boxes. It duplicates the routing logic already embedded in the "Upstream changed?" diamonds (D-02) and adds no new process step.

**Suggested fix:** Extract to a single shared reference card in the legend/vocabulary area. Replace each per-mode instance with a pointer annotation or remove entirely (since the diamond already contains this routing information).

---

### A-04 — Outcome stated as an action *(M01, Claude AI swimlane)*

> "Structural change: problem reframed · Designer approves cascade scope · All downstream modes flagged stale"

"All downstream modes flagged stale" is a system side-effect (an outcome), not an action Claude initiates. "Designer approves" belongs in the Designer swimlane.

**Suggested fix:** Split into: Designer swimlane → "Approve cascade scope"; Claude AI swimlane → "Flag all downstream modes as stale" (a distinct action node in Claude's lane).

---

### A-05 — Routing description as action *(M04, Claude AI swimlane)*

> "Design issue → designer routes to validation (M11) for classification → M11 routes to correct upstream mode"

The "→" notation describes handoff routing, not an action. This should be captured as labeled connectors, not a process box.

**Suggested fix:** Remove the node; represent as labeled connectors from the preceding decision diamond ("Design quality issue" path → M11).

---

### A-06 — Routing description as action *(M05, Claude AI swimlane)*

> "Scope decision → designer updates story priorities in M05 → downstream modes stale-flagged"

Same pattern as A-05.

**Suggested fix:** Remove the node; represent as labeled connector from the preceding decision diamond ("Scope change" path → M05).

---

### A-07 — Outcome and trigger description as action *(M13, Claude AI swimlane)*

> "Real concept → canvas-first workflow triggered (M13) · Backward propagation infers DS-NNN stories & IA entries"

"Workflow triggered" and "backward propagation infers" are outcomes of the decision in D-09, not independent actions.

**Suggested fix:** Remove the node; this content belongs on the "Yes" connector from D-09, not in a separate action box.

---

### A-08 — Routing rules as actions *(Scripts swimlane, M13)*

Two nodes:
- "Orphan story ID → route to design-stories (M05) to add missing DS-NNN to story map"
- "Orphan screen ID → route to design-ia (M06) to update screen-inventory.md"

"→ route to" is a routing instruction, not an action in the Scripts swimlane. These are outputs of the traceability validation check (D-03), not independent script steps.

**Suggested fix:** Represent as labeled connectors from the "No" output of D-03 pointing to the appropriate upstream mode column.

---

### A-09 — Overloaded gate node conflating multiple concerns *(M15, Claude AI swimlane)*

> "⛔ HARD BLOCK: no canvas brief = no screen build · ⚠ SOFT GATE: wireframe review pending? (warn, not block) ─ 1. figma-connect: verify connection + active file · 2. figma-handoff: detect designer changes · 3. figma-file-setup: if file new/blank..."

A single node combines: two gate conditions (which should each be a decision diamond), a question mark (visually suggesting a decision inside an action box), and the first three steps of the Figma pipeline. This is four different elements in one shape.

**Suggested fix:** Break into:
1. Decision diamond: "Canvas brief exists?" → ⛔ HARD BLOCK connector / proceed connector
2. Decision diamond: "Wireframe reviewed?" → ⚠ warn connector (designer can override) / proceed connector
3. Separate numbered action boxes for ①, ②, ③

---

## Section 4 — Connector vocabulary

The vocabulary legend defines 14 connector styles (solid/dashed, colour-coded by swimlane). This legend is internally consistent and accurate.

**However:** All 599 connectors on the board have empty text labels. No connector carries a routing label. This is a systemic diagram legibility issue (documented as D-01) rather than a toolchain variance.

The practical consequence is that all routing communication is delegated to embedded diamond text, which inflates node labels beyond their intended purpose. Adding text labels to the outgoing connectors of decision diamonds — even just "Yes" / "No" or the route name — would allow each diamond to contain only its question, eliminating most of the issues in Sections 2 and 3.

---

## Section 5 — Glossary

Terms that appear in the board and warrant either definition in a legend or simplification in node labels.

| Term | Where it appears | Technical meaning | Plain language | Keep or simplify? |
|---|---|---|---|---|
| `sync-version bump` | PREDEFINED\_PROCESS nodes | Run `sync-version.js bump <file>` to increment the artifact version number | "Update artifact version number" | **Keep** in script nodes — maps directly to the toolchain command. Add plain description as a sub-label. |
| `sync-version.js init` | PREDEFINED\_PROCESS nodes | First-time initialisation of version tracking for a new artifact | "Initialise version tracking" | **Keep** in script nodes; **simplify** if it appears in Claude AI action boxes. |
| `sync-manifest.js <mode>` | PREDEFINED\_PROCESS nodes | Update the mode status registry to record completion | "Record mode completion" | **Keep** — same rationale as above. |
| `delta only` / `re-process delta` | Diamond text, action nodes | Process only new or changed inputs — not a full rebuild from scratch | "Process changes only" | **Simplify** in plain action labels; keep as a technical qualifier in script nodes. |
| `_upstream.md` | ENG\_DATABASE nodes | A file in each mode's artifact directory tracking upstream dependencies and when they were last read | "Upstream dependency tracker" | **Add to glossary** — currently labelled "read on entry / written on exit" which is accurate but the filename is opaque without context. |
| JTBD | M03, M04 action nodes | Jobs-to-be-done — the outcome the user is trying to achieve, technology-agnostic | "User goal (job-to-be-done)" | **Add to glossary** — spell out on first use. |
| DS-NNN | M05, M13 nodes and diamonds | Stable story ID format (e.g. DS-042) — never reused; splits retire the original | "Story ID (e.g. DS-042)" | **Add to glossary** — the format is opaque without explanation. |
| BR-NN | M04 nodes, BRD database node | Stable business rule ID format (e.g. BR-07) — never reused | "Business rule ID (e.g. BR-07)" | **Add to glossary** — same rationale. |
| AC | BRD database node, diamond text | Acceptance criteria — the conditions a story must satisfy to be considered done | "Acceptance criteria" | **Spell out on first use** — add to glossary. |
| DLS | Figma artifact node | Design Language System — the token and component library | "Design system library" | **Keep** (term of art); add to glossary. |
| HARD BLOCK | M15 gate node, M16 gate node | An absolute stop condition — the process cannot continue until the blocker is resolved | "Hard stop — cannot proceed" | **Keep** — the emphasis is intentional and the term is consistent with vocabulary legend. |
| SOFT GATE | M15 gate node | A warning condition — the designer is notified and can choose to override | "Warning — proceed with caution" | **Keep** — consistent with vocabulary legend. |
| MCP | PREDEFINED\_PROCESS nodes | Model Context Protocol — the communication layer between Claude and Figma via the Figma Console plugin | "Claude–Figma connection layer" | **Keep** in script nodes (technical audience); add to glossary. |
| SPIKE | M13 action node | An exploratory prototype or concept that is not intended for production and does not enter the pipeline | "Design experiment (throwaway)" | **Keep** — standard engineering term; add to glossary. |
| backward propagation | M13 diamond, action nodes | Tracing a new screen concept back up the tier hierarchy to determine what stories, journey stages, or personas it implies | "Reverse-inferring upstream intent from a sketch" | **Add to glossary** — core to M13 but undefined on the board. |
| staleness | Connector vocabulary legend | When an artifact is outdated because an upstream artifact it depends on has been updated | "Out of date (upstream changed)" | **Add to glossary** — appears in the legend without definition. |
| drift | Develop loop diamond nodes | When two artifacts that should be in sync have diverged | "Out-of-sync between artifacts" | **Add to glossary** — central to Tier 4 but undefined. |
| ghost mode | Not yet on board | Figma variables that appear unresolved because `setExplicitVariableModeForCollection` was not called after binding | "Unresolved variable (appears broken in Figma)" | **New term** — add to board and glossary when V-02 is fixed. |
| token resolution fallback chain | Not yet on board | Three-level lookup order (Component → Semantic → Primitive) for finding or creating the right variable before binding | "Token lookup order" | **New term** — add to board and glossary when V-03 is fixed. |
| walking skeleton | M14, M16 action nodes | The thinnest implementation that touches all backbone activities — used to validate end-to-end flow before detail is added | "Minimal end-to-end flow" | **Add to glossary** — appears in multiple nodes without definition. |
| BRD | BRD database node | Business Requirements Document — the master cross-track collaboration document | "Business requirements document" | **Spell out on first use** — add to glossary. |

---

## Summary

| Category | Count | Primary action |
|---|---|---|
| Structural variances (toolchain drift) | 7 (V-01–V-07) | Update FigJam board: add screen-reader-specs output to M10, add variable binding enforcement and token fallback chain to Figma pipeline nodes, add motion tokens to ④ tokens node, add state persistence to ③ file-setup node, add variable scopes rule, correct drift sync routing for content/label and state changes |
| Decision clarity issues | 13 (D-01–D-13) | Add text labels to outgoing connectors (resolves D-01 and downstream issues); restructure multi-way diamonds; align terminology with toolchain |
| Action node label issues | 9 (A-01–A-09) | Rewrite labels as imperative actions; convert routing descriptions to connectors; split overloaded nodes |
| Connector vocabulary | Systemic (D-01) | All 599 connectors lack text labels — routing relies entirely on embedded diamond text |
| Glossary terms needed | 22 terms | Add a glossary section to the FigJam board; 4 terms are new (not yet on board) and require V-02 and V-03 fixes first |

**Priority order for FigJam updates:**
1. V-01 through V-07 — structural accuracy (toolchain drift)
2. V-07 — drift sync accuracy (actively misleading)
3. D-01 — add connector labels to all decision outgoing paths (unblocks most D/A fixes)
4. D-02 — restructure the 12 repeated "Upstream changed?" diamonds
5. A-02, A-03 — convert warning notes and reference matrices to correct shapes
6. Remaining D and A items in priority order
