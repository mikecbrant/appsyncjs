import { spawn } from 'node:child_process';
import path from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import readline from 'node:readline/promises';

import { generate } from './lib/generate.mjs';

const promptFor = async (question, defaultValue) => {
	const rl = readline.createInterface({ input, output });
	const asked = await rl
		.question(`${question} ${defaultValue ? `(${defaultValue}) ` : ''}`)
		.catch((err) => {
			console.error('Prompt failed:', err);
			return '';
		});
	rl.close();
	return (asked ?? '').trim() || defaultValue;
};

const buildContext = async ({
	templateDir,
	dest,
	entity,
	description,
	answers,
}) => {
	const appNameDefault = path.basename(dest).replace(/[^a-zA-Z0-9-_]/g, '-');
	const appName = answers?.APP_NAME ?? appNameDefault;

	// Values may be provided by the caller (cli prompts). If not, prompt or use defaults.
	const entityDefault = 'Example';
	const entityInput =
		answers?.ENTITY ??
		entity ??
		(process.stdin.isTTY
			? await promptFor('Entity name (singular, PascalCase)?', entityDefault)
			: entityDefault);

	const tableDefault = appName;
	const tableName = answers?.TABLE_NAME ?? tableDefault;

	const descDefault = `${appName} AppSync service`;
	const desc =
		answers?.DESCRIPTION ??
		description ??
		(process.stdin.isTTY
			? await promptFor('Project description?', descDefault)
			: descDefault);

	const regionDefault = 'us-east-1'; // pending reviewer confirmation
	const region = answers?.AWS_REGION ?? regionDefault;

	return {
		templateDir,
		dest,
		vars: {
			APP_NAME: appName,
			AWS_REGION: region,
			ENTITY: entityInput,
			TABLE_NAME: tableName,
			DESCRIPTION: desc,
		},
	};
};

const create = async ({ templateDir, dest, entity, description, answers }) => {
	const ctx = await buildContext({
		templateDir,
		dest,
		entity,
		description,
		answers,
	});
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
