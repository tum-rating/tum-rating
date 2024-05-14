import { fileURLToPath, URL } from 'url';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    resolve: {
        alias: [
            { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
            { find: 'cypress', replacement: fileURLToPath(new URL('./cypress', import.meta.url)) },
        ],
    },
    server: {
        port: 5174,
    },
    plugins: [react()],
});
