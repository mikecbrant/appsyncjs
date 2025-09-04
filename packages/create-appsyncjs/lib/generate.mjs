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
	// Prefer new key AWS_REGION; support legacy __REGION__ tokens in templates during transition
	const region = vars.AWS_REGION ?? vars.REGION;
	return content
		.replaceAll('__APP_NAME__', vars.APP_NAME)
		.replaceAll('__REGION__', region ?? '')
		.replaceAll('__ENTITY__', vars.ENTITY)
		.replaceAll('__TABLE_NAME__', vars.TABLE_NAME)
		.replaceAll('__DESCRIPTION__', vars.DESCRIPTION);
}

const copyDir = async (srcDir, destDir, vars) => {
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
};

const generate = async (ctx) => {
	await copyDir(ctx.templateDir, ctx.dest, ctx.vars);
};

export { generate };
