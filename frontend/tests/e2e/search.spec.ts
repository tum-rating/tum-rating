import { test } from '@playwright/test';

import { checkCourseRender } from 'tests/e2e/utils/courses.ts';

const query = 'advanced';

test(`should find courses by name "${query} "and navigate to course page by clicking course item in search combo box`, async ({ page }) => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Search...' }).fill(query);
    // http://localhost:3000/api/v1/courses?page-number=1&page-size=45&search=advanced
    await page.waitForRequest(/courses/, { timeout: 1000 });
    const menu = page.locator('.mantine-Popover-dropdown');
    const option = menu.getByRole('option').first()
    const optionCourseName = option.locator('p').first();
    const optionDetails = await optionCourseName.allInnerTexts();
    await option.click();
    await checkCourseRender({ page, name: optionDetails[0] });
});

test(`[mobile] should find courses by name "${query}" and navigate to course page by clicking course item in search combo box`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.getByTestId('search_trigger').click();
    await page.getByRole('textbox', { name: 'Search...' }).fill(query);
    await page.waitForRequest(/courses/, { timeout: 1000 });
    const option = page.getByRole('option').first()
    const optionCourseName = option.locator('p').first();
    const optionDetails = await optionCourseName.allInnerTexts();
    await option.click();
    await checkCourseRender({ page, name: optionDetails[0] });
})
