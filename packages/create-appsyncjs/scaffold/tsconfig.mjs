export default {
	compilerOptions: {
		target: 'ES2022',
		module: 'ESNext',
		moduleResolution: 'Bundler',
		strict: true,
		noEmit: true,
		outDir: './build',
	},
	include: ['src', 'sst.config.ts', 'graphql'],
	exclude: ['node_modules', 'build', 'coverage', '**/*.test.ts'],
};
