import { describe, expect, it } from 'vitest';
import time from './time.ts';

const { nowISO8601 } = time;

describe('time', () => {
	describe('nowISO8601', () => {
		it('works as expected', () => {
			const timestamp = nowISO8601();

			expect(nowISO8601).toBeCalled();

			// can be converted with fidelity
			const date = new Date(timestamp);
			const ts = date.toISOString();
			expect(timestamp).toEqual(ts);
		});
	});
});
