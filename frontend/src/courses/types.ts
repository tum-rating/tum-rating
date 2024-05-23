export interface Course {
    _id: string;
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
    _id: string;
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
