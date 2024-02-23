import { describe, expect, it } from 'vitest';
import {
	evaluateCode,
	EvaluateCodeError,
	evaluateFile,
	getThrottledClient,
} from './index.js';
import * as evalCodeModule from './evaluate-code.js';
import * as throttledClientModule from './throttled-appsync-client.js';

describe('eval-code', () => {
	it('has expected exports', () => {
		expect(evaluateCode).toStrictEqual(evalCodeModule.evaluateCode);
		expect(EvaluateCodeError).toStrictEqual(evalCodeModule.EvaluateCodeError);
		expect(evaluateFile).toStrictEqual(evalCodeModule.evaluateFile);
		expect(getThrottledClient).toStrictEqual(
			throttledClientModule.getThrottledClient,
		);
	});
});
