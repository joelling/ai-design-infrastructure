# Design Process Viewer

A local reading interface for the design process specification. Renders the markdown chapter files in `design/process/` with beautiful typography, tier-colored navigation, and real-time sync — any change to a `.md` file reflects in the browser instantly without refreshing.

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node)

## Setup

Install dependencies once:

```bash
cd design/viewer
npm install
```

## Running

```bash
cd design/viewer
npm run dev
```

Opens automatically at **http://localhost:5200**

## Usage

- **Navigate chapters** — click any item in the left sidebar
- **Keyboard shortcuts** — `←` / `→` arrow keys to move between chapters; `⌘J` / `⌘K` for next/prev
- **Jump to a section** — use the "In this chapter" table of contents at the top of each article
- **Deep link** — the URL hash updates as you navigate (`#01-discovery.md`), so you can bookmark or share a specific chapter
- **Live reload** — edit any file in `design/process/` while the viewer is running; the active chapter re-renders in place and a toast notification confirms the update

## Architecture

```
design/
├── process/          ← source of truth (markdown files Claude edits)
│   ├── README.md
│   ├── 01-discovery.md
│   └── ...
└── viewer/           ← this app (read-only UI layer)
    ├── index.html
    ├── main.js       ← chapter loading, rendering, HMR sync
    ├── style.css     ← typography system
    └── vite.config.js ← dev server + markdown API + filesystem watcher
```

The viewer is a **read-only layer** — it does not write back to the markdown files. All process changes are made by telling Claude what to update; Claude edits the `.md` files and propagates to SKILL.md and CLAUDE.md automatically.

## Stopping

`Ctrl+C` in the terminal running `npm run dev`.
