import {
	util,
	type DynamoDBDeleteItemRequest,
	type DynamoDBExpression,
} from '@aws-appsync/utils';
import type { DynamoKey } from './types.js';

export type DeleteItemProps = {
	key: DynamoKey;
	condition?: DynamoDBExpression;
	/** When true, requests DynamoDB to return the deleted item's old values */
	returnDeleted?: boolean;
};

const deleteItem = (props: DeleteItemProps): DynamoDBDeleteItemRequest => {
	const { key, condition, returnDeleted } = props;

	const request: DynamoDBDeleteItemRequest = {
		operation: 'DeleteItem',
		key: util.dynamodb.toMapValues(key),
	};

	if (condition) {
		request.condition = condition;
	}

	if (returnDeleted) {
		// In DynamoDB API, this includes the deleted item's previous attributes in the result
		(request as any).ReturnValues = 'ALL_OLD';
	}

	return request;
};

export default deleteItem;
