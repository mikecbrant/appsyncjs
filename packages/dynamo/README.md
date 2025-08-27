# @mikecbrant/appsyncjs-dynamo

Tiny helpers for building DynamoDB request objects in the AWS AppSync `APPSYNC_JS` runtime.

- Lightweight, no runtime dependencies beyond `@aws-appsync/utils`
- ESM-first and fully typed
- 100% unit test coverage

## Install

```bash
pnpm i -D @mikecbrant/appsyncjs-dynamo @aws-appsync/utils

# or npm
npm i -D @mikecbrant/appsyncjs-dynamo @aws-appsync/utils
```

## Exports

```ts
import Dynamo, { buildProjectionExpression, getItem, updateItem } from '@mikecbrant/appsyncjs-dynamo';
```

- `Dynamo` is a convenience namespace object that contains the named exports as properties.

## Usage

### getItem

Builds a DynamoDB `GetItem` request. Accepts the partition/sort key and optional consistency and projection settings.

```ts
import { getItem } from '@mikecbrant/appsyncjs-dynamo';

export function request(ctx) {
	const { id } = ctx.args;
	return getItem({
		key: { id },
		// optional
		consistentRead: false,
		returnedFields: ['id', 'title', 'updatedAt'],
	});
}
```

### updateItem

Builds a DynamoDB `UpdateItem` request. You provide the key and an update expression using the `@aws-appsync/utils` expression shape.

```ts
import { updateItem } from '@mikecbrant/appsyncjs-dynamo';

export function request(ctx) {
	const { id } = ctx.args;
	return updateItem({
		key: { id },
		update: {
			expression: 'ADD #votefield :plusOne, version :plusOne',
			expressionNames: { '#votefield': 'upvotes' },
			expressionValues: { ':plusOne': { N: 1 } },
		},
		// optional extras
		// condition: { expression: 'attribute_exists(#id)', expressionNames: { '#id': 'id' } },
		// customPartitionKey: 'tenant#1',
		// populateIndexFields: false,
		// _version: 3,
	});
}
```

- The `update` and `condition` shapes match the `DynamoDBExpression` and `ConditionCheckExpression` types from `@aws-appsync/utils`.
- Keys are converted with `util.dynamodb.toMapValues()` internally so you can pass plain JS values for the key.

## Helpers

### buildProjectionExpression(fields: string[]) => DynamoDBExpression | undefined

Transforms an array of field names into a DynamoDB projection expression structure suitable for `GetItem`, `Query`, or `Scan`.

```ts
const projection = buildProjectionExpression(['id', 'title']);
// { expression: '#id, #title', expressionNames: { '#id': 'id', '#title': 'title' } }
```

## License

MIT
