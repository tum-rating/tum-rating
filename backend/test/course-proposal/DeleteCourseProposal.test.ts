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
                expect(response.body._id).toEqual(createdCourseProposal.id);
                expect(response.body.name).toEqual(createdCourseProposal.name);
                expect(response.body.courseId).toEqual(createdCourseProposal.courseId);
                expect(response.body.courseNumber).toEqual(createdCourseProposal.courseNumber);
                expect(response.body.professor).toEqual(createdCourseProposal.professor);
                expect(response.body.offeredInSemesters).toEqual(createdCourseProposal.offeredInSemesters);
            });

        await supertest(courseProposalUrl)
            .delete('/' + createdCourseProposal.id)
            .set('Authorization', 'Bearer ' + singInAdminResponse.token);
        expect(200);

        await supertest(courseProposalUrl)
            .get('/' + createdCourseProposal.id)
            .set('Authorization', 'Bearer ' + singInAdminResponse.token)
            .expect(404);
    });
});
