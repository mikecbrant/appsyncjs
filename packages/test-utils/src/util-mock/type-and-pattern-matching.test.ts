import { describe, expect, it } from 'vitest';
import { authType } from './type-and-pattern-matching.js';

describe('type and pattern matching', () => {
	describe('unauthorized', () => {
		it('works as expected', () => {
			const type = authType();
			expect(authType).toBeCalled();
			expect(type).toEqual('User Pool Authorization');
		});

		it('works with overridden implementation', () => {
			const expected = 'API Key Authorization';
			authType.mockImplementation(() => expected);

			const type = authType();
			expect(authType).toBeCalled();
			expect(type).toEqual(expected);
		});
	});
});
