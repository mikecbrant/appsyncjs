// SST v3 config (Pulumi)
// Docs: https://sst.dev/docs/reference/config
import fs from 'node:fs';

// Injected at generation time
const appName = '__APP_NAME__';
const region = '__REGION__';
const entity = '__ENTITY__';
const tableName = '__TABLE_NAME__';

export default {
	app(_input) {
		return {
			name: appName,
			providers: {
				aws: { region },
			},
		};
	},
	async run() {
		// DynamoDB table
		const table = new sst.aws.Dynamo(tableName, {
			fields: { pk: 'string' },
			primaryIndex: { hashKey: 'pk' },
		});

		// GraphQL API (AppSync, JS runtime resolvers)
		const api = new sst.aws.AppSync('Api', {
			schema: 'graphql/schema.graphql',
			transform: { api: { authenticationType: 'API_KEY' } },
		});

		// Add DynamoDB as a data source
		const dynamoDS = api.addDataSource({ name: entity, dynamodb: table.arn });

		// Helper to load compiled JS resolver code (APPSYNC_JS)
		const code = (file: string) => fs.readFileSync(file, 'utf8');

		// Attach resolvers (unit resolvers with JS runtime)
		api.addResolver('Query get__ENTITY__', {
			dataSource: dynamoDS.name,
			code: code('appsync/src/resolvers/get.js'),
		});
		api.addResolver('Mutation upsert__ENTITY__', {
			dataSource: dynamoDS.name,
			code: code('appsync/src/resolvers/upsert.js'),
		});
		api.addResolver('Mutation update__ENTITY__', {
			dataSource: dynamoDS.name,
			code: code('appsync/src/resolvers/update.js'),
		});
		api.addResolver('Mutation delete__ENTITY__', {
			dataSource: dynamoDS.name,
			code: code('appsync/src/resolvers/delete.js'),
		});

		return { apiUrl: api.url, tableName: table.name };
	},
};
