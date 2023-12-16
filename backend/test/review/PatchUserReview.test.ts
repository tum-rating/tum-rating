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

describe('Patch User Review', () => {
    it('should patch single user review', async () => {
        const signInResponse = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInAdminResponse.token);

        let requestBody: AddUserReviewRequestDto = {
            howInterestingRating: 1,
            howEasyRating: 5,
            comment: faker.word.words(),
            semester: createdReview.offeredInSemesters[0],
        };

        await supertest(`${reviewUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(201);

        await supertest(reviewUrl)
            .get('/' + createdReview.id)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('reviews');
                expect(response.body.reviews.length == 1).toBe(true);
                expect(response.body.reviews.find((review) => review.userId === signInResponse.user.id)).toBeDefined();
                expect(response.body.howInterestingRatingAverage).toEqual(requestBody.howInterestingRating);
                expect(response.body.howEasyRatingAverage).toEqual(requestBody.howEasyRating);
            });

        requestBody.comment = 'put comment';
        requestBody.howInterestingRating = 5;
        requestBody.howEasyRating = 2;

        await supertest(`${reviewUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .patch('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(200);

        return supertest(reviewUrl)
            .get('/' + createdReview.id)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('reviews');
                expect(response.body.reviews.length == 1).toBe(true);
                expect(response.body.reviews.find((review) => review.userId === signInResponse.user.id)).toBeDefined();
                expect(response.body.howInterestingRatingAverage).toEqual(requestBody.howInterestingRating);
                expect(response.body.howEasyRatingAverage).toEqual(requestBody.howEasyRating);
            });
    });

    it('should fail if user review does not exist', async () => {
        const signInResponse = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInAdminResponse.token);

        const requestBody: AddUserReviewRequestDto = {
            howInterestingRating: 2.3,
            howEasyRating: 1.7,
            comment: faker.word.words(),
            semester: createdReview.offeredInSemesters[0],
        };

        return supertest(`${reviewUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .patch('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(404);
    });

    it('should fail if user review semester is not matching review one', async () => {
        const signInResponse = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInAdminResponse.token);

        const requestBody: AddUserReviewRequestDto = {
            howInterestingRating: 1.3,
            howEasyRating: 4.9,
            comment: faker.word.words(),
            semester: createdReview.offeredInSemesters[0],
        };

        await supertest(`${reviewUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(201);

        requestBody.semester = 'not matching';

        return supertest(`${reviewUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .patch('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(400);
    });

    it('should correctly update ratings after put user reviews', async () => {
        const signInResponse = await signInRequestMock();
        const signInResponse2 = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInAdminResponse.token);

        await addUserReviewMockRequest(signInResponse.token, createdReview.id, signInResponse.user.id, {
            howInterestingRating: 5,
            howEasyRating: 5,
            semester: createdReview.offeredInSemesters[0],
        });

        await addUserReviewMockRequest(signInResponse2.token, createdReview.id, signInResponse2.user.id, {
            howInterestingRating: 3,
            howEasyRating: 3,
            semester: createdReview.offeredInSemesters[0],
        });

        await supertest(reviewUrl + '/' + createdReview.id)
            .get('/')
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('_id');
                expect(response.body).toHaveProperty('reviews');
                expect(response.body.reviews.length).toBe(2);
                expect(response.body.howInterestingRatingAverage).toBe(4);
                expect(response.body.howEasyRatingAverage).toBe(4);
                expect(response.body.votesNumber).toBe(2);
            });

        const putRequestBody: AddUserReviewRequestDto = {
            howInterestingRating: 2,
            howEasyRating: 2,
            comment: faker.word.words(),
            semester: createdReview.offeredInSemesters[0],
        };

        await supertest(`${reviewUrl}/${createdReview.id}/user/${signInResponse2.user.id}`)
            .patch('/')
            .set('Authorization', 'Bearer ' + signInResponse2.token)
            .send(putRequestBody)
            .expect(200);

        return supertest(reviewUrl + '/' + createdReview.id)
            .get('/')
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('_id');
                expect(response.body).toHaveProperty('reviews');
                expect(response.body.reviews.length).toBe(2);
                expect(response.body.howInterestingRatingAverage).toBe(3.5);
                expect(response.body.howEasyRatingAverage).toBe(3.5);
                expect(response.body.votesNumber).toBe(2);
                expect(response.body.reviews.find((review) => review.userId === signInResponse2.user.id)).toBeDefined();
            });
    }, 10000);
});
