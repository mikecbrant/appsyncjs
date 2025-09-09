// Use the shared flat config from @mikecbrant/eslint-config as the root config.
// Add eslint-config-prettier to disable stylistic rules that conflict with Prettier.
import shared from '@mikecbrant/eslint-config';
import configPrettier from 'eslint-config-prettier';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	// Base: shared rules only
	...shared,

	// Prefer Prettier for formatting; turn off the Stylistic plugin rule family
	{ rules: { '@stylistic/*': 'off' } },

	// Allow linting TS files that aren't part of an explicit tsconfig project
	{
		files: ['**/*.{ts,tsx,mts,cts}'],
		languageOptions: { parserOptions: { allowDefaultProject: true } },
	},

	// Tests: disable typed project service; relax a few typed rules
	{
		files: ['**/*.test.{ts,tsx}', '**/vitest.config.ts'],
		languageOptions: { parserOptions: { projectService: false } },
		rules: {
			'@typescript-eslint/*': 'off',
			'@typescript-eslint/await-thenable': 'off',
			'@typescript-eslint/no-floating-promises': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-return': 'off',
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/promise-function-async': 'off',
			'@typescript-eslint/prefer-nullish-coalescing': 'off',
			'@typescript-eslint/dot-notation': 'off',
			'@typescript-eslint/consistent-type-exports': 'off',
			'@typescript-eslint/no-base-to-string': 'off',
			'@typescript-eslint/no-array-delete': 'off',
			'capitalized-comments': 'off',
			'no-console': 'off',
		},
	},

	// Package-specific relaxations for test-utils sources (non-test files)
	{
		files: ['packages/test-utils/src/**/*.ts'],
		rules: {
			'@typescript-eslint/*': 'off',
			'no-console': 'off',
		},
	},

	// Local ignores: exclude special/runtime-sensitive and generated/template content
	{
		ignores: [
			'packages/dynamo/**', // Explicitly excluded per repo policy
			'packages/create-appsyncjs/**',
			'packages/cli/**',
			'packages/test-utils/**',
			'packages/create-appsyncjs/scaffold/**',
			'**/*.json',
			'**/coverage/**',
			'**/dist/**',
			'**/*.cjs',
			'**/*.cts',
		],
	},

	// Disable formatting-related rules that overlap with Prettier output — keep last
	configPrettier,
];
