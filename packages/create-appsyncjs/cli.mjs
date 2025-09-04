#! /usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import readline from 'node:readline/promises';

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

const sanitizeAppName = (dest) =>
	path.basename(dest).replace(/[^a-zA-Z0-9-_]/g, '-');

const listTemplateFiles = async (srcDir, vars, prefix = '') => {
	const out = [];
	const entries = await fs.readdir(srcDir, { withFileTypes: true });
	for (const entry of entries) {
		const rewritten = entry.name.replaceAll('__APP_NAME__', vars.APP_NAME);
		const relPath = prefix ? path.join(prefix, rewritten) : rewritten;
		const srcPath = path.join(srcDir, entry.name);
		if (entry.isDirectory()) {
			const nested = await listTemplateFiles(srcPath, vars, relPath);
			out.push(...nested);
			continue;
		}
		// Only files are considered conflicts; directories alone are harmless
		out.push(relPath);
	}
	return out;
};

const exists = async (p) =>
	fs
		.stat(p)
		.then(() => true)
		.catch((err) => (err && err.code === 'ENOENT' ? false : true));

const promptConfirm = async (message) => {
	if (!process.stdin.isTTY) return false;
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const answer = await rl
		.question(`${message} [y/N] `)
		.catch(() => '')
		.finally(() => rl.close());
	const v = (answer ?? '').trim().toLowerCase();
	return v === 'y' || v === 'yes';
};

const gitIsRepo = () =>
	new Promise((resolve) => {
		const child = spawn('git', ['rev-parse', '--is-inside-work-tree'], {
			cwd: process.cwd(),
			stdio: ['ignore', 'pipe', 'ignore'],
		});
		let out = '';
		child.stdout.on('data', (d) => (out += String(d)));
		child.on('close', (code) => resolve(code === 0 && out.trim() === 'true'));
		child.on('error', () => resolve(false));
	});

const gitWorkingTreeDirty = () =>
	new Promise((resolve) => {
		const child = spawn('git', ['status', '--porcelain'], {
			cwd: process.cwd(),
			stdio: ['ignore', 'pipe', 'ignore'],
		});
		let out = '';
		child.stdout.on('data', (d) => (out += String(d)));
		child.on('close', () => resolve(out.trim().length > 0));
		child.on('error', () => resolve(false));
	});

const main = async () => {
	const parsed = parseArgs(process.argv);
	const targetDir = parsed.dir || 'appsyncjs-app';
	const cwd = process.cwd();
	const dest = path.resolve(cwd, targetDir);

	const __dirname = path.dirname(fileURLToPath(import.meta.url));
	const templateDir = path.resolve(__dirname, 'scaffold');

	// Build minimal vars to derive file name substitutions for conflict detection
	const vars = {
		APP_NAME: sanitizeAppName(dest),
		REGION: 'us-east-1',
		ENTITY: parsed.entity || 'User',
		TABLE_NAME: `${parsed.entity || 'User'}s`,
		DESCRIPTION: parsed.description || '',
	};

	// Compute prospective file paths from the scaffold
	const templateFiles = await listTemplateFiles(templateDir, vars);
	const conflicts = [];
	for (const rel of templateFiles) {
		const to = path.join(dest, rel);
		// A conflict exists if a file or directory already exists at the file path
		// (directory at file path would prevent writing the file)
		// We treat any non-ENOENT as a conflict signal.
		// Note: directories are only checked when they collide with a file path.
		const has = await exists(to);
		if (has) conflicts.push(rel);
	}

	if (conflicts.length > 0) {
		console.log(
			`Detected ${conflicts.length} path(s) that will be overwritten in ${dest}:`,
		);
		for (const p of conflicts) console.log(`  - ${p}`);

		if (!process.stdin.isTTY) {
			console.error(
				'Conflicts detected and no TTY available to confirm. Aborting without changes.',
			);
			process.exit(1);
		}

		const accepted = await promptConfirm(
			'Continue and overwrite ALL listed paths? This operation will replace file contents but will not delete non-conflicting files.',
		);
		if (!accepted) {
			console.log('Aborted. No files were written.');
			process.exit(1);
		}

		// Optional: if inside a Git repo and working tree is dirty, double-confirm
		const inRepo = await gitIsRepo();
		const isDirty = inRepo ? await gitWorkingTreeDirty() : false;
		if (isDirty) {
			const proceed = await promptConfirm(
				'Git working tree is not clean (uncommitted changes detected). Continue anyway?',
			);
			if (!proceed) {
				console.log('Aborted due to dirty Git state. No files were written.');
				process.exit(1);
			}
		}
	}

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
