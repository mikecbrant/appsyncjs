#! /usr/bin/env node
import { program } from 'commander';

import build, {
	defaultIgnore,
	defaultInclude,
	defaultOutdir,
} from './commands/build.mjs';

program
	.name('appsyncjs')
	.description('CLI tool for working with AWS AppSync JS resolvers');

program
	.command('build')
	.description('Build APPSYNC_JS-compatible scripts via esbuild')
	.option(
		'-o, --outdir <path>',
		'Output directory, mapped to esbuild outdir config option',
		defaultOutdir,
	)
	.option(
		'-i, --include <globs...>',
		'One or more glob-compatible strings for files to include as build entrypoints',
		defaultInclude,
	)
	.option(
		'-x, --ignore <globs...>',
		'One or more glob-compatible strings for files to be ignored by build',
		defaultIgnore,
	)
	.action(build);

await program.parseAsync(process.argv);
