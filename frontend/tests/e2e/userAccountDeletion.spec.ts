import {test, expect} from '@playwright/test';

test('should remove account of logged user',async ({page})=>{
    await page.goto('/');
    await page.getByTestId('user-btn-desktop').click();
    await page.getByRole('menuitem', {name: 'Settings'}).click();
    await expect(page.getByTestId('user-settings-username')).toBeVisible();
    await expect(page.getByTestId('user-settings-email')).toBeVisible();
    await page.getByTestId('user-settings-delete-button').click();
    //confirm deletion
    await page.getByTestId('user-settings-delete-confirmation-button').click();
    //final deletion
    const emailInput = page.getByTestId('user-settings-delete-email-input');
    const userEmail = page.getByTestId('user-settings-email').textContent();
    await emailInput.fill(await userEmail);
    await page.getByTestId('user-settings-delete-final-button').click();
    await expect(page.getByTestId('user-btn-desktop')).not.toBeVisible();
    await expect(page.getByTestId('sign-in-btn-desktop')).toBeVisible();
    await expect(page.getByTestId('sign-up-btn-desktop')).toBeVisible();
})
