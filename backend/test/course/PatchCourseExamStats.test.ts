import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import * as supertest from 'supertest';

import { MONGO_ZERO_ID } from '@tum-rating/backend/src/utils/const';
import { connectMongo, signInRequestMock, signInAdminRequestMock } from '@tum-rating/backend/test/utils';
import { courseUrl } from '@tum-rating/backend/test/utils/api-client/course';
import { createCourseMockRequest } from '@tum-rating/backend/test/utils/api-client/course';
import { patchCourseExamStatsMockRequest, TestPatchCourseExamStatsDto } from '@tum-rating/backend/test/utils/api-client/course-exam-stats';

beforeAll(async () => {
    await connectMongo();
});

afterAll(async () => {
    mongoose.disconnect();
});

describe('Patch Course Exam Stats', () => {
    it('should patch course exam stats with a single key', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const mockCourse = await createCourseMockRequest(signInAdminResponse.token);

        const patchCourseExamStatsResponse = await patchCourseExamStatsMockRequest(signInAdminResponse.token, mockCourse.id, {
            semester: mockCourse.offeredInSemesters[0],
            grades: [
                { grade: 1.0, people: 5 },
                { grade: 1.3, people: 6 },
                { grade: 1.7, people: 5 },
                { grade: 2.0, people: 5 },
                { grade: 2.3, people: 4 },
                { grade: 2.7, people: 2 },
                { grade: 3.0, people: 6 },
                { grade: 3.3, people: 5 },
                { grade: 3.7, people: 7 },
                { grade: 4.0, people: 9 },
                { grade: 4.3, people: 7 },
                { grade: 4.7, people: 2 },
                { grade: 5.0, people: 13 },
                { grade: 6.0, people: 20 }
            ],
        });

        expect(patchCourseExamStatsResponse).toHaveProperty('peopleTotal');
        expect(patchCourseExamStatsResponse.peopleTotal).toBe(96);
        expect(patchCourseExamStatsResponse).toHaveProperty('attemptsTotal');
        expect(patchCourseExamStatsResponse.attemptsTotal).toBe(76);
        expect(patchCourseExamStatsResponse).toHaveProperty('peopleAttemptsFailed');
        expect(patchCourseExamStatsResponse.peopleAttemptsFailed).toBe(22);
        expect(patchCourseExamStatsResponse).toHaveProperty('attemptsFailedPercentage');
        expect(patchCourseExamStatsResponse.attemptsFailedPercentage).toBe(28.95);
        expect(patchCourseExamStatsResponse).toHaveProperty('averageAttemptsTotal');
        expect(patchCourseExamStatsResponse.averageAttemptsTotal).toBe(3.25);
        expect(patchCourseExamStatsResponse).toHaveProperty('averageAttemptsPassed');
        expect(patchCourseExamStatsResponse.averageAttemptsPassed).toBe(2.64);
    });

    it('should patch course exam stats with a multiple exam keys key', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const semesters = ['2023 S', '2023 W', '2024 S'];
        const mockCourse = await createCourseMockRequest(signInAdminResponse.token, {
            offeredInSemesters: semesters
        });

        const patchCourseExamStatsResponse = await patchCourseExamStatsMockRequest(signInAdminResponse.token, mockCourse.id, {
            semester: semesters[0],
            examType: 'endterm',
            grades: [
                { grade: 1.0, people: 5 },
                { grade: 1.3, people: 6 },
                { grade: 1.7, people: 5 },
                { grade: 2.0, people: 5 },
                { grade: 2.3, people: 4 },
                { grade: 2.7, people: 2 },
                { grade: 3.0, people: 6 },
                { grade: 3.3, people: 5 },
                { grade: 3.7, people: 7 },
                { grade: 4.0, people: 9 },
                { grade: 4.3, people: 7 },
                { grade: 4.7, people: 2 },
                { grade: 5.0, people: 13 },
                { grade: 6.0, people: 20 }
            ],
        });

        expect(patchCourseExamStatsResponse).toHaveProperty('peopleTotal');
        expect(patchCourseExamStatsResponse.peopleTotal).toBe(96);
        expect(patchCourseExamStatsResponse).toHaveProperty('attemptsTotal');
        expect(patchCourseExamStatsResponse.attemptsTotal).toBe(76);
        expect(patchCourseExamStatsResponse).toHaveProperty('peopleAttemptsFailed');
        expect(patchCourseExamStatsResponse.peopleAttemptsFailed).toBe(22);
        expect(patchCourseExamStatsResponse).toHaveProperty('attemptsFailedPercentage');
        expect(patchCourseExamStatsResponse.attemptsFailedPercentage).toBe(28.95);
        expect(patchCourseExamStatsResponse).toHaveProperty('averageAttemptsTotal');
        expect(patchCourseExamStatsResponse.averageAttemptsTotal).toBe(3.25);
        expect(patchCourseExamStatsResponse).toHaveProperty('averageAttemptsPassed');
        expect(patchCourseExamStatsResponse.averageAttemptsPassed).toBe(2.64);

        const patchCourseExamStatsResponse2 = await patchCourseExamStatsMockRequest(signInAdminResponse.token, mockCourse.id, {
            semester: semesters[0],
            examType: 'retake',
            grades: [
                { grade: 1.0, people: 366 },
                { grade: 1.3, people: 117 },
                { grade: 1.7, people: 75 },
                { grade: 2.0, people: 60 },
                { grade: 2.3, people: 50 },
                { grade: 2.7, people: 32 },
                { grade: 3.0, people: 23 },
                { grade: 3.3, people: 20 },
                { grade: 3.7, people: 14 },
                { grade: 4.0, people: 9 },
                { grade: 4.3, people: 7 },
                { grade: 4.7, people: 5 },
                { grade: 5.0, people: 125 },
                { grade: 6.0, people: 9 }
            ],
        });

        expect(patchCourseExamStatsResponse2).toHaveProperty('peopleTotal');
        expect(patchCourseExamStatsResponse2.peopleTotal).toBe(912);
        expect(patchCourseExamStatsResponse2).toHaveProperty('attemptsTotal');
        expect(patchCourseExamStatsResponse2.attemptsTotal).toBe(903);
        expect(patchCourseExamStatsResponse2).toHaveProperty('peopleAttemptsFailed');
        expect(patchCourseExamStatsResponse2.peopleAttemptsFailed).toBe(137);
        expect(patchCourseExamStatsResponse2).toHaveProperty('attemptsFailedPercentage');
        expect(patchCourseExamStatsResponse2.attemptsFailedPercentage).toBe(15.17);
        expect(patchCourseExamStatsResponse2).toHaveProperty('averageAttemptsTotal');
        expect(patchCourseExamStatsResponse2.averageAttemptsTotal).toBe(2.07);
        expect(patchCourseExamStatsResponse2).toHaveProperty('averageAttemptsPassed');
        expect(patchCourseExamStatsResponse2.averageAttemptsPassed).toBe(1.55);

        const patchCourseExamStatsResponse3 = await patchCourseExamStatsMockRequest(signInAdminResponse.token, mockCourse.id, {
            semester: semesters[1],
            examType: 'endterm',
            grades: [
                { grade: 1.0, people: 48 },
                { grade: 1.3, people: 77 },
                { grade: 1.7, people: 113 },
                { grade: 2.0, people: 105 },
                { grade: 2.3, people: 143 },
                { grade: 2.7, people: 145 },
                { grade: 3.0, people: 156 },
                { grade: 3.3, people: 150 },
                { grade: 3.7, people: 137 },
                { grade: 4.0, people: 125 },
                { grade: 4.3, people: 90 },
                { grade: 4.7, people: 71 },
                { grade: 5.0, people: 196 },
                { grade: 6.0, people: 0 }
            ],
        });

        expect(patchCourseExamStatsResponse3).toHaveProperty('peopleTotal');
        expect(patchCourseExamStatsResponse3.peopleTotal).toBe(1556);
        expect(patchCourseExamStatsResponse3).toHaveProperty('attemptsTotal');
        expect(patchCourseExamStatsResponse3.attemptsTotal).toBe(1556);
        expect(patchCourseExamStatsResponse3).toHaveProperty('peopleAttemptsFailed');
        expect(patchCourseExamStatsResponse3.peopleAttemptsFailed).toBe(357);
        expect(patchCourseExamStatsResponse3).toHaveProperty('attemptsFailedPercentage');
        expect(patchCourseExamStatsResponse3.attemptsFailedPercentage).toBe(22.94);
        expect(patchCourseExamStatsResponse3).toHaveProperty('averageAttemptsTotal');
        expect(patchCourseExamStatsResponse3.averageAttemptsTotal).toBe(3.18);
        expect(patchCourseExamStatsResponse3).toHaveProperty('averageAttemptsPassed');
        expect(patchCourseExamStatsResponse3.averageAttemptsPassed).toBe(2.70);
    });

    it('should patch course exam stats for the same key twice', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const semesters = ['2023 S', '2023 W', '2024 S'];
        const mockCourse = await createCourseMockRequest(signInAdminResponse.token, {
            offeredInSemesters: semesters
        });

        const patchCourseExamStatsResponse = await patchCourseExamStatsMockRequest(signInAdminResponse.token, mockCourse.id, {
            semester: semesters[0],
            examType: 'endterm',
            grades: [
                { grade: 1.0, people: 7 },
                { grade: 1.3, people: 13 },
                { grade: 1.7, people: 15 },
                { grade: 2.0, people: 6 },
                { grade: 2.3, people: 12 },
                { grade: 2.7, people: 5 },
                { grade: 3.0, people: 4 },
                { grade: 3.3, people: 4 },
                { grade: 3.7, people: 0 },
                { grade: 4.0, people: 4 },
                { grade: 4.3, people: 2 },
                { grade: 4.7, people: 3 },
                { grade: 5.0, people: 10 },
                { grade: 6.0, people: 14 } 
            ],
        });

        expect(patchCourseExamStatsResponse).toHaveProperty('peopleTotal');
        expect(patchCourseExamStatsResponse.peopleTotal).toBe(99);
        expect(patchCourseExamStatsResponse).toHaveProperty('attemptsTotal');
        expect(patchCourseExamStatsResponse.attemptsTotal).toBe(85);
        expect(patchCourseExamStatsResponse).toHaveProperty('peopleAttemptsFailed');
        expect(patchCourseExamStatsResponse.peopleAttemptsFailed).toBe(15);
        expect(patchCourseExamStatsResponse).toHaveProperty('attemptsFailedPercentage');
        expect(patchCourseExamStatsResponse.attemptsFailedPercentage).toBe(17.65);
        expect(patchCourseExamStatsResponse).toHaveProperty('averageAttemptsTotal');
        expect(patchCourseExamStatsResponse.averageAttemptsTotal).toBe(2.55);
        expect(patchCourseExamStatsResponse).toHaveProperty('averageAttemptsPassed');
        expect(patchCourseExamStatsResponse.averageAttemptsPassed).toBe(2.05);

        const patchCourseExamStatsResponse2 = await patchCourseExamStatsMockRequest(signInAdminResponse.token, mockCourse.id, {
            semester: semesters[0],
            examType: 'endterm',
            grades: [
                { grade: 1.0, people: 13 },
                { grade: 1.3, people: 22 },
                { grade: 1.7, people: 39 },
                { grade: 2.0, people: 41 },
                { grade: 2.3, people: 21 },
                { grade: 2.7, people: 23 },
                { grade: 3.0, people: 20 },
                { grade: 3.3, people: 17 },
                { grade: 3.7, people: 14 },
                { grade: 4.0, people: 11 },
                { grade: 4.3, people: 8 },
                { grade: 4.7, people: 10 },
                { grade: 5.0, people: 9 },
                { grade: 6.0, people: 56 }
            ],
        });

        expect(patchCourseExamStatsResponse2).toHaveProperty('peopleTotal');
        expect(patchCourseExamStatsResponse2.peopleTotal).toBe(304);
        expect(patchCourseExamStatsResponse2).toHaveProperty('attemptsTotal');
        expect(patchCourseExamStatsResponse2.attemptsTotal).toBe(248);
        expect(patchCourseExamStatsResponse2).toHaveProperty('peopleAttemptsFailed');
        expect(patchCourseExamStatsResponse2.peopleAttemptsFailed).toBe(27);
        expect(patchCourseExamStatsResponse2).toHaveProperty('attemptsFailedPercentage');
        expect(patchCourseExamStatsResponse2.attemptsFailedPercentage).toBe(10.89);
        expect(patchCourseExamStatsResponse2).toHaveProperty('averageAttemptsTotal');
        expect(patchCourseExamStatsResponse2.averageAttemptsTotal).toBe(2.58);
        expect(patchCourseExamStatsResponse2).toHaveProperty('averageAttemptsPassed');
        expect(patchCourseExamStatsResponse2.averageAttemptsPassed).toBe(2.32);
    });

    it('should return 404 if there is not course with the given id', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const requestBody: TestPatchCourseExamStatsDto = {
            semester: '2023 S',
            examType: 'endterm',
            grades: [
                { grade: 1.0, people: 13 },
                { grade: 1.3, people: 22 },
                { grade: 1.7, people: 39 },
                { grade: 2.0, people: 41 },
                { grade: 2.3, people: 21 },
                { grade: 2.7, people: 23 },
                { grade: 3.0, people: 20 },
                { grade: 3.3, people: 17 },
                { grade: 3.7, people: 14 },
                { grade: 4.0, people: 11 },
                { grade: 4.3, people: 8 },
                { grade: 4.7, people: 10 },
                { grade: 5.0, people: 9 },
                { grade: 6.0, people: 56 }
            ], 
        };

        return supertest(courseUrl)
            .patch(`/` + MONGO_ZERO_ID + '/exam-stats')
            .send(requestBody)
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(404);
    });

    it('should return 400 if there is no grades', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const semesters = ['2023 S', '2023 W', '2024 S'];
        const mockCourse = await createCourseMockRequest(signInAdminResponse.token, {
            offeredInSemesters: semesters
        });

        const requestBody: TestPatchCourseExamStatsDto = {
            semester: '2023 S',
            examType: 'endterm',
            grades: [],
        };

        return supertest(courseUrl)
            .patch(`/` + mockCourse.id + '/exam-stats')
            .send(requestBody)
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(400);
    });

    it('should return 400 if exam type is invalid', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const semesters = ['2023 S', '2023 W', '2024 S'];
        const mockCourse = await createCourseMockRequest(signInAdminResponse.token, {
            offeredInSemesters: semesters
        });

        const requestBody: TestPatchCourseExamStatsDto = {
            semester: '2023 S',
            examType: 'invalid',
            grades: [
                { grade: 1.0, people: 13 },
                { grade: 1.3, people: 22 },
                { grade: 1.7, people: 39 },
                { grade: 2.0, people: 41 },
                { grade: 2.3, people: 21 },
                { grade: 2.7, people: 23 },
                { grade: 3.0, people: 20 },
                { grade: 3.3, people: 17 },
                { grade: 3.7, people: 14 },
                { grade: 4.0, people: 11 },
                { grade: 4.3, people: 8 },
                { grade: 4.7, people: 10 },
                { grade: 5.0, people: 9 },
                { grade: 6.0, people: 56 }
            ], 
        };

        return supertest(courseUrl)
            .patch(`/` + mockCourse.id + '/exam-stats')
            .send(requestBody)
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(400);
    });

    it('should return 400 if semesters are not aligned', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const semesters = ['2023 S', '2023 W', '2024 S'];
        const mockCourse = await createCourseMockRequest(signInAdminResponse.token, {
            offeredInSemesters: semesters
        });

        const requestBody: TestPatchCourseExamStatsDto = {
            semester: '2020 S',
            examType: 'retake',
            grades: [
                { grade: 1.0, people: 13 },
                { grade: 1.3, people: 22 },
                { grade: 1.7, people: 39 },
                { grade: 2.0, people: 41 },
                { grade: 2.3, people: 21 },
                { grade: 2.7, people: 23 },
                { grade: 3.0, people: 20 },
                { grade: 3.3, people: 17 },
                { grade: 3.7, people: 14 },
                { grade: 4.0, people: 11 },
                { grade: 4.3, people: 8 },
                { grade: 4.7, people: 10 },
                { grade: 5.0, people: 9 },
                { grade: 6.0, people: 56 }
            ], 
        };

        return supertest(courseUrl)
            .patch(`/` + mockCourse.id + '/exam-stats')
            .send(requestBody)
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(400);
    });

    it('should return 403 if called with user token', async () => {
        const signInAdminResponse = await signInAdminRequestMock();
        const signInUserResponse = await signInRequestMock();

        const semesters = ['2023 S', '2023 W', '2024 S'];
        const mockCourse = await createCourseMockRequest(signInAdminResponse.token, {
            offeredInSemesters: semesters
        });

        const requestBody: TestPatchCourseExamStatsDto = {
            semester: '2023 S',
            examType: 'retake',
            grades: [
                { grade: 1.0, people: 13 },
                { grade: 1.3, people: 22 },
                { grade: 1.7, people: 39 },
                { grade: 2.0, people: 41 },
                { grade: 2.3, people: 21 },
                { grade: 2.7, people: 23 },
                { grade: 3.0, people: 20 },
                { grade: 3.3, people: 17 },
                { grade: 3.7, people: 14 },
                { grade: 4.0, people: 11 },
                { grade: 4.3, people: 8 },
                { grade: 4.7, people: 10 },
                { grade: 5.0, people: 9 },
                { grade: 6.0, people: 56 }
            ], 
        };

        return supertest(courseUrl)
            .patch(`/` + mockCourse.id + '/exam-stats')
            .send(requestBody)
            .set('Authorization', 'Bearer ' + signInUserResponse.token)
            .expect(403);
    });

    it('should return 401 if called without token', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const semesters = ['2023 S', '2023 W', '2024 S'];
        const mockCourse = await createCourseMockRequest(signInAdminResponse.token, {
            offeredInSemesters: semesters
        });

        const requestBody: TestPatchCourseExamStatsDto = {
            semester: '2023 S',
            examType: 'retake',
            grades: [
                { grade: 1.0, people: 13 },
                { grade: 1.3, people: 22 },
                { grade: 1.7, people: 39 },
                { grade: 2.0, people: 41 },
                { grade: 2.3, people: 21 },
                { grade: 2.7, people: 23 },
                { grade: 3.0, people: 20 },
                { grade: 3.3, people: 17 },
                { grade: 3.7, people: 14 },
                { grade: 4.0, people: 11 },
                { grade: 4.3, people: 8 },
                { grade: 4.7, people: 10 },
                { grade: 5.0, people: 9 },
                { grade: 6.0, people: 56 }
            ], 
        };

        return supertest(courseUrl)
            .patch(`/` + mockCourse.id + '/exam-stats')
            .send(requestBody)
            .expect(401);
    });

    it('should return 400 if grade is out of range', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const semesters = ['2023 S', '2023 W', '2024 S'];
        const mockCourse = await createCourseMockRequest(signInAdminResponse.token, {
            offeredInSemesters: semesters
        });

        const requestBody: TestPatchCourseExamStatsDto = {
            semester: '2023 S',
            examType: 'retake',
            grades: [
                { grade: 1.0, people: 13 },
                { grade: 1.3, people: 22 },
                { grade: 1.7, people: 39 },
                { grade: 2.0, people: 41 },
                { grade: 2.3, people: 21 },
                { grade: 2.7, people: 23 },
                { grade: 3.0, people: 20 },
                { grade: 3.3, people: 17 },
                { grade: 3.7, people: 14 },
                { grade: 4.0, people: 11 },
                { grade: 4.3, people: 8 },
                { grade: 4.7, people: 10 },
                { grade: 5.0, people: 9 },
                { grade: 5.1, people: 56 },
                { grade: 6.0, people: 56 }
            ], 
        };

        return supertest(courseUrl)
            .patch(`/` + mockCourse.id + '/exam-stats')
            .send(requestBody)
            .set('Authorization', 'Bearer ' + signInAdminResponse.token)
            .expect(400);
    });
});