import {faker} from '@faker-js/faker';
import {expect, Page} from '@playwright/test';

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
        howInterestingRating: faker.number.float({min: 1, max: 5}),
        howEasyRating: faker.number.float({min: 1, max: 5}),
        comment: faker.lorem.sentence({min: 10, max: 50}),
        semester: '2024 S',
    };
};

const openCoursePageByClickingCourseRowInTable = async ({page, browser}) => {
    let randomRowIndex: number;
    const browserType = browser.browserType().name();
    if (browserType === 'chromium') {
        randomRowIndex = faker.number.int({min: 4, max: 7});
    } else if (browserType === 'firefox') {
        randomRowIndex = faker.number.int({min: 8, max: 12});
    }
    const rowElement = page.locator(`.mantine-Table-tr:nth-of-type(${randomRowIndex})`);
    const rowElementDetails = await rowElement.locator('.mantine-Table-td').allInnerTexts();
    await rowElement.click();
    await checkCourseRender({page, name: rowElementDetails[0]});
};

const addReviewToCourse = async ({page, courseReview}: CourseAction) => {
    await page.getByRole('button', {name: 'Add review'}).click();
    await page.getByTestId('textarea').fill(courseReview.comment);
    await page.getByTestId('select').click();
    await page.getByRole('option', {name: 'S'}).click();

    await page.getByLabel('Add your review').getByText('How easy0No reviews').click()
    await page.getByLabel('Add your review').getByText('How interesting0No reviews').click()
    await page.getByRole('button', {name: 'Send'}).click();
    await page.waitForTimeout(1000)

    await expect(page.locator('p').filter({hasText: courseReview.comment})).toBeVisible();
};


const checkCourseRender = async ({page, name}) => {
    await expect(page.getByRole('main').locator('p').filter({hasText: name})).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('link', {name: name})).toBeVisible();
};

export {
    openCoursePageByClickingCourseRowInTable,
    addReviewToCourse,
    checkCourseRender,
    generateCourseReview
};
