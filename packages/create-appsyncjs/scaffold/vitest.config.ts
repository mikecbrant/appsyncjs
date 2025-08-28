import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'node',
		clearMocks: true,
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html', 'text-summary'],
			reportsDirectory: './coverage',
		},
	},
});
