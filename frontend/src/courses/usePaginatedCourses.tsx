import {Course} from './types.ts';

import {endpoints} from '@/api';
import {fetchWithServices} from "@/api/fetchWithServices.ts";
import {useInfiniteQueryWithAuth} from '@/api/useInfiniteQueryWithAuth.tsx';
import {PAGE_SIZE} from '@/constants';
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

export type PaginatedCourses = {
    courses: Course[];
    nextPageNumber: number;
};

async function getPaginatedCourses({pageParam = 1}): Promise<PaginatedCourses> {
    const response = await fetchWithServices(endpoints.getPaginatedCourses(pageParam, PAGE_SIZE));
    const data = await response.json();
    if (!response.ok) throw new ResponseError(data.message, response, `page-${pageParam}`);
    return data;
}

export function usePaginatedCourses() {
    return useInfiniteQueryWithAuth({
        queryKey: [QUERY_KEY.courses],
        // @ts-ignore
        queryFn: getPaginatedCourses,
        getNextPageParam: (lastPage) => lastPage.nextPageNumber,
        refetchOnWindowFocus: false,
        initialPageParam: 1,
        retry: 3,
        staleTime: 1000 * 60 * 5,
    });
}
