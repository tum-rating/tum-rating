import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { connectMongo } from '@tum-rating/backend/test/utils';
import { signInRequestMock, signInAdminRequestMock, userUrl } from '@tum-rating/backend/test/utils';
import { createCourseMockRequest, getCourseById } from '@tum-rating/backend/test/utils/api-client/course';
import { addReviewMockRequest } from '@tum-rating/backend/test/utils/api-client/review';
import { deleteUserByAdmin } from '@tum-rating/backend/test/utils';
import { getReviewById } from '@tum-rating/backend/test/utils';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Delete user effects on course', () => {
    it('should delete reviews of deleted user', async () => {
        const user = await signInRequestMock();
        const admin = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(admin.token);
        const review = await addReviewMockRequest(user.token, createdCourse.id, user.user.id);

        const reviewFromApi = await getCourseById(createdCourse.id)

        expect(reviewFromApi.reviews.length).toBe(1);
        expect(reviewFromApi.reviews[0]['_id']).toBe(review.id);

        await deleteUserByAdmin(admin.token, user.user.id);

        const reviewFromApiAfterDeletion = await getCourseById(createdCourse.id);

        expect(reviewFromApiAfterDeletion.reviews.length).toBe(0);

        const reviewFromDB = await getReviewById(review.id);
        expect(reviewFromDB ).toBe(null);
    });

    it('should delete reviews of deleted user with multiple different users reviews', async () => {
        const user1 = await signInRequestMock();
        const user2 = await signInRequestMock();
        const user3 = await signInRequestMock();
        const admin = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(admin.token);
        
        const user_1_review = await addReviewMockRequest(user1.token, createdCourse.id, user1.user.id);
        const user_2_review = await addReviewMockRequest(user2.token, createdCourse.id, user2.user.id);
        const user_3_review = await addReviewMockRequest(user3.token, createdCourse.id, user3.user.id);

        const courseFromApi = await getCourseById(createdCourse.id)

        expect(courseFromApi.reviews.length).toBe(3);

        let foundReview = courseFromApi.reviews.find(review => review['_id'] === user_1_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);
        foundReview = courseFromApi.reviews.find(review => review['_id'] === user_2_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);
        foundReview = courseFromApi.reviews.find(review => review['_id'] === user_3_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);

        await deleteUserByAdmin(admin.token, user1.user.id);

        const courseFromApiAfterDeletion = await getCourseById(createdCourse.id);

        expect(courseFromApiAfterDeletion.reviews.length).toBe(2);

        foundReview = courseFromApiAfterDeletion.reviews.find(review => review['_id'] === user_1_review.id);
        expect(foundReview).toBe(undefined);
        foundReview = courseFromApiAfterDeletion.reviews.find(review => review['_id'] === user_2_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);
        foundReview = courseFromApiAfterDeletion.reviews.find(review => review['_id'] === user_3_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);
    });

    it('should delete reviews of deleted user for all courses reviewd by this user', async () => {
        const user1 = await signInRequestMock();
        const user2 = await signInRequestMock();
        const user3 = await signInRequestMock();
        const admin = await signInAdminRequestMock();

        const createdCourse1 = await createCourseMockRequest(admin.token);

        const user_1_course_1_review = await addReviewMockRequest(user1.token, createdCourse1.id, user1.user.id);
        const user_2_course_1_review = await addReviewMockRequest(user2.token, createdCourse1.id, user2.user.id);
        const user_3_course_1_review = await addReviewMockRequest(user3.token, createdCourse1.id, user3.user.id);

        const createdCourse2 = await createCourseMockRequest(admin.token);

        const user_1_course_2_review = await addReviewMockRequest(user1.token, createdCourse2.id, user1.user.id);
        const user_2_course_2_review = await addReviewMockRequest(user2.token, createdCourse2.id, user2.user.id);
        const user_3_course_2_review = await addReviewMockRequest(user3.token, createdCourse2.id, user3.user.id);

        const createdCourse3 = await createCourseMockRequest(admin.token);

        const user_1_course_3_review = await addReviewMockRequest(user1.token, createdCourse3.id, user1.user.id);
        const user_2_course_3_review = await addReviewMockRequest(user2.token, createdCourse3.id, user2.user.id);

        const courseFromApi = await getCourseById(createdCourse1.id)

        expect(courseFromApi.reviews.length).toBe(3);

        let foundReview = courseFromApi.reviews.find(review => review['_id'] === user_1_course_1_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);
        foundReview = courseFromApi.reviews.find(review => review['_id'] === user_2_course_1_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);
        foundReview = courseFromApi.reviews.find(review => review['_id'] === user_3_course_1_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);

        const courseFromApi2 = await getCourseById(createdCourse2.id)

        expect(courseFromApi2.reviews.length).toBe(3);

        foundReview = courseFromApi2.reviews.find(review => review['_id'] === user_1_course_2_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);
        foundReview = courseFromApi2.reviews.find(review => review['_id'] === user_2_course_2_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);
        foundReview = courseFromApi2.reviews.find(review => review['_id'] === user_3_course_2_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);

        const courseFromApi3 = await getCourseById(createdCourse3.id)

        expect(courseFromApi3.reviews.length).toBe(2);

        foundReview = courseFromApi3.reviews.find(review => review['_id'] === user_1_course_3_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);
        foundReview = courseFromApi3.reviews.find(review => review['_id'] === user_2_course_3_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);

        await deleteUserByAdmin(admin.token, user1.user.id);

        const courseFromApi1AfterUserDeletion = await getCourseById(createdCourse1.id);

        expect(courseFromApi1AfterUserDeletion.reviews.length).toBe(2);

        foundReview = courseFromApi1AfterUserDeletion.reviews.find(review => review['_id'] === user_1_course_1_review.id);
        expect(foundReview).toBe(undefined);
        foundReview = courseFromApi1AfterUserDeletion.reviews.find(review => review['_id'] === user_2_course_1_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);
        foundReview = courseFromApi1AfterUserDeletion.reviews.find(review => review['_id'] === user_2_course_1_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);

        const courseFromApi2AfterUserDeletion = await getCourseById(createdCourse2.id);

        expect(courseFromApi2AfterUserDeletion.reviews.length).toBe(2);

        foundReview = courseFromApi2AfterUserDeletion.reviews.find(review => review['_id'] === user_1_course_2_review.id);
        expect(foundReview).toBe(undefined);
        foundReview = courseFromApi2AfterUserDeletion.reviews.find(review => review['_id'] === user_2_course_2_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);
        foundReview = courseFromApi2AfterUserDeletion.reviews.find(review => review['_id'] === user_2_course_2_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);

        const courseFromApi3AfterDeletion = await getCourseById(createdCourse3.id);

        expect(courseFromApi3AfterDeletion.reviews.length).toBe(1);

        foundReview = courseFromApi3AfterDeletion.reviews.find(review => review['_id'] === user_1_course_3_review.id);
        expect(foundReview).toBe(undefined);
        foundReview = courseFromApi3AfterDeletion.reviews.find(review => review['_id'] === user_2_course_3_review.id);
        expect(foundReview).toBeDefined();
        expect(foundReview.isHidden).toBe(undefined);
    }, 10000);

    it('should delete reviews of deleted user with proper single course stats alignment', async () => {
        const user1 = await signInRequestMock();
        const user2 = await signInRequestMock();
        const user3 = await signInRequestMock();
        const admin = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(admin.token);
        
        const user_1_review = await addReviewMockRequest(user1.token, createdCourse.id, user1.user.id);
        const user_2_review = await addReviewMockRequest(user2.token, createdCourse.id, user2.user.id);
        const user_3_review = await addReviewMockRequest(user3.token, createdCourse.id, user3.user.id);

        let courseHowInteresing = (user_1_review.howInterestingRating + user_2_review.howInterestingRating + user_3_review.howInterestingRating) / 3;
        courseHowInteresing = parseFloat(courseHowInteresing.toFixed(2));
        let courseHowEasy = (user_1_review.howEasyRating + user_2_review.howEasyRating + user_3_review.howEasyRating) / 3;
        courseHowEasy = parseFloat(courseHowEasy.toFixed(2));

        const courseFromApi = await getCourseById(createdCourse.id)

        expect(courseFromApi.reviews.length).toBe(3);
        expect(courseFromApi.howInterestingRatingAverage).toBe(courseHowInteresing);
        expect(courseFromApi.howEasyRatingAverage).toBe(courseHowEasy);

        await deleteUserByAdmin(admin.token, user1.user.id);

        const reviewFromApiAfterUserDeletion = await getCourseById(createdCourse.id);

        let courseHowInteresingAfterUserDeletion = (user_2_review.howInterestingRating + user_3_review.howInterestingRating) / 2;
        courseHowInteresingAfterUserDeletion = parseFloat(courseHowInteresingAfterUserDeletion.toFixed(2));
        let courseHowEasyAfterUserDeletion = (user_2_review.howEasyRating + user_3_review.howEasyRating) / 2;
        courseHowEasyAfterUserDeletion = parseFloat(courseHowEasyAfterUserDeletion.toFixed(2));

        expect(reviewFromApiAfterUserDeletion.reviews.length).toBe(2);
        expect(reviewFromApiAfterUserDeletion.howInterestingRatingAverage).toBe(courseHowInteresingAfterUserDeletion);
        expect(reviewFromApiAfterUserDeletion.howEasyRatingAverage).toBe(courseHowEasyAfterUserDeletion);
    });

    it('should delete reviews of deleted user for all courses with proper stats alignment', async () => {
        const user1 = await signInRequestMock();
        const user2 = await signInRequestMock();
        const user3 = await signInRequestMock();
        const admin = await signInAdminRequestMock();

        const createdCourse1 = await createCourseMockRequest(admin.token);

        const user_1_course_1_review = await addReviewMockRequest(user1.token, createdCourse1.id, user1.user.id);
        const user_2_course_1_review = await addReviewMockRequest(user2.token, createdCourse1.id, user2.user.id);
        const user_3_course_1_review = await addReviewMockRequest(user3.token, createdCourse1.id, user3.user.id);

        let course1HowInteresing = (user_1_course_1_review.howInterestingRating + user_2_course_1_review.howInterestingRating + user_3_course_1_review.howInterestingRating) / 3;
        course1HowInteresing = parseFloat(course1HowInteresing.toFixed(2));
        let course1HowEasy = (user_1_course_1_review.howEasyRating + user_2_course_1_review.howEasyRating + user_3_course_1_review.howEasyRating) / 3;
        course1HowEasy = parseFloat(course1HowEasy.toFixed(2));

        const createdCourse2 = await createCourseMockRequest(admin.token);

        const user_1_course_2_review = await addReviewMockRequest(user1.token, createdCourse2.id, user1.user.id);
        const user_2_course_2_review = await addReviewMockRequest(user2.token, createdCourse2.id, user2.user.id);
        const user_3_course_2_review = await addReviewMockRequest(user3.token, createdCourse2.id, user3.user.id);

        let course2HowInteresing = (user_1_course_2_review.howInterestingRating + user_2_course_2_review.howInterestingRating + user_3_course_2_review.howInterestingRating) / 3;
        course2HowInteresing = parseFloat(course2HowInteresing.toFixed(2));
        let course2HowEasy = (user_1_course_2_review.howEasyRating + user_2_course_2_review.howEasyRating + user_3_course_2_review.howEasyRating) / 3;
        course2HowEasy = parseFloat(course2HowEasy.toFixed(2));

        const createdCourse3 = await createCourseMockRequest(admin.token);

        const user_1_course_3_review = await addReviewMockRequest(user1.token, createdCourse3.id, user1.user.id);
        const user_2_course_3_review = await addReviewMockRequest(user2.token, createdCourse3.id, user2.user.id);

        let course3HowInteresing = (user_1_course_3_review.howInterestingRating + user_2_course_3_review.howInterestingRating) / 2;
        course3HowInteresing = parseFloat(course3HowInteresing.toFixed(2));
        let course3HowEasy = (user_1_course_3_review.howEasyRating + user_2_course_3_review.howEasyRating) / 2;
        course3HowEasy = parseFloat(course3HowEasy.toFixed(2));

        const courseFromApi = await getCourseById(createdCourse1.id);

        expect(courseFromApi.reviews.length).toBe(3);
        expect(courseFromApi.howInterestingRatingAverage).toBe(course1HowInteresing);
        expect(courseFromApi.howEasyRatingAverage).toBe(course1HowEasy);

        const courseFromApi2 = await getCourseById(createdCourse2.id)

        expect(courseFromApi2.reviews.length).toBe(3);
        expect(courseFromApi2.howInterestingRatingAverage).toBe(course2HowInteresing);
        expect(courseFromApi2.howEasyRatingAverage).toBe(course2HowEasy);

        const courseFromApi3 = await getCourseById(createdCourse3.id)

        expect(courseFromApi3.reviews.length).toBe(2);
        expect(courseFromApi3.howInterestingRatingAverage).toBe(course3HowInteresing);
        expect(courseFromApi3.howEasyRatingAverage).toBe(course3HowEasy);

        await deleteUserByAdmin(admin.token, user1.user.id);

        const courseFromApi1AfterUserDeletion = await getCourseById(createdCourse1.id);

        let course1HowInteresingAfterUserDeletion = (user_2_course_1_review.howInterestingRating + user_3_course_1_review.howInterestingRating) / 2;
        course1HowInteresingAfterUserDeletion = parseFloat(course1HowInteresingAfterUserDeletion.toFixed(2));
        let course1HowEasyAfterUserDeletion = (user_2_course_1_review.howEasyRating + user_3_course_1_review.howEasyRating) / 2;
        course1HowEasyAfterUserDeletion = parseFloat(course1HowEasyAfterUserDeletion.toFixed(2));

        expect(courseFromApi1AfterUserDeletion.reviews.length).toBe(2);
        expect(courseFromApi1AfterUserDeletion.howInterestingRatingAverage).toBe(course1HowInteresingAfterUserDeletion);
        expect(courseFromApi1AfterUserDeletion.howEasyRatingAverage).toBe(course1HowEasyAfterUserDeletion);

        const courseFromApi2AfterUserDeletion = await getCourseById(createdCourse2.id);

        let course2HowInteresingAfterUserDeletion = (user_2_course_2_review.howInterestingRating + user_3_course_2_review.howInterestingRating) / 2;
        course2HowInteresingAfterUserDeletion = parseFloat(course2HowInteresingAfterUserDeletion.toFixed(2));
        let course2HowEasyAfterUserDeletion = (user_2_course_2_review.howEasyRating + user_3_course_2_review.howEasyRating) / 2;
        course2HowEasyAfterUserDeletion = parseFloat(course2HowEasyAfterUserDeletion.toFixed(2));

        expect(courseFromApi2AfterUserDeletion.reviews.length).toBe(2);
        expect(courseFromApi2AfterUserDeletion.howInterestingRatingAverage).toBe(course2HowInteresingAfterUserDeletion);
        expect(courseFromApi2AfterUserDeletion.howEasyRatingAverage).toBe(course2HowEasyAfterUserDeletion);

        const courseFromApi3AfterUserDeletion = await getCourseById(createdCourse3.id);

        expect(courseFromApi3AfterUserDeletion.reviews.length).toBe(1);
        expect(courseFromApi3AfterUserDeletion.howInterestingRatingAverage).toBe(user_2_course_3_review.howInterestingRating);
        expect(courseFromApi3AfterUserDeletion.howEasyRatingAverage).toBe(user_2_course_3_review.howEasyRating);
    }, 10000);
});