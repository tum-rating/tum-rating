import { faker } from '@faker-js/faker';
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

describe('Delete Course Proposal', () => {
    it('should delete course proposal', async () => {
        const signInResponse = await signInRequestMock();
        const singInAdminResponse = await signInAdminRequestMock();

        const createdCourseProposal = await createCourseProposalMockRequest(signInResponse.token);

        await supertest(courseProposalUrl)
            .get('/' + createdCourseProposal.id)
            .set('Authorization', 'Bearer ' + singInAdminResponse.token)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body.id).toEqual(createdCourseProposal.id);
                expect(response.body.url).toEqual(createdCourseProposal.url);
                expect(response.body.userId).toEqual(signInResponse.user.id);
                expect(response.body.createdAt).toBeDefined();
            });

        await supertest(courseProposalUrl)
            .delete('/' + createdCourseProposal.id)
            .set('Authorization', 'Bearer ' + singInAdminResponse.token)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body.id).toEqual(createdCourseProposal.id);
                expect(response.body.url).toEqual(createdCourseProposal.url);
                expect(response.body.userId).toEqual(signInResponse.user.id);
                expect(response.body.createdAt).toBeDefined();
            });

        await supertest(courseProposalUrl)
            .get('/' + createdCourseProposal.id)
            .set('Authorization', 'Bearer ' + singInAdminResponse.token)
            .expect(404);
    });


    it('should fail without admin token', async () => {
        const signInResponse = await signInRequestMock();
        const singInAdminResponse = await signInAdminRequestMock();

        const createdCourseProposal = await createCourseProposalMockRequest(signInResponse.token);

        await supertest(courseProposalUrl)
            .delete('/' + createdCourseProposal.id)
            .set('Authorization', 'Bearer ' + singInAdminResponse.token);
        expect(200);

         await supertest(courseProposalUrl)
            .delete('/' + createdCourseProposal.id)
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(403);
    });
});
