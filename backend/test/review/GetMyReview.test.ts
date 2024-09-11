import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { courseUrl } from '@tum-rating/backend/test/utils/api-client/course';
import { createCourseMockRequest } from '@tum-rating/backend/test/utils/api-client/course';
import { addReviewMockRequest } from '@tum-rating/backend/test/utils/api-client/review';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Get Review', () => {
    it('should get review', async () => {
        const signInResponse = await signInRequestMock();
        const signInAdminResponse = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(signInAdminResponse.token);

        const reviewUser = await addReviewMockRequest(signInResponse.token, createdCourse.id, signInResponse.user.id);

        return supertest(`${courseUrl}/${createdCourse.id}/user/me`)
            .get('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toBeDefined();
                expect(response.body.userId).toEqual(signInResponse.user.id);
                expect(response.body.courseId).toEqual(createdCourse.id);
                expect(response.body.howEasyRating).toEqual(reviewUser.howEasyRating);
                expect(response.body.howInterestingRating).toEqual(reviewUser.howInterestingRating);
                expect(response.body.semester).toEqual(reviewUser.semester);
                expect(response.body.userName).toEqual(signInResponse.user.username);
            });
    });

    it('should return 401 if no auth token provided', async () => {
        const signInResponse = await signInRequestMock();
        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseMockRequest(signInAdminResponse.token);

        await addReviewMockRequest(signInResponse.token, createdReview.id, signInResponse.user.id);

        return supertest(`${courseUrl}/${createdReview.id}/user/me`).get('/').expect(401);
    });

    it('should return 404 if no user review', async () => {
        const signInResponse = await signInRequestMock();
        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseMockRequest(signInAdminResponse.token);

        return supertest(`${courseUrl}/${createdReview.id}/user/me`)
            .get('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(404);
    });
});
