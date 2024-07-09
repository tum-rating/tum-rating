import {useInfiniteQuery} from '@tanstack/react-query';

import {endpoints} from '@/api';
import {PAGE_SIZE} from '@/constants';
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {Course} from '@/courses/types.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

type Courses = {
    courses: Course[];
    nextPageNumber: number;
};

async function getPaginatedCourses({pageParam = 1}): Promise<Courses> {
    const response = await fetch(endpoints.getPaginatedCourses(pageParam, PAGE_SIZE));
    const data = await response.json();
    if (!response.ok) {
        throw new ResponseError(data.message, response, 'courses');
    }
    return data;
}

export function useCourses() {
    return useInfiniteQuery({
        queryKey: [QUERY_KEY.admin_courses],
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        queryFn: getPaginatedCourses,
        getNextPageParam: (lastPage) => lastPage.nextPageNumber,
        initialPageParam: 1,
    });
}
