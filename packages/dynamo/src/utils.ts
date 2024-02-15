import type { DynamoDBExpression } from '@aws-appsync/utils';
import type { DynamoKey } from './types.js';

type BuildKeyConditionProps = {
	key: DynamoKey;
	exists: boolean;
};

/**
 * We don't ACTUALLY know which of keys in compound partition + sort key
 * is partition key, so we assign first key to #pk name and second
 * (if present) to #sk.
 * Order will not matter when applying condition expression in DynamoDB
 */
const buildKeyCondition = ({
	key,
	exists,
}: BuildKeyConditionProps): DynamoDBExpression => {
	const condition =
		exists === true ? 'attribute_exists' : 'attribute_not_exists';
	const keyNames = Object.keys(key);

	let expression = `${condition}(#pk)`;
	const expressionNames = {
		'#pk': keyNames[0],
	};

	if (keyNames[1]) {
		expression += ` AND ${condition}(#sk)`;
		expressionNames['#sk'] = keyNames[1];
	}

	return {
		expression,
		expressionNames,
	};
};

const buildProjectionExpression = (
	fields: string[],
): DynamoDBExpression | undefined => {
	if (!fields || typeof fields !== 'object' || fields?.length < 1) {
		return undefined;
	}

	const expressionNames = fields.reduce<Record<string, string>>(
		(obj, field) => {
			obj['#' + field] = field;
			return obj;
		},
		{},
	);

	return {
		expression: Object.keys(expressionNames).join(', '),
		expressionNames,
	};
};

export { buildKeyCondition, buildProjectionExpression };
