/// <reference path="./.sst/platform/config.d.ts" />
/* global $config, sst */

// Injected at generation time (tokens replaced by the generator)
const appName = '__APP_NAME__';
const region = '__REGION__';
const entity = '__ENTITY__';
const tableName = '__TABLE_NAME__';

// SST v3 config — import infra modules instead of defining resources inline
export default $config({
	app(_input) {
		return {
			name: appName,
			providers: { aws: { region } },
		};
	},
	async run() {
		// Compose infra from split modules, mirroring the SST monorepo template
		const storage = await import('./infra/storage');
		const api = await import('./infra/api');

		const { table } = storage.createStorage({ tableName });
		const { api: graph } = api.createApi({
			entity,
			schemaPath: 'packages/core/graphql/schema.graphql',
			tableArn: table.arn,
		});

		return { apiUrl: graph.url, tableName: table.name };
	},
});
