import {defineConfig, devices} from '@playwright/test';

export default defineConfig({
    testDir: 'tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : 4,
    reporter: 'line',
    use: {
        baseURL: 'http://localhost:5174',
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
        },
        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
                storageState: 'tests/e2e/utils/.auth/user.json',
            },
            dependencies: ['setup'],
        },
        {
            name: 'userAccountDeletion',
            testMatch: /.*userAccountDeletion\.spec\.ts/,
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'tests/e2e/utils/.auth/user.json',
            },
            dependencies: ['chromium', 'firefox'],
        },
    ],
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:5174',
        reuseExistingServer: !process.env.CI,
    },
});