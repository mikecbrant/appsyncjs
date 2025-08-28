# **APP_NAME**

A minimal SST-based AWS AppSync + DynamoDB starter with example User CRUD resolvers using `@mikecbrant/appsyncjs-dynamo` and tests with `@mikecbrant/appsyncjs-test-utils`.

## Quickstart

```bash
pnpm i   # or npm/yarn
pnpm build:resolvers
pnpm test
pnpm deploy  # requires AWS credentials
```

## What you get

- SST stack that provisions:
  - AppSync GraphQL API
  - DynamoDB table `__USER_TABLE_NAME__`
- GraphQL schema with `User` type and CRUD operations
- AppSync JS resolvers (bundled) that forward to DynamoDB
- Tests that mock `@aws-appsync/utils` via `@mikecbrant/appsyncjs-test-utils`

## Notes

- Resolvers are authored in TypeScript under `src/resolvers/**` and bundled to `appsync/` using `@mikecbrant/appsyncjs-cli`.
- The bundle includes `@mikecbrant/appsyncjs-dynamo` so you can write readable request builders instead of hand-crafting expressions.
- Update the region/table name in `sst.config.ts` if needed.
