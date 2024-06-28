import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import { getRecoveryTokenFromMail, signIn } from 'tests/e2e/utils/auth.ts';
import { openMobileDrawer } from 'tests/e2e/utils/layout.ts';

test.describe('with mode:serial', () => {
    test.describe.configure({ mode: 'serial' });
    test('should set new password in recovery process and sign in with new credentials', async ({ page }) => {
        const newPassword = faker.internet.password();
        await page.goto('/');
        await expect(page.getByTestId('menu')).toBeVisible();
        await page.getByTestId('menu').click();
        await page.getByTestId('username-loaded-dropdown').click();
        const email = await page.getByTestId('email-loaded-dropdown').allInnerTexts();
        await page.getByRole('menuitem', { name: 'Logout' }).click();
        await page.getByRole('button', { name: 'Sign In' }).click();
        await page.getByRole('button', { name: 'Forgot password?' }).click();
        await page.getByTestId('email').fill(email[0]);
        await page.getByTestId('submit').click();
        await expect(page.getByText('Check Your Email')).toBeVisible();
        const token = await getRecoveryTokenFromMail(email[0]);
        await page.goto(`/auth/recovery?token=${token}`);
        await page.getByTestId('password').fill(newPassword);
        await page.getByTestId('confirm-password').fill(newPassword);
        await page.getByRole('button', { name: 'Reset Password' }).click();
        await expect(page.getByText('Password Recovery Complete 🎉')).toBeVisible();
        //back to home, signIn test method do not work from recovery success page
        await page.getByRole('link', { name: 'tum rating logo' }).click();
        await signIn({ page, user: { email: email[0], password: newPassword } });
    });
    test('[mobile] should set new password in recovery process and sign in with new credentials', async ({ page }) => {
        const newPassword = faker.internet.password();
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');
        await openMobileDrawer({ page });
        const email = await page.getByTestId('email-loaded').allInnerTexts();
        await page.getByRole('button', { name: 'Log out' }).click();
        await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible();
        await page.getByRole('button', { name: 'Sign In' }).click();
        await page.getByRole('button', { name: 'Forgot password?' }).click();
        await page.getByTestId('email').fill(email[0]);
        await page.getByTestId('submit').click();
        await expect(page.getByText('Check Your Email')).toBeVisible();
        const token = await getRecoveryTokenFromMail(email[0]);
        await page.goto(`/auth/recovery?token=${token}`);
        await page.getByTestId('password').fill(newPassword);
        await page.getByTestId('confirm-password').fill(newPassword);
        await page.getByRole('button', { name: 'Reset Password' }).click();
        await expect(page.getByText('Password Recovery Complete 🎉')).toBeVisible();
        //back to home, signIn test method do not work from recovery success page
        await page.getByRole('link', { name: 'tum rating logo' }).click();
        await openMobileDrawer({ page });
        await signIn({ page, user: { email: email[0], password: newPassword }, mobile: true });
    });
});
