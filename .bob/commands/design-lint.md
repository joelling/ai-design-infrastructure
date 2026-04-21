---
description: Run the cross-tier design health check and produce LINT_REPORT.md
---

Run the `design-lint` skill. Specifically:

1. Execute structural scripts sequentially:
   - `node design/scripts/sync-status.js`
   - `node design/scripts/sync-traceability.js`
   - `node design/scripts/sync-composition.js`
2. Run the semantic checks described in `design/process/19-lint.md`:
   persona-confidence-vs-evidence, business-rule orphans, interaction-state
   coverage, accessibility-pattern coverage, research propagation,
   governance-principle violations, migration status, and composition-log health.
3. Classify findings as 🔴 Critical / 🟡 Warning / 🟢 Info.
4. Write the report to `design/LINT_REPORT.md` (overwriting any prior version;
   git preserves history). Bump the artifact version header.
5. Append a one-line summary to `design/DECISION_LOG.md` if it exists.
6. Never auto-fix anything — present findings and offer to help resolve
   Critical items one at a time.
