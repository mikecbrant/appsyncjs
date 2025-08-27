# @mikecbrant/appsyncjs-dynamo

Helpers for authoring AWS AppSync JavaScript (APPSYNC_JS) resolvers that target DynamoDB data sources.

This package currently exposes:

- `getItem(props)` — builds a valid `DynamoDBGetItemRequest` object.
- `deleteItem(props)` — builds a valid `DynamoDBDeleteItemRequest` object.
- `buildProjectionExpression(fields)` — builds a DynamoDB projection expression `{ expression, expressionNames }` from a string array.

Peer dependency: `@aws-appsync/utils` (the request objects use the AppSync `util.dynamodb` helpers under the hood).

## Examples

> The snippets below are written for the AppSync JS runtime resolver format and show both request and response handlers.

1) Basic GetItem

```ts
// resolvers/getUser.ts
import { getItem } from '@mikecbrant/appsyncjs-dynamo';
import { util } from '@aws-appsync/utils';

export function request(ctx) {
	return getItem({
		key: { pk: `USER#${ctx.args.id}` },
	});
}

export function response(ctx) {
	if (ctx.error) {
		// surface DynamoDB/Resolver errors via GraphQL
		util.error(ctx.error.message, ctx.error.type);
	}
	return ctx.result; // for GetItem, return the mapped item (or null)
}
```

2) DeleteItem (basic)

```ts
// resolvers/deleteUser.ts
import { deleteItem } from '@mikecbrant/appsyncjs-dynamo';
import { util } from '@aws-appsync/utils';

export function request(ctx) {
	return deleteItem({
		key: { pk: `USER#${ctx.args.id}` },
		// optional: provide a condition
		// condition: { expression: 'attribute_exists(#pk)', expressionNames: { '#pk': 'pk' }, expressionValues: {} },
	});
}

export function response(ctx) {
	if (ctx.error) {
		util.error(ctx.error.message, ctx.error.type);
	}
	return ctx.result ?? null;
}
```

3) GetItem with strongly consistent read and a projection

```ts
// resolvers/getUser.ts
import { getItem } from '@mikecbrant/appsyncjs-dynamo';
import { util } from '@aws-appsync/utils';

export function request(ctx) {
	return getItem({
		key: { pk: `USER#${ctx.args.id}` },
		consistentRead: true,
		returnedFields: ['pk', 'name', 'email'],
	});
}

export function response(ctx) {
	if (ctx.error) {
		util.error(ctx.error.message, ctx.error.type);
	}
	return ctx.result;
}
```

4) Use `buildProjectionExpression` with your own DynamoDB request

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

export function response(ctx) {
	if (ctx.error) {
		util.error(ctx.error.message, ctx.error.type);
	}
	// Query results commonly return { items, nextToken, ... }
	// Return the list of items when your schema expects a list
	return ctx.result?.items ?? [];
}
```


