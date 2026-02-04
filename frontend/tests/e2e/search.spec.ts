import {expect, test} from '@playwright/test';

import {checkCourseRender} from 'tests/e2e/utils/courses.ts';

const query = 'advanced';
const createQueryRegex = (word: string) => new RegExp(`\\b\\w*${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\w*\\b`, 'i');

test(`should find courses by name "${query} "and navigate to course page by clicking course item in search combo box`, async ({page}) => {
    await page.goto('/', {waitUntil: 'domcontentloaded'});
    await page.getByRole('textbox', {name: 'Search...'}).fill(query);

    // Wait for options to appear and stabilize
    const option = page.getByRole('option', {name: createQueryRegex(query)}).first();
    await expect(option).toBeVisible({timeout: 10000});
    
    // Get the course name before clicking to avoid detached element
    const optionCourseName = option.locator('p').first();
    await expect(optionCourseName).toBeVisible();
    const optionDetails = await optionCourseName.allInnerTexts();
    const courseName = optionDetails[0];
    
    // Wait a bit for the combobox to stabilize, then click
    await page.waitForTimeout(500);
    await option.click();
    await checkCourseRender({page, name: courseName});
});

test(`[mobile] should find courses by name "${query}" and navigate to course page by clicking course item in search combo box`, async ({page}) => {
    await page.setViewportSize({width: 375, height: 812});
    await page.goto('/', {waitUntil: 'domcontentloaded'});
    await page.getByTestId('search-trigger-mobile').click();
    await page.getByRole('textbox', {name: 'Search...'}).fill(query);
    
    // Wait for options to appear and stabilize
    const option = page.getByRole('option', {name: createQueryRegex(query)}).first();
    await expect(option).toBeVisible({timeout: 10000});
    
    // Get the course name before clicking to avoid detached element
    const optionCourseName = option.locator('p').first();
    await expect(optionCourseName).toBeVisible();
    const optionDetails = await optionCourseName.allInnerTexts();
    const courseName = optionDetails[0];
    
    // Wait a bit for the combobox to stabilize, then click
    await page.waitForTimeout(500);
    await option.click();
    await checkCourseRender({page, name: courseName});
});
