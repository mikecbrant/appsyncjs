# @mikecbrant/appsyncjs

Monorepo for publishing npm modules for use with AWS Appsync JS resolver runtime development.

# Packages

| package                                                           | description                                                                        |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [@mikecbrant/appsyncjs-cli](packages/cli/README.md)               | CLI utilities for use in `APPSYNC_JS` runtime development. Includes build utility. |
| [@mikecbrant/appsyncjs-test-utils](packages/test-utils/README.md) | Utilities for unit and functional testing of `APPSYNC_JS` resolvers.               |
| @mikecbrant/appsyncjs-dynamo                                      | Small helpers for building DynamoDB requests in `APPSYNC_JS` resolvers.            |

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

## DynamoDB package — @mikecbrant/appsyncjs-dynamo

Helpers for authoring AWS AppSync JavaScript (APPSYNC_JS) resolvers that target DynamoDB data sources. This package currently exposes:

- `getItem(props)` — builds a valid `DynamoDBGetItemRequest` object.
- `buildProjectionExpression(fields)` — builds a DynamoDB projection expression `{ expression, expressionNames }` from a string array.

Peer dependency: `@aws-appsync/utils` (the request objects use the AppSync `util.dynamodb` helpers under the hood).

### Examples

> The snippets below are written for the AppSync JS runtime resolver format. They focus on the request handler since response handling depends on your GraphQL schema and mapping.

1) Basic GetItem request

```ts
// resolvers/getUser.ts
import { getItem } from '@mikecbrant/appsyncjs-dynamo';

export function request(ctx) {
	return getItem({
		key: { pk: `USER#${ctx.args.id}` },
	});
}
```

2) GetItem with strongly consistent read and a projection

```ts
// resolvers/getUser.ts
import { getItem } from '@mikecbrant/appsyncjs-dynamo';

export function request(ctx) {
	return getItem({
		key: { pk: `USER#${ctx.args.id}` },
		consistentRead: true,
		returnedFields: ['pk', 'name', 'email'],
	});
}
```

3) Use `buildProjectionExpression` with your own DynamoDB request

```ts
// resolvers/listUserPosts.ts
import { buildProjectionExpression } from '@mikecbrant/appsyncjs-dynamo';
import { util } from '@aws-appsync/utils';

export function request(ctx) {
	const projection = buildProjectionExpression(['pk', 'sk', 'title', 'status']);

	return {
		operation: 'Query',
		query: {
			expression: '#pk = :pk',
			expressionNames: { '#pk': 'pk' },
			expressionValues: { ':pk': util.dynamodb.toDynamoDB(`USER#${ctx.args.id}`) },
		},
		projection,
	};
}
```

4) Import style

```ts
import { getItem, buildProjectionExpression } from '@mikecbrant/appsyncjs-dynamo';
```
