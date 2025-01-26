export declare enum ExamGrade {
    GRADE_1_0 = "1.0",
    GRADE_1_3 = "1.3",
    GRADE_1_7 = "1.7",
    GRADE_2_0 = "2.0",
    GRADE_2_3 = "2.3",
    GRADE_2_7 = "2.7",
    GRADE_3_0 = "3.0",
    GRADE_3_3 = "3.3",
    GRADE_3_7 = "3.7",
    GRADE_4_0 = "4.0",
    GRADE_4_3 = "4.3",
    GRADE_4_7 = "4.7",
    GRADE_5_0 = "5.0",
    GRADE_6_0 = "6.0"
}
export declare class ExamStats {
    peopleTotal: number;
    attemptsTotal: number;
    peopleAttemptsFailed: number;
    attemptsFailedPercentage: number;
    averageAttemptsTotal: number;
    averageAttemptsPassed: number;
    grades: {
        grade: ExamGrade;
        people: number;
    }[];
}
export interface Course {
    id: string;
    professor: string;
    name: string;
    courseId: string;
    courseNumber: string;
    createdAt: string;
    updatedAt: string;
    howInterestingRatingAverage: number;
    howEasyRatingAverage: number;
    votesNumber: number;
    offeredInSemesters: string[];
}

export interface DetailCourse {
    id: string;
    professor: string;
    name: string;
    courseId: string;
    courseNumber: string;
    createdAt: string;
    updatedAt: string;
    offeredInSemesters: string[];
    howInterestingRatingAverage: number;
    howEasyRatingAverage: number;
    votesNumber: number;
    reviews: any[];
    examStats: {
        [key: string]: {
            [key: string]: ExamStats;
        };
    }
    __v: number;
}
