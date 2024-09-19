import {test} from '@playwright/test';

import {
    addReviewToCourse,
    generateCourseReview,
    openCoursePageByClickingCourseRowInTable
} from 'tests/e2e/utils/courses.ts';

test('should add review to a course', async ({page, browser}) => {
    await page.goto('/', {waitUntil: 'domcontentloaded'});
    const courseReview = generateCourseReview();
    await openCoursePageByClickingCourseRowInTable({page, browser});
    await addReviewToCourse({page, courseReview, mobile: false});
});

test('[mobile] should add review to a course', async ({page, browser}) => {
    await page.setViewportSize({width: 375, height: 812});
    await page.goto('/', {waitUntil: 'domcontentloaded'});
    const courseReview = generateCourseReview();
    await openCoursePageByClickingCourseRowInTable({page, browser});
    await addReviewToCourse({page, courseReview, mobile: true});
});
