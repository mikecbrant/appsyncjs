import { type Mock, vi } from 'vitest';

const nowISO8601Implementation = (): string => {
	const now = new Date();
	return now.toISOString();
};

const nowISO8601 = vi.fn(nowISO8601Implementation);

const time: Record<string, Mock> = {
	nowISO8601,
};

export { time as default };
