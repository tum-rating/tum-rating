import { useQuery } from '@tanstack/react-query';
import { endpoints } from '@/api';
import { QUERY_KEY } from '@/constants/queryKeys';
import { ResponseError } from '@/utils/Errors/ResponseError';
import { Review } from './types';

async function getReviews(): Promise<Review[] | null> {
    const response = await fetch(endpoints.getAllReviews);
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);
    return await response.json();
}

export function useReviews() {
    return useQuery({
        queryKey: [QUERY_KEY.reviews],
        queryFn: async () => getReviews(),
        refetchOnWindowFocus: false,
    });
}
