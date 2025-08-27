import { describe, expect, it, vi } from 'vitest';
import {
	AppSyncClient,
	EvaluateCodeCommand,
	type EvaluateCodeCommandOutput,
} from '@aws-sdk/client-appsync';
import {
	getThrottledClient,
	ThrottledAppsyncClient,
} from './throttled-appsync-client.js';

const mockSend = vi.hoisted(() =>
	vi.fn(
		async (_command: EvaluateCodeCommand): Promise<EvaluateCodeCommandOutput> =>
			({}) as EvaluateCodeCommandOutput,
	),
);

vi.mock('@aws-sdk/client-appsync', async (importOriginal) => {
	const { AppSyncClient, ...rest } =
		await importOriginal<typeof import('@aws-sdk/client-appsync')>();

	class MockClient extends AppSyncClient {
		async send(
			command: EvaluateCodeCommand,
		): Promise<EvaluateCodeCommandOutput> {
			return mockSend(command);
		}
	}

	return {
		...rest,
		AppSyncClient: MockClient,
	};
});

const getCommand = () =>
	new EvaluateCodeCommand({
		code: 'blah',
		context: '{}',
		function: 'request',
		runtime: undefined,
	});

describe('throttled-appsync-client', () => {
	describe('getThrottledClient', () => {
		it('returns ThrottledAppsyncClient singleton', async () => {
			const maxRetries = 10;
			const opsPerSecond = 10;
			const region = 'us-east-1';
			const client = getThrottledClient({ maxRetries, opsPerSecond, region });

			expect(client).toBeInstanceOf(ThrottledAppsyncClient);
			expect(client).toBeInstanceOf(AppSyncClient);
			expect(client.maxRetries).toEqual(maxRetries);
			expect(client.opsPerSecond).toEqual(opsPerSecond);
			expect(client.requestInterval).toEqual(1000 / opsPerSecond);
			expect(await client.config.region()).toEqual(region);
			expect(client.firstRequestAt).toEqual(0);
			expect(client.requestCount).toEqual(0);

			const sameClient = getThrottledClient();

			expect(sameClient).toStrictEqual(client);
		});
	});

	describe('ThrottledAppsyncClient', () => {
		it('can be instantiated with defaults', () => {
			const client = new ThrottledAppsyncClient();

			expect(client).toBeInstanceOf(ThrottledAppsyncClient);
			expect(client).toBeInstanceOf(AppSyncClient);
			expect(client.maxRetries).toEqual(
				ThrottledAppsyncClient.defaultMaxRetries,
			);
			expect(client.opsPerSecond).toEqual(
				ThrottledAppsyncClient.defaultOpsPerSecond,
			);
			expect(client.requestInterval).toEqual(
				1000 / ThrottledAppsyncClient.defaultOpsPerSecond,
			);
			expect(client.firstRequestAt).toEqual(0);
			expect(client.requestCount).toEqual(0);
		});

		it('can be instantiated with opts', async () => {
			const maxRetries = 10;
			const opsPerSecond = 10;
			const region = 'us-east-1';
			const client = new ThrottledAppsyncClient({
				maxRetries,
				opsPerSecond,
				region,
			});

			expect(client).toBeInstanceOf(ThrottledAppsyncClient);
			expect(client).toBeInstanceOf(AppSyncClient);
			expect(client.maxRetries).toEqual(maxRetries);
			expect(client.opsPerSecond).toEqual(opsPerSecond);
			expect(await client.config.region()).toEqual(region);
			expect(client.requestInterval).toEqual(1000 / opsPerSecond);
			expect(client.firstRequestAt).toEqual(0);
			expect(client.requestCount).toEqual(0);
		});

		it('throttles as expected', async () => {
			// Use fake timers to eliminate real-time flakiness and make elapsed time deterministic
			vi.useFakeTimers();
			vi.setSystemTime(new Date(0));
			try {
				const opsPerSecond = 100;
				const opCount = 100;
				const client = new ThrottledAppsyncClient({ opsPerSecond });

				const start = Date.now();
				const promises: Promise<EvaluateCodeCommandOutput>[] = [];

				for (let i = 0; i < opCount; i++) {
					promises.push(client.send(getCommand()));
				}

				// Advance the mocked clock enough for all throttled requests to run
				const totalMs = (opCount / opsPerSecond) * 1000;
				await vi.advanceTimersByTimeAsync(totalMs);

				await Promise.all(promises);
				const end = Date.now();

				expect(mockSend).toHaveBeenCalledTimes(opCount);
				expect(end - start).toBeGreaterThanOrEqual(totalMs);
			} finally {
				vi.useRealTimers();
			}
		});

		it('retries as expected', async () => {
			mockSend.mockImplementationOnce(
				async (
					_command: EvaluateCodeCommand,
				): Promise<EvaluateCodeCommandOutput> => {
					// test error message case
					throw new Error('Too Many Requests');
				},
			);
			const client = new ThrottledAppsyncClient();

			const result = await client.send(getCommand());

			expect(mockSend).toHaveBeenCalledTimes(2);
			expect(result).toEqual({});
		});

		it('fails after max retries', async () => {
			const maxRetries = 2;
			mockSend.mockImplementation(
				async (
					_command: EvaluateCodeCommand,
				): Promise<EvaluateCodeCommandOutput> => {
					// test error name case
					const err = new Error('Error message');
					err.name = 'TooManyRequestsException';
					throw err;
				},
			);
			const client = new ThrottledAppsyncClient({ maxRetries });

			const error = await client.send(getCommand()).catch((err) => err);

			expect(mockSend).toHaveBeenCalledTimes(maxRetries + 1);
			expect(error).toBeInstanceOf(Error);
			expect(error.message).toEqual('Max retries for Appsync command reached');
		});

		it('rethrows unknown errors', async () => {
			const error = new Error('Unknown Error');

			mockSend.mockImplementationOnce(
				async (
					_command: EvaluateCodeCommand,
				): Promise<EvaluateCodeCommandOutput> => {
					throw error;
				},
			);
			const client = new ThrottledAppsyncClient();

			const caught = await client.send(getCommand()).catch((err) => err);

			expect(mockSend).toHaveBeenCalledTimes(1);
			expect(caught).toStrictEqual(error);
		});
	});
});
