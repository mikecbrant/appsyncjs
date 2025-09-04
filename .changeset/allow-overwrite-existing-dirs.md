---
'@mikecbrant/create-appsyncjs': minor
---

feat(create-appsyncjs): add safe overwrite support when target dir contains existing files

- Detect and list conflicts (paths that already exist) before any writes
- Prompt once to confirm overwriting all conflicting paths or abort
- Overwrite only matching scaffold paths; do not delete unrelated files
- Optional: when overwriting inside a Git repo with a dirty working tree, ask for a second confirmation (no Git mutations performed)

Implements APPSYNC-20.
