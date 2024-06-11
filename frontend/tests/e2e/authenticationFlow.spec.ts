import { test } from '@playwright/test';

import { activateAccount, generateTestUser, signIn, signUp } from 'tests/e2e/utils/user.ts';

const user = generateTestUser();
test.use({ storageState: { cookies: [], origins: [] } });
test('should sign up, activate user account and sign in with new credentials', async ({ page }) => {
    await signUp({ page, user });
    await activateAccount({ page, user });
    await signIn({ page, user });
});
