export declare const endpoints: {
    base: string;
    getAllReviews: string;
    getSpecificReview: (id: string) => string;
    postSpecificReview: (courseId: string, userId: string) => string;
    getPaginatedReviews: (pageNumber: number, pageSize: number) => string;
    searchReviews: (query: string) => string;
    postReviewProposal: string;
    searchReviewsOnCurrentPage: (pageNumber: number, pageSize: number, search: string) => string;
    signup: string;
    signin: string;
    activate: string;
    recovery: string;
    user: string;
};
