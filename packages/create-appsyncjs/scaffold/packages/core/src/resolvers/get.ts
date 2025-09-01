import { getItem } from '@mikecbrant/appsyncjs-dynamo';
import type {
	AppSyncResolverEvent,
	DynamoDBGetItemRequest,
} from '@aws-appsync/utils';

type GetArgs = { id: string };

export function request(
	ctx: AppSyncResolverEvent<GetArgs>,
): DynamoDBGetItemRequest {
	const { id } = ctx.args;
	return getItem({ key: { pk: id } });
}

export function response(ctx: AppSyncResolverEvent<GetArgs>) {
	return ctx.result ?? null;
}
