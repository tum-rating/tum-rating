import { useQuery } from '@tanstack/react-query';

import { Course } from './types.ts';

import { endpoints } from '@/api';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

type Courses = {
    courses: Course[];
    nextPageNumber: number;
};

export async function getReviews(query: string): Promise<Courses | null> {
    const endpoint = endpoints.searchCourses(query);
    const response = await fetch(endpoint);
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);
    return await response.json();
}

export function useSearchCourses(query: string) {
    return useQuery({
        queryKey: [QUERY_KEY.search_query, query],
        queryFn: async () => getReviews(query),
    });
}
