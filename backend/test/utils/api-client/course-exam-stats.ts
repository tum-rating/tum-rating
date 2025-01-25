import axios from 'axios';
import { faker } from '@faker-js/faker';

import { ExamType, PatchCourseExamStatsDto, PatchCourseExamStatsGradesDto } from '@tum-rating/backend/src/modules/course/dto/PatchCourseExamStatsRequest.dto';
import { ExamGrade } from '@tum-rating/backend/src/database/documents/examStats';
import { courseUrl } from './course';

export type TestPatchCourseExamStatsDto = Omit<PatchCourseExamStatsDto, 'examType'> & { examType: string };

export const generateExamStatsGrades = (): {grade: ExamGrade, people: number}[] => {
    const grades: {grade: ExamGrade, people: number}[] = [];

    // values of returns both keys and values, thus filter for the values
    const gradesValues = Object.values(ExamGrade).filter(value => typeof value === 'number');

    for (const grade of gradesValues) {
        grades.push({
            grade: grade as ExamGrade,
            people: faker.number.int({ min: 0, max: 100 }),
        });
    }

    return grades;
}

export const patchCourseExamStatsMockRequest = async (token: string, courseId: string, examStats: Partial<TestPatchCourseExamStatsDto>) => {

    const requestBody: TestPatchCourseExamStatsDto = {
        semester: '2023 S',
        examType: 'endterm',
        grades: generateExamStatsGrades(),
        ...examStats,
    };

    const patchCourseExamStatsResponse = await axios.patch(
        courseUrl + '/' + courseId + '/exam-stats', 
        requestBody, 
        { headers: { Authorization: 'Bearer ' + token } }
    );

    return patchCourseExamStatsResponse.data;
}