import {test} from "@playwright/test";

import {
    addReviewToCourse,
    generateCourseReview,
    openCoursePageByClickingCourseRowInTable
} from "tests/e2e/utils/courses.ts";



test('should add review to a course and edit it', async ({page}) => {
    const courseReview = generateCourseReview();
    await openCoursePageByClickingCourseRowInTable({page});
    await addReviewToCourse({page, courseReview});
})



