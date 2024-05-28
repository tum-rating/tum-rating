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

export async function getReviews(query: string, pageNumber: number = 1, pageSize: number = PAGE_SIZE): Promise<Courses | null> {
    const endpoint = endpoints.searchCoursesOnCurrentPage(pageNumber, pageSize, query);
    const response = await fetch(endpoint);
    const data = await response.json();
    if (!response.ok) throw new ResponseError(data.message, response, query);
    return data;
}

export function useSearchCourses(query: string) {
    return useInfiniteQuery({
        queryKey: [QUERY_KEY.search_query, query],
        queryFn: ({ pageParam = 1 }) => getReviews(query, pageParam),
        getNextPageParam: (lastPage) => lastPage.nextPageNumber,
        refetchOnWindowFocus: false,
        initialPageParam: 1,
        staleTime: 1000 * 60 * 5,
    });
}
