import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { courseProposalUrl } from '@tum-rating/backend/test/utils/api-client/course-proposal';
import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { createCourseProposalMockRequest } from '@tum-rating/backend/test/utils/api-client/course-proposal';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Get Course Proposal', () => {
    it('should get course proposal', async () => {
        const signInResponse = await signInRequestMock();
        const singInAdminResponse = await signInAdminRequestMock();

        const createdCourseProposal = await createCourseProposalMockRequest(signInResponse.token);

        return supertest(courseProposalUrl)
            .get('/' + createdCourseProposal.id)
            .set('Authorization', 'Bearer ' + singInAdminResponse.token)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body.id).toEqual(createdCourseProposal.id);
                expect(response.body.url).toEqual(createdCourseProposal.url);
                expect(response.body.userId).toEqual(signInResponse.user.id);
                expect(response.body.createdAt).toBeDefined();
            });
    });

    it('should fail without auth token', async () => {
        const signInResponse = await signInRequestMock();

        const createdCourseProposal = await createCourseProposalMockRequest(signInResponse.token);

        return supertest(courseProposalUrl)
            .get('/' + createdCourseProposal.id)
            .expect(401);
    });

    it('should fail without admin auth token', async () => {
        const signInResponse = await signInRequestMock();

        const createdCourseProposal = await createCourseProposalMockRequest(signInResponse.token);

        return supertest(courseProposalUrl)
            .get('/' + createdCourseProposal.id)
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(403);
    });
});
