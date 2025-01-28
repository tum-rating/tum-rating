import {faker} from '@faker-js/faker';
import {expect, test} from '@playwright/test';

import {getRecoveryTokenFromMail, signIn} from 'tests/e2e/utils/auth.ts';
import {openMobileDrawer} from 'tests/e2e/utils/layout.ts';

test.describe.configure({mode: 'serial'});

test('should set new password in recovery process and sign in with new credentials', async ({page}) => {
    const newPassword = faker.internet.password();
    await page.goto('/', {waitUntil: 'domcontentloaded'});
    await page.getByTestId('user-btn-desktop').click();
    const username = await page.getByTestId('user-btn-username-desktop').allInnerTexts();
    const email = await page.getByTestId('user-btn-email-desktop').allInnerTexts();
    await page.getByRole('menuitem', {name: 'Logout'}).click();
    await page.getByRole('button', {name: 'Sign In'}).click();
    await page.getByRole('button', {name: 'Forgot password?'}).click();
    await expect(page.getByTestId('email')).toBeVisible();
    await page.getByTestId('email').fill(email[0]);
    await page.getByTestId('submit').click();
    await expect(page.getByText('Check Your Email')).toBeVisible();
    const token = await getRecoveryTokenFromMail(email[0]);
    await page.goto(`/auth/recovery?token=${token}`, {waitUntil: 'domcontentloaded'});
    await page.getByTestId('password').fill(newPassword);
    await page.getByTestId('confirm-password').fill(newPassword);

    const resetPasswordButton = page.getByRole('button', {name: 'Reset Password'});
    await expect(resetPasswordButton).toBeVisible({timeout: 10000});
    await expect(resetPasswordButton).toBeEnabled({timeout: 10000});
    await resetPasswordButton.click();

    //back to home, signIn test method do not work from recovery success page
    await page.getByRole('link', {name: 'tum rating logo'}).click();
    await page.getByTestId('sign-in-btn-desktop').click();
    await signIn({page, user: {email: email[0], username: username[0], password: newPassword}});
});

test('[mobile] should set new password in recovery process and sign in with new credentials', async ({page}) => {
    const newPassword = faker.internet.password();
    await page.setViewportSize({width: 375, height: 667});
    await page.goto('/', {waitUntil: 'domcontentloaded'});
    await openMobileDrawer({page});
    const username = await page.getByTestId('user-btn-username-mobile').allInnerTexts();
    const email = await page.getByTestId('user-btn-email-mobile').allInnerTexts();
    await page.getByRole('button', {name: 'Log out'}).click();
    await expect(page.getByRole('button', {name: 'Sign In'})).toBeVisible();
    await expect(page.getByRole('button', {name: 'Sign Up'})).toBeVisible();
    await page.getByRole('button', {name: 'Sign In'}).click();
    await page.getByRole('button', {name: 'Forgot password?'}).click();

    await page.getByTestId('email').fill(email[0]);
    await page.getByTestId('submit').click();
    await expect(page.getByText('Check Your Email')).toBeVisible();
    const token = await getRecoveryTokenFromMail(email[0]);
    await page.goto(`/auth/recovery?token=${token}`, {waitUntil: 'domcontentloaded'});
    await page.getByTestId('password').fill(newPassword);
    await page.getByTestId('confirm-password').fill(newPassword);

    const resetPasswordButton = page.getByRole('button', {name: 'Reset Password'});
    await expect(resetPasswordButton).toBeVisible({timeout: 10000});
    await expect(resetPasswordButton).toBeEnabled({timeout: 10000});
    await resetPasswordButton.click();

    await expect(page.getByText('Password Recovery Complete 🎉')).toBeVisible({timeout: 10000});
    //back to home, signIn test method do not work from recovery success page
    await page.getByRole('link', {name: 'tum rating logo'}).click();
    await openMobileDrawer({page});
    await page.getByTestId('sign-in-btn-mobile').click();
    await signIn({page, user: {email: email[0], username: username[0], password: newPassword}, mobile: true});
});
