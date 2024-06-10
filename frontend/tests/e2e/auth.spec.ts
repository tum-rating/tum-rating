import { faker } from '@faker-js/faker';
import { test, expect } from '@playwright/test';
import { signUpRequestMock } from '@tum-rating/backend/test/utils/api-client/user.ts';

const config = {
    email: faker.internet.email({ provider: 'tum.de' }),
    username: faker.internet.userName(),
    password: faker.internet.password(),
}

test('should sign up and activate user account', async ({page}) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByTestId('email').fill(config.email);
    await page.getByTestId('username').fill(config.username);
    await page.getByTestId('password').fill(config.password);
    await page.getByTestId('submit').click();
    await expect(page.getByText('Check Your Email')).toBeVisible();
    await expect(page.getByText(config.email)).toBeVisible();
});



test('should login verified user', async ({ page }) => {
    // await signUpRequestMock(config);
    // await page.goto('/');
    // await page.getByRole('button', { name: 'Sign In' }).click();
    // await page.getByTestId('email').fill(config.email);
    // await page.getByTestId('password').click();
    // await page.getByTestId('password').fill(config.password);
    // await page.getByTestId('submit').click();
    // await expect(page.getByTestId('menu')).toBeVisible();
});
