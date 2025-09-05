import { describe, expect, it } from 'vitest';

import build from './commands/build.mjs';
import { build as indexBuild } from './index.mjs';

describe('index', () => {
	it('has expected exports', () => {
		expect(indexBuild).toStrictEqual(build);
	});
});
