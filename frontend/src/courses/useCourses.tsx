import { useQuery } from '@tanstack/react-query';

import { Course } from './types.ts';

import { endpoints } from '@/api';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

async function getCourses(): Promise<Course[] | null> {
    const response = await fetch(endpoints.getAllCourses);
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);
    return await response.json();
}

export function useCourses() {
    return useQuery({
        queryKey: [QUERY_KEY.courses],
        queryFn: async () => getCourses(),
        refetchOnWindowFocus: false,
    });
}
