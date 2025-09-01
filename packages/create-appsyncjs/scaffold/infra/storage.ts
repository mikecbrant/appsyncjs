/* global sst */
// Creates a single-table DynamoDB table used by the AppSync API

export function createStorage({ tableName }: { tableName: string }) {
	const table = new sst.aws.Dynamo(tableName, {
		fields: { pk: 'string' },
		primaryIndex: { hashKey: 'pk' },
	});

	return { table };
}
