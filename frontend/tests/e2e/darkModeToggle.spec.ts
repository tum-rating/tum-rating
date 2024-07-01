import { expect, test } from '@playwright/test';

// import { openMobileDrawer } from 'tests/e2e/utils/layout.ts';

test('should toggle dark mode', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('banner').getByTestId('color-scheme-toggle').click();
    const html = await page.locator('html');
    await expect(html).toHaveAttribute('data-mantine-color-scheme', 'dark');
});

//TODO Make this working
// test('[mobile] should toggle dark mode', async ({ page }) => {
//     await page.setViewportSize({ width: 375, height: 812 });
//     await page.goto('/');
//     await openMobileDrawer({ page });
//     await page.locator('label div').first().click();
//     const html = await page.locator('html');
//     await expect(html).toHaveAttribute('data-mantine-color-scheme', 'dark');
// });
