import { type DynamoDBPutItemRequest, util } from '@aws-appsync/utils';
import type { DynamoKey, DynamoRecord } from './types.js';
import { buildKeyCondition } from './utils.js';

type PutitemProps = {
	key: DynamoKey;
	item: DynamoRecord;
	idempotent?: boolean;
};

const putItem = (props: PutitemProps): DynamoDBPutItemRequest => {
	const { key, item, idempotent = true } = props;

	const request: DynamoDBPutItemRequest = {
		operation: 'PutItem',
		key: util.dynamodb.toMapValues(key),
		attributeValues: util.dynamodb.toMapValues(item),
	};

	if (idempotent !== true) {
		request.condition = buildKeyCondition({ key, exists: false });
	}

	return request;
};

export default putItem;
