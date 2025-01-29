import axios from 'axios';
import { faker } from '@faker-js/faker';

import { ExamType, PatchCourseExamStatsDto, PatchCourseExamStatsGradesDto } from '@tum-rating/backend/src/modules/course/dto/PatchCourseExamStatsRequest.dto';
import { ExamGrade } from '@tum-rating/backend/src/database/documents/examStats';
import { courseUrl } from './course';

export type TestPatchCourseExamStatsDto = Omit<PatchCourseExamStatsDto, 'examType'> & { examType: string };

export const generateExamStatsGrades = (): {grade: number, people: number}[] => {
    const grades: {grade: number, people: number}[] = [];

    const count = faker.number.int({ min: 5, max: 16});
    const gradeValues: number[] = []
    while (gradeValues.length < count) {
        const gradeValue = faker.number.float({
            min: ExamGrade.GRADE_HIGHEST,
            max: ExamGrade.GRADE_LOWEST,
            multipleOf: 0.1,
        });

        if (!gradeValues.includes(gradeValue)) {
            gradeValues.push(gradeValue);
        }
    }

    for (const grade of gradeValues) {
        grades.push({
            grade: grade,
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