import {expect} from '@playwright/test';

const openMobileDrawer = async ({page}) => {
    await page.getByTestId('burger').click();
    await expect(page.getByRole('dialog')).toBeVisible();
};

export {openMobileDrawer};
