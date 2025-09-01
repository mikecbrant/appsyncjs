# @mikecbrant/create-appsyncjs

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
