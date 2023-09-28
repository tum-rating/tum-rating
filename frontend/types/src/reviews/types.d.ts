export interface Review {
    _id: string;
    professor: string;
    course: string;
    courseId: string;
    courseNumber: string;
    createdAt: string;
    updatedAt: string;
    howInterestingRatingAverage: number;
    howEasyRatingAverage: number;
    votesNumber: number;
    offeredInSemesters: string[];
}
export interface DetailReview {
    _id: string;
    professor: string;
    course: string;
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
