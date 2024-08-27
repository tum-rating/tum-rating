import {useQuery} from '@tanstack/react-query';

import {Course} from './types.ts';

import {endpoints} from '@/api';
import {fetchWithServices} from "@/api/fetchWithServices.ts";
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

async function getCourses(): Promise<Course[] | null> {
    const response = await fetchWithServices(endpoints.getAllCourses);
    const data = await response.json();
    if (!response.ok) throw new ResponseError(data.message, response, 'courses');
    return data;
}

export function useCourses() {
    return useQuery({
        queryKey: [QUERY_KEY.courses],
        queryFn: async () => getCourses(),
        refetchOnWindowFocus: false,
    });
}
