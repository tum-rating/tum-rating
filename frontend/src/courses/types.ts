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
    __v: number;
}
