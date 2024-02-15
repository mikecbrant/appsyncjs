import { beforeAll, describe, expect, it, vi } from 'vitest';
import putItem from './put-item.ts';
import { buildKeyCondition } from './utils.js';

vi.mock('@aws-appsync/utils', async () => {
	const original = await vi.importActual('@aws-appsync/utils');
	const { utilMock } = await import('@mikecbrant/appsyncjs-test-utils');
	return {
		...original,
		util: utilMock,
	};
});

describe('putItem', () => {
	let util;

	beforeAll(async () => {
		const mock = await import('@aws-appsync/utils');
		util = mock.util;
	});

	it('works with key and item only', async () => {
		const key = { foo: 'bar', bat: 'baz' };
		const item = {
			...key,
			fizz: 'buzz',
			num: 42,
		};
		const request = putItem({ key, item });

		expect(util.dynamodb.toMapValues).toBeCalledWith(key);
		expect(util.dynamodb.toMapValues).toBeCalledWith(item);
		expect(request).toEqual({
			operation: 'PutItem',
			key: {
				foo: { S: 'bar' },
				bat: { S: 'baz' },
			},
			attributeValues: {
				foo: { S: 'bar' },
				bat: { S: 'baz' },
				fizz: { S: 'buzz' },
				num: { N: 42 },
			},
		});
	});

	it('supports idempotent prop', () => {
		const key = { foo: 'bar', bat: 'baz' };
		const item = {
			...key,
			fizz: 'buzz',
			num: 42,
		};
		let request = putItem({
			key,
			item,
			idempotent: true,
		});

		expect(request).toEqual({
			operation: 'PutItem',
			key: {
				foo: { S: 'bar' },
				bat: { S: 'baz' },
			},
			attributeValues: {
				foo: { S: 'bar' },
				bat: { S: 'baz' },
				fizz: { S: 'buzz' },
				num: { N: 42 },
			},
		});

		request = putItem({
			key,
			item,
			idempotent: false,
		});

		expect(request).toEqual({
			operation: 'PutItem',
			key: {
				foo: { S: 'bar' },
				bat: { S: 'baz' },
			},
			attributeValues: {
				foo: { S: 'bar' },
				bat: { S: 'baz' },
				fizz: { S: 'buzz' },
				num: { N: 42 },
			},
			condition: buildKeyCondition({ key, exists: false }),
		});
	});
});
