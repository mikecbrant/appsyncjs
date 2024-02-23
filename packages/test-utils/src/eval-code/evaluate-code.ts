import type { JsonValue, OverrideProperties } from 'type-fest';
import {
	type AppSyncRuntime,
	type CodeError,
	EvaluateCodeCommand,
	type EvaluateCodeErrorDetail,
	type EvaluateCodeRequest,
	type EvaluateCodeResponse,
} from '@aws-sdk/client-appsync';
import { readFile } from 'node:fs/promises';
import { getThrottledClient } from './throttled-appsync-client.js';

export type EvaluationResponse = {
	error?: { message: string };
	evaluationResult: JsonValue | undefined;
	logs: string[];
};

const functionNames = ['request', 'response'] as const;
type FunctionNames = (typeof functionNames)[number];

export type EvaluationRequest = {
	code: string;
	context?: Record<string, unknown>;
	function: FunctionNames;
};

const runtime: AppSyncRuntime = {
	name: 'APPSYNC_JS',
	runtimeVersion: '1.0.0',
};

const evaluateCode = async ({
	code,
	context = {},
	function: fn,
}: EvaluationRequest): Promise<EvaluationResponse> => {
	const input: EvaluateCodeRequest = {
		code,
		context: JSON.stringify(context),
		function: fn,
		runtime,
	};

	const command = new EvaluateCodeCommand(input);

	const {
		error,
		evaluationResult,
		logs = [],
	}: EvaluateCodeResponse = await getThrottledClient().send(command);

	let parsedResult;
	if (evaluationResult !== undefined) {
		parsedResult = JSON.parse(evaluationResult);
	}

	const out: EvaluationResponse = {
		evaluationResult: parsedResult,
		logs,
	};

	if (error) {
		const message = handleEvaluateError(error, logs);
		out.error = { message };
	}

	return out;
};

export type FileEvaluationRequest = {
	file: string;
	context?: Record<string, unknown>;
	function: 'request' | 'response';
};

const evaluateFile = async ({
	file,
	context,
	function: fn,
}: FileEvaluationRequest): Promise<EvaluationResponse> =>
	readFile(file, { encoding: 'utf8' }).then((code) =>
		evaluateCode({ code, context, function: fn }),
	);

class EvaluateCodeError extends AggregateError {
	constructor(details: Array<CodeError | string>, message: string) {
		super(details, message);
	}
}

/**
 * Differentiate between code errors and errors returned via util.error and util.append error.
 * Throws EvaluateCodeError if code error is determined either at compile or run time.
 */
const handleEvaluateError = (
	error: EvaluateCodeErrorDetail,
	logs: string[],
): string => {
	const { message = 'Appsync evaluateCode found errors', codeErrors } = error;

	if (codeErrors) {
		const details = [...codeErrors, ...logs];
		throw new EvaluateCodeError(details, message);
	}

	// we have encountered an unexpected runtime error
	// we want to treat this differently than error messages
	// from util.error & util.appendError calls
	if (/^code\.js:\d+:\d+:/.test(message)) {
		throw new EvaluateCodeError(logs, message);
	}

	return message;
};

export { evaluateCode, evaluateFile, EvaluateCodeError };
