const baseDomain = import.meta.env.VITE_API_BASE;
const api = '/api';
const apiVersion = '/v1';
const baseApiUrl = baseDomain + api + apiVersion;
const authBase = baseApiUrl + '/auth';
const reviewsBase = baseApiUrl + '/reviews';
type AuthEndpoints = {
    base: string;
    signup: string;
    signin: string;
    activate: string;
    recovery: string;
    user: string;
};

const auth: AuthEndpoints = {
    base: authBase,
    signup: authBase + '/signup',
    signin: authBase + '/signin',
    activate: authBase + '/activate',
    recovery: authBase + '/recovery',
    user: baseApiUrl + '/users/me',
};

type ReviewsEndpoints = {
    base: string;
    getAllReviews: string;
    getSpecificReview: (id: string) => string;
    postSpecificReview: (courseId: string, userId: string) => string;
    getPaginatedReviews: (pageNumber: number, pageSize: number) => string;
    searchReviews: (query: string) => string;
    postReviewProposal: string;
    searchReviewsOnCurrentPage: (pageNumber: number, pageSize: number, search: string) => string;
};

const reviews: ReviewsEndpoints = {
    base: reviewsBase,
    getAllReviews: reviewsBase ,
    postReviewProposal: baseApiUrl + '/review-proposals',
    getSpecificReview: (id: string) => `${reviewsBase}/${id}`,
    postSpecificReview: (courseId: string, userId: string) => `${reviewsBase}/${courseId}/user/${userId}`,
    getPaginatedReviews: (pageNumber: number, pageSize: number) => `${reviewsBase}?page-number=${pageNumber}&page-size=${pageSize}`,
    searchReviews: (query: string) => `${reviewsBase}?search=${query}`,
    searchReviewsOnCurrentPage: (pageNumber: number, pageSize: number, search: string) => `${reviewsBase}?page-number=${pageNumber}&page-size=${pageSize}&search=${search}`,
};

type AdminEndpoints = {
    getAllUsers: string;
    getAllProposals: string;
    acceptProposal: (proposalId: string) => string;
    removeProposal: (proposalId: string) => string;
};

const admin: AdminEndpoints = {
    getAllUsers: baseApiUrl + '/users',
    getAllProposals: baseApiUrl + '/review-proposals',
    acceptProposal: (proposalId: string) => `${baseApiUrl}/review-proposals/${proposalId}/accept`,
    removeProposal: (proposalId: string) => `${baseApiUrl}/review-proposals/${proposalId}`,
};

export const endpoints = {
    ...auth,
    ...reviews,
    ...admin
};
