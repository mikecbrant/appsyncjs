import { describe, expect, it } from 'vitest';
import { buildProjectionExpression } from './utils.js';

describe('utils', () => {
	describe('buildProjectionExpression', () => {
		it('returns undefined for non-array or empty array', () => {
			[undefined, null, 0, '', 'foo', NaN, []].forEach((val) => {
				// @ts-expect-error - intentionally bad input
				expect(buildProjectionExpression(val)).toBeUndefined();
			});
		});

		it('returns expected projection object', () => {
			const fields = ['foo', 'bar', 'bat', 'baz'];

			const expected = {
				expression: '#foo, #bar, #bat, #baz',
				expressionNames: {
					'#foo': 'foo',
					'#bar': 'bar',
					'#bat': 'bat',
					'#baz': 'baz',
				},
			};

			expect(buildProjectionExpression(fields)).toEqual(expected);
		});
	});
});
