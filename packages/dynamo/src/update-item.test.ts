import { beforeAll, describe, expect, it, vi } from 'vitest';
import updateItem from './update-item.ts';

vi.mock('@aws-appsync/utils', async () => {
	const original = await vi.importActual('@aws-appsync/utils');
	const { utilMock } = await import('@mikecbrant/appsyncjs-test-utils');
	return {
		...original,
		util: utilMock,
	};
});

describe('updateItem', () => {
	let util;

	beforeAll(async () => {
		const mock = await import('@aws-appsync/utils');
		util = mock.util;
	});

	it('builds minimal UpdateItem request', () => {
		const key = { id: 'abc', sort: '001' };
		const update = {
			expression: 'SET #count = if_not_exists(#count, :zero) + :inc',
			expressionNames: { '#count': 'count' },
			expressionValues: { ':zero': { N: 0 }, ':inc': { N: 1 } },
		};

		const request = updateItem({ key, update });

		expect(util.dynamodb.toMapValues).toBeCalledWith(key);
		expect(request).toEqual({
			operation: 'UpdateItem',
			key: {
				id: { S: 'abc' },
				sort: { S: '001' },
			},
			update,
		});
	});

	it('supports optional condition', () => {
		const key = { id: 'abc' };
		const update = {
			expression: 'ADD version :one',
			expressionValues: { ':one': { N: 1 } },
		};
		const condition = {
			expression: 'attribute_exists(#id)',
			expressionNames: { '#id': 'id' },
		};

		const request = updateItem({ key, update, condition });
		expect(request.condition).toEqual(condition);
	});

	it('passes through optional properties when provided', () => {
		const key = { id: 'abc' };
		const update = { expression: 'REMOVE #old', expressionNames: { '#old': 'legacy' } };

		const request = updateItem({
			key,
			update,
			customPartitionKey: 'tenant#1',
			populateIndexFields: false,
			_version: 7,
		});

		expect(request).toEqual({
			operation: 'UpdateItem',
			key: { id: { S: 'abc' } },
			update,
			customPartitionKey: 'tenant#1',
			populateIndexFields: false,
			_version: 7,
		});
	});
});
