import { faker } from '@faker-js/faker';
import { expect, Page } from '@playwright/test';

interface CourseAction {
    page: Page;
    courseReview: {
        howInterestingRating?: number;
        howEasyRating?: number;
        comment: string;
        semester?: string;
    };
}

const generateCourseReview = () => {
    return {
        howInterestingRating: faker.number.float({ min: 1, max: 5 }),
        howEasyRating: faker.number.float({ min: 1, max: 5 }),
        comment: faker.lorem.sentence({ min: 10, max: 50 }),
        semester: '2024 S',
    };
};

const openCoursePageByClickingCourseRowInTable = async ({ page }) => {
    const rowElement = page.locator('.mantine-Table-tr:nth-of-type(4)');
    const rowElementDetails = await rowElement.locator('.mantine-Table-td').allInnerTexts();
    await rowElement.click();
    await expect(page.getByRole('main').locator('p').filter({ hasText: rowElementDetails[0] })).toBeVisible();
    await expect(page.getByRole('link', { name: rowElementDetails[0] })).toBeVisible();
};

const addReviewToCourse = async ({ page, courseReview }: CourseAction) => {
    await page.getByRole('button', { name: 'Add review' }).click();
    await page.getByTestId('textarea').fill(courseReview.comment);
    await page.getByTestId('select').click();
    await page.getByRole('option', { name: 'S' }).click();

    // //TODO check if this work every time
    await page.getByLabel('Add your review').getByText('How easy0No reviews').click()
    await page.getByLabel('Add your review').getByText('How interesting0No reviews').click()
    await page.getByRole('button', { name: 'Send' }).click();

    // await howEasyRating.locator('.mantine-Rating-input').check()
    // await howInterestingRating.locator('.mantine-Rating-input').check()
    // await page.locator('div:nth-child(4) > label:nth-child(4) > .m_fae05d6a > .m_5662a89a').first().click();
    // await page.locator('#mantine-k1mggu3gt > div:nth-child(5) > label > .m_fae05d6a > .m_5662a89a > path').first().click();
};

export { openCoursePageByClickingCourseRowInTable, addReviewToCourse, generateCourseReview };
