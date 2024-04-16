import {useQuery} from '@tanstack/react-query';

import {endpoints} from '@/api';
import * as userLocalStorage from "@/auth/user.localstore.ts";
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';
import {User} from "@/admin/types.ts";

async function getAllUsers(token: string): Promise<{users: User[]} | null> {
    const response = await fetch(endpoints.getAllUsers,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);
    const data = await response.json();
    return await data;
}

export function useAllUsers() {
    const token = userLocalStorage.getUser();
    return useQuery({
        queryKey: [QUERY_KEY.all_users],
        queryFn: async () => getAllUsers(token),
        refetchIntervalInBackground: true,
        refetchInterval: 1000 * 60 * 5, // 5 minutes
    });
}