export default {
	compilerOptions: {
		target: 'ES2022',
		module: 'ESNext',
		moduleResolution: 'Bundler',
		strict: true,
		noEmit: true,
		types: ['vitest/importMeta', 'vitest'],
	},
	include: ['src/**/*.test.ts'],
	exclude: ['node_modules', 'build', 'coverage'],
};
