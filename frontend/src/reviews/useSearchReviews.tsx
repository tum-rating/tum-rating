import { useQuery } from '@tanstack/react-query';

import { DetailReview } from './types.ts';

import { endpoints } from '@/api';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';


export async function getReviews(query: string): Promise<DetailReview | null> {
    const endpoint = endpoints.searchReviews(query);
    const response = await fetch(endpoint);
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);
    return await response.json();
}

export function useSearchReviews(query: string) {
    return useQuery({
        queryKey: ['searchQuery', query],
        queryFn: async () => getReviews(query),
    });
}
