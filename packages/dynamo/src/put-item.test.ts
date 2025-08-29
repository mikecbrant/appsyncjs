import { beforeAll, describe, expect, it, vi } from 'vitest';
import putItem from './put-item.ts';

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

	it('builds UpdateItem with SET expression and ALL_NEW when given key and item', () => {
		const key = { id: '123' };
		const item = { id: '123', name: 'Alice' };
		const request = putItem({ key, item });

		expect(util.dynamodb.toMapValues).toBeCalledWith(key);
		expect(util.dynamodb.toMapValues).toBeCalledWith({
			':id': '123',
			':name': 'Alice',
		});
		expect(request.operation).toBe('UpdateItem');
		expect(request.key).toEqual({ id: { S: '123' } });
		expect(request.update).toBeDefined();
		expect(request.update!.expression).toMatch(/^SET /);
		expect(request.returnValues).toBe('ALL_NEW');
	});

	it('supports optional condition', () => {
		const key = { id: '123' };
		const item = { id: '123', name: 'Bob' };
		const condition = {
			expression: 'attribute_not_exists(#id)',
			expressionNames: { '#id': 'id' },
			expressionValues: undefined,
			equalsIgnore: ['version'],
			consistentRead: true,
			conditionalCheckFailedHandler: { strategy: 'Reject' },
		};

		const request = putItem({ key, item, condition });

		expect(request.operation).toBe('UpdateItem');
		expect(request.key).toEqual({ id: { S: '123' } });
		expect(request.condition).toEqual(condition);
	});

	it('propagates errors from util when mapping values', () => {
		const key = { id: 'oops' };
		const item = { id: 'oops', name: 'Err' };
		util.dynamodb.toMapValues.mockImplementationOnce(() => {
			throw new Error('boom');
		});
		expect(() => putItem({ key, item })).toThrow('boom');
	});
});
