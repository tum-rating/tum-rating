import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { CreateCourseRequestDto } from '@tum-rating/backend/src/modules/course/dto/CreateCourseRequest.dto';
import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { fakeNumberOfLenght } from '@tum-rating/backend/test/utils/utils/fakeNumberOfLenght';
import { courseUrl } from '@tum-rating/backend/test/utils/api-client/course';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Create Course', () => {
    it('should create course', async () => {
        const signInResponse = await signInAdminRequestMock();

        const requestBody: CreateCourseRequestDto = {
            courseId: fakeNumberOfLenght(9),
            courseNumber: fakeNumberOfLenght(8),
            name: faker.word.words(faker.number.int({ min: 2, max: 10 })),
            professor: faker.word.words(2),
            offeredInSemesters: ['SS 2023', 'WS 2023'],
        };

        return supertest(courseUrl)
            .post('/')
            .send(requestBody)
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(201)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('id');
            });
    });

    it('should fail with user token auth', async () => {
        const signInResponse = await signInRequestMock();

        const requestBody: CreateCourseRequestDto = {
            courseId: fakeNumberOfLenght(9),
            courseNumber: fakeNumberOfLenght(8),
            name: faker.word.words(faker.number.int({ min: 2, max: 10 })),
            professor: faker.word.words(2),
            offeredInSemesters: ['SS 2023', 'WS 2023'],
        };

        return supertest(courseUrl)
            .post('/')
            .send(requestBody)
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(403);
    });
});
