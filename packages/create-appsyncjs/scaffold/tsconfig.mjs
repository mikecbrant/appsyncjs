export default {
	compilerOptions: {
		target: 'ES2022',
		module: 'ESNext',
		moduleResolution: 'Bundler',
		strict: true,
		noEmit: true,
	},
	include: ['src', 'sst.config.ts', 'graphql'],
	exclude: ['node_modules', 'appsync', 'dist', '**/*.test.ts'],
};
