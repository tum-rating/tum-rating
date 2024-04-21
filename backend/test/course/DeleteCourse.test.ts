import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { MONGO_ZERO_ID } from '@tum-rating/backend/src/utils/const';
import { CreateCourseRequestDto } from '@tum-rating/backend/src/modules/course/dto/CreateCourseRequest.dto';
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

describe('Delete Course', () => {
    it('should delete course', async () => {
        const signInResponse = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(signInResponse.token);

        return supertest(courseUrl)
            .delete('/'+createdCourse.id)
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body.id).toEqual(createdCourse.id);
                expect(response.body.courseId).toEqual(createdCourse.courseId);
                expect(response.body.courseNumber).toEqual(createdCourse.courseNumber);
                expect(response.body.name).toEqual(createdCourse.name);
                expect(response.body.professor).toEqual(createdCourse.professor);
                expect(response.body.otherLecturers).toEqual(createdCourse.otherLecturers);
                expect(response.body.offeredInSemesters).toEqual(createdCourse.offeredInSemesters);
            });
    });

    it('should fail with user token auth', async () => {
        const signInResponse = await signInRequestMock();
        const signInAdminResponse = await signInAdminRequestMock();

        const createdCourse = await createCourseMockRequest(signInAdminResponse.token);

        return supertest(courseUrl)
            .delete('/'+createdCourse.id)
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(403);
    });

    it('should fail with 404 if course not found', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        return supertest(courseUrl)
            .delete(`/` + MONGO_ZERO_ID)
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(404);
    });
});
