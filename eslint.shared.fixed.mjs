import xoTypeScript from 'eslint-config-xo-typescript';
import importPlugin from 'eslint-plugin-import';
import sonarjs from 'eslint-plugin-sonarjs';
import unicornPlugin from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
	...xoTypeScript,
	sonarjs.configs.recommended,
	{
		name: 'local/strict-overrides',
		plugins: {
			import: importPlugin,
			unicorn: unicornPlugin,
			'unused-imports': unusedImports,
		},
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
			'no-console': 'off',
			'unicorn/prevent-abbreviations': 'off',
			'unicorn/no-null': 'off',
		},
	},
	{
		ignores: [
			'**/*.cjs',
			'**/*.cts',
			'packages/create-appsyncjs/scaffold/**',
			'**/coverage/**',
			'**/dist/**',
		],
	},
];
