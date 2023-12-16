import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { CreateReviewProposalRequestDto } from 'src/modules/review-proposal/dto/CreateReviewProposalRequest.dto';
import { AddUserReviewRequestDto } from 'src/modules/review/dto/AddUserReviewRequest.dto';

import { fakeNumberOfLenght } from '@tum-rating/backend/test/utils/utils/fakeNumberOfLenght';
import { reviewProposalUrl } from '@tum-rating/backend/test/utils/api-client/review-proposal';
import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { createCourseReviewMockRequest } from '@tum-rating/backend/test/utils/api-client/review';
import { createReviewProposalMockRequest } from '@tum-rating/backend/test/utils/api-client/review-proposal';
import { reviewUrl } from '@tum-rating/backend/test/utils/api-client/review';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Accept Review Proposal', () => {
    it('should accept review proposal', async () => {
        const signInResponse = await signInRequestMock();
        const singInAdminResponse = await signInAdminRequestMock();

        const createdReviewProposal = await createReviewProposalMockRequest(signInResponse.token);

        let createdReviewId: string;

        await supertest(reviewProposalUrl + '/' + createdReviewProposal.id + '/accept')
            .post('/')
            .set('Authorization', 'Bearer ' + singInAdminResponse.token)
            .expect(201)
            .expect((response: supertest.Response) => {
                createdReviewId = response.body.createdReview;
                expect(response.body.createdReview).toBeDefined();
            });

        return supertest(reviewUrl)
            .get('/' + createdReviewId)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body.courseId).toEqual(createdReviewProposal.courseId);
                expect(response.body.course).toEqual(createdReviewProposal.course);
                expect(response.body.professor).toEqual(createdReviewProposal.professor);
                expect(response.body.courseNumber).toEqual(createdReviewProposal.courseNumber);
                expect(response.body.reviews).toBeDefined();
            });
    });

    it('should fail without auth token', async () => {
        const signInResponse = await signInRequestMock();

        const createdReviewProposal = await createReviewProposalMockRequest(signInResponse.token);

        await supertest(reviewProposalUrl + '/' + createdReviewProposal.id + '/accept')
            .post('/')
            .expect(401);
    });

    it('should fail without admin auth token', async () => {
        const signInResponse = await signInRequestMock();

        const createdReviewProposal = await createReviewProposalMockRequest(signInResponse.token);

        await supertest(reviewProposalUrl + '/' + createdReviewProposal.id + '/accept')
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(403);
    });
});
