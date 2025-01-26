import { ExamGrade, ExamStats } from 'src/database/documents/examStats';

export const calculateExamStats = (examStats: Pick<ExamStats, 'grades'>): ExamStats => {
    const peopleTotal = examStats.grades.reduce((acc, grade) => acc + grade.people, 0);
    const attemptsTotal = examStats.grades.filter(gradeStats => gradeStats.grade <= ExamGrade.GRADE_5_0).reduce((acc, gradeStats) => acc + gradeStats.people, 0);
    const peopleAttemptsFailed = examStats.grades.filter(gradeStats => gradeStats.grade >= ExamGrade.GRADE_4_3 && gradeStats.grade < ExamGrade.GRADE_6_0).reduce((acc, grade) => acc + grade.people, 0);
    const attemptsFailedPercentage = roundToTwoDecimals((peopleAttemptsFailed / attemptsTotal) * 100);
    const averageAttemptsTotal = roundToTwoDecimals(examStats.grades.filter((gradesStats) => gradesStats.grade <= ExamGrade.GRADE_5_0).reduce((acc, grade) => acc + grade.grade * grade.people, 0) / attemptsTotal);
    const averageAttemptsPassed = roundToTwoDecimals(examStats.grades.filter(grade => grade.grade <= ExamGrade.GRADE_4_0).reduce((acc, grade) => acc + grade.grade * grade.people, 0) / (attemptsTotal - peopleAttemptsFailed));

    return {
        peopleTotal,
        peopleAttemptsFailed,
        attemptsTotal,
        attemptsFailedPercentage,
        averageAttemptsTotal,
        averageAttemptsPassed,
        grades: examStats.grades,
    };
}

const roundToTwoDecimals = (num: number): number => {
    return parseFloat(num.toFixed(2));
}
