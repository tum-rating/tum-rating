export interface UserAddReviewInput {
    howInterestingRating: number;
    howEasyRating: number;
    comment: string;
    semester: string;
}
export declare function useAddUserReview(courseId: string, type: "POST" | "PUT"): any;
