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

describe('Get Course Exam Stats', () => {
    it('should get course exam stats with a single key', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const semester = '1939 S';
        const mockCourse = await createCourseMockRequest(signInAdminResponse.token, {
            offeredInSemesters: [semester],
        });

        const patchCourseExamStatsResponse = await patchCourseExamStatsMockRequest(signInAdminResponse.token, mockCourse.id, {
            examType: 'endterm',
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

        return supertest(courseUrl)
            .get('/' + mockCourse.id)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body.id).toEqual(mockCourse.id);
                expect(response.body.courseId).toEqual(mockCourse.courseId);
                expect(response.body.name).toEqual(mockCourse.name);
                expect(response.body.professor).toEqual(mockCourse.professor);
                expect(response.body.courseNumber).toEqual(mockCourse.courseNumber);
                expect(response.body.reviews).toBeDefined();
                const examStats = response.body.examStats;
                expect(examStats).toHaveProperty(semester);
                expect(examStats[semester]).toHaveProperty('endterm');
                const semesterEndtermExamStats = response.body.examStats[semester].endterm;
                expect(semesterEndtermExamStats).toHaveProperty('peopleTotal');
                expect(semesterEndtermExamStats.peopleTotal).toBe(96);
                expect(semesterEndtermExamStats).toHaveProperty('attemptsTotal');
                expect(semesterEndtermExamStats.attemptsTotal).toBe(76);
                expect(semesterEndtermExamStats).toHaveProperty('peopleAttemptsFailed');
                expect(semesterEndtermExamStats.peopleAttemptsFailed).toBe(22);
                expect(semesterEndtermExamStats).toHaveProperty('attemptsFailedPercentage');
                expect(semesterEndtermExamStats.attemptsFailedPercentage).toBe(28.95);
                expect(semesterEndtermExamStats).toHaveProperty('averageAttemptsTotal');
                expect(semesterEndtermExamStats.averageAttemptsTotal).toBe(3.25);
                expect(semesterEndtermExamStats).toHaveProperty('averageAttemptsPassed');
                expect(semesterEndtermExamStats.averageAttemptsPassed).toBe(2.64);
                expect(semesterEndtermExamStats).toHaveProperty('grades');
                const grades = semesterEndtermExamStats.grades;
                expect(grades).toHaveLength(14);
                expect(grades.find((grade) => grade.grade === '1.0').people).toBe(5);
                expect(grades.find((grade) => grade.grade === '1.3').people).toBe(6);
                expect(grades.find((grade) => grade.grade === '1.7').people).toBe(5);
                expect(grades.find((grade) => grade.grade === '2.0').people).toBe(5);
                expect(grades.find((grade) => grade.grade === '2.3').people).toBe(4);
                expect(grades.find((grade) => grade.grade === '2.7').people).toBe(2);
                expect(grades.find((grade) => grade.grade === '3.0').people).toBe(6);
                expect(grades.find((grade) => grade.grade === '3.3').people).toBe(5);
                expect(grades.find((grade) => grade.grade === '3.7').people).toBe(7);
                expect(grades.find((grade) => grade.grade === '4.0').people).toBe(9);
                expect(grades.find((grade) => grade.grade === '4.3').people).toBe(7);
                expect(grades.find((grade) => grade.grade === '4.7').people).toBe(2);
                expect(grades.find((grade) => grade.grade === '5.0').people).toBe(13);
                expect(grades.find((grade) => grade.grade === '6.0').people).toBe(20);
            });
    });

    it('should get course exam stats with a multiple keys', async () => {
        const signInAdminResponse = await signInAdminRequestMock();

        const semesters = ['2023 S', '2023 W', '2024 S'];
        const mockCourse = await createCourseMockRequest(signInAdminResponse.token, {
            offeredInSemesters: semesters,
        });

        const patchCourseExamStatsResponse = await patchCourseExamStatsMockRequest(signInAdminResponse.token, mockCourse.id, {
            examType: 'endterm',
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

        await supertest(courseUrl)
            .get('/' + mockCourse.id)
            .expect(200)
            .expect((response: supertest.Response) => {
                expect(response.body.id).toEqual(mockCourse.id);
                expect(response.body.courseId).toEqual(mockCourse.courseId);
                expect(response.body.name).toEqual(mockCourse.name);
                expect(response.body.professor).toEqual(mockCourse.professor);
                expect(response.body.courseNumber).toEqual(mockCourse.courseNumber);
                expect(response.body.reviews).toBeDefined();

                const examStats = response.body.examStats;

                // semester[0] endterm
                expect(examStats).toHaveProperty(semesters[0]);
                expect(examStats[semesters[0]]).toHaveProperty('endterm');
                const semester0EndtermExamStats = response.body.examStats[semesters[0]].endterm;
                expect(semester0EndtermExamStats).toHaveProperty('peopleTotal');
                expect(semester0EndtermExamStats.peopleTotal).toBe(96);
                expect(semester0EndtermExamStats).toHaveProperty('attemptsTotal');
                expect(semester0EndtermExamStats.attemptsTotal).toBe(76);
                expect(semester0EndtermExamStats).toHaveProperty('peopleAttemptsFailed');
                expect(semester0EndtermExamStats.peopleAttemptsFailed).toBe(22);
                expect(semester0EndtermExamStats).toHaveProperty('attemptsFailedPercentage');
                expect(semester0EndtermExamStats.attemptsFailedPercentage).toBe(28.95);
                expect(semester0EndtermExamStats).toHaveProperty('averageAttemptsTotal');
                expect(semester0EndtermExamStats.averageAttemptsTotal).toBe(3.25);
                expect(semester0EndtermExamStats).toHaveProperty('averageAttemptsPassed');
                expect(semester0EndtermExamStats.averageAttemptsPassed).toBe(2.64);
                expect(semester0EndtermExamStats).toHaveProperty('grades');
                const grades = semester0EndtermExamStats.grades;
                expect(grades).toHaveLength(14);
                expect(grades.find((grade) => grade.grade === '1.0').people).toBe(5);
                expect(grades.find((grade) => grade.grade === '1.3').people).toBe(6);
                expect(grades.find((grade) => grade.grade === '1.7').people).toBe(5);
                expect(grades.find((grade) => grade.grade === '2.0').people).toBe(5);
                expect(grades.find((grade) => grade.grade === '2.3').people).toBe(4);
                expect(grades.find((grade) => grade.grade === '2.7').people).toBe(2);
                expect(grades.find((grade) => grade.grade === '3.0').people).toBe(6);
                expect(grades.find((grade) => grade.grade === '3.3').people).toBe(5);
                expect(grades.find((grade) => grade.grade === '3.7').people).toBe(7);
                expect(grades.find((grade) => grade.grade === '4.0').people).toBe(9);
                expect(grades.find((grade) => grade.grade === '4.3').people).toBe(7);
                expect(grades.find((grade) => grade.grade === '4.7').people).toBe(2);
                expect(grades.find((grade) => grade.grade === '5.0').people).toBe(13);
                expect(grades.find((grade) => grade.grade === '6.0').people).toBe(20);

                // semester[0] retake
                expect(examStats[semesters[0]]).toHaveProperty('retake');
                const semester0RetakeExamStats = response.body.examStats[semesters[0]].retake;
                expect(semester0RetakeExamStats).toHaveProperty('peopleTotal');
                expect(semester0RetakeExamStats.peopleTotal).toBe(912);
                expect(semester0RetakeExamStats).toHaveProperty('attemptsTotal');
                expect(semester0RetakeExamStats.attemptsTotal).toBe(903);
                expect(semester0RetakeExamStats).toHaveProperty('peopleAttemptsFailed');
                expect(semester0RetakeExamStats.peopleAttemptsFailed).toBe(137);
                expect(semester0RetakeExamStats).toHaveProperty('attemptsFailedPercentage');
                expect(semester0RetakeExamStats.attemptsFailedPercentage).toBe(15.17);
                expect(semester0RetakeExamStats).toHaveProperty('averageAttemptsTotal');
                expect(semester0RetakeExamStats.averageAttemptsTotal).toBe(2.07);
                expect(semester0RetakeExamStats).toHaveProperty('averageAttemptsPassed');
                expect(semester0RetakeExamStats.averageAttemptsPassed).toBe(1.55);

                // semester[1] endterm
                expect(examStats).toHaveProperty(semesters[1]);
                expect(examStats[semesters[1]]).toHaveProperty('endterm');
                const semester1EndtermExamStats = response.body.examStats[semesters[1]].endterm;
                expect(semester1EndtermExamStats).toHaveProperty('peopleTotal');
                expect(semester1EndtermExamStats.peopleTotal).toBe(1556);
                expect(semester1EndtermExamStats).toHaveProperty('attemptsTotal');
                expect(semester1EndtermExamStats.attemptsTotal).toBe(1556);
                expect(semester1EndtermExamStats).toHaveProperty('peopleAttemptsFailed');
                expect(semester1EndtermExamStats.peopleAttemptsFailed).toBe(357);
                expect(semester1EndtermExamStats).toHaveProperty('attemptsFailedPercentage');
                expect(semester1EndtermExamStats.attemptsFailedPercentage).toBe(22.94);
                expect(semester1EndtermExamStats).toHaveProperty('averageAttemptsTotal');
                expect(semester1EndtermExamStats.averageAttemptsTotal).toBe(3.18);
                expect(semester1EndtermExamStats).toHaveProperty('averageAttemptsPassed');
                expect(semester1EndtermExamStats.averageAttemptsPassed).toBe(2.70);
            });
    });
});