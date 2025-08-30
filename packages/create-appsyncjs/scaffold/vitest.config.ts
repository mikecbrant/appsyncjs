import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		clearMocks: true,
		exclude: ['build/**', 'coverage/**'],
		coverage: {
			enabled: true,
			all: true,
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'text-summary'],
			reportsDirectory: './coverage',
			thresholds: {
				branches: 100,
				functions: 100,
				lines: 100,
				statements: 100,
			},
		},
	},
});
