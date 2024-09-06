import {useInfiniteQuery} from '@tanstack/react-query';

import {Review} from "@/admin/types.ts";
import {endpoints} from '@/api';
import {fetchWithServices} from '@/api/fetchWithServices.ts';
import {PAGE_SIZE} from '@/constants';
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

type Reviews = {
    results: Review[];
    nextPageNumber: number;
};

async function getPaginatedReviews({pageParam = 1, userId, courseId}: {pageParam?: number, userId?: string, courseId?: string}): Promise<Reviews> {
    const response = await fetchWithServices(endpoints.getPaginatedReviews(pageParam, PAGE_SIZE, userId, courseId));
    const data = await response.json();
    if (!response.ok) {
        throw new ResponseError(data.message, response, 'courses');
    }
    return data;
}

export function useReviews({userId, courseId}: {userId?: string, courseId?: string}) {
    return useInfiniteQuery({
        queryKey: [QUERY_KEY.admin_courses, userId, courseId],
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        queryFn: ({pageParam = 1}) => getPaginatedReviews({pageParam, userId, courseId}),
        getNextPageParam: (lastPage) => lastPage.nextPageNumber,
        initialPageParam: 1,
    });
}