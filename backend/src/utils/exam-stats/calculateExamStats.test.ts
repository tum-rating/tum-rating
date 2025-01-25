import { ExamGrade, ExamStats } from '@tum-rating/backend/src/database/documents/examStats';
import { calculateExamStats } from './calculateExamStats';

const testCases = [
    {
        grades: [
            { grade: ExamGrade.GRADE_1_0, people: 4 },
            { grade: ExamGrade.GRADE_1_3, people: 53 },
            { grade: ExamGrade.GRADE_1_7, people: 71 },
            { grade: ExamGrade.GRADE_2_0, people: 73 },
            { grade: ExamGrade.GRADE_2_3, people: 61 },
            { grade: ExamGrade.GRADE_2_7, people: 48 },
            { grade: ExamGrade.GRADE_3_0, people: 45 },
            { grade: ExamGrade.GRADE_3_3, people: 47 },
            { grade: ExamGrade.GRADE_3_7, people: 46 },
            { grade: ExamGrade.GRADE_4_0, people: 38 },
            { grade: ExamGrade.GRADE_4_3, people: 34 },
            { grade: ExamGrade.GRADE_4_7, people: 31 },
            { grade: ExamGrade.GRADE_5_0, people: 71 },
            { grade: ExamGrade.GRADE_6_0, people: 126 },
        ],
        result: {
            peopleTotal: 748,
            peopleFailed: 136,
            attemptsTotal: 622,
            attemptsFailedPercent: 21.86,
            averageTotal: 3.00,
            averagePassed: 2.51
        }
    },
    {
        grades: [
            { grade: ExamGrade.GRADE_1_0, people: 55 },
            { grade: ExamGrade.GRADE_1_3, people: 50 },
            { grade: ExamGrade.GRADE_1_7, people: 75 },
            { grade: ExamGrade.GRADE_2_0, people: 76 },
            { grade: ExamGrade.GRADE_2_3, people: 87 },
            { grade: ExamGrade.GRADE_2_7, people: 70 },
            { grade: ExamGrade.GRADE_3_0, people: 58 },
            { grade: ExamGrade.GRADE_3_3, people: 64 },
            { grade: ExamGrade.GRADE_3_7, people: 46 },
            { grade: ExamGrade.GRADE_4_0, people: 14 },
            { grade: ExamGrade.GRADE_5_0, people: 76 },
            { grade: ExamGrade.GRADE_6_0, people: 115 },
        ],
        result: {
            peopleTotal: 786,
            peopleFailed: 76,
            attemptsTotal: 671,
            attemptsFailedPercent: 11.33,
            averageTotal: 2.65,
            averagePassed: 2.35
        }
    },
    {
        grades: [
            { grade: ExamGrade.GRADE_1_0, people: 3 },
            { grade: ExamGrade.GRADE_1_3, people: 1 },
            { grade: ExamGrade.GRADE_1_7, people: 1 },
            { grade: ExamGrade.GRADE_2_0, people: 3 },
            { grade: ExamGrade.GRADE_2_3, people: 3 },
            { grade: ExamGrade.GRADE_2_7, people: 3 },
            { grade: ExamGrade.GRADE_3_0, people: 3 },
            { grade: ExamGrade.GRADE_3_3, people: 1 },
            { grade: ExamGrade.GRADE_3_7, people: 2 },
            { grade: ExamGrade.GRADE_4_0, people: 2 },
            { grade: ExamGrade.GRADE_5_0, people: 20 },
            { grade: ExamGrade.GRADE_6_0, people: 26 },
        ],
        result: {
            peopleTotal: 68,
            peopleFailed: 20,
            attemptsTotal: 42,
            attemptsFailedPercent: 47.62,
            averageTotal: 3.68,
            averagePassed: 2.49
        }
    },
    {
        grades: [
            { grade: ExamGrade.GRADE_1_0, people: 1 },
            { grade: ExamGrade.GRADE_1_3, people: 11 },
            { grade: ExamGrade.GRADE_1_7, people: 31 },
            { grade: ExamGrade.GRADE_2_0, people: 26 },
            { grade: ExamGrade.GRADE_2_3, people: 50 },
            { grade: ExamGrade.GRADE_2_7, people: 69 },
            { grade: ExamGrade.GRADE_3_0, people: 36 },
            { grade: ExamGrade.GRADE_3_3, people: 44 },
            { grade: ExamGrade.GRADE_3_7, people: 71 },
            { grade: ExamGrade.GRADE_4_0, people: 42 },
            { grade: ExamGrade.GRADE_4_3, people: 25 },
            { grade: ExamGrade.GRADE_4_7, people: 19 },
            { grade: ExamGrade.GRADE_5_0, people: 39 },
            { grade: ExamGrade.GRADE_6_0, people: 50 },
        ],
        result: {
            peopleTotal: 514,
            peopleFailed: 83,
            attemptsTotal: 464,
            attemptsFailedPercent: 17.89,
            averageTotal: 3.23,
            averagePassed: 2.90
        }
    },
    {
        grades: [
            { grade: ExamGrade.GRADE_1_0, people: 3 },
            { grade: ExamGrade.GRADE_1_3, people: 17 },
            { grade: ExamGrade.GRADE_1_7, people: 13 },
            { grade: ExamGrade.GRADE_2_0, people: 13 },
            { grade: ExamGrade.GRADE_2_3, people: 14 },
            { grade: ExamGrade.GRADE_2_7, people: 17 },
            { grade: ExamGrade.GRADE_3_0, people: 15 },
            { grade: ExamGrade.GRADE_3_3, people: 10 },
            { grade: ExamGrade.GRADE_3_7, people: 7 },
            { grade: ExamGrade.GRADE_4_0, people: 3 },
            { grade: ExamGrade.GRADE_4_3, people: 2 },
            { grade: ExamGrade.GRADE_4_7, people: 1 },
            { grade: ExamGrade.GRADE_5_0, people: 4 },
            { grade: ExamGrade.GRADE_6_0, people: 28 },
        ],
        result: {
            peopleTotal: 147,
            peopleFailed: 7,
            attemptsTotal: 119,
            attemptsFailedPercent: 5.88,
            averageTotal: 2.53,
            averagePassed: 2.39
        }
    },
    {
        grades: [
            { grade: ExamGrade.GRADE_1_0, people: 3 },
            { grade: ExamGrade.GRADE_1_3, people: 17 },
            { grade: ExamGrade.GRADE_1_7, people: 13 },
            { grade: ExamGrade.GRADE_2_0, people: 13 },
            { grade: ExamGrade.GRADE_2_3, people: 14 },
            { grade: ExamGrade.GRADE_2_7, people: 17 },
            { grade: ExamGrade.GRADE_3_0, people: 15 },
            { grade: ExamGrade.GRADE_3_3, people: 10 },
            { grade: ExamGrade.GRADE_3_7, people: 7 },
            { grade: ExamGrade.GRADE_4_0, people: 3 },
            { grade: ExamGrade.GRADE_4_7, people: 4 },
            { grade: ExamGrade.GRADE_5_0, people: 4 },
            { grade: ExamGrade.GRADE_6_0, people: 38 },
        ],
        result: {
            peopleTotal: 158,
            peopleFailed: 8,
            attemptsTotal: 120,
            attemptsFailedPercent: 6.67,
            averageTotal: 2.55,
            averagePassed: 2.39
        }
    },
    {
        grades: [
            { grade: ExamGrade.GRADE_1_7, people: 1 },
            { grade: ExamGrade.GRADE_2_0, people: 2 },
            { grade: ExamGrade.GRADE_2_3, people: 5 },
            { grade: ExamGrade.GRADE_2_7, people: 1 },
            { grade: ExamGrade.GRADE_3_0, people: 5 },
            { grade: ExamGrade.GRADE_3_3, people: 5 },
            { grade: ExamGrade.GRADE_3_7, people: 7 },
            { grade: ExamGrade.GRADE_4_0, people: 19 },
            { grade: ExamGrade.GRADE_4_3, people: 8 },
            { grade: ExamGrade.GRADE_4_7, people: 18 },
            { grade: ExamGrade.GRADE_5_0, people: 42 },
            { grade: ExamGrade.GRADE_6_0, people: 52 },
        ],
        result: {
            peopleTotal: 165,
            peopleFailed: 68,
            attemptsTotal: 113,
            attemptsFailedPercent: 60.18,
            averageTotal: 4.27,
            averagePassed: 3.41
        }
    },
    {
        grades: [
            { grade: ExamGrade.GRADE_1_0, people: 1 },
            { grade: ExamGrade.GRADE_1_3, people: 2 },
            { grade: ExamGrade.GRADE_1_7, people: 2 },
            { grade: ExamGrade.GRADE_2_0, people: 2 },
            { grade: ExamGrade.GRADE_2_3, people: 4 },
            { grade: ExamGrade.GRADE_2_7, people: 2 },
            { grade: ExamGrade.GRADE_3_0, people: 2 },
            { grade: ExamGrade.GRADE_3_3, people: 2 },
            { grade: ExamGrade.GRADE_3_7, people: 1 },
            { grade: ExamGrade.GRADE_4_0, people: 2 },
            { grade: ExamGrade.GRADE_4_3, people: 7 },
            { grade: ExamGrade.GRADE_4_7, people: 5 },
            { grade: ExamGrade.GRADE_5_0, people: 6 },
            { grade: ExamGrade.GRADE_6_0, people: 31 },
        ],
        result: {
            peopleTotal: 69,
            peopleFailed: 18,
            attemptsTotal: 38,
            attemptsFailedPercent: 47.37,
            averageTotal: 3.51,
            averagePassed: 2.50
        }
    }
];

describe('calculateExamStats', () => {
    it.each(testCases)('should calculate exam stats correctly', ({ grades, result }) => {
        const examStats = calculateExamStats({grades});
        expect(examStats.peopleTotal).toEqual(result.peopleTotal);
        expect(examStats.peopleAttemptsFailed).toEqual(result.peopleFailed);
        expect(examStats.attemptsTotal).toEqual(result.attemptsTotal);
        expect(examStats.attemptsFailedPercentage).toEqual(result.attemptsFailedPercent);
        expect(examStats.averageAttemptsTotal).toEqual(result.averageTotal);
        expect(examStats.averageAttemptsPassed).toEqual(result.averagePassed);
    });
});