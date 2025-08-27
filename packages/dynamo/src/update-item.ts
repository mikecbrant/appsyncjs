import {
	util,
	type ConditionCheckExpression,
	type DynamoDBExpression,
	type DynamoDBUpdateItemRequest,
} from '@aws-appsync/utils';
import type { DynamoKey } from './types.js';

type UpdateItemProps = {
	key: DynamoKey;
	update: DynamoDBExpression;
	condition?: ConditionCheckExpression;
};

const updateItem = (props: UpdateItemProps): DynamoDBUpdateItemRequest => {
	const { key, update, condition } = props;

	const request: DynamoDBUpdateItemRequest = {
		operation: 'UpdateItem',
		key: util.dynamodb.toMapValues(key),
		update,
	};

	if (condition) {
		request.condition = condition;
	}

	return request;
};

export default updateItem;
