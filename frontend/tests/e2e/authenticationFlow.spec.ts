import { test } from '@playwright/test';

import { activateAccount, generateTestUser, signIn, signUp } from 'tests/e2e/utils/auth.ts';
import { openMobileDrawer } from 'tests/e2e/utils/layout.ts';

test.use({ storageState: { cookies: [], origins: [] } });
test('should sign up, activate user account and sign in with new credentials', async ({ page }) => {
    const user = generateTestUser();
    await page.goto('/');
    await page.getByTestId('sign-up-btn-desktop').click();
    await signUp({ page, user });
    await activateAccount({ page, user });
    await page.goto('/');
    await page.getByTestId('sign-in-btn-desktop').click();
    await signIn({ page, user });
});

test('[mobile] should sign up, activate user account and sign in with new credentials', async ({ page }) => {
    const user = generateTestUser();
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await openMobileDrawer({ page });
    await page.getByTestId('sign-up-btn-mobile').click();
    await signUp({ page, user, mobile: true });
    await activateAccount({ page, user });
    await page.goto('/');
    await openMobileDrawer({ page });
    await page.getByTestId('sign-in-btn-mobile').click();
    await signIn({ page, user, mobile: true });
});
