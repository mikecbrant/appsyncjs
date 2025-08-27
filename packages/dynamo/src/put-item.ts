import {
	type ConditionCheckExpression,
	type DynamoDBPutItemRequest,
	util,
} from '@aws-appsync/utils';
import type { DynamoKey } from './types.js';

type PutItemProps = {
	key: DynamoKey;
	item: Record<string, unknown>;
	condition?: ConditionCheckExpression;
	customPartitionKey?: string;
	populateIndexFields?: boolean;
	_version?: number;
};

const putItem = (props: PutItemProps): DynamoDBPutItemRequest => {
	const {
		key,
		item,
		condition,
		customPartitionKey,
		populateIndexFields,
		_version,
	} = props;

	const request: DynamoDBPutItemRequest = {
		operation: 'PutItem',
		key: util.dynamodb.toMapValues(key),
		attributeValues: util.dynamodb.toMapValues(item),
	};

	if (condition) request.condition = condition;
	if (customPartitionKey) request.customPartitionKey = customPartitionKey;
	if (typeof populateIndexFields === 'boolean')
		request.populateIndexFields = populateIndexFields;
	if (typeof _version === 'number') request._version = _version;

	return request;
};

export default putItem;
