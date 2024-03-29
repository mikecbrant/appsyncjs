import { type DynamoDBGetItemRequest, util } from '@aws-appsync/utils';
import type { DynamoKey } from './types.js';
import { buildProjectionExpression } from './utils.js';

type GetItemProps = {
	key: DynamoKey;
	consistentRead?: boolean;
	returnedFields?: string[];
};

const getItem = (props: GetItemProps): DynamoDBGetItemRequest => {
	const { key, consistentRead = false, returnedFields = [] } = props;

	const request: DynamoDBGetItemRequest = {
		operation: 'GetItem',
		key: util.dynamodb.toMapValues(key),
		consistentRead,
	};

	if (returnedFields.length > 0) {
		request.projection = buildProjectionExpression(returnedFields);
	}

	return request;
};

export default getItem;
