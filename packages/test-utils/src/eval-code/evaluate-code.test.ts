import type {
	AppSyncRuntime,
	EvaluateCodeCommand,
	EvaluateCodeCommandOutput,
} from '@aws-sdk/client-appsync';
import { describe, expect, it, vi } from 'vitest';
import {
	evaluateCode,
	EvaluateCodeError,
	evaluateFile,
	type EvaluationRequest,
	type FileEvaluationRequest,
} from './evaluate-code.js';

const runtime: AppSyncRuntime = {
	name: 'APPSYNC_JS',
	runtimeVersion: '1.0.0',
};

const getCommandOutput = ({
	error,
	evaluationResult = '{"fizz":"buzz"}',
}: {
	error?: EvaluateCodeCommandOutput['error'];
	evaluationResult?: string;
} = {}): EvaluateCodeCommandOutput => {
	const out: EvaluateCodeCommandOutput = {
		logs: ['some', 'logs'],
		$metadata: {},
	};

	if (error) {
		out.error = error;
	} else {
		out.evaluationResult = evaluationResult;
	}

	return out;
};

const mockClient = vi.hoisted(() => ({
	send: vi.fn(
		async (_command: EvaluateCodeCommand): Promise<EvaluateCodeCommandOutput> =>
			getCommandOutput(),
	),
}));

vi.mock('./throttled-appsync-client.ts', () => ({
	getThrottledClient: () => mockClient,
}));

const getFileContent = () => 'console.log("hello world")';

const fsMock = vi.hoisted(() => ({
	readFile: vi.fn(async (_file: string): Promise<string> => getFileContent()),
}));

vi.mock('node:fs/promises', async (importOriginal) => {
	return {
		...(await importOriginal<typeof import('node:fs/promises')>()),
		readFile: fsMock.readFile,
	};
});

describe('evaluate-code', () => {
	describe('evaluateCode', () => {
		it('handles empty command response', async () => {
			mockClient.send.mockImplementationOnce(
				async (
					_command: EvaluateCodeCommand,
				): Promise<EvaluateCodeCommandOutput> => ({ $metadata: {} }),
			);

			const input: EvaluationRequest = {
				code: 'foo',
				context: { bat: 'baz' },
				function: 'request',
			};

			const result = await evaluateCode(input);

			expect(result).toEqual({
				evaluationResult: undefined,
				logs: [],
			});

			const calls = mockClient.send.mock.calls;

			expect(calls.length).toEqual(1);
			const args = calls[0];
			const [command] = args;

			expect(command.input).toEqual({
				code: input.code,
				context: JSON.stringify(input.context),
				function: input.function,
				runtime,
			});
		});

		it('works with minimum inputs', async () => {
			const input: EvaluationRequest = {
				code: 'foo',
				function: 'response',
			};

			const result = await evaluateCode(input);

			const commandOutput = getCommandOutput();

			expect(result).toEqual({
				evaluationResult: JSON.parse(commandOutput.evaluationResult!),
				logs: commandOutput.logs,
			});

			const calls = mockClient.send.mock.calls;

			expect(calls.length).toEqual(1);
			const args = calls[0];
			const [command] = args;

			expect(command.input).toEqual({
				code: input.code,
				context: JSON.stringify({}),
				function: input.function,
				runtime,
			});
		});

		it('returns util.error and util.appendError messages', async () => {
			const commandOutput = getCommandOutput({
				error: { message: 'error message' },
			});

			mockClient.send.mockImplementationOnce(
				async (
					_command: EvaluateCodeCommand,
				): Promise<EvaluateCodeCommandOutput> => commandOutput,
			);

			const input: EvaluationRequest = {
				code: 'foo',
				context: { bat: 'baz' },
				function: 'request',
			};

			const result = await evaluateCode(input);

			expect(result).toEqual({
				error: commandOutput.error,
				evaluationResult: undefined,
				logs: commandOutput.logs,
			});

			const calls = mockClient.send.mock.calls;

			expect(calls.length).toEqual(1);
			const args = calls[0];
			const [command] = args;

			expect(command.input).toEqual({
				code: input.code,
				context: JSON.stringify(input.context),
				function: input.function,
				runtime,
			});
		});

		it('rejects when compile-time code error found', async () => {
			const commandOutput: EvaluateCodeCommandOutput = getCommandOutput({
				error: {
					codeErrors: [
						{
							errorType: 'PARSER_ERROR',
							value: 'some parsing error',
							location: {
								line: 1,
								column: 2,
								span: 3,
							},
						},
					],
				},
			});

			mockClient.send.mockImplementationOnce(
				async (
					_command: EvaluateCodeCommand,
				): Promise<EvaluateCodeCommandOutput> => commandOutput,
			);

			const input: EvaluationRequest = {
				code: 'foo',
				context: { bat: 'baz' },
				function: 'request',
			};

			const error = await evaluateCode(input).catch((err) => err);

			expect(error).toBeInstanceOf(EvaluateCodeError);
			expect(error).toBeInstanceOf(AggregateError);
			expect(error.message).toEqual('Appsync evaluateCode found errors');
			expect(error.errors).toEqual([
				...commandOutput.error!.codeErrors!,
				...commandOutput.logs!,
			]);

			const calls = mockClient.send.mock.calls;

			expect(calls.length).toEqual(1);
			const args = calls[0];
			const [command] = args;

			expect(command.input).toEqual({
				code: input.code,
				context: JSON.stringify(input.context),
				function: input.function,
				runtime,
			});
		});

		it('rejects when run-time code error found', async () => {
			const commandOutput = getCommandOutput({
				error: { message: 'code.js:123:456: some error' },
			});

			mockClient.send.mockImplementationOnce(
				async (
					_command: EvaluateCodeCommand,
				): Promise<EvaluateCodeCommandOutput> => commandOutput,
			);

			const input: EvaluationRequest = {
				code: 'foo',
				context: { bat: 'baz' },
				function: 'request',
			};

			const error = await evaluateCode(input).catch((err) => err);

			expect(error).toBeInstanceOf(EvaluateCodeError);
			expect(error).toBeInstanceOf(AggregateError);
			expect(error.message).toEqual(commandOutput.error!.message!);
			expect(error.errors).toEqual(commandOutput.logs);

			const calls = mockClient.send.mock.calls;

			expect(calls.length).toEqual(1);
			const args = calls[0];
			const [command] = args;

			expect(command.input).toEqual({
				code: input.code,
				context: JSON.stringify(input.context),
				function: input.function,
				runtime,
			});
		});
	});

	describe('evaluateFile', () => {
		it('executes evaluateCode with file content string', async () => {
			const input: FileEvaluationRequest = {
				file: 'foo',
				context: { bat: 'baz' },
				function: 'request',
			};

			const result = await evaluateFile(input);

			const commandOutput = getCommandOutput();

			expect(result).toEqual({
				evaluationResult: JSON.parse(commandOutput.evaluationResult!),
				logs: commandOutput.logs,
			});

			expect(fsMock.readFile).toBeCalledWith(input.file, { encoding: 'utf8' });

			const calls = mockClient.send.mock.calls;

			expect(calls.length).toEqual(1);
			const args = calls[0];
			const [command] = args;

			expect(command.input).toEqual({
				code: getFileContent(),
				context: JSON.stringify(input.context),
				function: input.function,
				runtime,
			});
		});

		it('executes evaluateCode without context (omits undefined)', async () => {
			const input: Omit<FileEvaluationRequest, 'context'> = {
				file: 'foo',
				function: 'response',
			};

			const result = await evaluateFile(input as FileEvaluationRequest);

			const commandOutput = getCommandOutput();

			expect(result).toEqual({
				evaluationResult: JSON.parse(commandOutput.evaluationResult!),
				logs: commandOutput.logs,
			});

			expect(fsMock.readFile).toBeCalledWith(input.file, { encoding: 'utf8' });

			const calls = mockClient.send.mock.calls;

			expect(calls.length).toBeGreaterThan(0);
			const [command] = calls.at(-1)!;

			expect(command.input).toEqual({
				code: getFileContent(),
				context: JSON.stringify({}),
				function: input.function,
				runtime,
			});
		});
	});
});
