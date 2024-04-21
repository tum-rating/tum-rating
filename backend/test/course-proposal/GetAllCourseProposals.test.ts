import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { courseProposalUrl } from '@tum-rating/backend/test/utils/api-client/course-proposal';
import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { createCourseProposalMockRequest } from '@tum-rating/backend/test/utils/api-client/course-proposal';
import exp from 'constants';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Get All Course Proposal', () => {
    it('should get all course proposals', async () => {
        const signInResponse = await signInRequestMock();
        const singInAdminResponse = await signInAdminRequestMock();

        await createCourseProposalMockRequest(signInResponse.token);

        return supertest(courseProposalUrl)
            .get('/') 
            .set('Authorization', 'Bearer ' + singInAdminResponse.token)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body.courseProposals).toBeDefined();
                expect(response.body.courseProposals.length).toBeGreaterThan(0);
                expect(response.body.courseProposals[0].id).toBeDefined();
                expect(response.body.courseProposals[0].url).toBeDefined();
                expect(response.body.courseProposals[0].userId).toBeDefined();
                expect(response.body.courseProposals[0].createdAt).toBeDefined();
            });
    });

    it('should fail without auth token', async () => {
        const signInResponse = await signInRequestMock();

        return supertest(courseProposalUrl)
            .get('/')
            .expect(401);
    });

    it('should fail without admin auth token', async () => {
        const signInResponse = await signInRequestMock();

        return supertest(courseProposalUrl)
            .get('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(403);
    });
});
