import { UseQueryResult, useQuery } from '@tanstack/react-query';

import { DetailCourse } from './types.ts';

import { endpoints } from '@/api';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

async function getDetailCourse(_id: string) {
    const endpoint = endpoints.getSpecificCourse(_id);
    const response = await fetch(endpoint);
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);
    return await response.json();
}

export function useDetailCourse(_id: string, props?: any): UseQueryResult<DetailCourse | null, unknown> {
    return useQuery({
        queryKey: [QUERY_KEY.admin_detail_course, _id],
        queryFn: async () => getDetailCourse(_id),
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        ...(props || {}),
    });
}
