# @mikecbrant/appsyncjs-dynamo

Helpers for authoring AWS AppSync JavaScript (APPSYNC_JS) resolvers that target DynamoDB data sources.

This package currently exposes:

- `getItem(props)` — builds a valid `DynamoDBGetItemRequest` object.
- `putItem(props)` — builds a valid `DynamoDBPutItemRequest` object.
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

2) GetItem with strongly consistent read and a projection

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

export function response(ctx) {
	if (ctx.error) {
		util.error(ctx.error.message, ctx.error.type);
	}
	// Query results commonly return { items, nextToken, ... }
	// Return the list of items when your schema expects a list
	return ctx.result?.items ?? [];
}
```


4) Basic PutItem

```ts
// resolvers/createUser.ts
import { putItem } from '@mikecbrant/appsyncjs-dynamo';
import { util } from '@aws-appsync/utils';

export function request(ctx) {
	const user = {
		pk: `USER#${ctx.args.id}`,
		name: ctx.args.name,
		email: ctx.args.email,
	};

	return putItem({
		key: { pk: user.pk },
		item: user,
	});
}

export function response(ctx) {
	if (ctx.error) {
		util.error(ctx.error.message, ctx.error.type);
	}
	// Note: PutItem only returns attributes when your resolver is configured
	// to return them; otherwise ctx.result is typically empty
	return ctx.result;
}
```

5) Conditional write with `condition`

```ts
// resolvers/createUserIfMissing.ts
import { putItem } from '@mikecbrant/appsyncjs-dynamo';
import { util } from '@aws-appsync/utils';

export function request(ctx) {
	const pk = `USER#${ctx.args.id}`;
	return putItem({
		key: { pk },
		item: { pk, name: ctx.args.name },
		// Only create when the item does not already exist
		condition: {
			expression: 'attribute_not_exists(#pk)',
			expressionNames: { '#pk': 'pk' },
		},
	});
}

export function response(ctx) {
	if (ctx.error) {
		util.error(ctx.error.message, ctx.error.type);
	}
	return ctx.result;
}
```

6) Options: `customPartitionKey`, `populateIndexFields`, `_version`

```ts
// resolvers/createUserWithOptions.ts
import { putItem } from '@mikecbrant/appsyncjs-dynamo';

export function request(ctx) {
	const pk = `USER#${ctx.identity.sub}`;
	return putItem({
		key: { pk },
		item: { pk, name: ctx.args.name, email: ctx.args.email },
		// Multi-tenant tables: route writes under a tenant-specific logical partition
		customPartitionKey: `TENANT#${ctx.identity.claims['tenantId']}`,
		// Control whether GSIs should be auto-populated by the service
		populateIndexFields: true,
		// Optional optimistic concurrency version
		_version: 1,
	});
}
```

## API: `putItem(props)`

Builds and returns a `DynamoDBPutItemRequest` suitable for AppSync DynamoDB resolvers. Import it as a named export:

```ts
import { putItem } from '@mikecbrant/appsyncjs-dynamo';
```

Parameters (`PutItemProps`):

- `key: DynamoKey` — the primary key for the item. A map of attribute name to a string or number value, e.g. `{ pk: 'USER#123' }`.
- `item: Record<string, unknown>` — the full item attributes to write. Values are marshaled with `util.dynamodb.toMapValues`.
- `condition?: ConditionCheckExpression` — optional conditional expression to enforce on write (for example, `attribute_not_exists(#pk)`).
- `customPartitionKey?: string` — optional logical tenant/custom partition identifier used by the AppSync resolver/service; this does not alter DynamoDB’s physical partitioning.
- `populateIndexFields?: boolean` — when set, signals the AppSync resolver/service to auto-populate index fields (when supported by your API configuration). This is not a native DynamoDB feature.
- `_version?: number` — optional version number for optimistic concurrency use cases.

Notes
- All optional properties are omitted from the request unless provided.
- Under the hood, both `key` and `item` are converted with `util.dynamodb.toMapValues` from `@aws-appsync/utils`.


