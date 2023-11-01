import { useInfiniteQuery } from '@tanstack/react-query';
import { endpoints } from '@/api';
import { ResponseError } from '@/utils/Errors/ResponseError';
import { Review } from './types';
import { isMobile } from 'react-device-detect';

type Reviews = {
    reviews: Review[];
    nextPageNumber: number;
};

async function getPaginatedReviews({ pageParam = 1 }): Promise<Reviews> {
    const PAGE_SIZE = isMobile ? 20 : 45;
    const response = await fetch(endpoints.getPaginatedReviews(pageParam, PAGE_SIZE));
    const responseData = await response.json();
    if (!response.ok) throw new ResponseError('Failed on get paginated reviews request', response);
    return responseData;
}

export function usePaginatedReviews() {
    return useInfiniteQuery({
        queryKey: ['courses'],
        queryFn: getPaginatedReviews,
        getNextPageParam: (lastPage) => lastPage.nextPageNumber,
    });
}
