import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { addUserReviewMockRequest, reviewUrl } from '@tum-rating/backend/test/utils/api-client/review';
import { createCourseReviewMockRequest } from '@tum-rating/backend/test/utils/api-client/review';
import { AddUserReviewRequestDto } from 'src/modules/review/dto/AddUserReviewRequest.dto';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Add User Review', () => {
    it('should add user review', async () => {
        const signInResponse = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInAdminResponse.token);

        const requestBody: AddUserReviewRequestDto = {
            howInterestingRating: 3,
            howEasyRating: 4,
            comment: faker.word.words(),
            semester: createdReview.offeredInSemesters[0],
        };

        return supertest(`${reviewUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(201);
    });

    it('should fail if user review is already present', async () => {
        const signInResponse = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInAdminResponse.token);

        const requestBody: AddUserReviewRequestDto = {
            howInterestingRating: 3,
            howEasyRating: 4,
            comment: faker.word.words(),
            semester: createdReview.offeredInSemesters[0],
        };

        await supertest(`${reviewUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(201);

        return supertest(`${reviewUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(409);
    });

    it('should fail if user review is already present', async () => {
        const signInResponse = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInAdminResponse.token);

        const requestBody: AddUserReviewRequestDto = {
            howInterestingRating: 3,
            howEasyRating: 4,
            comment: faker.word.words(),
            semester: createdReview.offeredInSemesters[0],
        };

        await supertest(`${reviewUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(201);

        return supertest(`${reviewUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(409);
    });

    it('should fail if user review semester is not matching review one', async () => {
        const signInResponse = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInAdminResponse.token);

        const requestBody: AddUserReviewRequestDto = {
            howInterestingRating: 3,
            howEasyRating: 4,
            comment: faker.word.words(),
            semester: 'not matching',
        };

        return supertest(`${reviewUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(400);
    });

    it('should correctly update ratings after added user reviews', async () => {
        const signInResponse = await signInRequestMock();
        const signInResponse2 = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInAdminResponse.token);

        await addUserReviewMockRequest(signInResponse.token, createdReview.id, signInResponse.user.id, {
            howInterestingRating: 3,
            howEasyRating: 4,
        });

        await addUserReviewMockRequest(signInResponse2.token, createdReview.id, signInResponse2.user.id, {
            howInterestingRating: 2,
            howEasyRating: 5,
        });

        return supertest(reviewUrl + '/' + createdReview.id)
            .get('/')
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('_id');
                expect(response.body).toHaveProperty('reviews');
                expect(response.body.reviews.length).toBe(2);
                expect(response.body.howInterestingRatingAverage).toBe(2.5);
                expect(response.body.howEasyRatingAverage).toBe(4.5);
                expect(response.body.votesNumber).toBe(2);
            });
    }, 10000);
});
