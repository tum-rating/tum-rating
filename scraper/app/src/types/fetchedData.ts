type FetchedComputedCourse = {
    name: string;
    merged?: FetchedCourse[];
    codes?: string[];
    offeredInSemesters: string[];
    professor: string;
    courseId: string;
    courseNumber: string;
    id: string;
}

type FetchedCourse = {
    id: string;
    courseId: string;
    courseNumber: string;
    professor: string;
    otherLecturers: string[];
    name: string;
    offeredInSemesters: string[];
    howInterestingRatingAverage: number;
    howEasyRatingAverage: number;
    votesNumber: number;
    distance: number;
    codes?: string[];
}

type FetchedData = {
    computedCourses: FetchedComputedCourse[];
    allCoursesMap: Record<string, number>;
    allCourses: FetchedCourse[];
}

export type {FetchedData, FetchedComputedCourse, FetchedCourse};
