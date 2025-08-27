import { beforeAll, describe, expect, it, vi } from 'vitest';
import deleteItem from './delete-item.ts';

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
		const key = { pk: 'USER#1', sk: 'PROFILE' };
		const request = deleteItem({ key });

		expect(util.dynamodb.toMapValues).toBeCalledWith(key);
		expect(request).toEqual({
			operation: 'DeleteItem',
			key: {
				pk: { S: 'USER#1' },
				sk: { S: 'PROFILE' },
			},
		});
	});

	it('supports condition', () => {
		const key = { pk: 'USER#2' };
		const condition = {
			expression: 'attribute_exists(#pk)',
			expressionNames: { '#pk': 'pk' },
			expressionValues: {},
		};

		const request = deleteItem({
			key,
			condition,
		});

		expect(request).toEqual({
			operation: 'DeleteItem',
			key: { pk: { S: 'USER#2' } },
			condition,
		});
	});

	it('when returnDeleted=true, sets ReturnValues to ALL_OLD', () => {
		const key = { pk: 'USER#3' };

		const request = deleteItem({ key, returnDeleted: true });

		expect(request).toEqual({
			operation: 'DeleteItem',
			key: { pk: { S: 'USER#3' } },
			ReturnValues: 'ALL_OLD',
		});
	});
});
