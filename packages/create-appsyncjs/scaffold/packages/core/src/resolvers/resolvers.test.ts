import { describe, it, expect, vi, beforeAll } from 'vitest';

// Swap in the util mock for AppSync runtime internals
vi.mock('@aws-appsync/utils', async () => {
	const { utilMock } = await import('@mikecbrant/appsyncjs-test-utils');
	return { util: utilMock };
});

import * as dynamo from '@mikecbrant/appsyncjs-dynamo';
import type { AppSyncResolverEvent } from '@aws-appsync/utils';

describe('__ENTITY__ resolvers', () => {
	it('get.request builds a valid GetItem request', async () => {
		const mod = await import('./get.ts');
		const ctx = { args: { id: 'e-123' } } as unknown as AppSyncResolverEvent<{
			id: string;
		}>;
		const actual = mod.request(ctx);
		const expected = dynamo.getItem({ key: { pk: 'e-123' } });
		expect(actual).toStrictEqual(expected);
	});

	it('get.response returns the fetched entity or null', async () => {
		const mod = await import('./get.ts');
		const ctxOk = {
			result: { id: 'e-1' },
		} as unknown as AppSyncResolverEvent<any>;
		expect(mod.response(ctxOk)).toStrictEqual({ id: 'e-1' });
		const ctxNull = { result: null } as unknown as AppSyncResolverEvent<any>;
		expect(mod.response(ctxNull)).toBeNull();
	});

	it('upsert.request builds an UpdateItem request that writes base fields', async () => {
		const mod = await import('./upsert.ts');
		const input = { id: 'e-123' };
		const ctx = { args: { input } } as unknown as AppSyncResolverEvent<{
			input: typeof input;
		}>;
		const actual = mod.request(ctx);
		// putItem now returns an UpdateItem with SET expression over provided fields
		expect(actual.operation).toBe('UpdateItem');
		expect(actual.key).toStrictEqual(
			dynamo.putItem({ key: { pk: 'e-123' }, item: expect.any(Object) as any })
				.key,
		);
		expect(actual.update).toBeDefined();
		expect(actual.update!.expression).toMatch(/^SET /);
	});

	it('upsert.response returns the stored entity', async () => {
		const mod = await import('./upsert.ts');
		const ctx = {
			result: { attributes: { id: 'e-1', createdAt: 't', updatedAt: 't' } },
		} as unknown as AppSyncResolverEvent<any>;
		expect(mod.response(ctx)).toStrictEqual({
			id: 'e-1',
			createdAt: 't',
			updatedAt: 't',
		});
	});

	it('update.request builds an UpdateItem request that sets updatedAt and returns ALL_NEW', async () => {
		const mod = await import('./update.ts');
		const ctx = {
			args: { input: { id: 'e-1' } },
		} as unknown as AppSyncResolverEvent<{
			input: { id: string };
		}>;
		const actual = mod.request(ctx);
		expect(actual.operation).toBe('UpdateItem');
		expect(actual.key).toStrictEqual(
			dynamo.updateItem({
				key: { pk: 'e-1' },
				update: {
					expression: '',
					expressionNames: {},
					expressionValues: {} as any,
				},
			}).key,
		);
		expect((actual as any).returnValues).toBe('ALL_NEW');
		expect(actual.update).toBeDefined();
		expect(actual.update.expression).toMatch(/SET/);
	});

	it('update.response returns ALL_NEW attributes', async () => {
		const mod = await import('./update.ts');
		const ctx = {
			result: { attributes: { id: 'e-1', updatedAt: 't' } },
		} as unknown as AppSyncResolverEvent<any>;
		expect(mod.response(ctx)).toStrictEqual({ id: 'e-1', updatedAt: 't' });
	});

	it('delete.request builds a valid DeleteItem request with input wrapper + returnDeleted', async () => {
		const mod = await import('./delete.ts');
		const ctx = {
			args: { input: { id: 'e-123', returnDeleted: true } },
		} as unknown as AppSyncResolverEvent<{
			input: { id: string; returnDeleted?: boolean };
		}>;
		const actual = mod.request(ctx);
		const expected = dynamo.deleteItem({
			key: { pk: 'e-123' },
			returnDeleted: true,
		});
		expect(actual).toStrictEqual(expected);
	});

	it('delete.response returns deleted attributes when requested', async () => {
		const mod = await import('./delete.ts');
		const ctx = {
			args: { input: { id: 'e-1', returnDeleted: true } },
			result: { attributes: { id: 'e-1' } },
		} as unknown as AppSyncResolverEvent<any>;
		expect(mod.response(ctx)).toStrictEqual({ id: 'e-1' });
	});
});
