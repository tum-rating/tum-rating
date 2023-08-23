import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { connectMongo, signInRequestMock } from '@tum-rating/backend/test/utils';
import { reviewUrl } from '@tum-rating/backend/test/utils/api-client/review';
import { createCourseReviewMockRequest } from '@tum-rating/backend/test/utils/api-client/review';
import { AddUserReviewRequestDto } from 'src/modules/review/dto/AddUserReviewRequest.dto';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Add User Review', () => {
    it('should add user review', async () => {
        const signInResponse = await signInRequestMock();

        const createdReview = await createCourseReviewMockRequest(signInResponse.token);
        
        const requestBody: AddUserReviewRequestDto = {
            howInterestingRating: 50,
            howEasyRating: 75,
            comment: faker.word.words(),
            semester: createdReview.offeredInSemesters[0]
        };

        return supertest(`${reviewUrl}/${createdReview.id}/user/${signInResponse.user.id}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(201)
            // .expect((response: supertest.Response) => {
            //     expect(response.body).toHaveProperty('reviews');
            //     expect(response.body.reviews.length >= 1).toBe(true);
            // });
    });
});