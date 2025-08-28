import { getItem } from '@mikecbrant/appsyncjs-dynamo';
import type {
	AppSyncResolverEvent,
	DynamoDBGetItemRequest,
} from '@aws-appsync/utils';

type GetUserArgs = { id: string };

export function request(
	ctx: AppSyncResolverEvent<GetUserArgs>,
): DynamoDBGetItemRequest {
	const { id } = ctx.args;
	return getItem({ key: { pk: id } });
}

export function response(ctx: AppSyncResolverEvent<GetUserArgs>) {
	return ctx.result;
}
