import { putItem } from '@mikecbrant/appsyncjs-dynamo';
import type {
	AppSyncResolverEvent,
	DynamoDBUpdateItemRequest,
} from '@aws-appsync/utils';

type PutInput = { id: string };
type PutArgs = { input: PutInput };

export function request(
	ctx: AppSyncResolverEvent<PutArgs>,
): DynamoDBUpdateItemRequest {
	const { id } = ctx.args.input;
	const now = new Date().toISOString();
	return putItem({
		key: { pk: id },
		item: { id, createdAt: now, updatedAt: now },
	});
}

export function response(ctx: AppSyncResolverEvent<PutArgs>) {
	return ctx.result?.attributes ?? null;
}
