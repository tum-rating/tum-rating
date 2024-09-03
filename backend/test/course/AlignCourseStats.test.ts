import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { MONGO_ZERO_ID } from '@tum-rating/backend/src/utils/const';

import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { addReviewMockRequest, courseUrl, getCourseById } from '@tum-rating/backend/test/utils/api-client/course';
import { createCourseMockRequest } from '@tum-rating/backend/test/utils/api-client/course';
import { updateCourse } from '@tum-rating/backend/test/utils/db-client/course';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Align Course Course', () => {
    it('should align course stats', async () => {
        const signInResponse = await signInRequestMock();
        const signInResponse2 = await signInRequestMock();
        const signInResponse3 = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(signInAdminResponse.token);

        const review1 = await addReviewMockRequest(signInResponse.token, createdCourse.id, signInResponse.user.id);
        const review2 = await addReviewMockRequest(signInResponse2.token, createdCourse.id, signInResponse2.user.id);
        const review3 = await addReviewMockRequest(signInResponse3.token, createdCourse.id, signInResponse3.user.id);

        let howInterestingRating = (review1.howInterestingRating + review2.howInterestingRating + review3.howInterestingRating) / 3;
        howInterestingRating = parseFloat(howInterestingRating.toFixed(2));
        let howEasyRating = (review1.howEasyRating + review2.howEasyRating + review3.howEasyRating) / 3;
        howEasyRating = parseFloat(howEasyRating.toFixed(2));

        const apiRetrievedCourse = await getCourseById(createdCourse.id);

        expect(apiRetrievedCourse.reviews.length).toEqual(3);
        expect(apiRetrievedCourse.howEasyRatingAverage).toEqual(howEasyRating);
        expect(apiRetrievedCourse.howInterestingRatingAverage).toEqual(howInterestingRating);

        const modifiedHowInterestingRating = 4.77;
        const modifiedHowEasyRating = 1.24;
        const modifiedReviewCount = 109;

        await updateCourse(createdCourse.id, {
            howInterestingRatingAverage: modifiedHowInterestingRating,
            howEasyRatingAverage: modifiedHowEasyRating,
            votesNumber: modifiedReviewCount,
        });

        const apiRetrievedCourse2 = await getCourseById(createdCourse.id);

        expect(apiRetrievedCourse2.howEasyRatingAverage).toEqual(modifiedHowEasyRating);
        expect(apiRetrievedCourse2.howInterestingRatingAverage).toEqual(modifiedHowInterestingRating);
        expect(apiRetrievedCourse2.votesNumber).toEqual(modifiedReviewCount);

        await supertest(courseUrl)
            .patch(`/${createdCourse.id}/align-stats`)
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(200);

        const apiRetrievedCourse3 = await getCourseById(createdCourse.id);

        expect(apiRetrievedCourse3.howEasyRatingAverage).toEqual(howEasyRating);
        expect(apiRetrievedCourse3.howInterestingRatingAverage).toEqual(howInterestingRating);
        expect(apiRetrievedCourse3.votesNumber).toEqual(3);
    });

    it('should fail with user token auth', async () => {
        const signInResponse = await signInRequestMock();
        const signInAdminResponse = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(signInAdminResponse.token);

        return supertest(courseUrl)
            .patch(`/${createdCourse.id}/align-stats`)
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(403);
    });

    it('should fail without token auth', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(signInAdminResponse.token);

        return supertest(courseUrl)
            .patch(`/${createdCourse.id}/align-stats`)
            .expect(401);
    });

    it('should fail with 404 if course not found', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        return supertest(courseUrl)
            .patch(`/` + MONGO_ZERO_ID + '/align-stats')
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(404);
    });
});
