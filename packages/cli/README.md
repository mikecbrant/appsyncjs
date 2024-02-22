# @mikecbrant/appsyncjs-cli

This is package is intended to provide CLI utilities for use in `APPSYNC_JS` runtime development. These utilities are also made available through standard module imports.

The `APPSYNC_JS` runtime environment offers a Javascript-like set of features geared at making it easier for developers to write performant resolvers without the need to learn the legacy VTL mapping templates syntax which was formerly the primary means for implementing AppSync resolver logic.

Related reading:

- [Javascript resolvers overview](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-reference-overview-js.html)
- [APPSYNC_JS runtime features](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-util-reference-js.html).

## Install

Install as a `devDependency` along with `@aws-appsync/utils` peer dependency

```bash
pnpm i -D @mikecbrant/appsyncjs-cli @aws-appsync/utils

# or
npm i -D @mikecbrant/appsyncjs-cli @aws-appsync/utils
```

This library provides a pnpm/npm compatible binary available for use in scripts as `appsyncjs`.
The library can also be used programmatically via module `import` in your own scripts.

## Build Utility

The `build` command/export is intended to generate compacted, tree-shaken, source-mapped, `APPSYNC_JS`-compatible bundle artifacts for direct use as uploaded resolver code. This command acts as a drop-in replacement for `esbuild` which utilizes a standard `esbuild` config based on [AWS-recommended esbuild config examples](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-reference-overview-js.html#additional-utilities).

The parameters/options which can be configured for use with `build` are:

| option property | parameter         | default                   | notes                                                                                                                     |
| --------------- | ----------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `ignore`        | `-x`, `--ignore`  | `['**/*.{test,spec}.ts']` | Array of glob-compatible strings to be ignored by build. Parameter accepts space-separated values for globs.              |
| `include`       | `-i`, `--include` | `['src/**/*.ts']`         | Array of glob-compatible strings to be included as build entrypoints. Parameter accepts space-separated values for globs. |
| `outdir`        | `-o`, `--outdir`  | `dist/`                   | Directory path to which built artifacts are to be written.                                                                |

### Build via CLI

Example usage in package.json script:

```js
    "scripts": {
		// shown specifying all options
		"build": "appsyncjs build --outdir 'appsync/' --include 'src/**/*.ts' 'other-src/**./*.ts' --ignore '**/*.test.ts'",
		// other scripts
	},
```

Usage via package `import`:

```js
import { build } from '@mikecbrant/appsyncjs-cli';

// shown specifying all options
await build({
	ignore: ['**/*.test.ts'],
	include: ['src/**/*.ts', 'other-src/**./*.ts'],
	outdir: 'appsync/',
});
```
