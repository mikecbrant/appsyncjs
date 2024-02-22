import { build as esbuild } from 'esbuild';
import { glob } from 'glob';

const defaultIgnore = ['**/*.{test,spec}.ts'];
const defaultInclude = ['src/**/*.ts'];
const defaultOutdir = 'dist/';

const build = async ({
	ignore = defaultIgnore,
	include = defaultInclude,
	outdir = defaultOutdir,
} = {}) => {
	const entryPoints = await glob(include, { ignore });

	return esbuild({
		bundle: true,
		entryPoints,
		external: ['@aws-appsync/utils'],
		format: 'esm',
		outdir,
		platform: 'node',
		sourcemap: true,
		sourcesContent: false,
		target: 'esnext',
		treeShaking: true,
	});
};

export { build as default, defaultIgnore, defaultInclude, defaultOutdir };
