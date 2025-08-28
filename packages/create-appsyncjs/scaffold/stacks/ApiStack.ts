import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { StackContext, AppSyncApi, Table } from 'sst/constructs';
import * as appsync from 'aws-cdk-lib/aws-appsync';

export function ApiStack({ stack }: StackContext) {
	const table = new Table(stack, '__USER_TABLE_NAME__Table', {
		fields: {
			pk: 'string',
		},
		primaryIndex: { partitionKey: 'pk' },
	});

	const api = new AppSyncApi(stack, 'Api', {
		graphqlApi: {
			// Enable JS resolver runtime
			authorizationConfig: {
				defaultAuthorization: {
					authorizationType: appsync.AuthorizationType.API_KEY,
				},
			},
		},
		schema: 'graphql/schema.graphql',
		dataSources: {
			users: {
				type: 'dynamodb',
				table,
			},
		},
	});

	const __dirname = path.dirname(fileURLToPath(import.meta.url));
	const bundle = (relative) => path.resolve(__dirname, '..', relative);

	// Helper to attach a JS runtime resolver for a field using a bundled file
	const attach = (typeName, fieldName, file) => {
		api.cdk.graphqlApi.createResolver(`${typeName}${fieldName}Resolver`, {
			typeName,
			fieldName,
			code: appsync.Code.fromAsset(bundle(file)),
			runtime: appsync.FunctionRuntime.JS_1_0_0,
			dataSource: api.getDataSource('users'),
		});
	};

	attach('Query', 'getUser', 'appsync/Query.getUser.mjs');
	attach('Mutation', 'putUser', 'appsync/Mutation.putUser.mjs');
	attach('Mutation', 'updateUser', 'appsync/Mutation.updateUser.mjs');
	attach('Mutation', 'deleteUser', 'appsync/Mutation.deleteUser.mjs');

	stack.addOutputs({
		ApiId: api.cdk.graphqlApi.apiId,
		ApiUrl: api.url,
		TableName: table.tableName,
	});
}
