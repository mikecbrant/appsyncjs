import {
	util,
	type ConditionCheckExpression,
	type DynamoDBExpression,
	type DynamoDBUpdateItemRequest,
} from '@aws-appsync/utils';
import type { DynamoKey } from './types.js';

export type PutItemProps = {
	key: DynamoKey;
	item: Record<string, unknown>;
	condition?: ConditionCheckExpression;
};

const putItem = (props: PutItemProps): DynamoDBUpdateItemRequest => {
	const { key, item, condition } = props;

	// Model Put as Update so the runtime returns the updated item in the response
	const names: Record<string, string> = {};
	const values: Record<string, unknown> = {};
	const sets: string[] = [];

	for (const [attr, val] of Object.entries(item)) {
		const nameKey = `#${attr}`;
		const valueKey = `:${attr}`;
		names[nameKey] = attr;
		values[valueKey] = val;
		sets.push(`${nameKey} = ${valueKey}`);
	}

	const update: DynamoDBExpression = {
		expression: `SET ${sets.join(', ')}`,
		expressionNames: names,
		expressionValues: util.dynamodb.toMapValues(values as any) as any,
	};

	const request: DynamoDBUpdateItemRequest & { returnValues: 'ALL_NEW' } = {
		operation: 'UpdateItem',
		key: util.dynamodb.toMapValues(key),
		update,
		returnValues: 'ALL_NEW',
	};

	if (condition) request.condition = condition;

	return request;
};

export default putItem;
