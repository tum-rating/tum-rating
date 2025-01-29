import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
    testDir: 'tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: 5,
    workers: 1,
    timeout: 80_000,
    reporter: 'line',
    use: {
        baseURL: 'http://localhost:3000',
        trace: 'on-first-retry',
    },
    projects: [
        {name: 'setup', testMatch: /.*\.setup\.ts/},
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'tests/e2e/utils/.auth/user.json',
            },
            dependencies: ['setup'],
            testMatch: '!(userAccountDeletion|*.setup).spec.ts',
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                storageState: 'tests/e2e/utils/.auth/user.json',
            },
            dependencies: ['setup'],
            testMatch: '!(userAccountDeletion|*.setup).spec.ts',
        },
        {
            name: 'chromium: user-account-deletion',
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'tests/e2e/utils/.auth/userToRemove.json',
            },
            dependencies: ['setup'],
            testMatch: 'userAccountDeletion.spec.ts',
        },
    ],
});
