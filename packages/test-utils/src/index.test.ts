import { describe, expect, it } from 'vitest';
import { test } from './index.js';

describe('index', () => {
	it('has expected exports', () => {
		expect(test).toEqual('test');
	});
});
