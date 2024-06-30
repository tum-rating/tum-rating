import { test } from '@playwright/test';

import { activateAccount, generateTestUser, signIn, signUp } from 'tests/e2e/utils/auth.ts';
import { openMobileDrawer } from 'tests/e2e/utils/layout.ts';

test.use({ storageState: { cookies: [], origins: [] } });
test('should sign up, activate user account and sign in with new credentials', async ({ page }) => {
    const user = generateTestUser();
    await page.goto('/', { timeout: 60000 });
    await signUp({ page, user });
    await activateAccount({ page, user });
    await signIn({ page, user });
});

test('[mobile] should sign up, activate user account and sign in with new credentials', async ({ page }) => {
    const user = generateTestUser();
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { timeout: 60000 });
    await openMobileDrawer({ page });
    await signUp({ page, user });
    await activateAccount({ page, user });
    await openMobileDrawer({ page });
    await signIn({ page, user, mobile: true });
});
