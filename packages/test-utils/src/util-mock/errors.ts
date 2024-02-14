import { type Mock, vi } from 'vitest';

const errorImplementation = (
	message: string,
	errorType?: string,
	data?: Record<string, unknown>,
	errorInfo?: Record<string, unknown>,
): void => {
	console.error(message, errorType, data, errorInfo);
};

const appendError: Mock = vi.fn(errorImplementation);

const error: Mock = vi.fn(errorImplementation);

export { appendError, error };
