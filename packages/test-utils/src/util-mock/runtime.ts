import { type Mock, vi } from 'vitest';

const earlyReturnImplementation = (out?: unknown): unknown => {
	console.info('Early return with', out);
	return out;
};

const earlyReturn: Mock = vi.fn(earlyReturnImplementation);

const runtime: Record<string, Mock> = {
	earlyReturn,
};

export { runtime as default };
