import { test } from '@playwright/test';

import { activateAccount, generateTestUser, signIn, signUp } from 'tests/e2e/utils/auth.ts';

test.use({ storageState: { cookies: [], origins: [] } });
test('should sign up, activate user account and sign in with new credentials', async ({ page }) => {
    const user = generateTestUser();
    await signUp({ page, user });
    await activateAccount({ page, user });
    await signIn({ page, user });
});
