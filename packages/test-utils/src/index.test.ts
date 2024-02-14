import { describe, expect, it } from 'vitest';
import { utilMock } from './index.js';
import utilMockModule from './util-mock/index.js';

describe('index', () => {
	it('has expected exports', () => {
		expect(utilMock).toStrictEqual(utilMockModule);
	});
});
