import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { PatchCourseRequestDto } from '@tum-rating/backend/src/modules/course/dto/PatchCourseRequest.dto';
import { MONGO_ZERO_ID } from '@tum-rating/backend/src/utils/const';

import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { fakeNumberOfLenght } from '@tum-rating/backend/test/utils/utils/fakeNumberOfLenght';
import { courseUrl } from '@tum-rating/backend/test/utils/api-client/course';
import { createCourseMockRequest } from '@tum-rating/backend/test/utils/api-client/course';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Patch Course', () => {
    it('should patch course - full update', async () => {
        const signInResponse = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(signInResponse.token);

        const requestBody: PatchCourseRequestDto = {
            courseId: fakeNumberOfLenght(9),
            courseNumber: fakeNumberOfLenght(8),
            name: faker.word.words(faker.number.int({ min: 2, max: 10 })),
            professor: faker.word.words(2),
            otherLecturers: [faker.word.words(2)],
            offeredInSemesters: ['SS 2023', 'WS 2023'],
        };

        return supertest(courseUrl)
            .patch(`/${createdCourse.id}`)
            .send(requestBody)
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body.id).toEqual(createdCourse.id);
                expect(response.body.courseId).toEqual(requestBody.courseId);
                expect(response.body.courseNumber).toEqual(requestBody.courseNumber);
                expect(response.body.name).toEqual(requestBody.name);
                expect(response.body.professor).toEqual(requestBody.professor);
                expect(response.body.otherLecturers).toEqual(requestBody.otherLecturers);
                expect(response.body.offeredInSemesters).toEqual(requestBody.offeredInSemesters);
            });
    });

    it('should patch course - partial update', async () => {
        const signInResponse = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(signInResponse.token);

        const requestBody: PatchCourseRequestDto = {
            courseNumber: fakeNumberOfLenght(8),
            name: faker.word.words(faker.number.int({ min: 2, max: 10 })),
        };

        return supertest(courseUrl)
            .patch(`/${createdCourse.id}`)
            .send(requestBody)
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body.id).toEqual(createdCourse.id);
                expect(response.body.courseId).toEqual(createdCourse.courseId);
                expect(response.body.courseNumber).toEqual(requestBody.courseNumber);
                expect(response.body.name).toEqual(requestBody.name);
                expect(response.body.professor).toEqual(createdCourse.professor);
                expect(response.body.otherLecturers).toEqual(createdCourse.otherLecturers);
                expect(response.body.offeredInSemesters).toEqual(createdCourse.offeredInSemesters);
            });
    });

    it('should fail with user token auth', async () => {
        const signInResponse = await signInRequestMock();
        const signInAdminResponse = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(signInAdminResponse.token);

        const requestBody: PatchCourseRequestDto = {
            courseNumber: fakeNumberOfLenght(8),
            name: faker.word.words(faker.number.int({ min: 2, max: 10 })),
        };

        return supertest(courseUrl)
            .patch(`/${createdCourse.id}`)
            .send(requestBody)
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(403);
    });

    it('should fail with 404 if course not found', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const requestBody: PatchCourseRequestDto = {
            courseNumber: fakeNumberOfLenght(8),
            name: faker.word.words(faker.number.int({ min: 2, max: 10 })),
        };

        return supertest(courseUrl)
            .patch(`/` + MONGO_ZERO_ID)
            .send(requestBody)
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(404);
    });
});
