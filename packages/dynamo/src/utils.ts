import type { DynamoDBExpression } from '@aws-appsync/utils';

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

export { buildProjectionExpression };
