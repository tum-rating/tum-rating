type CourseProposal = {
    courseId: string,
    courseNumber: string,
    professor: string,
    otherLecturers: string[],
    userId: string,
    name: string,
    offeredInSemesters: string[],
    _id: string,
}

type Course = {
    courseId: string,
    courseNumber: string,
    professor: string,
    otherLecturers: string[],
    createdAt: string,
    userId: string,
    name: string,
    offeredInSemesters: string[],
    _id: string,
}

type User = {
    id: string,
    email: string,
    username: string,
    isEmailActivated: boolean,
    isBanned: boolean,
    role: number
}


export type { CourseProposal, User, Course }