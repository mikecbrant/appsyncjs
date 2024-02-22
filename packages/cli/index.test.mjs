import { describe, expect, it } from 'vitest';
import { build as indexBuild } from './index.mjs';
import build from './commands/build.mjs';

describe('index', () => {
	it('has expected exports', () => {
		expect(indexBuild).toStrictEqual(build);
	});
});
