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
	customPartitionKey?: string;
	populateIndexFields?: boolean;
	_version?: number;
};

const updateItem = (props: UpdateItemProps): DynamoDBUpdateItemRequest => {
	const {
		key,
		update,
		condition,
		customPartitionKey,
		populateIndexFields,
		_version,
	} = props;

	const request: DynamoDBUpdateItemRequest = {
		operation: 'UpdateItem',
		key: util.dynamodb.toMapValues(key),
		update,
	};

	if (condition) {
		request.condition = condition;
	}
	if (customPartitionKey) {
		request.customPartitionKey = customPartitionKey;
	}
	if (populateIndexFields !== undefined) {
		request.populateIndexFields = populateIndexFields;
	}
	if (_version !== undefined) {
		request._version = _version;
	}

	return request;
};

export default updateItem;
