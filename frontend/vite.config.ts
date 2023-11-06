import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';

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
