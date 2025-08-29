# **APP_NAME**

__DESCRIPTION__

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
- Tests run with Vitest via `sst load-config -- vitest run`.
- Resolvers are authored in TypeScript under `src/resolvers/**` and bundled to `appsync/` using `@mikecbrant/appsyncjs-cli`.
- The bundle includes `@mikecbrant/appsyncjs-dynamo` so you can write readable request builders instead of hand-crafting expressions.
