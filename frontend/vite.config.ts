import { fileURLToPath, URL } from 'url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        alias: [
            { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
            { find: 'cypress', replacement: fileURLToPath(new URL('./cypress', import.meta.url)) },
            { find: 'tests', replacement: fileURLToPath(new URL('./tests', import.meta.url)) },
        ],
    },
    server: {
        port: 5174,
    },
    plugins: [react()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['vitest.setup.ts'],
    },
});
