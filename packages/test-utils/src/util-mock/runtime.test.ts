import { describe, expect, it } from 'vitest';
import runtime from './runtime.js';

const { earlyReturn } = runtime;

describe('runtime', () => {
	describe('earlyReturn', () => {
		it('works without argument', () => {
			earlyReturn();
			expect(earlyReturn).toBeCalled();
		});

		it('works with argument', () => {
			earlyReturn({ foo: 'bar' });
			expect(earlyReturn).toBeCalledWith({ foo: 'bar' });
		});
	});
});
