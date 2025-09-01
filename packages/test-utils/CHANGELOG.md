# @mikecbrant/appsyncjs-test-utils

## 1.2.5

### Patch Changes

- ac12639: Align generator and scaffold with SST v3 (Pulumi), Node >=22, default region injection, Vitest tooling with 100% coverage thresholds in the scaffold, and strict AppSync JS resolver types. Scaffold removes authentication configuration from `sst.config.ts` (no auth by default).

  Monorepo adopts `@aws-appsync/utils@2.0.3` across packages. `@mikecbrant/appsyncjs-dynamo` now targets v2 types (peer requirement >=2.0.3), which is a breaking change for consumers still on v1.

- Updated dependencies [38784d1]
- Updated dependencies [ac12639]
  - @mikecbrant/appsyncjs-cli@1.0.3

## 1.2.4

### Patch Changes

- 0cb8c75: chore(deps): update dependency/devDependency specifiers to latest non‑major ranges. No runtime code changes.
- Updated dependencies [0cb8c75]
  - @mikecbrant/appsyncjs-cli@1.0.2

## 1.2.3

### Patch Changes

- d875598: releaseable README change

## 1.2.2

### Patch Changes

- 696293c: releasable README change

## 1.2.1

### Patch Changes

- c837e07: releaseable README change

## 1.2.0

### Minor Changes

- 3593888: Functional test utilities

## 1.1.0

### Minor Changes

- a97d963: Implement encoding utils, authType, unauthorized, and runtime.earlyReturn

## 1.0.1

### Patch Changes

- 8b27f0c: fix file glob in package.json
