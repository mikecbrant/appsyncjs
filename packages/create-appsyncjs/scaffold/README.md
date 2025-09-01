# **APP_NAME**

**DESCRIPTION**

## Quickstart

```bash
pnpm i   # or npm/yarn
pnpm build:resolvers
pnpm test
pnpm deploy  # requires AWS credentials
```

## What you get

- SST v3 config that provisions:
  - AppSync GraphQL API
  - DynamoDB table `__TABLE_NAME__`
- GraphQL schema with `__ENTITY__` type and CRUD operations
- AppSync JS resolvers (bundled) that forward to DynamoDB
- Tests that mock `@aws-appsync/utils` via `@mikecbrant/appsyncjs-test-utils`

## Notes

- Node.js >= 22 is required.
- Default region is `__REGION__`.
- Tests run from the `packages/core` workspace via `sst shell -- vitest run`.
- Resolvers are authored in TypeScript under `packages/core/src/resolvers/**` and bundled to `build/appsync/` using `@mikecbrant/appsyncjs-cli`.
- GraphQL schema lives at `packages/core/graphql/schema.graphql`.
- The bundle includes `@mikecbrant/appsyncjs-dynamo` so you can write readable request builders instead of hand-crafting expressions.

## Output directories

- All compiled/bundled artifacts are written to `build/` (e.g., resolver bundles in `build/appsync/`).
- Test coverage reports are written to `coverage/`.
- Both `build/` and `coverage/` are ignored by Git and tooling (ESLint/Prettier).
