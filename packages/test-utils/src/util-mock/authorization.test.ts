import { describe, expect, it } from 'vitest';
import { unauthorized } from './authorization.js';

describe('authorization', () => {
	describe('unauthorized', () => {
		it('works as expected', () => {
			unauthorized();
			expect(unauthorized).toBeCalled();
		});
	});
});
