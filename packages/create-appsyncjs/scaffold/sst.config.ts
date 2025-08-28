import { App, StackContext } from 'sst/constructs';
import { ApiStack } from './stacks/ApiStack.js';

export default {
	config(_input) {
		return {
			name: '__APP_NAME__',
			region: '__REGION__',
		} satisfies Parameters<App['config']>[0];
	},
	stacks(app: App) {
		app.stack(ApiStack);
	},
};
