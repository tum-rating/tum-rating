import {test as setup} from '@playwright/test';

import {activateAccount, generateTestUser, signIn, signUp} from 'tests/e2e/utils/auth.ts';

const authFile = 'tests/e2e/utils/.auth/user.json';

setup('authenticate', async ({page}) => {
    const user = generateTestUser();
    await page.goto('/');
    await page.getByTestId('sign-up-btn-desktop').click();
    await page.getByText('Sign up', {exact: true}).click();
    await signUp({page, user});
    await activateAccount({page, user});
    await page.goto('/');
    await page.getByTestId('sign-in-btn-desktop').click();
    await signIn({page, user});
    await page.context().storageState({path: authFile});
});
