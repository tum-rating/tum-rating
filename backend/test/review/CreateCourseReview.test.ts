import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { CreateReviewRequestDto } from '@tum-rating/backend/src/modules/review/dto/CreateReviewRequest.dto';
import { connectMongo, signInRequestMock } from '@tum-rating/backend/test/utils';
import { fakeNumberOfLenght } from '@tum-rating/backend/test/utils/utils/fakeNumberOfLenght';
import { reviewUrl } from '@tum-rating/backend/test/utils/api-client/review';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Create Course Review', () => {
    it('should create course review', async () => {
        const signInResponse = await signInRequestMock();

        const requestBody: CreateReviewRequestDto = {
            courseId: fakeNumberOfLenght(9),
            courseNumber: fakeNumberOfLenght(8),
            course: faker.word.words(faker.number.int({min: 2, max: 10})),
            professor: faker.word.words(2),
            offeredInSemesters: ['SS 2023', 'WS 2023']
        };
    
        return supertest(reviewUrl)
            .post('/')
            .send(requestBody)
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(201)
            .expect((response: supertest.Response) => {
                expect(response.body).toHaveProperty('id');
            });
    });
});