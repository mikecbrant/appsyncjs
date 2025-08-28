import { putItem } from '@mikecbrant/appsyncjs-dynamo';
import type {
	AppSyncResolverEvent,
	DynamoDBPutItemRequest,
} from '@aws-appsync/utils';

type PutUserInput = { id: string; email: string; name: string };
type PutUserArgs = { input: PutUserInput };

export function request(
	ctx: AppSyncResolverEvent<PutUserArgs>,
): DynamoDBPutItemRequest {
	const { input } = ctx.args;
	const { id, email, name } = input;
	const now = new Date().toISOString();
	return putItem({
		key: { pk: id },
		item: { id, email, name, createdAt: now, updatedAt: now },
	});
}

export function response(ctx: AppSyncResolverEvent<PutUserArgs>) {
	// Return the input as a convenience; DynamoDB PutItem without ReturnValues doesn't return the item
	return { ...ctx.args.input };
}
