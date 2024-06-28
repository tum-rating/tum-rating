import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

import { getRecoveryTokenFromMail, signIn } from 'tests/e2e/utils/auth.ts';

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
    await page.getByRole('button', { name: 'Log In' }).click();
    //-- login in btn in recovery page redirects to /#=modal=sign-in by default
    await page.waitForURL('/#modal=sign-in');
    //-- we are doing that because we have function signIn in utils/user.ts which works only when signIn modal is not open
    await page.goto('/');
    await signIn({ page, user: { email: email[0], password: newPassword } });
});
