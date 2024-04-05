import { useQuery } from '@tanstack/react-query';

import { endpoints } from '@/api';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

async function getAllUsers(): Promise<any[] | null> {
    const response = await fetch(endpoints.getAllUsers);
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);
    const data = await response.json();
    return await data;
}

export function useAllUsers() {
    return useQuery({
        queryKey: [QUERY_KEY.all_users],
        queryFn: async () => getAllUsers(),
        refetchIntervalInBackground: true,
        refetchInterval: 1000 * 60 * 5, // 5 minutes
    });
}