---
name: design-wireframe
description: >
  Builds clickable ASCII wireframes from canvas briefs for structural and flow validation
  before Figma execution. Static HTML with monospace styling — deliberately rough to elicit
  feedback on structure, not aesthetics. Disposable: archived when Figma begins.
  Triggers on: "wireframe", "ascii wireframe", "clickable wireframe", "structural review",
  "flow validation", "validate layout", "wireframe this screen", "sketch the flow",
  or when canvas briefs are ready and the designer wants structural validation before Figma.
  Upstream dependencies: canvas briefs (hard), walking skeleton, screen inventory.
---

# Clickable ASCII Wireframe — Structural Validation Before Figma

> **Quick reference**
> - **Purpose:** Validate flow, layout, and content hierarchy with stakeholders before Figma investment
> - **Inputs:** Canvas briefs (hard dep), walking skeleton, screen inventory
> - **Outputs:** Clickable HTML wireframes → `design/14_WIREFRAME/screens/`
> - **Hard rules:** Fidelity anchoring is non-negotiable. No colour, no polish. Feedback flows into canvas briefs, not Figma. Archived when Figma starts.
> - **Common mistake:** Making wireframes look too polished — if stakeholders comment on aesthetics, the wireframe is too refined

## Purpose

Translate canvas briefs into clickable ASCII wireframes that stakeholders can navigate in a browser. The wireframes validate structure and flow — are the right screens here, does the flow make sense, is content grouped correctly — without visual fidelity that would bias feedback toward aesthetics.

---

## Dependency check

### Hard dependencies (blocks if missing)

| Required | What it provides | How to check |
|----------|-----------------|-------------|
| Canvas briefs | Frame inventory, layout, components, content, states | `design/13_CANVAS/*.md` exists |

### Soft dependencies (used if available)

- `design/05_STORIES/walking-skeleton.md` — flow order for wiring screens
- `design/06_INFORMATION_ARCHITECTURE/screen-inventory.md` — screen list and purposes
- `design/05_STORIES/story-map.md` — secondary flows

---

## Upstream sync (step 0)

Before starting this mode's workflow:

0. **Value alignment check:** If `design/01_DISCOVERY/value-framework.md` exists, verify that wireframed screens trace to documented user needs. If an output cannot be connected, question whether it belongs.
1. Check `design/14_WIREFRAME/_upstream.md` for the dependency manifest
2. Compare recorded canvas brief versions against current briefs
3. If briefs have changed, report which wireframes are affected and ask: regenerate or proceed?
4. If regenerating, rebuild only affected wireframes — don't rebuild the full set

After completing this mode's workflow:

1. Add or increment `<!-- artifact: ... -->` version headers on all changed output files
2. Update `design/14_WIREFRAME/_upstream.md` with consumed canvas brief versions
3. Report that wireframes are ready for stakeholder review

### Script commands
```bash
# On entry — check staleness:
node design/scripts/sync-status.js

# After completing — version and manifest:
node design/scripts/sync-version.js init <file> design-wireframe   # first time
node design/scripts/sync-version.js bump <file>                     # subsequent updates
node design/scripts/sync-manifest.js wireframe                      # update manifest
```

---

## Workflow

### Step 1 — Scaffold

Create `design/14_WIREFRAME/` if it doesn't exist:

```
design/14_WIREFRAME/
├── _upstream.md
├── manifest.md
├── feedback/
├── archive/
└── screens/
    ├── index.html
    └── style.css
```

Copy `design/templates/wireframe-style.css` to `design/14_WIREFRAME/screens/style.css` if the file does not already exist. This static stylesheet is never regenerated — it enforces monospace font, single accent color for clickable regions, no other color, and `max-width: 72ch`.

### Step 2 — Build screen by screen

For each canvas brief in scope:

1. **Read the canvas brief:**
   - Section 1 (frame inventory) → how many wireframes this screen needs
   - Section 4 (layout and content hierarchy) → spatial arrangement
   - Section 5 (components needed) → component labels (use these names exactly)
   - Section 6 (states) → each significant state gets its own wireframe page
   - Section 7 (content specification) → real labels and text, never lorem ipsum

2. **Render the ASCII wireframe** using visual conventions:
   - Box-drawing characters: `┌ ┐ └ ┘ ├ ┤ ─ │`
   - `↓` / `→` for auto-layout direction
   - `[sticky]`, `[scrollable]`, `[collapsed]` for behavioural annotations
   - `(optional)` for conditionally visible regions
   - `{SlotName}` for dynamic/variable content areas
   - Max width: 72 characters

3. **Wrap in HTML** with shared stylesheet. Include:
   - Review framing header: *"You're reviewing STRUCTURE and FLOW. What's missing? What's in the wrong place? What shouldn't be here?"*
   - Footer: screen name, canvas brief reference, frame number
   - Navigation links to other screens

4. **One HTML file per frame per significant breakpoint.** Naming: `{ScreenID}_{screen-name}[_state][_breakpoint].html`

### Step 3 — Wire navigation

Following the walking skeleton as primary flow:

1. Mark clickable regions with `[▸ Label →]` in the ASCII art
2. Wrap clickable regions in `<a>` links pointing to target screen files
3. Wire all navigation paths from the IA navigation model
4. Add secondary flow links from the story map
5. Ensure every screen is reachable from the index

### Step 4 — Generate index

Create `screens/index.html`:
- Screen map: list of all screens with brief descriptions and links
- Flow diagram: walking skeleton order with screen-to-screen navigation
- Legend: explanation of wireframe conventions (box-drawing, annotations, clickable syntax)
- Entry point for stakeholder review

### Step 5 — Stakeholder review

Present wireframes for review. For each review round, copy `design/templates/wireframe-feedback.tpl.md` to `design/14_WIREFRAME/feedback/round-N.md`. Collect structured feedback per screen (missing / wrong / unnecessary / misplaced) and at the flow level (missing screens, wrong order, dead ends).

### Step 6 — Incorporate feedback

For each piece of structural feedback:
1. Update the relevant **canvas brief** (not the wireframe directly)
2. Regenerate affected wireframes from updated briefs
3. Update the manifest with feedback round summary
4. Repeat review if structural changes are significant

### Step 7 — Archive

When Figma execution begins for these screens:
1. Move wireframe HTML files to `archive/`
2. Note archive date in manifest
3. Wireframes are no longer maintained or referenced

---

## Fidelity anchoring rules (non-negotiable)

1. **Visual anchoring.** Monospace font, box-drawing characters, no colour except single accent for clickable regions. No CSS that could be mistaken for design intent.

2. **Review framing.** Every page includes: *"You're reviewing STRUCTURE and FLOW. What's missing? What's in the wrong place? What shouldn't be here?"*

3. **Feedback capture.** Structured feedback template feeds back into canvas briefs, never into Figma.

4. **Deliberate disposability.** Archived when Figma starts. Never maintained alongside high-fidelity work.

5. **Naming discipline.** This is `design-wireframe`, never "lo-fi prototype." `design/14_WIREFRAME/`, never "low-fidelity prototype directory."

---

## Rules

- **Canvas briefs are the source.** Wireframes are rendered from canvas briefs. Changes go to the brief first, then the wireframe is regenerated.
- **Component labels must match.** Every label in the wireframe matches canvas brief Section 5 names.
- **Use real content.** Pull labels and text from canvas brief Section 7. Placeholder text defeats content validation.
- **Walking skeleton first.** Wire the walking skeleton flow before secondary flows.
- **One wireframe per frame per significant breakpoint.** Only where layout fundamentally changes.
- **Wireframes are disposable.** Archived when Figma starts, never synced, never maintained.
- **If stakeholders comment on aesthetics, the wireframe is too refined.** Strip it back.

---

## Output checklist

- [ ] `design/14_WIREFRAME/manifest.md` — complete with screen mappings and review status `[synthesis]`
- [ ] `design/14_WIREFRAME/screens/index.html` — entry point with screen map and flow `[synthesis]`
- [ ] `design/14_WIREFRAME/screens/style.css` — monospace, no polish `[pure template]`
- [ ] `design/14_WIREFRAME/feedback/round-N.md` — structured feedback per review round `[pure template]`
- [ ] All wireframe pages include review framing header
- [ ] All clickable regions link to correct target screens
- [ ] Walking skeleton flow navigable end-to-end
- [ ] Component labels match canvas brief Section 5 names
- [ ] Real content from canvas brief Section 7, no lorem ipsum
- [ ] All screens reachable from index
