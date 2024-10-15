type CourseProposal = {
    url: string;
    createdAt: string;
    id: string;
    userId: string;
};

type Review = {
    id: string;
    userId: string;
    userName: string;
    courseId: string;
    howInterestingRating: number;
    howEasyRating: number;
    comment: string;
    semester: string;
    createdAt: string;
    updatedAt: string;
};

type ReadyCourseProposal = {
    courseId: string;
    courseNumber: string;
    professor: string;
    otherLecturers: string[];
    name: string;
    offeredInSemesters: string[];
};

type Course = {
    courseId: string;
    courseNumber: string;
    professor: string;
    otherLecturers: string[];
    createdAt: string;
    userId: string;
    name: string;
    offeredInSemesters: string[];
    id: string;
};

type User = {
    id: string;
    email: string;
    username: string;
    isEmailActivated: boolean;
    isBanned: boolean;
    role: number;
};

type Toggle = {
    enabled: boolean;
    name: string;
    description: string;
}

export type {CourseProposal, User, Course, ReadyCourseProposal, Review, Toggle};
