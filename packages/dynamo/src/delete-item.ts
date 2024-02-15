import { type DynamoDBDeleteItemRequest, util } from '@aws-appsync/utils';
import type { DynamoKey } from './types.js';
import { buildKeyCondition } from './utils.js';

type DeleteItemProps = {
	key: DynamoKey;
	idempotent?: boolean;
};

const deleteItem = (props: DeleteItemProps): DynamoDBDeleteItemRequest => {
	const { key, idempotent = true } = props;

	const request: DynamoDBDeleteItemRequest = {
		operation: 'DeleteItem',
		key: util.dynamodb.toMapValues(key),
	};

	if (idempotent !== true) {
		request.condition = buildKeyCondition({ key, exists: true });
	}

	return request;
};

export default deleteItem;
