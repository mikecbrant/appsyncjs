import { glob } from 'glob';
import { execSync } from 'node:child_process';
import { rm } from 'node:fs/promises';
import { afterEach, describe, expect, it, vi } from 'vitest';

const testFileDir = 'test-files/';
const testIncludeGlob = testFileDir + '**/*.ts';
const testOutdir = 'test-dist/';
const testOutdirGlob = testOutdir + '**/*';

const includedFileRegex = /.*test-files\/.*\.ts$/;
const testFileRegex = /(spec|test)\.ts$/;

const shouldBuild = (file) =>
	!testFileRegex.test(file) && includedFileRegex.test(file);

const buildMock = vi.hoisted(() => vi.fn(() => undefined));

vi.mock('./commands/build', async (importOriginal) => {
	const orig = await importOriginal();
	return {
		...orig,
		default: buildMock,
	};
});

describe('cli', () => {
	describe('build command', () => {
		describe('CLI execution', () => {
			afterEach(
				async () => await rm(testOutdir, { force: true, recursive: true }),
			);

			it('works with test files', async () => {
				const filesInTestDir = await glob(testIncludeGlob);
				const command = `node ./cli.mjs build -i '${testIncludeGlob}' -o '${testOutdir}'`;

				execSync(command);

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

		describe('mock invocation', () => {
			it('works with short params', async () => {
				const argv = process.argv;
				process.argv = [
					'node',
					'./cli.mjs',
					'build',
					'-i',
					'glob1/**',
					'glob2/**',
					'-x',
					'**/*.js',
					'*.test.ts',
					'-o',
					'out/',
				];

				await import('./cli.mjs').finally(() => {
					process.argv = argv;
				});

				expect(buildMock).toBeCalledWith(
					{
						ignore: ['**/*.js', '*.test.ts'],
						include: ['glob1/**', 'glob2/**'],
						outdir: 'out/',
					},
					// commander Command object
					expect.objectContaining({ _name: 'build' }),
				);
			});
		});
	});
});
