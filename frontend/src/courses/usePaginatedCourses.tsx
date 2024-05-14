import { useInfiniteQuery } from '@tanstack/react-query';

import { Course } from './types.ts';

import { endpoints } from '@/api';
import { PAGE_SIZE } from '@/constants';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

type Courses = {
    courses: Course[];
    nextPageNumber: number;
};

async function getPaginatedCourses({ pageParam = 1 }): Promise<Courses> {
    const response = await fetch(endpoints.getPaginatedCourses(pageParam, PAGE_SIZE));
    const data = await response.json();
    if (!response.ok) throw new ResponseError(data.message, response, `page-${pageParam}`);
    return data;
}

export function usePaginatedCourses() {
    return useInfiniteQuery({
        queryKey: [QUERY_KEY.courses],
        queryFn: getPaginatedCourses,
        getNextPageParam: (lastPage) => lastPage.nextPageNumber,
        refetchOnWindowFocus: false,
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5,
    });
}
