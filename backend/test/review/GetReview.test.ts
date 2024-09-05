import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { courseUrl } from '@tum-rating/backend/test/utils/api-client/course';
import { reviewUrl } from '@tum-rating/backend/test/utils/api-client/review';
import { createCourseMockRequest } from '@tum-rating/backend/test/utils/api-client/course';
import { addReviewMockRequest } from '@tum-rating/backend/test/utils/api-client/review';
import { AddReviewRequestDto } from '@tum-rating/backend/src/modules/course/dto/AddReviewRequest.dto';
import { GetReviewResponseDto } from '@tum-rating/backend/src/modules/review/dto/GetReviewRequest.dto';
import { SignInRequestMockResponse } from '@tum-rating/backend/test/utils';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Get Review', () => {
    it('should get reviews by user id', async () => {
        const signInResponse = await signInRequestMock();
        const signInAdminResponse = await signInAdminRequestMock();

        const courses = [];

        for (let i = 0; i < 5; i++) {
            courses.push(await createCourseMockRequest(signInAdminResponse.token));
        }

        const reviews: WithId<AddReviewRequestDto>[] = [];

        for (let i = 0; i < 5; i++) {
            const reviewUser = await addReviewMockRequest(signInResponse.token, courses[i].id, signInResponse.user.id);
            reviews.push(reviewUser);
        }

        await supertest(reviewUrl)
            .get(`/?user-id=${signInResponse.user.id}`)
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toBeDefined();
                expect(response.body.results).toBeDefined();
                expect(response.body.results.length).toEqual(5);

                const results = response.body.results as GetReviewResponseDto[];

                for (let i = 0; i < results.length; i++) {
                    expect(results[i].userId).toEqual(signInResponse.user.id);
                    expect(results[i].courseId).toEqual(courses[i].id);
                    expect(results[i].howEasyRating).toEqual(reviews[i].howEasyRating);
                    expect(results[i].howInterestingRating).toEqual(reviews[i].howInterestingRating);
                    expect(results[i].semester).toEqual(reviews[i].semester);
                    expect(results[i].userName).toEqual(signInResponse.user.username);
                    expect(results[i].comment).toEqual(reviews[i].comment);
                }

                expect(response.body.nextPageNumber).toBe(null);
            });
    });

    it('should get reviews by course id', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const course = await createCourseMockRequest(signInAdminResponse.token);

        const users: SignInRequestMockResponse[] = [];

        for (let i = 0; i < 5; i++) {
            users.push(await signInRequestMock());
        }

        const reviews: WithId<AddReviewRequestDto>[] = [];

        for (let i = 0; i < 5; i++) {
            const reviewUser = await addReviewMockRequest(users[i].token, course.id, users[i].user.id);
            reviews.push(reviewUser);
        }

        await supertest(reviewUrl)
            .get(`/?course-id=${course.id}`)
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toBeDefined();
                expect(response.body.results).toBeDefined();
                expect(response.body.results.length).toEqual(5);

                const results = response.body.results as GetReviewResponseDto[];

                for (let i = 0; i < results.length; i++) {
                    expect(results[i].userId).toEqual(users[i].user.id);
                    expect(results[i].courseId).toEqual(course.id);
                    expect(results[i].howEasyRating).toEqual(reviews[i].howEasyRating);
                    expect(results[i].howInterestingRating).toEqual(reviews[i].howInterestingRating);
                    expect(results[i].semester).toEqual(reviews[i].semester);
                    expect(results[i].userName).toEqual(users[i].user.username);
                    expect(results[i].comment).toEqual(reviews[i].comment);
                }

                expect(response.body.nextPageNumber).toBe(null);
            });
    });

    it('should return empty list if no reviews found for user', async () => {
        const signInResponse = await signInRequestMock();
        const signInAdminResponse = await signInAdminRequestMock();

        return supertest(reviewUrl)
            .get('/?user-id=' + signInResponse.user.id)
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toBeDefined();
                expect(response.body.results).toBeDefined();
                expect(response.body.results.length).toEqual(0);
                expect(response.body.nextPageNumber).toBe(null);
            });
    });

    it('should return empty list if no reviews found for course', async () => {
        const signInResponse = await signInRequestMock();
        const signInAdminResponse = await signInAdminRequestMock();

        const course = await createCourseMockRequest(signInAdminResponse.token);

        return supertest(reviewUrl)
            .get('/?course-id=' + course.id)
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toBeDefined();
                expect(response.body.results).toBeDefined();
                expect(response.body.results.length).toEqual(0);
                expect(response.body.nextPageNumber).toBe(null);
            });
    });

    it('should return 401 if no auth token provided', async () => {
        return supertest(reviewUrl).get('/').expect(401);
    });

    it('should return 403 if not admin token provided', async () => {
        const signInResponse = await signInRequestMock();

        return supertest(reviewUrl)
            .get('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(403);
    });
});
