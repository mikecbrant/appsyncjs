import { updateItem } from '@mikecbrant/appsyncjs-dynamo';
import { util } from '@aws-appsync/utils';

export function request(ctx: any) {
	const { input } = ctx.args as {
		input: { id: string; email?: string | null; name?: string | null };
	};
	const { id, ...attrs } = input;

	// Build a DynamoDB update expression based on provided fields
	const names: Record<string, string> = {};
	const values: Record<string, any> = {};
	const sets: string[] = [];

	for (const [k, v] of Object.entries(attrs)) {
		if (v === undefined || v === null) continue;
		const nameKey = `#${k}`;
		const valueKey = `:${k}`;
		names[nameKey] = k;
		values[valueKey] = v;
		sets.push(`${nameKey} = ${valueKey}`);
	}
	// Always update updatedAt
	names['#updatedAt'] = 'updatedAt';
	values[':updatedAt'] = new Date().toISOString();
	sets.push('#updatedAt = :updatedAt');

	const update = {
		expression: `SET ${sets.join(', ')}`,
		expressionNames: names,
		expressionValues: util.dynamodb.toMapValues(values),
	};

	return updateItem({ key: { pk: id }, update });
}

export function response(ctx: any) {
	return { id: ctx.args.input.id, ...ctx.args.input };
}
