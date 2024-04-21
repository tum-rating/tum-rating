import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { CreateCourseProposalRequestDto } from '@tum-rating/backend/src/modules/course-proposal/dto/CreateCourseProposalRequest.dto';

import { courseProposalUrl } from '@tum-rating/backend/test/utils/api-client/course-proposal';
import { connectMongo, signInRequestMock, } from '@tum-rating/backend/test/utils';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Create Course Proposal', () => {
    it('should create course proposal', async () => {
        const signInResponse = await signInRequestMock();

        const requestBody: CreateCourseProposalRequestDto = {
            url: 'https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/slc.tm.cp/student/courses/950733269?$scrollTo=toc_overview'
        };

        return supertest(`${courseProposalUrl}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(201)
            .then((response) => {
                expect(response.body.id).toBeDefined();
            });
    });

    it('should fail with invalid url - wrong domain', async () => {
        const signInResponse = await signInRequestMock();

        const requestBody: CreateCourseProposalRequestDto = {
            url: 'https://invalid.tum.de/tumonline/ee/ui/ca2/app/desktop/#/slc.tm.cp/student/courses'
        };

        return supertest(`${courseProposalUrl}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(400);
    });

    it('should fail with invalid url - no specific course', async () => {
        const signInResponse = await signInRequestMock();

        const requestBody: CreateCourseProposalRequestDto = {
            url: 'https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/slc.tm.cp/student/courses/'
        };

        return supertest(`${courseProposalUrl}`)
            .post('/')
            .set('Authorization', 'Bearer ' + signInResponse.token)
            .send(requestBody)
            .expect(400);
    });


    it('should fail without auth token', async () => {

        const requestBody: CreateCourseProposalRequestDto = {
            url: 'https://invalid.tum.de/tumonline/ee/ui/ca2/app/desktop/#/slc.tm.cp/student/courses/'
        };

        return supertest(`${courseProposalUrl}`)
            .post('/')
            .send(requestBody)
            .expect(401);
    });
});
