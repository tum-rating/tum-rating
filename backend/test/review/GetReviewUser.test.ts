import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { reviewUrl } from '@tum-rating/backend/test/utils/api-client/review';
import { createCourseReviewMockRequest, addUserReviewMockRequest } from '@tum-rating/backend/test/utils/api-client/review';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Get Review User', () => {
    it('should get review user', async () => {
        const signInResponse = await signInRequestMock();
        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInAdminResponse.token);

        const reviewUser = await addUserReviewMockRequest(signInResponse.token, createdReview.id, signInResponse.user.id);

        return supertest(`${reviewUrl}/${createdReview.id}/user/me`)
            .get('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toBeDefined();
                expect(response.body.userId).toEqual(signInResponse.user.id);
                expect(response.body.reviewId).toEqual(createdReview.id);
                expect(response.body.howEasyRating).toEqual(reviewUser.userReview.howEasyRating);
                expect(response.body.howInterestingRating).toEqual(reviewUser.userReview.howInterestingRating);
                expect(response.body.semester).toEqual(reviewUser.userReview.semester);
                expect(response.body.userName).toEqual(signInResponse.user.username);
            });
    });

    it('should return 401 if no auth token provided', async () => {
        const signInResponse = await signInRequestMock();
        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInAdminResponse.token);

        await addUserReviewMockRequest(signInResponse.token, createdReview.id, signInResponse.user.id);

        return supertest(`${reviewUrl}/${createdReview.id}/user/me`).get('/').expect(401);
    });

    it('should return 404 if no user review', async () => {
        const signInResponse = await signInRequestMock();
        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInAdminResponse.token);

        return supertest(`${reviewUrl}/${createdReview.id}/user/me`)
            .get('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(404);
    });
});
