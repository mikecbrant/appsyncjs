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

	const request: DynamoDBDeleteItemRequest & { returnValues?: 'ALL_OLD' } = {
		operation: 'DeleteItem',
		key: util.dynamodb.toMapValues(key),
	};

	if (condition) {
		request.condition = condition;
	}

	if (returnDeleted) {
		// In DynamoDB/AppSync request shape, this includes the deleted item's previous attributes in the result
		request.returnValues = 'ALL_OLD';
	}

	return request;
};

export default deleteItem;
