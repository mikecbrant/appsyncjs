import { spawn } from 'node:child_process';

import { generate } from './lib/generate.mjs';

const buildContext = async ({ templateDir, dest, answers }) => {
	if (!answers || typeof answers !== 'object') {
		throw new Error('answers object is required');
	}

	const required = [
		'APP_NAME',
		'REGION',
		'ENTITY',
		'TABLE_NAME',
		'DESCRIPTION',
	];
	for (const key of required) {
		if (!answers[key] || String(answers[key]).length === 0) {
			throw new Error(`answers.${key} is required`);
		}
	}

	const appName = answers.APP_NAME;
	return {
		templateDir,
		dest,
		vars: {
			APP_NAME: appName,
			REGION: answers.REGION,
			ENTITY: answers.ENTITY,
			TABLE_NAME: answers.TABLE_NAME,
			DESCRIPTION: answers.DESCRIPTION,
		},
	};
};

const create = async ({ templateDir, dest, answers }) => {
	const ctx = await buildContext({ templateDir, dest, answers });
	await generate(ctx);

	// Post-scaffold: upgrade deps to latest in the generated project
	await new Promise((resolve) => {
		const child = spawn('pnpm', ['up', '--latest'], {
			cwd: ctx.dest,
			stdio: 'inherit',
		});
		child.on('close', (code, signal) => {
			if (code !== 0) {
				console.warn(
					`'pnpm up --latest' exited with code ${code}${signal ? ` (signal: ${signal})` : ''}. You can re-run it manually in: ${ctx.dest}`,
				);
			}
			resolve();
		});
		child.on('error', (err) => {
			console.warn(
				"Couldn't run 'pnpm up --latest' automatically. You can run it manually in the project directory.",
				err,
			);
			resolve();
		});
	});
};

export default { create };
export { create };
