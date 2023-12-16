import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { CreateReviewProposalRequestDto } from 'src/modules/review-proposal/dto/CreateReviewProposalRequest.dto';
import { AddUserReviewRequestDto } from 'src/modules/review/dto/AddUserReviewRequest.dto';

import { fakeNumberOfLenght } from '@tum-rating/backend/test/utils/utils/fakeNumberOfLenght';
import { reviewProposalUrl } from '@tum-rating/backend/test/utils/api-client/review-proposal';
import {
    connectMongo,
    signInRequestMock,
    signInAdminRequestMock,
} from '@tum-rating/backend/test/utils';
import { createCourseReviewMockRequest } from '@tum-rating/backend/test/utils/api-client/review';
import { createReviewProposalMockRequest } from '@tum-rating/backend/test/utils/api-client/review-proposal';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Delete Review Proposal', () => {
    it('should delete review proposal', async () => {
        const signInResponse = await signInRequestMock();
        const singInAdminResponse = await signInAdminRequestMock();

        const createdReviewProposal = await createReviewProposalMockRequest(
            signInResponse.token,
        );

        await supertest(reviewProposalUrl)
            .get('/' + createdReviewProposal.id)
            .set('Authorization', 'Bearer ' + singInAdminResponse.token)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body._id).toEqual(createdReviewProposal.id);
                expect(response.body.course).toEqual(
                    createdReviewProposal.course,
                );
                expect(response.body.courseId).toEqual(
                    createdReviewProposal.courseId,
                );
                expect(response.body.courseNumber).toEqual(
                    createdReviewProposal.courseNumber,
                );
                expect(response.body.professor).toEqual(
                    createdReviewProposal.professor,
                );
                expect(response.body.offeredInSemesters).toEqual(
                    createdReviewProposal.offeredInSemesters,
                );
            });

        await supertest(reviewProposalUrl)
            .delete('/' + createdReviewProposal.id)
            .set('Authorization', 'Bearer ' + singInAdminResponse.token);
        expect(200);

        await supertest(reviewProposalUrl)
            .get('/' + createdReviewProposal.id)
            .set('Authorization', 'Bearer ' + singInAdminResponse.token)
            .expect(404);
    });
});
