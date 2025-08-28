#! /usr/bin/env node
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import { create } from './index.mjs';

async function main() {
	const [, , targetArg] = process.argv;
	const targetDir = targetArg || 'appsyncjs-app';
	const cwd = process.cwd();
	const dest = path.resolve(cwd, targetDir);

	const __dirname = path.dirname(fileURLToPath(import.meta.url));
	const templateDir = path.resolve(__dirname, 'scaffold');

	// Basic guard: don't overwrite non-empty directories
	try {
		const stat = await fs.stat(dest).catch(() => null);
		if (stat) {
			const files = await fs.readdir(dest);
			if (files.length > 0) {
				console.error(
					`Target directory already exists and is not empty: ${dest}`,
				);
				process.exit(1);
			}
		}
	} catch (err) {
		// ignore
	}

	await create({ templateDir, dest });
	console.log(`✔ Created scaffold in ${dest}`);
	console.log('\nNext steps:');
	console.log(`  1. cd ${path.relative(cwd, dest)}`);
	console.log('  2. pnpm i  # or npm i / yarn');
	console.log('  3. pnpm build:resolvers');
	console.log('  4. pnpm test');
	console.log('  5. pnpm deploy  # requires AWS credentials configured');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
