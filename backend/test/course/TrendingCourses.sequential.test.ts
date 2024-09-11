import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { GetCourseWithoutReviewResponseDto } from '@tum-rating/backend/src/modules/course/dto/GetCourseRequest.dto';
import { PaginatedResults } from '@tum-rating/backend/src/utils/api/pagination';

import { connectMongo, signInRequestMock, signInAdminRequestMock, SignInRequestMockResponse } from '@tum-rating/backend/test/utils';
import { courseUrl } from '@tum-rating/backend/test/utils/api-client/course';
import { addReviewMockRequest } from '@tum-rating/backend/test/utils/api-client/review';
import { createCourseMockRequest } from '@tum-rating/backend/test/utils/api-client/course';
import { dropAllCourses } from '@tum-rating/backend/test/utils/db-client/course';
import { dropAllReviews } from '@tum-rating/backend/test/utils';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

const trendingCoursesUrl = courseUrl + '/trending';

describe('Trending Courses', () => {
    const numberOfUsers = 10;
    const users: SignInRequestMockResponse[]  = [];
    let admin: SignInRequestMockResponse;

    beforeAll(async () => {
        for (let i = 0; i < numberOfUsers; i++) {
            const signInResponse = await signInRequestMock();
            users.push(signInResponse);
        }

        admin = await signInAdminRequestMock();
    });

    beforeEach(async () => {
        await dropAllReviews();
        await dropAllCourses();
    });

    it('should get courses sorted by number of reviews', async () => {
        const numberOfCourses = 5;
        const courses = [];

        for (let i = 0; i < numberOfCourses; i++) {
            const createdCourse = await createCourseMockRequest(admin.token);

            courses.push(createdCourse);

            for (let j = 0; j < numberOfUsers - i; j++) {
                const user = users[j];
                await addReviewMockRequest(user.token, createdCourse.id, user.user.id);
            }
        }

        await supertest(trendingCoursesUrl)
            .post('/')
            .set('Authorization', 'Bearer ' + admin.token)
            .expect(201);

        return supertest(trendingCoursesUrl)
            .get('/?page-size=5')
            .expect(200)
            .expect((response: supertest.Response) => {
                const trendingCoursesResponse = response.body as PaginatedResults<GetCourseWithoutReviewResponseDto>;
                expect(trendingCoursesResponse.results).toHaveLength(5);
                expect(trendingCoursesResponse.nextPageNumber).toBeNull();

                const results = trendingCoursesResponse.results;

                expect(results[0].id).toBe(courses[0].id);
                expect(results[0].votesNumber).toBe(10);

                expect(results[1].id).toBe(courses[1].id);
                expect(results[1].votesNumber).toBe(9);

                expect(results[2].id).toBe(courses[2].id);
                expect(results[2].votesNumber).toBe(8);

                expect(results[3].id).toBe(courses[3].id);
                expect(results[3].votesNumber).toBe(7);

                expect(results[4].id).toBe(courses[4].id);
                expect(results[4].votesNumber).toBe(6);
            });
    });

    it('should get reset trending courses cache', async () => {
        const numberOfCourses = 5;
        const courses = [];

        for (let i = 0; i < numberOfCourses; i++) {
            const createdCourse = await createCourseMockRequest(admin.token);

            courses.push(createdCourse);

            for (let j = 0; j < numberOfUsers - i - 1; j++) {
                const user = users[j];
                await addReviewMockRequest(user.token, createdCourse.id, user.user.id);
            }
        }

        await supertest(trendingCoursesUrl)
            .post('/')
            .set('Authorization', 'Bearer ' + admin.token)
            .expect(201);

        await supertest(trendingCoursesUrl)
            .get('/?page-size=5')
            .expect(200)
            .expect((response: supertest.Response) => {
                const trendingCoursesResponse = response.body as PaginatedResults<GetCourseWithoutReviewResponseDto>;
                expect(trendingCoursesResponse.results).toHaveLength(5);
                expect(trendingCoursesResponse.nextPageNumber).toBeNull();

                const results = trendingCoursesResponse.results;

                expect(results[0].id).toBe(courses[0].id);
                expect(results[0].votesNumber).toBe(9);

                expect(results[1].id).toBe(courses[1].id);
                expect(results[1].votesNumber).toBe(8);

                expect(results[2].id).toBe(courses[2].id);
                expect(results[2].votesNumber).toBe(7);

                expect(results[3].id).toBe(courses[3].id);
                expect(results[3].votesNumber).toBe(6);

                expect(results[4].id).toBe(courses[4].id);
                expect(results[4].votesNumber).toBe(5);
            });

        const createdCourse = await createCourseMockRequest(admin.token);

        courses.push(createdCourse);

        for (let j = 0; j < numberOfUsers; j++) {
            const user = users[j];
            await addReviewMockRequest(user.token, createdCourse.id, user.user.id);
        }

        await supertest(trendingCoursesUrl)
            .get('/?page-size=5')
            .expect(200)
            .expect((response: supertest.Response) => {
                const trendingCoursesResponse = response.body as PaginatedResults<GetCourseWithoutReviewResponseDto>;
                expect(trendingCoursesResponse.results).toHaveLength(5);
                expect(trendingCoursesResponse.nextPageNumber).toBeNull();

                const results = trendingCoursesResponse.results;

                expect(results[0].id).toBe(courses[0].id);
                expect(results[0].votesNumber).toBe(9);

                expect(results[1].id).toBe(courses[1].id);
                expect(results[1].votesNumber).toBe(8);

                expect(results[2].id).toBe(courses[2].id);
                expect(results[2].votesNumber).toBe(7);

                expect(results[3].id).toBe(courses[3].id);
                expect(results[3].votesNumber).toBe(6);

                expect(results[4].id).toBe(courses[4].id);
                expect(results[4].votesNumber).toBe(5);
            });

        await supertest(trendingCoursesUrl)
            .post('/')
            .set('Authorization', 'Bearer ' + admin.token)
            .expect(201);

        await supertest(trendingCoursesUrl)
            .get('/?page-size=5')
            .expect(200)
            .expect((response: supertest.Response) => {
                const trendingCoursesResponse = response.body as PaginatedResults<GetCourseWithoutReviewResponseDto>;
                expect(trendingCoursesResponse.results).toHaveLength(5);
                expect(trendingCoursesResponse.nextPageNumber).toBeNull();

                const results = trendingCoursesResponse.results;

                expect(results[0].id).toBe(createdCourse.id);
                expect(results[0].votesNumber).toBe(10);

                expect(results[1].id).toBe(courses[0].id);
                expect(results[1].votesNumber).toBe(9);

                expect(results[2].id).toBe(courses[1].id);
                expect(results[2].votesNumber).toBe(8);

                expect(results[3].id).toBe(courses[2].id);
                expect(results[3].votesNumber).toBe(7);

                expect(results[4].id).toBe(courses[3].id);
                expect(results[4].votesNumber).toBe(6);
            });
    });

    it('should get same trending from admin cache reset endpoint', async () => {
        const numberOfCourses = 5;
        const courses = [];

        for (let i = 0; i < numberOfCourses; i++) {
            const createdCourse = await createCourseMockRequest(admin.token);

            courses.push(createdCourse);

            for (let j = 0; j < numberOfUsers - i; j++) {
                const user = users[j];
                await addReviewMockRequest(user.token, createdCourse.id, user.user.id);
            }
        }

        await supertest(trendingCoursesUrl)
            .post('/')
            .set('Authorization', 'Bearer ' + admin.token)
            .expect(201)
            .expect((response: supertest.Response) => {
                const trendingCoursesResponse = response.body as PaginatedResults<GetCourseWithoutReviewResponseDto>;
                expect(trendingCoursesResponse).toHaveLength(5);

                expect(trendingCoursesResponse[0].id).toBe(courses[0].id);
                expect(trendingCoursesResponse[0].votesNumber).toBe(10);

                expect(trendingCoursesResponse[1].id).toBe(courses[1].id);
                expect(trendingCoursesResponse[1].votesNumber).toBe(9);

                expect(trendingCoursesResponse[2].id).toBe(courses[2].id);
                expect(trendingCoursesResponse[2].votesNumber).toBe(8);

                expect(trendingCoursesResponse[3].id).toBe(courses[3].id);
                expect(trendingCoursesResponse[3].votesNumber).toBe(7);

                expect(trendingCoursesResponse[4].id).toBe(courses[4].id);
                expect(trendingCoursesResponse[4].votesNumber).toBe(6);
            });

        return supertest(trendingCoursesUrl)
            .get('/?page-size=5')
            .expect(200)
            .expect((response: supertest.Response) => {
                const trendingCoursesResponse = response.body as PaginatedResults<GetCourseWithoutReviewResponseDto>;
                expect(trendingCoursesResponse.results).toHaveLength(5);
                expect(trendingCoursesResponse.nextPageNumber).toBeNull();

                const results = trendingCoursesResponse.results;

                expect(results[0].id).toBe(courses[0].id);
                expect(results[0].votesNumber).toBe(10);

                expect(results[1].id).toBe(courses[1].id);
                expect(results[1].votesNumber).toBe(9);

                expect(results[2].id).toBe(courses[2].id);
                expect(results[2].votesNumber).toBe(8);

                expect(results[3].id).toBe(courses[3].id);
                expect(results[3].votesNumber).toBe(7);

                expect(results[4].id).toBe(courses[4].id);
                expect(results[4].votesNumber).toBe(6);
            });
    });

    it('should fail if cache reset endpoint is not called with admin token', async () => {
        await supertest(trendingCoursesUrl)
            .post('/')
            .set('Authorization', 'Bearer ' + users[0].token)
            .expect(403);
    });

    it('should fail if cache reset endpoint is not called with token', async () => {
        await supertest(trendingCoursesUrl)
            .post('/')
            .expect(401);
    });
});
