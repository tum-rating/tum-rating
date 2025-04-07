type FetchedComputedCourse = {
    name: string;
    merged?: FetchedCourse[];
    codes?: string[];
    offeredInSemesters: string[];
    professor: string;
    courseId: string;
    courseNumber: string;
    id: string;
    acceptedCount?: number;
    rejectedCount?: number;
    notResolvedCount?: number;
    lockedCount?: number;
    badMerge?: boolean;
}


type FetchedCourse = {
    id: string;
    courseId: string;
    courseNumber: string;
    professor: string;
    otherLecturers: string[];
    name: string;
    offeredInSemesters: string[];
    reviews: any[];
    howInterestingRatingAverage: number;
    howEasyRatingAverage: number;
    votesNumber: number;
    similarity: number;
    codes?: string[];
    accepted?: boolean | null;
    acceptedCount?: number;
    rejectedCount?: number;
    notResolvedCount?: number;
    lockedCount?: number;
    locked?: boolean;
    badMerge?: boolean;
}

type FetchedData = {
    computedCourses: FetchedComputedCourse[];
    allCoursesMap: Record<string, number>;
    allCourses: FetchedCourse[];
}
type FileData = {
    id: string;
    name: string;
    size: number;
    lastModified: Date;
};

export type { FileData, FetchedData, FetchedComputedCourse, FetchedCourse };

