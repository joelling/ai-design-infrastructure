---
description: Pipeline staleness sweep — report which modes need re-processing
---

Run `node design/scripts/sync-status.js` and summarise the output.

The script scans every mode directory's `_upstream.md` manifest and compares declared upstream-artifact versions against current versions on disk. Report:

1. A table of modes with stale upstreams, including which upstream artifact changed and the delta in versions.
2. For each stale mode, whether the designer should re-process now or wait.
3. If no staleness is found, report "pipeline clean" and the timestamp of the check.

Do not trigger re-processing automatically — offer to run the affected modes one at a time with the user's confirmation.
