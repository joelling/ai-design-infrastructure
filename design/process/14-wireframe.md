---
operation: query
---

# Clickable ASCII Wireframe

> **Tier 4 — Develop** | Mode: `design-wireframe`

## Why this matters

When stakeholders review polished prototypes, they give feedback on visual polish — colours, fonts, spacing — instead of structure. This is the fidelity trap: high fidelity signals "this is finished, critique the surface" rather than "this is a draft, challenge the structure." By the time someone says "actually, this whole screen shouldn't exist," the team has already invested hours in Figma and code.

Clickable ASCII wireframes solve this. Their deliberate roughness creates psychological permission for fundamental feedback. They validate flow, layout, and content hierarchy at near-zero cost — before any Figma investment.

## The mental model

You are sketching on a whiteboard with a marker, except the whiteboard is clickable. Stakeholders can walk through the flow, tap between screens, and experience the information architecture — without anything visual to distract them. The wireframe answers: "Are the right screens here? Does the flow make sense? Is the content grouped correctly? Is anything missing?" It does not answer: "Does it look good?"

## Position in the Develop pipeline

Wireframes sit between canvas synthesis and Figma execution:

```
Canvas Brief ──► ASCII Wireframe ──► Figma Screens ──► Prototype
  (intent)      (flow + layout       (visual            (interaction
                 validation)          execution)          fidelity)
```

Wireframes are a **validation gate**, not a sync node. They do not participate in the Tier 4 sync loop. They are created, reviewed, and archived:

- Created from canvas briefs
- Reviewed by stakeholders for structural feedback
- Feedback flows back into canvas briefs
- Archived when Figma execution begins — never maintained alongside Figma
- No drift detection against wireframes

The Tier 4 sync loop remains three nodes: Canvas ↔ Figma ↔ Prototype.

## Inputs

| Artifact | What it provides | Path |
|----------|-----------------|------|
| Canvas briefs | Frame inventory, layout hierarchy, component list, content, states | `design/13_CANVAS/*.md` |
| Walking skeleton | Flow order for wiring screens | `design/05_STORIES/walking-skeleton.md` |
| Screen inventory | Screen list and purposes | `design/06_INFORMATION_ARCHITECTURE/screen-inventory.md` |

## Upstream sync

**On entry:** Check `design/14_WIREFRAME/_upstream.md` (if it exists). Compare recorded canvas brief versions against current briefs. If briefs have changed since last run:

1. Report which canvas briefs changed and which wireframes are affected
2. Ask the designer: regenerate affected wireframes, or proceed with current?
3. If regenerating, rebuild only affected screen wireframes — don't rebuild the full set

**On completion:** After producing or updating wireframes:

1. Update `design/14_WIREFRAME/_upstream.md` with consumed canvas brief versions
2. Report that wireframes are ready for stakeholder review

## Process

**0. Check upstream sync.** Run the upstream sync check described above. Verify canvas briefs exist for screens to be wireframed.

**1. Scaffold wireframe directory.** Create `design/14_WIREFRAME/` structure if it doesn't exist: `screens/`, `feedback/`, `archive/`. Copy `design/templates/wireframe-style.css` to `design/14_WIREFRAME/screens/style.css` if the file does not already exist — this static stylesheet is never regenerated.

**2. Build screen by screen.** For each canvas brief in scope:
   - Read Section 1 (frame inventory) — determines how many wireframes this screen needs
   - Read Section 4 (layout and content hierarchy) — determines spatial arrangement
   - Read Section 5 (components needed) — labels match these names exactly
   - Read Section 6 (states) — each significant state gets its own wireframe
   - Read Section 7 (content specification) — use actual labels and text, not placeholder lorem ipsum
   - Render one ASCII wireframe per frame, per breakpoint where layout significantly changes
   - Wrap in HTML with shared stylesheet

**3. Wire navigation.** Connect screens following the walking skeleton as primary flow:
   - Mark clickable regions with `[▸ Label →]` syntax
   - Link to target screen HTML files
   - Wire all navigation paths from the IA navigation model
   - Add secondary flow links from the story map

**4. Add review framing.** On every wireframe page, insert:
   - Header prompt: *"You're reviewing STRUCTURE and FLOW. What's missing? What's in the wrong place? What shouldn't be here?"*
   - Footer with screen name, canvas brief reference, and frame number

**5. Generate index.** Create `screens/index.html`:
   - Screen map listing all screens with descriptions
   - Flow diagram showing walking skeleton navigation
   - Entry point for stakeholder review

**6. Stakeholder review gate.** Present wireframes for review. For each review round, copy `design/templates/wireframe-feedback.tpl.md` to `design/14_WIREFRAME/feedback/round-N.md`. Collect structured feedback:
   - Per screen: what's missing, what's wrong, what's unnecessary, what's in the wrong place
   - Flow-level: what screens are missing, what's the wrong order, where do users get lost

**7. Incorporate feedback.** For each piece of structural feedback:
   - Update the relevant canvas brief (not the wireframe directly)
   - Regenerate affected wireframes from updated briefs
   - Record the feedback round in the manifest

**8. Archive.** When Figma execution begins for these screens:
   - Move wireframe HTML files to `archive/`
   - Note archive date in the manifest
   - Wireframes are no longer maintained or referenced

## Outputs

| File | Type | What it contains |
|------|------|-----------------|
| `design/14_WIREFRAME/manifest.md` | synthesis | Screen-to-file mapping, review status, feedback round history |
| `design/14_WIREFRAME/screens/*.html` | synthesis | Clickable ASCII wireframe pages |
| `design/14_WIREFRAME/screens/style.css` | pure template | Shared monospace stylesheet — copied from `design/templates/wireframe-style.css`; never regenerated |
| `design/14_WIREFRAME/feedback/round-N.md` | pure template | Structured feedback capture — copied from `design/templates/wireframe-feedback.tpl.md` per review round |

*`_upstream.md` is maintained by `sync-manifest.js` and is not a mode deliverable.*

### Manifest format

```markdown
# Wireframe Manifest

## Screen mapping

| Screen | Canvas brief | Wireframe files | Review status |
|--------|-------------|----------------|---------------|
| [name] | [brief path] | [file list] | pending / reviewed / archived |

## Flow mapping

| Flow | Screens (in order) |
|------|-------------------|
| Walking skeleton | [screen list] |
| [secondary flow] | [screen list] |

## Feedback rounds

| Round | Date | Screens reviewed | Key changes |
|-------|------|-----------------|-------------|
| 1 | [date] | [screens] | [summary] |
```

## Fidelity anchoring rules

These rules ensure the wireframe's roughness works as intended. They are non-negotiable.

1. **Visual anchoring.** Monospace font, box-drawing characters, no colour except a single accent for clickable regions. No CSS that could be mistaken for design intent. No images, no icons, no gradients.

2. **Review framing.** Every wireframe page includes a header prompt: *"You're reviewing STRUCTURE and FLOW. What's missing? What's in the wrong place? What shouldn't be here?"* This resets stakeholder expectations on every page.

3. **Feedback capture.** Wireframe output includes a structured feedback template that feeds back into canvas briefs — never into Figma directly. The wireframe is not a design deliverable.

4. **Deliberate disposability.** Wireframes are explicitly archived when Figma starts. They do not persist as a reference during high-fidelity work. This prevents "but the wireframe showed it differently" during Figma review.

5. **Naming discipline.** The skill is `design-wireframe`, never "lo-fi prototype" or "low-fidelity prototype." The artifact directory is `design/14_WIREFRAME/`. Language shapes perception — these are wireframes, not prototypes.

## Visual conventions

- Box-drawing characters: `┌ ┐ └ ┘ ├ ┤ ─ │`
- Component labels match canvas brief Section 5 component names exactly
- `↓` / `→` indicate auto-layout direction
- `[sticky]`, `[scrollable]`, `[collapsed]` for behavioural annotations
- `(optional)` for conditionally visible regions
- `{SlotName}` for dynamic/variable content areas
- Clickable regions: `[▸ Label →]` with accent colour, linked to target screen
- `── breakpoint NNNpx ──` separators for responsive variants
- Max width: 72 characters per wireframe (fits terminal, markdown, and brief readability)

### Example wireframe

```
┌─────────────────────────────────────────┐
│ TopNav [sticky]                         │
│  Logo   [▸ Search →]   [▸ Profile →]   │
├─────────────────────────────────────────┤
│ →                                       │
│ ┌───────────┐ ┌───────────────────────┐ │
│ │ Sidebar ↓ │ │ Main Content ↓        │ │
│ │           │ │ ┌───────────────────┐  │ │
│ │ [▸ Users] │ │ │ PageHeader        │  │ │
│ │   Reports │ │ │ "Active Employees"│  │ │
│ │   Settings│ │ ├───────────────────┤  │ │
│ │           │ │ │ DataTable         │  │ │
│ │           │ │ │  [scrollable]     │  │ │
│ │           │ │ │  Name | Role | ⋯  │  │ │
│ │           │ │ ├───────────────────┤  │ │
│ │           │ │ │ ActionBar         │  │ │
│ │           │ │ │ [▸ Add New →]     │  │ │
│ │           │ │ └───────────────────┘  │ │
│ └───────────┘ └───────────────────────┘ │
└─────────────────────────────────────────┘
```

## Rules

- **Wireframes are disposable.** They are archived when Figma begins, never synced, never maintained alongside high-fidelity work.
- **Feedback flows into canvas briefs.** Structural changes from wireframe review update the canvas brief first. The wireframe is then regenerated from the updated brief.
- **Fidelity anchoring is non-negotiable.** No colour, no polish, review framing header on every page. If it starts looking designed, strip it back.
- **Component labels must match.** Every label in the wireframe matches a component name in canvas brief Section 5. No invented names.
- **One wireframe per frame per significant breakpoint.** Don't wireframe every pixel width — only where layout fundamentally changes.
- **Walking skeleton first.** Wire the walking skeleton flow before secondary flows, just like the prototype.
- **Use real content, not placeholders.** Pull labels and text from canvas brief Section 7. "Lorem ipsum" defeats the purpose of content validation.

## Feeds into

- **Canvas Briefs** — stakeholder feedback from wireframe review flows back as brief updates
- **Figma Page Setup** — wireframe layout provides spatial reference for Figma page structure
- **Figma Component** — wireframe component placement informs Figma build order
