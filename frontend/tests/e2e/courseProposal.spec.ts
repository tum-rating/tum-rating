import { expect, test } from '@playwright/test';

const weirdQuery = 'Konstantynopolitańczykowianeczka';
const tumCourseLink = 'https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/slc.tm.cp/student/courses/950600157?$scrollTo=toc_overview';

test('should add course proposal', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Search...' }).click();
    await page.getByRole('textbox', { name: 'Search...' }).fill(weirdQuery);
    await expect(page.getByText('No matching courses for', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Add Course Proposal' }).click();
    await page.getByTestId('textarea').click();
    await page.getByTestId('textarea').fill(tumCourseLink);
    await page.getByTestId('submit-button').click();
    // TODO - fix this
    // await page.waitForResponse((response) => {
    //     const status = response.status();
    //     const url = response.url();
    //     return status === 201 && url.includes('course-proposals');
    // });
});

test('[mobile] should add course proposal', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.getByTestId('search_trigger').click();
    await page.getByRole('textbox', { name: 'Search...' }).fill(weirdQuery);
    await page.waitForRequest(/courses/, { timeout: 1000 });
    await expect(page.getByText('No matching courses for', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Add Course Proposal' }).click();
    await page.getByTestId('textarea').click();
    await page.getByTestId('textarea').fill(tumCourseLink);
    await page.getByTestId('submit-button').click();
    // await page.waitForResponse((response) => {
    //     const status = response.status();
    //     const url = response.url();
    //     return status === 201 && url.includes('course-proposals');
    // });
});

test.describe('without authorization', () => {
    test.use({ storageState: { cookies: [], origins: [] } });
    test('should display sign in dialog when trying to add course proposal without being signed in', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('textbox', { name: 'Search...' }).click();
        await page.getByRole('textbox', { name: 'Search...' }).fill(weirdQuery);
        await expect(page.getByText('No matching courses for', { exact: true })).toBeVisible();
        await page.getByRole('button', { name: 'Sign In to Add Course Proposal' }).click();
        await expect(page.getByRole('dialog', { name: 'Sign In' })).toBeVisible();
    });

    test('[mobile] should display sign in dialog when trying to add course proposal without being signed in', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('/');
        await page.getByTestId('search_trigger').click();
        await page.getByRole('textbox', { name: 'Search...' }).fill(weirdQuery);
        await expect(page.getByText('No matching courses for', { exact: true })).toBeVisible();
        await page.getByRole('button', { name: 'Sign In to Add Course Proposal' }).click();
        await expect(page.getByRole('dialog', { name: 'Sign In' })).toBeVisible();
    });
});
