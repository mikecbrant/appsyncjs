import { type Mock, vi } from 'vitest';

const authTypeImplementation = (): string => 'User Pool Authorization';

const authType: Mock = vi.fn(authTypeImplementation);

export { authType };
