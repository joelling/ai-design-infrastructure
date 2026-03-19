---
name: figma-file-setup
description: >
  Sets up a new Figma working file with the correct page structure, naming conventions,
  file type roles, and initial token scaffold. Use this skill whenever starting a new
  project, creating a new working file, or when a file is missing the standard page
  structure. Triggers on: "new project", "set up file", "create file structure",
  "new figma file", "start project", "initialize file", "file setup", or when opening
  a blank Figma file for the first time. Also use when the user wants to know what pages
  a working file should have, or when reorganising an existing file's page order.
---

# Figma File Setup

## File Type System

This project uses a multi-file architecture. Understand each file's role:

| File | Name pattern | Purpose |
|------|-------------|---------|
| **Working File** | `[Project] - Working` | Active design. All screens, flows, exploration. |
| **Core Library** | `[Project] - Core Library` | Atoms + molecules + all variables/tokens. Published. |
| **Pattern Library** | `[Project] - Patterns` | Organisms + templates. Created when Core Library grows complex (50+ component types). |

Working File is always the active design canvas. Library files are separate and only exist to be published and consumed by the Working File.

---

## Working File — Page Structure

Create pages in this order (order matters — Figma shows them top to bottom):

```
📋 Cover
🗺️ Sitemap
── [screen pages added here as you design] ──
🅿️ Parking Lot
```

### Page details

**📋 Cover**
Create an annotation frame (1440×900) with:
- Project name (large heading text)
- File type label (e.g., "Working File")
- Date started
- Team / owner

**🗺️ Sitemap**
A free-form page for mapping out screen hierarchy and user flows. Use simple frames (not components) connected with arrows/connectors. No auto-layout required here — it's a planning canvas.

**[Screen pages]**
Added as work progresses. Follow naming: `01 - Dashboard`, `02 - Onboarding Flow`, etc. Each gets set up with the `figma-page-setup` skill.

**🅿️ Parking Lot**
Always kept as the LAST page. This is the staging area for components before they migrate to a library file. Set it up with:
- A single full-canvas auto-layout frame (vertical, 64px gap)
- Category header frames: Atoms / Molecules / Organisms / Templates / States / Annotations
- Each category is a horizontal auto-layout row for components

---

## Initial Token Scaffold

After creating the page structure, immediately scaffold the token system. Call the `figma-tokens` skill (or follow the token setup steps inline):

Create three variable collections:
1. `Primitives` — raw values only
2. `Semantic` — purpose-based aliases referencing Primitives
3. `Component` — component-specific aliases referencing Semantic

At minimum, seed these before any design work:
- A base color palette (4–6 hues × 9 steps each)
- A spacing scale (4, 8, 12, 16, 24, 32, 48, 64, 96px)
- A border radius scale (2, 4, 8, 12, 16, 24, 9999px)
- A typography scale (12, 14, 16, 18, 24, 32, 48px)

---

## Non-negotiable rules for all files

- Every frame uses auto-layout — no exceptions
- Every value (color, spacing, radius, opacity) references a variable — no hardcoded values
- Components are placed in the left staging area of each page as they're created, then moved to Parking Lot when the page is done
- Parking Lot page is always the last page in the file

---

## Checklist

- [ ] File named correctly (`[Project] - Working`)
- [ ] Pages created: Cover, Sitemap, Parking Lot
- [ ] Cover annotation frame populated
- [ ] Parking Lot page set up with category rows
- [ ] Variable collections created: Primitives, Semantic, Component
- [ ] Base token values seeded in Primitives
- [ ] Semantic tokens aliased to Primitives
- [ ] Light + Dark modes configured on Semantic collection
