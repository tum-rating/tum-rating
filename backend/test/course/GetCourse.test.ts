import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { courseUrl } from '@tum-rating/backend/test/utils/api-client/course';
import { createCourseMockRequest } from '@tum-rating/backend/test/utils/api-client/course';
import { deleteCoursesWithName } from '@tum-rating/backend/test/utils/db-client/course';
import { MONGO_ZERO_ID } from '@tum-rating/backend/src/utils/const';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Get Course', () => {
    it('should get course', async () => {
        const signInResponse = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(signInResponse.token);

        return supertest(courseUrl)
            .get('/')
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('courses');
                expect(response.body.courses.length >= 1).toBe(true);
            });
    });

    it('should get course by id', async () => {
        const signInResponse = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(signInResponse.token);

        return supertest(courseUrl)
            .get('/' + createdCourse.id)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body._id).toEqual(createdCourse.id);
                expect(response.body.courseId).toEqual(createdCourse.courseId);
                expect(response.body.name).toEqual(createdCourse.name);
                expect(response.body.professor).toEqual(createdCourse.professor);
                expect(response.body.courseNumber).toEqual(createdCourse.courseNumber);
                expect(response.body.reviews).toBeDefined();
            });
    });

    it('get course by if should return 404 if course not found', async () => {
        return supertest(courseUrl)
            .get('/' + MONGO_ZERO_ID)
            .expect(404);
    });

    it('should search course by its title', async () => {
        const signInResponse = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(signInResponse.token, {
            name: faker.string.uuid(),
        });

        return supertest(courseUrl)
            .get('?search=' + createdCourse.name)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('courses');
                expect(response.body.courses.length == 1).toBe(true);
                expect(response.body.courses.find((course) => course._id === createdCourse.id)).toBeDefined();
            });
    });

    it('should search course by its title part', async () => {
        const signInResponse = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(signInResponse.token, {
            name: faker.string.uuid(),
        });

        return supertest(courseUrl)
            .get('?search=' + createdCourse.name)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('courses');
                expect(response.body.courses.length == 1).toBe(true);
                expect(response.body.courses.find((course) => course._id === createdCourse.id)).toBeDefined();
            });
    });

    it('should search course by professor', async () => {
        const signInResponse = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(signInResponse.token, {
            professor: faker.string.uuid(),
        });

        return supertest(courseUrl)
            .get('?search=' + createdCourse.professor)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('courses');
                expect(response.body.courses.length == 1).toBe(true);
                expect(response.body.courses.find((course) => course._id === createdCourse.id)).toBeDefined();
            });
    });

    it('should search by parital course title', async () => {
        const commonTitlePart = faker.word.noun();

        const title1 = faker.word.words(4) + ' ' + commonTitlePart;
        const title2 = commonTitlePart + ' ' + faker.word.words(3);
        const title3s = faker.word.words(5).split(' ');
        title3s.splice(2, 0, commonTitlePart);
        const title3 = title3s.join(' ');

        await Promise.all([deleteCoursesWithName(title1), deleteCoursesWithName(title2), deleteCoursesWithName(title3)]);

        const signInResponse = await signInAdminRequestMock();

        const createdCourse1 = await createCourseMockRequest(signInResponse.token, {
            name: title1,
        });

        const createdCourse2 = await createCourseMockRequest(signInResponse.token, {
            name: title2,
        });

        const createdCourse3 = await createCourseMockRequest(signInResponse.token, {
            name: title3,
        });

        return supertest(courseUrl)
            .get('?search=' + commonTitlePart)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('courses');
                expect(response.body.courses.length >= 3).toBe(true);
                expect(response.body.courses.find((course) => course._id === createdCourse1.id)).toBeDefined();
                expect(response.body.courses.find((course) => course._id === createdCourse2.id)).toBeDefined();
                expect(response.body.courses.find((course) => course._id === createdCourse3.id)).toBeDefined();
            });
    });

    it('should return paginated courses', async () => {
        const commonTitlePart = faker.string.uuid();
        const titles = Array(15)
            .fill('')
            .map(() => commonTitlePart + ' ' + faker.word.words(5));

        await Promise.all(titles.map((title) => deleteCoursesWithName(title)));

        const signInResponse = await signInAdminRequestMock();

        const createdCourses = await Promise.all(
            titles.map((title) =>
                createCourseMockRequest(signInResponse.token, {
                    name: title,
                }),
            ),
        );

        createdCourses.sort((a, b) => (a.name > b.name ? 1 : a.name < b.name ? -1 : 0));

        const paginationResponse = await supertest(courseUrl)
            .get(`?search=${commonTitlePart}&page-size=5`)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('courses');
                expect(response.body).toHaveProperty('nextPageNumber');
                expect(response.body.courses.length).toBe(5);
                for (let i = 0; i < 5; i++) {
                    expect(response.body.courses.find((course) => course._id === createdCourses[i].id)).toBeDefined();
                }
            });

        const paginationResponse2 = await supertest(courseUrl)
            .get(`?search=${commonTitlePart}&page-size=5&page-number=` + paginationResponse.body.nextPageNumber)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('courses');
                expect(response.body).toHaveProperty('nextPageNumber');
                expect(response.body.courses.length).toBe(5);
                for (let i = 5; i < 10; i++) {
                    expect(response.body.courses.find((course) => course._id === createdCourses[i].id)).toBeDefined();
                }
            });

        return supertest(courseUrl)
            .get(`?search=${commonTitlePart}&page-size=5&page-number=` + paginationResponse2.body.nextPageNumber)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('courses');
                expect(response.body).toHaveProperty('nextPageNumber');
                expect(response.body.courses.length).toBe(5);
                for (let i = 10; i < 15; i++) {
                    expect(response.body.courses.find((course) => course._id === createdCourses[i].id)).toBeDefined();
                }
            });
    });
});
