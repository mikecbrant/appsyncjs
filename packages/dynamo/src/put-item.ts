import {
	type ConditionCheckExpression,
	type DynamoDBPutItemRequest,
	util,
} from '@aws-appsync/utils';
import type { DynamoKey } from './types.js';

export type PutItemProps = {
	key: DynamoKey;
	item: Record<string, unknown>;
	condition?: ConditionCheckExpression;
};

const putItem = (props: PutItemProps): DynamoDBPutItemRequest => {
	const { key, item, condition } = props;

	const request: DynamoDBPutItemRequest = {
		operation: 'PutItem',
		key: util.dynamodb.toMapValues(key),
		attributeValues: util.dynamodb.toMapValues(item),
	};

	if (condition) request.condition = condition;

	return request;
};

export default putItem;
