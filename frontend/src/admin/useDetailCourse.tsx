import {useQuery, UseQueryResult} from '@tanstack/react-query';

import {endpoints} from '@/api';
import {fetchWithServices} from '@/api/fetchWithServices.ts';
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {DetailCourse} from '@/courses/types.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

async function getDetailCourse(_id: string) {
    const endpoint = endpoints.getSpecificCourse(_id);
    const response = await fetchWithServices(endpoint);
    const data = await response.json();
    if (!response.ok) throw new ResponseError(data.message, response, _id);
    return data;
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
