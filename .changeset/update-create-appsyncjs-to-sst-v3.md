---
'@mikecbrant/create-appsyncjs': minor
'@mikecbrant/appsyncjs-dynamo': major
'@mikecbrant/appsyncjs-cli': patch
'@mikecbrant/appsyncjs-test-utils': patch
---

Align generator and scaffold with SST v3 (Pulumi), Node >=22, default region injection, Vitest tooling with 100% coverage thresholds in the scaffold, and strict AppSync JS resolver types. Scaffold removes authentication configuration from `sst.config.ts` (no auth by default).

Monorepo adopts `@aws-appsync/utils@2.0.3` across packages. `@mikecbrant/appsyncjs-dynamo` now targets v2 types (peer requirement >=2.0.3), which is a breaking change for consumers still on v1.
