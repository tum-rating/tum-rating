import { test } from '@playwright/test';

import { checkCourseRender } from 'tests/e2e/utils/courses.ts';

const query = 'advanced';
const createQueryRegex = (word: string) => new RegExp(`\\b\\w*${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\w*\\b`, 'i');

test(`should find courses by name "${query} "and navigate to course page by clicking course item in search combo box`, async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('textbox', { name: 'Search...' }).fill(query);

    const option = page.getByRole('option', { name: createQueryRegex(query) }).first();
    const optionCourseName = option.locator('p').first();
    const optionDetails = await optionCourseName.allInnerTexts();
    await option.click({ force: true });
    await checkCourseRender({ page, name: optionDetails[0] });
});

test(`[mobile] should find courses by name "${query}" and navigate to course page by clicking course item in search combo box`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByTestId('search_trigger').click();
    await page.getByRole('textbox', { name: 'Search...' }).fill(query);
    const option = page.getByRole('option', { name: createQueryRegex(query) }).first();
    const optionCourseName = option.locator('p').first();
    const optionDetails = await optionCourseName.allInnerTexts();
    await option.click({ force: true });
    await checkCourseRender({ page, name: optionDetails[0] });
});
