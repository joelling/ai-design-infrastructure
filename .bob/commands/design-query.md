---
description: Ask a natural-language question against the design corpus
argument-hint: <question about personas, principles, rules, patterns, decisions>
---

Run the `design-query` skill against the user's question ($1).

Specifically:

1. Read `design/WIKI/index.md` to understand what the wiki already indexes.
2. Determine the query axis: persona, principle, business rule, pattern, constraint, decision, screen, or cross-cutting.
3. Retrieve the relevant wiki pages and source artifacts. Cite every claim with the source artifact path and version.
4. Synthesise a cited answer. Never fabricate — if the corpus doesn't cover the topic, say so and propose what upstream mode would produce the answer.
5. File back any insight discovered during the query, with user confirmation:
   - Gap found → AC note in the relevant canvas brief (if one exists)
   - Contradiction found → entry in the lint queue
   - Undocumented decision → entry in `design/DECISION_LOG.md`
   - Novel pattern → flag for `design-governance` Phase B

Do not auto-modify artifacts. Every file-back requires explicit designer confirmation.
