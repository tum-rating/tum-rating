import {test} from "@playwright/test";

test('should set new password in recovery process and sign in with new credentials', async ({ page}) => {
    await page.goto('/');
    await page.getByTestId('menu').click();
    await page.getByRole('menuitem', { name: 'Logout' }).click();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('button', { name: 'Forgot password?' }).click();
});
