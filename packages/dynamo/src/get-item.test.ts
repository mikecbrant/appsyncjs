import { beforeAll, describe, expect, it, vi } from 'vitest';
import getItem from './get-item.ts';
import { buildProjectionExpression } from './utils.js';

vi.mock('@aws-appsync/utils', async () => {
	const original = await vi.importActual('@aws-appsync/utils');
	const { utilMock } = await import('@mikecbrant/appsyncjs-test-utils');
	return {
		...original,
		util: utilMock,
	};
});

describe('getItem', () => {
	let util;

	beforeAll(async () => {
		const mock = await import('@aws-appsync/utils');
		util = mock.util;
	});

	it('works with key only', async () => {
		const key = { foo: 'bar', bat: 'baz' };
		const request = getItem({ key });

		expect(util.dynamodb.toMapValues).toBeCalledWith(key);
		expect(request).toEqual({
			operation: 'GetItem',
			key: {
				foo: { S: 'bar' },
				bat: { S: 'baz' },
			},
			consistentRead: false,
		});
	});

	it('supports consistentRead prop', () => {
		const key = { foo: 'bar', bat: 'baz' };
		let request = getItem({
			key,
			consistentRead: true,
		});

		expect(request).toEqual({
			operation: 'GetItem',
			key: {
				foo: { S: 'bar' },
				bat: { S: 'baz' },
			},
			consistentRead: true,
		});

		request = getItem({
			key,
			consistentRead: false,
		});

		expect(request).toEqual({
			operation: 'GetItem',
			key: {
				foo: { S: 'bar' },
				bat: { S: 'baz' },
			},
			consistentRead: false,
		});
	});

	it('adds projection expression when returnedFields passed', () => {
		const key = { foo: 'bar', bat: 'baz' };
		const returnedFields = ['fizz', 'buzz'];
		const request = getItem({
			key,
			returnedFields,
		});

		expect(request).toEqual({
			operation: 'GetItem',
			key: {
				foo: { S: 'bar' },
				bat: { S: 'baz' },
			},
			consistentRead: false,
			projection: buildProjectionExpression(returnedFields),
		});
	});
});
