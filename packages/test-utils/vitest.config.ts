/// <reference types="vitest" />
import {
	coverageConfigDefaults,
	defineConfig,
	defaultExclude,
} from 'vitest/config';

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
		},
		environment: 'node',
		clearMocks: true,
		root: './',
	},
	logLevel: 'info',
	esbuild: {
		sourcemap: 'both',
	},
});
