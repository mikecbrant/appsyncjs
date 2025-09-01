import { deleteItem } from '@mikecbrant/appsyncjs-dynamo';
import type {
	AppSyncResolverEvent,
	DynamoDBDeleteItemRequest,
} from '@aws-appsync/utils';

type DeleteInput = { id: string; returnDeleted?: boolean | null };
type DeleteArgs = { input: DeleteInput };

export function request(
	ctx: AppSyncResolverEvent<DeleteArgs>,
): DynamoDBDeleteItemRequest {
	const { id, returnDeleted } = ctx.args.input;
	return deleteItem({ key: { pk: id }, returnDeleted: Boolean(returnDeleted) });
}

export function response(ctx: AppSyncResolverEvent<DeleteArgs>) {
	return ctx.result?.attributes ?? null;
}
