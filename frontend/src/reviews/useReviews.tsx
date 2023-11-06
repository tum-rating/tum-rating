import { useQuery } from '@tanstack/react-query';
import { endpoints } from '@/api';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';
import { Review } from './types.ts';

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
