import { updateItem } from '@mikecbrant/appsyncjs-dynamo';
import {
	util,
	type AppSyncResolverEvent,
	type DynamoDBUpdateItemRequest,
	type DynamoDBExpression,
} from '@aws-appsync/utils';

type UpdateUserInput = {
	id: string;
	email?: string | null;
	name?: string | null;
};
type UpdateUserArgs = { input: UpdateUserInput };

export function request(
	ctx: AppSyncResolverEvent<UpdateUserArgs>,
): DynamoDBUpdateItemRequest {
	const { input } = ctx.args;
	const { id, ...attrs } = input;

	// Build a DynamoDB update expression based on provided fields
	const names: Record<string, string> = {};
	const values: Record<string, any> = {};
	const sets: string[] = [];

	for (const [k, v] of Object.entries(attrs)) {
		if (v === undefined || v === null) continue;
		const nameKey = `#${k}`;
		const valueKey = `:${k}`;
		names[nameKey] = k;
		values[valueKey] = v;
		sets.push(`${nameKey} = ${valueKey}`);
	}
	// Always update updatedAt
	names['#updatedAt'] = 'updatedAt';
	values[':updatedAt'] = new Date().toISOString();
	sets.push('#updatedAt = :updatedAt');

	const update: DynamoDBExpression = {
		expression: `SET ${sets.join(', ')}`,
		expressionNames: names,
		expressionValues: util.dynamodb.toMapValues(values),
	};

	return updateItem({ key: { pk: id }, update });
}

export function response(ctx: AppSyncResolverEvent<UpdateUserArgs>) {
	return { id: ctx.args.input.id, ...ctx.args.input };
}
