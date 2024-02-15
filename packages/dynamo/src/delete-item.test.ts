import { beforeAll, describe, expect, it, vi } from 'vitest';
import deleteItem from './delete-item.ts';
import { buildKeyCondition } from './utils.js';

vi.mock('@aws-appsync/utils', async () => {
	const original = await vi.importActual('@aws-appsync/utils');
	const { utilMock } = await import('@mikecbrant/appsyncjs-test-utils');
	return {
		...original,
		util: utilMock,
	};
});

describe('deleteItem', () => {
	let util;

	beforeAll(async () => {
		const mock = await import('@aws-appsync/utils');
		util = mock.util;
	});

	it('works with key only', async () => {
		const key = { foo: 'bar', bat: 'baz' };
		const request = deleteItem({ key });

		expect(util.dynamodb.toMapValues).toBeCalledWith(key);
		expect(request).toEqual({
			operation: 'DeleteItem',
			key: {
				foo: { S: 'bar' },
				bat: { S: 'baz' },
			},
		});
	});

	it('supports idempotent prop', () => {
		const key = { foo: 'bar', bat: 'baz' };
		let request = deleteItem({
			key,
			idempotent: true,
		});

		expect(request).toEqual({
			operation: 'DeleteItem',
			key: {
				foo: { S: 'bar' },
				bat: { S: 'baz' },
			},
		});

		request = deleteItem({
			key,
			idempotent: false,
		});

		expect(request).toEqual({
			operation: 'DeleteItem',
			key: {
				foo: { S: 'bar' },
				bat: { S: 'baz' },
			},
			condition: buildKeyCondition({ key, exists: true }),
		});
	});
});
