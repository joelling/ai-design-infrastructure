---
name: figma-component
description: >
  Creates Figma components following the full workflow: auto-layout, variable binding,
  naming conventions, properties, variants, and placement. Use this skill whenever
  creating any new component — whether it's a UI element, layout shell, state template,
  or annotation. Triggers on: "create component", "make component", "componentize",
  "build [name]", "new component", "make this a component", "add component", "design
  [component name]", or whenever a repeatable design element is being built. Also
  trigger when the user describes a UI pattern that should obviously be a reusable
  component even if they don't use the word "component". Always bias toward
  componentizing — if in doubt, make it a component.
---

# Component Creation Workflow

## Naming conventions

### Published components (appear in Assets panel, reusable across files)
Format: `Category/ComponentName`

```
Button/Primary
Button/Secondary
Button/Ghost
Card/Product
Card/Article
Icon/Arrow
Icon/Close
Input/Text
Input/Select
Navigation/TopBar
Navigation/Sidebar
Modal/Alert
Modal/Confirmation
Form/Label
Form/FieldGroup
Layout/PageShell
Layout/ContentGrid
State/Loading
State/Empty
State/Error
Annotation/SpecLabel
Annotation/RedlineMarker
```

### Hidden/nested components (sub-components inside published ones)
Prefix with `.` (period) — these won't appear in the Assets panel:
```
.ButtonIcon
.ButtonLabel
.CardImage
.CardBody
.NavItem
.InputField
.DropdownOption
```

> **Why hidden components?** They let you build a large published component from smaller, composable pieces without cluttering the Assets panel. The tradeoff is that hidden components don't receive library updates automatically — keep them simple and close to their parent.

---

## Component creation checklist

Work through these in order every time:

### 1. Structure
- [ ] All frames inside the component use **auto-layout** (no exceptions)
- [ ] Nesting is logical: outer frame → section frames → content frames → leaf elements
- [ ] No absolute-positioned elements unless they're intentional overlays (tooltips, badges)

### 2. Variables
- [ ] Every color fill/stroke references a `semantic/` or `component/` variable
- [ ] Every spacing value (padding, gap) references a `semantic/spacing/` or `component/` variable
- [ ] Every border radius references a `semantic/radius/` or `component/` variable
- [ ] Every opacity references a `semantic/opacity/` variable
- [ ] Zero hardcoded values anywhere in the component

### 3. Component properties
Set these up in the component's Properties panel:

| Type | When to use | Example |
|------|-------------|---------|
| `BOOLEAN` | Toggle-able child elements | `showIcon`, `showBadge`, `isDisabled` |
| `TEXT` | Editable label content | `label`, `placeholder`, `helperText` |
| `INSTANCE_SWAP` | Swappable sub-components | `leadingIcon`, `avatar`, `thumbnail` |
| `VARIANT` | Mutually exclusive states | `size` (sm/md/lg), `variant` (primary/secondary) |

**Prefer properties over separate components.** A Button with 3 sizes + 3 variants = 9 combinations. Don't create 9 components — create 1 component with `size` and `variant` properties.

### 4. Interactive states
Create variants for: `Default`, `Hover`, `Pressed`, `Disabled`, `Focus`
Only create states that are relevant (e.g., a static card may not need Hover/Pressed).

### 5. Slots (for flexible content)
For components that need to accept variable inner content (modals, cards, dialogs, drawers):
- Create a "slot" frame inside the component
- Mark it as a slot using Figma's slot feature (currently in beta)
- This lets the component accept different content without detaching

### 6. Description
- Add a component description in the right-hand panel
- Include: what it is, when to use it, any important constraints

### 7. Placement
- Place the completed component to the **left of the current artboard** (outside the main frame)
- It stays there until the page is done, then moves to the Parking Lot

---

## Categories of components — think broader than UI elements

Most designers only componentize buttons and inputs. Aim for near-total componentization:

### Layout components
- **Page shells**: full-page layout with header/content/footer slots
- **Grid systems**: responsive column grids as components with breakpoint variants
- **Section containers**: padded content sections with max-width constraints

### State components
- **Loading skeletons**: animated placeholder for each content type (card, list, table)
- **Empty states**: zero-data view with icon + message + CTA slots
- **Error states**: error display with retry action
- **Loading spinners**: global + inline variants

### Content block components
- **Article layout**: image + title + body + meta
- **Dashboard widget**: header + metric + sparkline
- **Data table row**: columns matching your actual data shape
- **Notification/toast**: icon + message + dismiss

### Annotation components (for developer handoff)
- **Spec label**: points to a measurement with value
- **Redline marker**: dimension callout
- **Color swatch label**: shows token name + hex
- **Breakpoint indicator**: shows current viewport width

### Navigation components
- All nav items as components with active/inactive/hover states
- Mobile nav, desktop nav, and collapsed nav as separate variants

---

## When to make something hidden vs published

**Published** if: it will be reused across multiple screens or pages, or another designer/developer would search for it in Assets.

**Hidden** (`.` prefix) if: it only exists to make a published component work, has no standalone utility, and is always nested inside another component.

When in doubt, publish it — hidden components have update limitations.

---

## Develop loop sync

This skill participates in the Tier 4 Develop sync loop. After creating or modifying components:

1. **Check canvas brief alignment** — verify the component matches what the canvas brief specifies (variants, states, TEXT properties).
2. **Note any deviations** — if you added variants or properties not in the brief (e.g., discovered during implementation), log them so the canvas brief and prototype can be updated.
3. **Content/label changes auto-sync** — if you change a TEXT property default, the canvas brief and prototype should update to match.
4. **Structural changes flag drift** — if you add/remove components not in the brief, this is flagged for designer approval before propagating.
