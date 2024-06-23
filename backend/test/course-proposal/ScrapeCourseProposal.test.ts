import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { courseProposalUrl } from '@tum-rating/backend/test/utils/api-client/course-proposal';
import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { createCourseProposalMockRequest } from '@tum-rating/backend/test/utils/api-client/course-proposal';
import { MONGO_ZERO_ID } from '@tum-rating/backend/src/utils/const';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Scrape Course Proposal', () => {
    it('should scrape course proposal', async () => {
        const signInResponse = await signInRequestMock();
        const singInAdminResponse = await signInAdminRequestMock();

        const createdCourseProposal = await createCourseProposalMockRequest(signInResponse.token, {
            url: 'https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/slc.tm.cp/student/courses/950760117?$scrollTo=toc_overview'
        });

        return supertest(courseProposalUrl)
            .get('/' + createdCourseProposal.id + '/scrape')
            .set('Authorization', 'Bearer ' + singInAdminResponse.token)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body.statusCode).toEqual(200);
                expect(response.body.error).toEqual(null);
                expect(response.body.course).toBeDefined();
                expect(response.body.course.courseId).toEqual('950760117');
                expect(response.body.course.courseNumber).toEqual('0000002641');
                expect(response.body.course.name).toEqual('Active Mobility');
                expect(response.body.course.professor).toEqual('Dominik Fuchs');
                expect(response.body.course.offeredInSemesters).toEqual(['2024 S']);
                expect(response.body.course.otherLecturers).toEqual([
                    'Benjamin Büttner',
                    'Mahtab Baghaie Poor',
                    'Simone Margarete Aumann'
                ]);
            });
    });

    it('should fail without auth token', async () => {
        const signInResponse = await signInRequestMock();

        const createdCourseProposal = await createCourseProposalMockRequest(signInResponse.token, {
            url: 'https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/slc.tm.cp/student/courses/950760117?$scrollTo=toc_overview'
        });

        return supertest(courseProposalUrl)
            .get('/' + createdCourseProposal.id + '/scrape')
            .expect(401);
    });

    it('should fail without admin auth token', async () => {
        const signInResponse = await signInRequestMock();

        const createdCourseProposal = await createCourseProposalMockRequest(signInResponse.token, {
            url: 'https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/slc.tm.cp/student/courses/950760117?$scrollTo=toc_overview'
        });

        return supertest(courseProposalUrl)
            .get('/' + createdCourseProposal.id + '/scrape')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .expect(403)
    });

    it('should fail without admin auth token', async () => {
        const singInAdminResponse = await signInAdminRequestMock();

        return supertest(courseProposalUrl)
            .get('/' + MONGO_ZERO_ID + '/scrape')
            .set('Authorization', 'Bearer ' + singInAdminResponse.token)
            .expect(404);
    }); 
});
