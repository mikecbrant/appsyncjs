import { type DynamoDBGetItemRequest, util } from '@aws-appsync/utils';
import type { DynamoKey } from './types.js';
import { buildProjectionExpression } from './utils.js';

export type GetItemProps = {
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
		const projection = buildProjectionExpression(returnedFields);
		if (projection) request.projection = projection;
	}

	return request;
};

export default getItem;
