/* global sst */
import fs from 'node:fs';

type CreateApiProps = {
	entity: string;
	schemaPath: string;
	tableArn: string;
};

// AppSync API and resolver wiring (JS runtime resolvers)
export function createApi({ entity, schemaPath, tableArn }: CreateApiProps) {
	const api = new sst.aws.AppSync('Api', { schema: schemaPath });

	// Add DynamoDB as a data source
	const dynamoDS = api.addDataSource({ name: entity, dynamodb: tableArn });

	// Helper to load compiled JS resolver code (APPSYNC_JS)
	const code = (name: string) =>
		fs.readFileSync(`build/appsync/${name}.js`, 'utf8');

	// Attach resolvers (unit resolvers with JS runtime)
	api.addResolver('Query get__ENTITY__', {
		dataSource: dynamoDS.name,
		code: code('get'),
	});
	api.addResolver('Mutation upsert__ENTITY__', {
		dataSource: dynamoDS.name,
		code: code('upsert'),
	});
	api.addResolver('Mutation update__ENTITY__', {
		dataSource: dynamoDS.name,
		code: code('update'),
	});
	api.addResolver('Mutation delete__ENTITY__', {
		dataSource: dynamoDS.name,
		code: code('delete'),
	});

	return { api };
}
