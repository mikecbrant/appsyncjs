import { updateItem } from '@mikecbrant/appsyncjs-dynamo';
import {
	util,
	type AppSyncResolverEvent,
	type DynamoDBUpdateItemRequest,
	type DynamoDBExpression,
} from '@aws-appsync/utils';

type UpdateInput = { id: string };
type UpdateArgs = { input: UpdateInput };

export function request(
	ctx: AppSyncResolverEvent<UpdateArgs>,
): DynamoDBUpdateItemRequest {
	const { id } = ctx.args.input;

	const values = { ':updatedAt': new Date().toISOString() } as const;
	const update: DynamoDBExpression = {
		expression: 'SET #updatedAt = :updatedAt',
		expressionNames: { '#updatedAt': 'updatedAt' },
		expressionValues: util.dynamodb.toMapValues(values as any),
	};

	const req = updateItem({ key: { pk: id }, update });
	return { ...req, returnValues: 'ALL_NEW' } as DynamoDBUpdateItemRequest & {
		returnValues: 'ALL_NEW';
	};
}

export function response(ctx: AppSyncResolverEvent<UpdateArgs>) {
	return ctx.result?.attributes ?? null;
}
