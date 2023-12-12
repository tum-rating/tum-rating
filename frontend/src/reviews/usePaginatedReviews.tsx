import { useInfiniteQuery } from '@tanstack/react-query';
import { endpoints } from '@/api';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';
import { Review } from './types.ts';

type Reviews = {
    reviews: Review[];
    nextPageNumber: number;
};

async function getPaginatedReviews({ pageParam = 1 }): Promise<Reviews> {
    const PAGE_SIZE = 45;
    const response = await fetch(endpoints.getPaginatedReviews(pageParam, PAGE_SIZE));
    const responseData = await response.json();
    if (!response.ok) throw new ResponseError('Failed on get paginated reviews request', response);
    return responseData;
}

export function usePaginatedReviews() {
    return useInfiniteQuery({
        queryKey: ['courses'],
        refetchOnWindowFocus: false,
        staleTime: Infinity, // Set staleTime to Infinity to prevent automatic refetching
        queryFn: getPaginatedReviews,
        getNextPageParam: (lastPage) => lastPage.nextPageNumber,
        initialPageParam: 1,
    });
}
