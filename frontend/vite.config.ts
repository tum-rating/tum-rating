/// <reference types="vitest" />
/// <reference types="vite/client" />
import { fileURLToPath, URL } from 'url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

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
    plugins: [react(), tsconfigPaths()],
    build: {
        rollupOptions: {
            output: {
                entryFileNames: '[hash].js',
                chunkFileNames: '[hash].js',
                assetFileNames: '[hash].[ext]',
            },
        },
    },
    test: {
        environment: 'jsdom',
        setupFiles: ['./vitest.setup.ts'],
        exclude: ['**/tests/e2e/**'],

        globals: true,
    },
});
