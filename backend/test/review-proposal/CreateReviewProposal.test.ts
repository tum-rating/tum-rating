import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { CreateReviewProposalRequestDto } from 'src/modules/review-proposal/dto/CreateReviewProposalRequest.dto';
import { AddUserReviewRequestDto } from 'src/modules/review/dto/AddUserReviewRequest.dto';

import { fakeNumberOfLenght } from '@tum-rating/backend/test/utils/utils/fakeNumberOfLenght';
import { reviewProposalUrl } from '@tum-rating/backend/test/utils/api-client/review-proposal';
import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { createCourseReviewMockRequest } from '@tum-rating/backend/test/utils/api-client/review';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Create Review Proposal', () => {
    it('should create review proposal', async () => {
        const signInResponse = await signInRequestMock();

        const requestBody: CreateReviewProposalRequestDto = {
            courseId: fakeNumberOfLenght(9),
            courseNumber: fakeNumberOfLenght(8),
            course: faker.word.words(faker.number.int({ min: 2, max: 10 })),
            professor: faker.word.words(2),
            offeredInSemesters: ['SS 2023', 'WS 2023'],
        };

        return supertest(`${reviewProposalUrl}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(201);
    });
});
