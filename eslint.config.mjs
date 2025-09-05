// Minimal flat config: focus on basic JS/MJS hygiene. TypeScript correctness is
// enforced via `tsgo check` and package builds.
import importPlugin from 'eslint-plugin-import';
import unusedImports from 'eslint-plugin-unused-imports';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	{
		files: ['**/*.{js,mjs}'],
		languageOptions: { ecmaVersion: 2023, sourceType: 'module' },
		plugins: { import: importPlugin, 'unused-imports': unusedImports },
		rules: {
			'import/no-duplicates': 'error',
			'import/order': [
				'error',
				{
					groups: [
						['builtin', 'external'],
						'internal',
						'parent',
						'sibling',
						'index',
						'object',
						'type',
					],
					alphabetize: { order: 'asc', caseInsensitive: true },
					'newlines-between': 'always',
				},
			],
			'unused-imports/no-unused-imports': 'error',
		},
	},
	{
		ignores: [
			'packages/create-appsyncjs/scaffold/**',
			'**/*.cjs',
			'**/*.cts',
			'**/coverage/**',
			'**/dist/**',
		],
	},
];
