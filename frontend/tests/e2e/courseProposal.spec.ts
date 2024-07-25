import {expect, test} from '@playwright/test';

import {addCourseProposal} from 'tests/e2e/utils/courses.ts';

const weirdQuery = 'Konstantynopolitańczykowianeczka';

test('should add course proposal', async ({page}) => {
    await page.goto('/', {waitUntil: 'domcontentloaded'});
    await page.getByRole('textbox', {name: 'Search...'}).click();
    await page.getByRole('textbox', {name: 'Search...'}).fill(weirdQuery);
    await expect(page.getByText('No matching courses for', {exact: true})).toBeVisible();
    await page.getByRole('button', {name: 'Add Course Proposal'}).click();
    await addCourseProposal({page});
});

test('[mobile] should add course proposal', async ({page}) => {
    await page.setViewportSize({width: 375, height: 812});
    await page.goto('/', {waitUntil: 'domcontentloaded'});
    await page.getByTestId('search-trigger-mobile').click();
    await page.getByRole('textbox', {name: 'Search...'}).fill(weirdQuery);
    await expect(page.getByText('No matching courses for', {exact: true})).toBeVisible();
    await page.getByRole('button', {name: 'Add Course Proposal'}).click();
    await addCourseProposal({page});
});

test.describe('without authorization', () => {
    test.use({storageState: {cookies: [], origins: []}});
    test('should display sign in button when trying to add course proposal without being signed in', async ({page}) => {
        await page.goto('/', {waitUntil: 'domcontentloaded'});
        await page.getByRole('textbox', {name: 'Search...'}).click();
        await page.getByRole('textbox', {name: 'Search...'}).fill(weirdQuery);
        await expect(page.getByText('No matching courses for', {exact: true})).toBeVisible();
        await expect(page.getByTestId('sign-in-to-add-course-proposal')).toBeVisible();
    });

    test('[mobile] should display sign in when trying to add course proposal without being signed in', async ({page}) => {
        await page.setViewportSize({width: 375, height: 812});
        await page.goto('/', {waitUntil: 'domcontentloaded'});
        await page.getByTestId('search-trigger-mobile').click();
        await page.getByRole('textbox', {name: 'Search...'}).fill(weirdQuery);
        await expect(page.getByText('No matching courses for', {exact: true})).toBeVisible();
        await expect(page.getByTestId('sign-in-to-add-course-proposal')).toBeVisible();
    });
});
