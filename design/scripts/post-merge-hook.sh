#!/bin/sh
# post-merge hook — run v2 migration detection after every git pull/merge
# Install: cp design/scripts/post-merge-hook.sh .git/hooks/post-merge && chmod +x .git/hooks/post-merge

node design/scripts/migrate.js
