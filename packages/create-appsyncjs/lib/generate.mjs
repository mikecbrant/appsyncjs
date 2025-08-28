import fs from 'node:fs/promises';
import path from 'node:path';

const TEXT_EXTS = new Set([
	'.md',
	'.json',
	'.ts',
	'.tsx',
	'.js',
	'.mjs',
	'.cjs',
	'.yml',
	'.yaml',
	'.gitignore',
	'.prettierignore',
	'.graphql',
]);

function substitute(content, vars) {
	return content
		.replaceAll('__APP_NAME__', vars.APP_NAME)
		.replaceAll('__REGION__', vars.REGION)
		.replaceAll('__USER_TABLE_NAME__', vars.USER_TABLE_NAME)
		.replaceAll('__DYNAMO_VERSION__', vars.DYNAMO_VERSION)
		.replaceAll('__TEST_UTILS_VERSION__', vars.TEST_UTILS_VERSION);
}

async function copyDir(srcDir, destDir, vars) {
	await fs.mkdir(destDir, { recursive: true });
	const entries = await fs.readdir(srcDir, { withFileTypes: true });
	for (const entry of entries) {
		const srcPath = path.join(srcDir, entry.name);
		const destPath = path.join(
			destDir,
			entry.name.replaceAll('__APP_NAME__', vars.APP_NAME),
		);
		if (entry.isDirectory()) {
			await copyDir(srcPath, destPath, vars);
			continue;
		}

		const ext = path.extname(entry.name);
		if (TEXT_EXTS.has(ext) || ext === '') {
			const raw = await fs.readFile(srcPath, 'utf8');
			const out = substitute(raw, vars);
			await fs.writeFile(destPath, out, 'utf8');
		} else {
			const buf = await fs.readFile(srcPath);
			await fs.writeFile(destPath, buf);
		}
	}
}

export async function generate(ctx) {
	await copyDir(ctx.templateDir, ctx.dest, ctx.vars);
}

export default { generate };
