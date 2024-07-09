import {test, expect} from '@playwright/test';

import {openMobileDrawer} from 'tests/e2e/utils/layout.ts';

test('should sign out logged user', async ({page}) => {
    await page.goto('/');
    await page.getByTestId('user-btn-desktop').click();
    await page.getByRole('menuitem', {name: 'Logout'}).click();
    await expect(page.getByTestId('menu')).not.toBeVisible();
    await expect(page.getByRole('button', {name: 'Sign In'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Sign Up'})).toBeVisible();
});

test('[mobile] should sign out logged user', async ({page}) => {
    await page.setViewportSize({width: 375, height: 812});
    await page.goto('/');
    await openMobileDrawer({page});
    await page.getByRole('button', {name: 'Log out'}).click();
    await expect(page.getByRole('button', {name: 'Sign In'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Sign Up'})).toBeVisible();
});
