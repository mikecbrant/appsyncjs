import { type Mock, vi } from 'vitest';

const unauthorizedImplementation = (): void => {
	console.error('Unauthorized');
};

const unauthorized: Mock = vi.fn(unauthorizedImplementation);

export { unauthorized };
