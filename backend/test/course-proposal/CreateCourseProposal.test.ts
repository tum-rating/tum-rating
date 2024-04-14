import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { CreateCourseProposalRequestDto } from '@tum-rating/backend/src/modules/course-proposal/dto/CreateCourseProposalRequest.dto';

import { fakeNumberOfLenght } from '@tum-rating/backend/test/utils/utils/fakeNumberOfLenght';
import { courseProposalUrl } from '@tum-rating/backend/test/utils/api-client/course-proposal';
import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Create Course Proposal', () => {
    it('should create course proposal', async () => {
        const signInResponse = await signInRequestMock();

        const requestBody: CreateCourseProposalRequestDto = {
            courseId: fakeNumberOfLenght(9),
            courseNumber: fakeNumberOfLenght(8),
            name: faker.word.words(faker.number.int({ min: 2, max: 10 })),
            professor: faker.word.words(2),
            offeredInSemesters: ['SS 2023', 'WS 2023'],
        };

        return supertest(`${courseProposalUrl}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(201);
    });
});
