import { describe, expect, it } from 'vitest';
import { appendError, error } from './errors.ts';

describe('errors', () => {
	describe('appendError', () => {
		it('can be called with minimal arguments', () => {
			const message = 'foo';
			appendError(message);

			expect(appendError).toBeCalledWith(message);
		});

		it('can be called with all arguments', () => {
			const message = 'foo';
			const errorType = 'bar';
			const data = { bat: 'baz' };
			const errorInfo = { fizz: 'buzz' };
			appendError(message, errorType, data, errorInfo);

			expect(appendError).toBeCalledWith(message, errorType, data, errorInfo);
		});
	});

	describe('error', () => {
		it('can be called with minimal arguments', () => {
			const message = 'foo';
			error(message);

			expect(error).toBeCalledWith(message);
		});

		it('can be called with all arguments', () => {
			const message = 'foo';
			const errorType = 'bar';
			const data = { bat: 'baz' };
			const errorInfo = { fizz: 'buzz' };
			error(message, errorType, data, errorInfo);

			expect(error).toBeCalledWith(message, errorType, data, errorInfo);
		});
	});
});
