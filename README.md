# @mikecbrant/appsyncjs

Monorepo for publishing npm modules for use with AWS Appsync JS resolver runtime development.

# Packages

| package                                                           | description                                                                        |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [@mikecbrant/appsyncjs-cli](packages/cli/README.md)               | CLI utilities for use in `APPSYNC_JS` runtime development. Includes build utility. |
| [@mikecbrant/appsyncjs-dynamo](packages/dynamo/README.md)         | Helpers for building DynamoDB requests in `APPSYNC_JS` resolvers.            |
| [@mikecbrant/appsyncjs-test-utils](packages/test-utils/README.md) | Utilities for unit and functional testing of `APPSYNC_JS` resolvers.               |

All code in released packages is fully tested.

# Install

For best install of this framework and full set peer dependencies use.

```bash
pnpm i -D @mikecbrant/appsyncjs-cli @mikecbrant/appsyncjs-test-utils @mikecbrant/appsyncjs-dynamo @aws-appsync/eslint-plugin @aws-appsync/utils @aws-sdk/client-appsync vitest

# or npm
npm i -D @mikecbrant/appsyncjs-cli @mikecbrant/appsyncjs-test-utils @mikecbrant/appsyncjs-dynamo @aws-appsync/eslint-plugin @aws-appsync/utils @aws-sdk/client-appsync vitest
```

- `@aws-appsync/eslint-plugin` is not needed by these libraries, but is recommended for use in linting your files for `APPSYNC_JS`
- `@aws-sdk/client-appsync` is peer dependency needed for `evaluateFile` / `evaluateCode` functional testing utils
- `vitest` is peer dependency needed for `utilMock` unit testing utility


