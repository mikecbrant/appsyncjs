// SST v3 config (Pulumi)
// Docs: https://sst.dev/docs/reference/config
import fs from 'node:fs';

export default {
	app(input) {
		return {
			name: '__APP_NAME__',
			providers: {
				aws: {
					region: '__REGION__',
				},
			},
		};
	},
	async run() {
		// DynamoDB table for Users
		const table = new sst.aws.Dynamo('__USER_TABLE_NAME__', {
			fields: { pk: 'string' },
			primaryIndex: { hashKey: 'pk' },
		});

		// Optional Cognito baseline when requested at generation time
		const isCognito = '__AUTH_MODE__' === 'cognito';
		let userPool: sst.aws.CognitoUserPool | undefined;
		if (isCognito) {
			userPool = new sst.aws.CognitoUserPool('UserPool', {
				passwordPolicy: {
					minLength: 8,
					lowercase: true,
					uppercase: true,
					numbers: true,
				},
			});
		}

		// GraphQL API (AppSync, JS runtime resolvers)
		const api = new sst.aws.AppSync('Api', {
			schema: 'graphql/schema.graphql',
			// Auth mode decided at generation time
			transform: {
				api: isCognito
					? {
							authenticationType: 'AMAZON_COGNITO_USER_POOLS',
							userPoolConfig: {
								awsRegion: '__REGION__',
								defaultAction: 'ALLOW',
								userPoolId: userPool!.id,
							} as any,
						}
					: {
							authenticationType: 'API_KEY',
						},
			},
		});

		// Add DynamoDB as a data source
		const dynamoDS = api.addDataSource({ name: 'users', dynamodb: table.arn });

		// Helper to load compiled JS resolver code (APPSYNC_JS)
		const code = (file: string) => fs.readFileSync(file, 'utf8');

		// Attach resolvers (unit resolvers with JS runtime)
		api.addResolver('Query getUser', {
			dataSource: dynamoDS.name,
			code: code('appsync/Query.getUser.mjs'),
		});
		api.addResolver('Mutation putUser', {
			dataSource: dynamoDS.name,
			code: code('appsync/Mutation.putUser.mjs'),
		});
		api.addResolver('Mutation updateUser', {
			dataSource: dynamoDS.name,
			code: code('appsync/Mutation.updateUser.mjs'),
		});
		api.addResolver('Mutation deleteUser', {
			dataSource: dynamoDS.name,
			code: code('appsync/Mutation.deleteUser.mjs'),
		});

		return {
			apiUrl: api.url,
			tableName: table.name,
			userPoolArn: userPool?.arn,
		};
	},
};
