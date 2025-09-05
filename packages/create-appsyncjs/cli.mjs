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

const promptInput = async (message, def = '') => {
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	const answer = await rl
		.question(`${message}${def ? ` (${def})` : ''}: `)
		.catch(() => '')
		.finally(() => rl.close());
	const v = (answer ?? '').trim();
	return v.length > 0 ? v : def;
};

const gitIsRepo = (cwd) =>
	new Promise((resolve) => {
		const child = spawn('git', ['rev-parse', '--is-inside-work-tree'], {
			cwd,
			stdio: ['ignore', 'pipe', 'ignore'],
		});
		let out = '';
		child.stdout.on('data', (d) => (out += String(d)));
		child.on('close', (code) => resolve(code === 0 && out.trim() === 'true'));
		child.on('error', () => resolve(false));
	});

const gitWorkingTreeDirty = (cwd) =>
	new Promise((resolve) => {
		const child = spawn('git', ['status', '--porcelain'], {
			cwd,
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

	// Gather scaffold variables via interactive prompts (source of truth for this run)
	const defaultAppName = sanitizeAppName(dest);
	const answers = {
		APP_NAME: defaultAppName,
		DESCRIPTION: `${defaultAppName} AppSync service`,
		REGION: 'us-east-1',
		ENTITY: 'Example',
		TABLE_NAME: defaultAppName,
	};

	// Seed answers from any provided CLI flags for non-interactive/automation cases
	if (parsed.entity) answers.ENTITY = parsed.entity;
	if (parsed.description) answers.DESCRIPTION = parsed.description;

	if (process.stdin.isTTY) {
		// Order matters; later defaults depend on earlier answers
		answers.APP_NAME = await promptInput('Application name', defaultAppName);
		if (!parsed.description) {
			answers.DESCRIPTION = await promptInput(
				'Repo description',
				`${answers.APP_NAME} AppSync service`,
			);
		}
		answers.REGION = await promptInput('AWS region', answers.REGION);
		if (!parsed.entity) {
			answers.ENTITY = await promptInput(
				'Name of the first entity to create (singular, PascalCase)',
				'Example',
			);
		}
		answers.TABLE_NAME = await promptInput(
			'Name of the DynamoDB table',
			answers.APP_NAME,
		);
	}

	// Compute prospective file paths from the scaffold
	const templateFiles = await listTemplateFiles(templateDir, answers);
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

		// If inside a Git repo and working tree is dirty, double-confirm
		const inRepo = await gitIsRepo(dest);
		const isDirty = inRepo ? await gitWorkingTreeDirty(dest) : false;
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

	await create({ templateDir, dest, answers });
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
