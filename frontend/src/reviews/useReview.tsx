import { useQuery } from '@tanstack/react-query';
import { endpoints } from '@/api';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';
import { DetailReview } from './types.ts';
import { UseQueryResult } from '@tanstack/react-query/src/types.ts';

async function getDetailReview(_id: string): Promise<DetailReview | null> {
    const endpoint = endpoints.getSpecificReview(_id);
    const response = await fetch(endpoint);
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);
    return await response.json();
}

export function useDetailReview(_id: string, props?: any): UseQueryResult<DetailReview | null, unknown> {
    return useQuery({
        queryKey: ['detailReview', _id],
        queryFn: async () => getDetailReview(_id),
        refetchOnWindowFocus: false,
        ...(props || {}),
    });
}
