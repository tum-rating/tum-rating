import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { connectMongo, signInRequestMock, signInAdminRequestMock, updateReview } from '@tum-rating/backend/test/utils';
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

describe('Patch Review', () => {
    it('should patch single user review', async () => {
        const signInResponse = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseMockRequest(signInAdminResponse.token);

        let requestBody: AddReviewRequestDto = {
            howInterestingRating: 1,
            howEasyRating: 5,
            comment: faker.word.words(),
            semester: createdReview.offeredInSemesters[0],
        };

        await supertest(`${courseUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(201);

        await supertest(courseUrl)
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

        await supertest(`${courseUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .patch('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(200);

        return supertest(courseUrl)
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

    it('should fail if review does not exist', async () => {
        const signInResponse = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseMockRequest(signInAdminResponse.token);

        const requestBody: AddReviewRequestDto = {
            howInterestingRating: 2.3,
            howEasyRating: 1.7,
            comment: faker.word.words(),
            semester: createdReview.offeredInSemesters[0],
        };

        return supertest(`${courseUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .patch('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(404);
    });

    it('should fail if user review semester is not matching review one', async () => {
        const signInResponse = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseMockRequest(signInAdminResponse.token);

        const requestBody: AddReviewRequestDto = {
            howInterestingRating: 1.3,
            howEasyRating: 4.9,
            comment: faker.word.words(),
            semester: createdReview.offeredInSemesters[0],
        };

        await supertest(`${courseUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(201);

        requestBody.semester = 'not matching';

        return supertest(`${courseUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .patch('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(400);
    });

    it('should correctly update ratings after put user reviews', async () => {
        const signInResponse = await signInRequestMock();
        const signInResponse2 = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdReview = await createCourseMockRequest(signInAdminResponse.token);

        await addReviewMockRequest(signInResponse.token, createdReview.id, signInResponse.user.id, {
            howInterestingRating: 5,
            howEasyRating: 5,
            semester: createdReview.offeredInSemesters[0],
        });

        await addReviewMockRequest(signInResponse2.token, createdReview.id, signInResponse2.user.id, {
            howInterestingRating: 3,
            howEasyRating: 3,
            semester: createdReview.offeredInSemesters[0],
        });

        await supertest(courseUrl + '/' + createdReview.id)
            .get('/')
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('id');
                expect(response.body).toHaveProperty('reviews');
                expect(response.body.reviews.length).toBe(2);
                expect(response.body.howInterestingRatingAverage).toBe(4);
                expect(response.body.howEasyRatingAverage).toBe(4);
                expect(response.body.votesNumber).toBe(2);
            });

        const putRequestBody: AddReviewRequestDto = {
            howInterestingRating: 2,
            howEasyRating: 2,
            comment: faker.word.words(),
            semester: createdReview.offeredInSemesters[0],
        };

        await supertest(`${courseUrl}/${createdReview.id}/user/${signInResponse2.user.id}`)
            .patch('/')
            .set('Authorization', 'Bearer ' + signInResponse2.token)
            .send(putRequestBody)
            .expect(200);

        return supertest(courseUrl + '/' + createdReview.id)
            .get('/')
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('id');
                expect(response.body).toHaveProperty('reviews');
                expect(response.body.reviews.length).toBe(2);
                expect(response.body.howInterestingRatingAverage).toBe(3.5);
                expect(response.body.howEasyRatingAverage).toBe(3.5);
                expect(response.body.votesNumber).toBe(2);
                expect(response.body.reviews.find((review) => review.userId === signInResponse2.user.id)).toBeDefined();
            });
    }, 10000);

    it('should not allow user to modify isHidden review property', async () => {
        const signInResponse = await signInRequestMock();

        const signInAdminResponse = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(signInAdminResponse.token);

        let requestBody: AddReviewRequestDto = {
            howInterestingRating: 1,
            howEasyRating: 5,
            comment: faker.word.words(),
            semester: createdCourse.offeredInSemesters[0],
        };

        await supertest(`${courseUrl}/${createdCourse.id}/user/${signInResponse.user.id}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(201);

        const response = await supertest(courseUrl)
            .get('/' + createdCourse.id)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('reviews');
                expect(response.body.reviews.length == 1).toBe(true);
                expect(response.body.reviews.find((review) => review.userId === signInResponse.user.id)).toBeDefined();
                expect(response.body.howInterestingRatingAverage).toEqual(requestBody.howInterestingRating);
                expect(response.body.howEasyRatingAverage).toEqual(requestBody.howEasyRating);
            });

        const createdReviewId = response.body.reviews[0].id;

        const result = await updateReview(createdReviewId, { isHidden: true });

        await supertest(courseUrl)
            .get('/' + createdCourse.id)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('reviews');
                expect(response.body.reviews.length == 0).toBe(true);
            });

        await supertest(`${courseUrl}/${createdCourse.id}/user/${signInResponse.user.id}`)
            .patch('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send({
                isHidden: false,
                comment: faker.word.words(),
            })
            .expect(400);

        await supertest(courseUrl)
            .get('/' + createdCourse.id)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('reviews');
                expect(response.body.reviews.length == 0).toBe(true);
            });
    });
});
