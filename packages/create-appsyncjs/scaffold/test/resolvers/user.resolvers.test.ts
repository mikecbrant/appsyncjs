import { describe, it, expect, vi, beforeAll } from 'vitest';

// Swap in the util mock for AppSync runtime internals
vi.mock('@aws-appsync/utils', async () => {
	const { utilMock } = await import('@mikecbrant/appsyncjs-test-utils');
	return { util: utilMock };
});

import * as dynamo from '@mikecbrant/appsyncjs-dynamo';
import type { AppSyncResolverEvent } from '@aws-appsync/utils';

describe('User resolvers', () => {
	it('Query.getUser.request builds a valid GetItem request', async () => {
		const mod = await import('../../src/resolvers/Query.getUser.ts');
		const ctx = { args: { id: 'u-123' } } as unknown as AppSyncResolverEvent<{
			id: string;
		}>;
		const actual = mod.request(ctx);
		const expected = dynamo.getItem({ key: { pk: 'u-123' } });
		expect(actual).toStrictEqual(expected);
	});

	it('Mutation.putUser.request builds a valid PutItem request', async () => {
		const mod = await import('../../src/resolvers/Mutation.putUser.ts');
		const input = { id: 'u-123', email: 'a@example.com', name: 'Ada' };
		const ctx = { args: { input } } as unknown as AppSyncResolverEvent<{
			input: typeof input;
		}>;
		const actual = mod.request(ctx);
		// cannot predict timestamps; just assert key + attributeValues mapping is invoked
		const expected = dynamo.putItem({
			key: { pk: 'u-123' },
			item: expect.any(Object) as any,
		});
		expect(actual.operation).toBe('PutItem');
		expect(actual.key).toStrictEqual(expected.key);
		expect(actual.attributeValues).toBeDefined();
	});

	it('Mutation.updateUser.request builds a valid UpdateItem request', async () => {
		const mod = await import('../../src/resolvers/Mutation.updateUser.ts');
		const ctx = {
			args: { input: { id: 'u-1', name: 'New' } },
		} as unknown as AppSyncResolverEvent<{
			input: { id: string; name?: string };
		}>;
		const actual = mod.request(ctx);
		expect(actual.operation).toBe('UpdateItem');
		expect(actual.key).toStrictEqual(
			dynamo.updateItem({
				key: { pk: 'u-1' },
				update: {
					expression: '',
					expressionNames: {},
					expressionValues: {} as any,
				},
			}).key,
		);
		expect(actual.update).toBeDefined();
		expect(actual.update.expression).toMatch(/^SET /);
	});

	it('Mutation.deleteUser.request builds a valid DeleteItem request', async () => {
		const mod = await import('../../src/resolvers/Mutation.deleteUser.ts');
		const ctx = { args: { id: 'u-123' } } as unknown as AppSyncResolverEvent<{
			id: string;
		}>;
		const actual = mod.request(ctx);
		const expected = dynamo.deleteItem({
			key: { pk: 'u-123' },
			returnDeleted: true,
		});
		expect(actual).toStrictEqual(expected);
	});
});
