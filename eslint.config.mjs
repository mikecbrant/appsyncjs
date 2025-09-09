// Use the shared flat config from @mikecbrant/eslint-config as the root config
// so ESLint actually applies the shared rules in this repository.
import shared from '@mikecbrant/eslint-config';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  ...shared,
  { files: ['**/*.{ts,tsx,mts,cts}'], languageOptions: { parserOptions: { allowDefaultProject: true } } },
  // Keep local ignores to avoid linting generated/template files and JSON
  { ignores: [
    'packages/create-appsyncjs/**',
    'packages/cli/**',
    '**/*.json',
    '**/coverage/**',
    '**/dist/**',
    '**/*.cjs',
    '**/*.cts',
  ] },
];
