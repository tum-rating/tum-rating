import {UseInfiniteQueryOptions} from '@tanstack/react-query';

import {Course} from './types.ts';

import {endpoints} from '@/api';
import {fetchWithServices} from '@/api/fetchWithServices.ts';
import {useInfiniteQueryWithAuth} from '@/api/useInfiniteQueryWithAuth.tsx';
import {TRENDING_PAGE_SIZE} from '@/constants';
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

export type PaginatedCourses = {
    results: Course[];
    nextPageNumber: number;
};

async function getPaginatedTrendingCourses({pageParam = 1}): Promise<PaginatedCourses> {
    const response = await fetchWithServices(endpoints.getPaginatedTrendingCourses(pageParam, TRENDING_PAGE_SIZE));
    const data = await response.json();
    if (!response.ok) throw new ResponseError(data.message, response, `page-${pageParam}`);
    return data;
}

interface PaginatedTrendingCoursesProps extends Partial<UseInfiniteQueryOptions> {}

export function usePaginatedTrendingCourses(props: PaginatedTrendingCoursesProps) {
    return useInfiniteQueryWithAuth({
        queryKey: [QUERY_KEY['trending_courses']],
        // @ts-ignore
        queryFn: getPaginatedTrendingCourses,
        getNextPageParam: (lastPage) => lastPage.nextPageNumber,
        refetchOnWindowFocus: false,
        initialPageParam: 1,
        retry: 3,
        staleTime: 1000 * 60 * 5,
        ...props,
    });
}
