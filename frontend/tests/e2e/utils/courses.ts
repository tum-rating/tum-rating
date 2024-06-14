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
    const rowElement = page.locator('tbody tr:nth-child(3) td:nth-child(1)');
    const rowElementDetails = await rowElement.allInnerTexts();
    await rowElement.click();
    await checkCourseRender({ page, name: rowElementDetails[0] });
};

const addReviewToCourse = async ({ page, courseReview }: CourseAction) => {
    await page.getByRole('button', { name: 'Add review' }).click();
    await page.getByTestId('textarea').fill(courseReview.comment);
    await page.getByTestId('select').click();
    await page.getByRole('option', { name: 'S' }).click();

    //TODO check if this work every time
    await page.locator('div:nth-child(4) > label:nth-child(4) > .m_fae05d6a > .m_5662a89a').first().click();
    await page.locator('#mantine-k1mggu3gt > div:nth-child(5) > label > .m_fae05d6a > .m_5662a89a > path').first().click();
};

const checkCourseRender = async ({ page, name }) => {
    await expect(page.getByRole('main').locator('p').filter({ hasText: name })).toBeVisible();
    await expect(page.getByRole('link', { name: name })).toBeVisible();
};

export { openCoursePageByClickingCourseRowInTable, addReviewToCourse, checkCourseRender, generateCourseReview };
