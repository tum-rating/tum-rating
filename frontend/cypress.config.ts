import { defineConfig } from 'cypress';

export default defineConfig({
    env: {
        email: 'jevdev@tum.de',
        username: 'jevdev@tum.de',
        password: 'jevdev@tum.de',
    },
    e2e: {
        baseUrl: 'http://localhost:5174/',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});
