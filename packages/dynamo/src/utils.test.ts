import { describe, expect, it } from 'vitest';
import { buildKeyCondition, buildProjectionExpression } from './utils.js';

describe('utils', () => {
	describe('buildKeyCondition', () => {
		it('works with partition key only', () => {
			const key = { foo: 'bar' };
			let exists = true;

			let expected = {
				expression: 'attribute_exists(#pk)',
				expressionNames: { '#pk': 'foo' },
			};

			let result = buildKeyCondition({ key, exists });
			expect(result).toEqual(expected);

			exists = false;
			expected = {
				expression: 'attribute_not_exists(#pk)',
				expressionNames: { '#pk': 'foo' },
			};

			result = buildKeyCondition({ key, exists });
			expect(result).toEqual(expected);
		});

		it('works with partition and sort keys', () => {
			const key = { foo: 'bar', bat: 'baz' };
			let exists = true;

			let expected = {
				expression: 'attribute_exists(#pk) AND attribute_exists(#sk)',
				expressionNames: { '#pk': 'foo', '#sk': 'bat' },
			};

			let result = buildKeyCondition({ key, exists });
			expect(result).toEqual(expected);

			exists = false;
			expected = {
				expression: 'attribute_not_exists(#pk) AND attribute_not_exists(#sk)',
				expressionNames: { '#pk': 'foo', '#sk': 'bat' },
			};

			result = buildKeyCondition({ key, exists });
			expect(result).toEqual(expected);
		});
	});

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
