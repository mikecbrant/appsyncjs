import { deleteItem } from '@mikecbrant/appsyncjs-dynamo';
import type {
	AppSyncResolverEvent,
	DynamoDBDeleteItemRequest,
} from '@aws-appsync/utils';

type DeleteUserArgs = { id: string };

export function request(
	ctx: AppSyncResolverEvent<DeleteUserArgs>,
): DynamoDBDeleteItemRequest {
	const { id } = ctx.args;
	return deleteItem({ key: { pk: id }, returnDeleted: true });
}

export function response(ctx: AppSyncResolverEvent<DeleteUserArgs>) {
	return ctx.result?.attributes ?? null;
}
