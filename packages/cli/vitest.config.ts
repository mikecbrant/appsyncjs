/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		testTimeout: 4000,
		coverage: {
			enabled: true,
			all: true,
			provider: 'v8',
			reporter: ['text', 'html', 'clover', 'json', 'text-summary'],
			reportsDirectory: './coverage',
			thresholds: {
				branches: 100,
				functions: 100,
				lines: 100,
				statements: 100,
			},
			exclude: ['**/test-files/**'],
		},
		environment: 'node',
		clearMocks: true,
		root: './',
		exclude: ['**/test-files/**'],
	},
	logLevel: 'info',
	esbuild: {
		sourcemap: 'both',
	},
});
