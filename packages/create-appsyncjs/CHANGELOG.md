# @mikecbrant/create-appsyncjs

## 1.0.0

### Major Changes

- 1f887c0: feat(create-appsyncjs): prompt + safe overwrite for existing dirs; BREAKING programmatic API changes
  - Detect and list conflicts (paths that already exist) before any writes
  - Prompt once to confirm overwriting all conflicting paths or abort
  - Overwrite only matching scaffold paths; do not delete unrelated files
  - Optional: when overwriting inside a Git repo with a dirty working tree, ask for a second confirmation (no Git mutations performed)

  BREAKING CHANGE
  - `packages/create-appsyncjs/index.mjs`: the programmatic API no longer performs prompting or applies defaults. The `create` entry now accepts a single object with the simplified signature `create({ templateDir, dest, answers })`, and it requires explicit `answers` keys (`APP_NAME`, `REGION`, `ENTITY`, `TABLE_NAME`, `DESCRIPTION`). Calls relying on implicit defaults or separate top-level params must be updated.
  - `packages/create-appsyncjs/lib/generate.mjs`: region token substitution now uses `vars.REGION` only and replaces `__REGION__` in templates. Transitional handling for `AWS_REGION`/`__AWS_REGION__` was removed.
  - `packages/create-appsyncjs/cli.mjs`: adds interactive prompts and adjusts defaults (Application name → sanitized `dest`; Repo description → `${APP_NAME} AppSync service`; AWS region → `us-east-1`; First entity → `Example`; DynamoDB table name → same as `APP_NAME`). Primarily UX, noted here for completeness alongside the overwrite safety feature.

## 0.2.1

### Patch Changes

- 1b68ea8: Release patch to ship scaffold updates aligning with SST v3 template conventions.

  This includes moving schema/resolvers/tests under `packages/core`, introducing a `packages/scripts` workspace, adopting JSON `tsconfig` files, and wiring pnpm workspaces in the scaffold. No runtime behavior in the generator changed—this publish propagates the updated scaffold layout.

## 0.2.0

### Minor Changes

- ac12639: Align generator and scaffold with SST v3 (Pulumi), Node >=22, default region injection, Vitest tooling with 100% coverage thresholds in the scaffold, and strict AppSync JS resolver types. Scaffold removes authentication configuration from `sst.config.ts` (no auth by default).

  Monorepo adopts `@aws-appsync/utils@2.0.3` across packages. `@mikecbrant/appsyncjs-dynamo` now targets v2 types (peer requirement >=2.0.3), which is a breaking change for consumers still on v1.

### Patch Changes

- d672c93: scaffold: route compiled resolver outputs to `build/` and coverage reports to `coverage/`; update ignore files and `sst.config.ts` to load from `build/appsync/*.js`; add `clean` script. (APPSYNC-15)
