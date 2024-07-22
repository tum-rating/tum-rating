import {test} from '@playwright/test';

import {signOut} from 'tests/e2e/utils/auth.ts';

test('should sign out logged user', async ({page}) => {
    await page.goto('/');
    await signOut({page, mobile: false});
});

test('[mobile] should sign out logged user', async ({page}) => {
    await page.setViewportSize({width: 375, height: 812});
    await page.goto('/');
    await signOut({page, mobile: true});
});
