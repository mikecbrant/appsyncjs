---
'@mikecbrant/create-appsyncjs': major
---

feat(create-appsyncjs): prompt + safe overwrite for existing dirs; BREAKING programmatic API changes

- Detect and list conflicts (paths that already exist) before any writes
- Prompt once to confirm overwriting all conflicting paths or abort
- Overwrite only matching scaffold paths; do not delete unrelated files
- Optional: when overwriting inside a Git repo with a dirty working tree, ask for a second confirmation (no Git mutations performed)

BREAKING CHANGE

- `packages/create-appsyncjs/index.mjs`: the programmatic API no longer performs prompting or applies defaults. The `create` entry now accepts a single object with the simplified signature `create({ templateDir, dest, answers })`, and it requires explicit `answers` keys (`APP_NAME`, `REGION`, `ENTITY`, `TABLE_NAME`, `DESCRIPTION`). Calls relying on implicit defaults or separate top‑level params must be updated.
- `packages/create-appsyncjs/lib/generate.mjs`: region token substitution now uses `vars.REGION` only and replaces `__REGION__` in templates. Transitional handling for `AWS_REGION`/`__AWS_REGION__` was removed.
- `packages/create-appsyncjs/cli.mjs`: adds interactive prompts and adjusts defaults (Application name → sanitized `dest`; Repo description → `${APP_NAME} AppSync service`; AWS region → `us-east-1`; First entity → `Example`; DynamoDB table name → same as `APP_NAME`). Primarily UX, noted here for completeness alongside the overwrite safety feature.

Implements APPSYNC-20.
