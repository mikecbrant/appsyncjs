import { describe, expect, it } from 'vitest';
import {
	evaluateCode,
	EvaluateCodeError,
	evaluateFile,
	getThrottledClient,
	utilMock,
} from './index.js';
import * as evalCodeModule from './eval-code/index.js';
import utilMockModule from './util-mock/index.js';

describe('index', () => {
	it('has expected exports', () => {
		expect(evaluateCode).toStrictEqual(evalCodeModule.evaluateCode);
		expect(EvaluateCodeError).toStrictEqual(evalCodeModule.EvaluateCodeError);
		expect(evaluateFile).toStrictEqual(evalCodeModule.evaluateFile);
		expect(getThrottledClient).toStrictEqual(evalCodeModule.getThrottledClient);
		expect(utilMock).toStrictEqual(utilMockModule);
	});
});
