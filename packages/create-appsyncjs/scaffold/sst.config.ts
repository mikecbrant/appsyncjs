/// <reference path="./.sst/platform/config.d.ts" />
/* global $config, sst */

const appName = '__APP_NAME__';
const region = '__REGION__';
const entity = '__ENTITY__';
const tableName = '__TABLE_NAME__';

export default $config({
	app(_input) {
		return {
			name: appName,
			providers: { aws: { region } },
		};
	},
	async run() {
		const storage = await import('./infra/storage');
		const apiInfra = await import('./infra/api');

		const { table } = storage.createStorage({ tableName });
		const { api } = apiInfra.createApi({
			entity,
			schemaPath: 'packages/core/graphql/schema.graphql',
			tableArn: table.arn,
		});

		return { apiUrl: api.url, tableName: table.name };
	},
});
