const baseDomain = import.meta.env.VITE_API_BASE;
const api = '/api';
const apiVersion = '/v1';
const baseApiUrl = baseDomain + api + apiVersion;
const authBase = baseApiUrl + '/auth';
const coursesBase = baseApiUrl + '/courses';
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

type CoursesEndpoints = {
    base: string;
    getAllCourses: string;
    getSpecificCourse: (id: string) => string;
    postSpecificReview: (courseId: string, userId: string) => string;
    getPaginatedCourses: (pageNumber: number, pageSize: number) => string;
    searchCourses: (query: string) => string;
    postCourseProposal: string;
    searchCoursesOnCurrentPage: (pageNumber: number, pageSize: number, search: string) => string;
};

const Courses: CoursesEndpoints = {
    base: coursesBase,
    getAllCourses: coursesBase,
    postCourseProposal: baseApiUrl + '/course-proposals',
    getSpecificCourse: (id: string) => `${coursesBase}/${id}`,
    postSpecificReview: (courseId: string, userId: string) => `${coursesBase}/${courseId}/user/${userId}`,
    getPaginatedCourses: (pageNumber: number, pageSize: number) => `${coursesBase}?page-number=${pageNumber}&page-size=${pageSize}`,
    searchCourses: (query: string) => `${coursesBase}?search=${query}`,
    searchCoursesOnCurrentPage: (pageNumber: number, pageSize: number, search: string) => `${coursesBase}?page-number=${pageNumber}&page-size=${pageSize}&search=${search}`,
};

type AdminEndpoints = {
    //---COURSES
    addCourse: string;
    editCourse: (courseId: string) => string;
    //---PROPOSALS
    getAllProposals: string;
    getSingleProposal: (proposalId: string) => string;
    acceptProposal: (proposalId: string) => string;
    removeProposal: (proposalId: string) => string;
    //---USER
    getUser: (userId: string) => string;
    getAllUsers: string;
    removeUser: (userId: string) => string;
    banUser: (userId: string) => string;
};

const admin: AdminEndpoints = {
    getUser: (userId: string) => baseApiUrl + `/users/${userId}`,
    getAllUsers: baseApiUrl + '/users',
    getAllProposals: baseApiUrl + '/course-proposals',
    getSingleProposal: (proposalId: string) => `${baseApiUrl}/course-proposals/${proposalId}`,
    acceptProposal: (proposalId: string) => `${baseApiUrl}/course-proposals/${proposalId}/accept`,
    removeProposal: (proposalId: string) => `${baseApiUrl}/course-proposals/${proposalId}`,
    removeUser: (userId: string) => `${baseApiUrl}/users/${userId}`,
    banUser: (userId: string) => `${baseApiUrl}/users/${userId}/ban`,
    addCourse: `${baseApiUrl}/courses`,
    editCourse: (courseId: string) => `${baseApiUrl}/courses/${courseId}`,
};

type AdminScraperEndpoints = {
    scrapeCourse: (id: string) => string
}

const adminScraper: AdminScraperEndpoints = {
    scrapeCourse: (id: string) => `https://campus.tum.de/tumonline/ee/rest/slc.tm.cp/student/courses/${id}`,
};

export const endpoints = {
    ...auth,
    ...Courses,
    ...admin,
    ...adminScraper
};
