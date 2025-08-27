import {
	util,
	type DynamoDBDeleteItemRequest,
	type DynamoDBExpression,
} from '@aws-appsync/utils';
import type { DynamoKey } from './types.js';

export type DeleteItemProps = {
	key: DynamoKey;
	condition?: DynamoDBExpression;
};

const deleteItem = (props: DeleteItemProps): DynamoDBDeleteItemRequest => {
	const { key, condition } = props;

	const request: DynamoDBDeleteItemRequest = {
		operation: 'DeleteItem',
		key: util.dynamodb.toMapValues(key),
	};

	if (condition) {
		request.condition = condition;
	}

	return request;
};

export default deleteItem;
