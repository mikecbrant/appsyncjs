#! /usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { create } from './index.mjs';

const parseArgs = (argv) => {
	const args = { dir: undefined, entity: undefined, description: undefined };
	for (let i = 2; i < argv.length; i++) {
		const a = argv[i];
		if (
			(a === '--entity' || a === '-e') &&
			argv[i + 1] &&
			!argv[i + 1].startsWith('-')
		) {
			args.entity = argv[++i];
			continue;
		}
		if (
			(a === '--description' || a === '-d') &&
			argv[i + 1] &&
			!argv[i + 1].startsWith('-')
		) {
			args.description = argv[++i];
			continue;
		}
		if (!args.dir) args.dir = a;
	}
	return args;
};

const main = async () => {
	const parsed = parseArgs(process.argv);
	const targetDir = parsed.dir || 'appsyncjs-app';
	const cwd = process.cwd();
	const dest = path.resolve(cwd, targetDir);

	const __dirname = path.dirname(fileURLToPath(import.meta.url));
	const templateDir = path.resolve(__dirname, 'scaffold');

	// Basic guard: don't overwrite non-empty directories
	await fs
		.stat(dest)
		.then(async () => {
			// Directory exists — check if it's empty
			const files = await fs.readdir(dest).catch((err) => {
				console.error('Error reading target directory contents:', err);
				throw err;
			});
			if (files.length > 0) {
				console.error(
					`Target directory already exists and is not empty: ${dest}`,
				);
				process.exit(1);
			}
		})
		.catch((err) => {
			// Ignore missing directory; log and exit on other errors
			if (err && err.code !== 'ENOENT') {
				console.error('Error checking target directory:', err);
				process.exit(1);
			}
		});

	await create({
		templateDir,
		dest,
		entity: parsed.entity,
		description: parsed.description,
	});
	console.log(`✔ Created scaffold in ${dest}`);
	console.log('\nNext steps:');
	console.log(`  1. cd ${path.relative(cwd, dest)}`);
	console.log('  2. pnpm i  # or npm i / yarn');
	console.log('  3. pnpm build:resolvers');
	console.log('  4. pnpm test');
	console.log('  5. pnpm deploy  # requires AWS credentials configured');
};

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
