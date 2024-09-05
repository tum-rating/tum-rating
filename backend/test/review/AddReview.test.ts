import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { courseUrl } from '@tum-rating/backend/test/utils/api-client/course';
import { addReviewMockRequest } from '@tum-rating/backend/test/utils/api-client/review';
import { createCourseMockRequest } from '@tum-rating/backend/test/utils/api-client/course';
import { AddReviewRequestDto } from '@tum-rating/backend/src/modules/course/dto/AddReviewRequest.dto';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Add Review', () => {
    it('should add review', async () => {
        const signInResponse = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseMockRequest(signInAdminResponse.token);

        const requestBody: AddReviewRequestDto = {
            howInterestingRating: 3,
            howEasyRating: 4,
            comment: faker.word.words(),
            semester: createdReview.offeredInSemesters[0],
        };

        return supertest(`${courseUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(201);
    });

    it('should fail if user review is already present', async () => {
        const signInResponse = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseMockRequest(signInAdminResponse.token);

        const requestBody: AddReviewRequestDto = {
            howInterestingRating: 3,
            howEasyRating: 4,
            comment: faker.word.words(),
            semester: createdReview.offeredInSemesters[0],
        };

        await supertest(`${courseUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(201);

        return supertest(`${courseUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(409);
    });

    it('should fail if user review semester is not matching review one', async () => {
        const signInResponse = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseMockRequest(signInAdminResponse.token);

        const requestBody: AddReviewRequestDto = {
            howInterestingRating: 3,
            howEasyRating: 4,
            comment: faker.word.words(),
            semester: 'not matching',
        };

        return supertest(`${courseUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(400);
    });

    it('should correctly update ratings after added user reviews', async () => {
        const signInResponse = await signInRequestMock();
        const signInResponse2 = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseMockRequest(signInAdminResponse.token);

        await addReviewMockRequest(signInResponse.token, createdReview.id, signInResponse.user.id, {
            howInterestingRating: 3,
            howEasyRating: 4,
        });

        await addReviewMockRequest(signInResponse2.token, createdReview.id, signInResponse2.user.id, {
            howInterestingRating: 2,
            howEasyRating: 5,
        });

        return supertest(courseUrl + '/' + createdReview.id)
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

    it('should correctly update ratings after added user reviews - precision', async () => {
        const signInResponse = await signInRequestMock();
        const signInResponse2 = await signInRequestMock();
        const signInResponse3 = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseMockRequest(signInAdminResponse.token);

        await addReviewMockRequest(signInResponse.token, createdReview.id, signInResponse.user.id, {
            howInterestingRating: 3,
            howEasyRating: 2,
        });

        await addReviewMockRequest(signInResponse2.token, createdReview.id, signInResponse2.user.id, {
            howInterestingRating: 2,
            howEasyRating: 3,
        });

        await addReviewMockRequest(signInResponse3.token, createdReview.id, signInResponse3.user.id, {
            howInterestingRating: 5,
            howEasyRating: 5,
        });

        return supertest(courseUrl + '/' + createdReview.id)
            .get('/')
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('_id');
                expect(response.body).toHaveProperty('reviews');
                expect(response.body.reviews.length).toBe(3);
                expect(response.body.howInterestingRatingAverage).toBe(3.33);
                expect(response.body.howEasyRatingAverage).toBe(3.33);
                expect(response.body.votesNumber).toBe(3);
            });
    }, 10000);
});
