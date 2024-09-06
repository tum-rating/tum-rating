import {Review} from '@/admin/types.ts';
import {endpoints} from '@/api';
import {fetchWithServices} from '@/api/fetchWithServices.ts';
import {useInfiniteQueryWithAuth} from '@/api/useInfiniteQueryWithAuth.tsx';
import * as userLocalStorage from "@/auth/user.localstore.ts";
import {PAGE_SIZE} from '@/constants';
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

type Reviews = {
    results: Review[];
    nextPageNumber: number;
};

type PaginatedReviewsConfig = {
    pageParam?: number | any;
    userId?: string;
    courseId?: string;
    query?: string;
};

async function getPaginatedReviews({pageParam = 1, userId, courseId, query}: PaginatedReviewsConfig): Promise<Reviews> | null {
    const token = userLocalStorage.getUser();
    const response = await fetchWithServices(endpoints.getPaginatedReviews(pageParam, PAGE_SIZE, userId, courseId, query),{
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new ResponseError(data.message, response, 'courses');
    }
    return data;
}

export function useReviews({userId, courseId, query}: PaginatedReviewsConfig) {
    return useInfiniteQueryWithAuth({
        queryKey: [QUERY_KEY.admin_reviews, userId, courseId, query],
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        queryFn: ({pageParam = 1}) => getPaginatedReviews({pageParam, userId, courseId, query}),
        getNextPageParam: (lastPage) => lastPage.nextPageNumber,
        initialPageParam: 1,
    });
}
