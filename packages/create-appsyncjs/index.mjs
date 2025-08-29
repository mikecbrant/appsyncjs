import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { generate } from './lib/generate.mjs';

export async function create({ templateDir, dest, entity, description }) {
	const ctx = await buildContext({ templateDir, dest, entity, description });
	await generate(ctx);
}

async function promptFor(question, defaultValue) {
	const rl = readline.createInterface({ input, output });
	try {
		const ans = (
			await rl.question(
				`${question} ${defaultValue ? `(${defaultValue}) ` : ''}`,
			)
		).trim();
		return ans || defaultValue;
	} finally {
		rl.close();
	}
}

async function buildContext({ templateDir, dest, entity, description }) {
	const appName = path.basename(dest).replace(/[^a-zA-Z0-9-_]/g, '-');
	// Pull current versions of internal packages from this repo's package.json files at publish-time.
	// At runtime (consumer env), these values are baked into the template placeholders.
	const __dirname = path.dirname(fileURLToPath(import.meta.url));
	const repoRoot = path.resolve(__dirname, '../../');
	const readJSON = async (p) => JSON.parse(await fs.readFile(p, 'utf8'));
	let dynamoVersion = '^0.3.0';
	let testUtilsVersion = '^1.2.4';
	try {
		const dyn = await readJSON(
			path.resolve(repoRoot, 'packages/dynamo/package.json'),
		);
		dynamoVersion = `^${dyn.version}`;
	} catch {}
	try {
		const tu = await readJSON(
			path.resolve(repoRoot, 'packages/test-utils/package.json'),
		);
		testUtilsVersion = `^${tu.version}`;
	} catch {}

	// Interactive prompts
	const defaultEntity = 'User';
	const entityInput =
		entity ??
		(process.stdin.isTTY
			? await promptFor('Entity name (singular, PascalCase)?', defaultEntity)
			: defaultEntity);
	// naive pluralization (append 's') for table and potential list naming; acceptable for scaffold
	const tableName = `${entityInput}s`;
	const desc =
		description ??
		(process.stdin.isTTY
			? await promptFor(
					'Project description?',
					`SST AppSync + DynamoDB starter with ${entityInput} CRUD using @mikecbrant/appsyncjs-dynamo`,
				)
			: `SST AppSync + DynamoDB starter with ${entityInput} CRUD using @mikecbrant/appsyncjs-dynamo`);

	return {
		templateDir,
		dest,
		vars: {
			APP_NAME: appName,
			REGION: 'us-east-1',
			ENTITY: entityInput,
			TABLE_NAME: tableName,
			DYNAMO_VERSION: dynamoVersion,
			TEST_UTILS_VERSION: testUtilsVersion,
			DESCRIPTION: desc,
		},
	};
}

export default { create };
