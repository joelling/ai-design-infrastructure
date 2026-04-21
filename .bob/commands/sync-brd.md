---
description: Regenerate design/BRD.xlsx from md SSOT files
---

Run `python design/scripts/sync-brd.py --regenerate`.

The script aggregates BRD sheets from the canonical md files:

- `design/05_STORIES/story-map.md` → User Stories (DS-NNN)
- `design/04_PROCESS_FLOWS/business-rules-register.md` → inline-expanded into AC cells via `[BR-NN]` tags
- `design/06_INFORMATION_ARCHITECTURE/rbac.md` → RBAC sheet
- `design/06_INFORMATION_ARCHITECTURE/notifications.md` → Notification Mapping
- `design/06_INFORMATION_ARCHITECTURE/data-dictionary.md` → Data Fields
- `design/09_CONTENT/terminology.md` (LOV section) → LOV sheet
- `design/06_INFORMATION_ARCHITECTURE/screen-inventory.md` → Feature / Touchpoint

Priority and Release columns are preserved as PM-editable values. Manual BRD edits outside those columns will be overwritten.

Report:

1. Which sheets were regenerated.
2. Any staleness warnings emitted by the script.
3. Any BR-NN / DS-NNN resolution errors.

If the script exits non-zero, show the error, do not commit, and ask the user to resolve.
