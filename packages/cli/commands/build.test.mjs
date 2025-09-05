import { glob } from 'glob';
import { rm } from 'node:fs/promises';
import { afterEach, describe, expect, it } from 'vitest';

import build from './build.mjs';

const testFileDir = 'test-files/';
const testIncludeGlob = testFileDir + '**/*.ts';
const testOutdir = 'test-dist/';
const testOutdirGlob = testOutdir + '**/*';

const includedFileRegex = /.*test-files\/.*\.ts$/;
const testFileRegex = /(spec|test)\.ts$/;

const shouldBuild = (file) =>
	!testFileRegex.test(file) && includedFileRegex.test(file);

describe('build', () => {
	afterEach(async () => await rm(testOutdir, { force: true, recursive: true }));

	it('works with test files', async () => {
		const filesInTestDir = await glob(testIncludeGlob);

		const opts = {
			include: [testIncludeGlob],
			outdir: testOutdir,
		};

		await build(opts);

		const expected = [];
		filesInTestDir.filter(shouldBuild).forEach((file) => {
			const built = file
				.replace(testFileDir, testOutdir)
				.replace(/\.ts$/, '.js');

			const sourcemap = built + '.map';
			expected.push(sourcemap, built);
		});

		const built = await glob(testOutdirGlob);

		expect(built).toEqual(expected);
	});
});
