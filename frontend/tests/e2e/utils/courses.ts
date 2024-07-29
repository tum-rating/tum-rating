import {faker} from '@faker-js/faker';
import {Page} from '@playwright/test';

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

const addCourseProposal = async ({page}) => {
    const tumCourseLink = 'https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/slc.tm.cp/student/courses/950600157?$scrollTo=toc_overview';
    const form = page.getByTestId('add-course-proposal-form');
    await form.locator('[data-testid="textarea"]').fill(tumCourseLink);
    await form.locator('[data-testid="submit"]').click();

    //TODO somehow check if the course proposal was added
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
    await page.waitForTimeout(1000);
    await page.getByRole('button', {name: 'Add review'}).click();
    await page.getByTestId('textarea').fill(courseReview.comment);
    await page.getByTestId('select').click();
    await page.getByRole('option').first().click();

    await page.getByTestId('add-user-review-form').getByText('How easy0No reviews').click();
    await page.getByTestId('add-user-review-form').getByText('How interesting0No reviews').click();
    await page.getByRole('button', {name: 'Send'}).click();
    await page.waitForTimeout(1000);

    page.locator('[data-testid="user-comment"]').filter({hasText: courseReview.comment});
};

const checkCourseRender = async ({page, name}) => {
    await page.getByTestId('course-name').filter({hasText: name}).isVisible();
};

export {openCoursePageByClickingCourseRowInTable, addReviewToCourse, checkCourseRender, generateCourseReview, addCourseProposal};
