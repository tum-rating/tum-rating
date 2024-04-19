import {useQuery} from '@tanstack/react-query';

import {User} from "@/admin/types.ts";
import {endpoints} from '@/api';
import * as userLocalStorage from "@/auth/user.localstore.ts";
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

async function getAllUsers(token: string): Promise<User[] | undefined> {
    const response = await fetch(endpoints.getAllUsers,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);
    let data = await response.json();
    return data.users || [];
}

export function useAllUsers() {
    const token = userLocalStorage.getUser();
    return useQuery({
        queryKey: [QUERY_KEY.all_users],
        initialData: [],
        queryFn: async () => getAllUsers(token),
        refetchIntervalInBackground: true,
        refetchInterval: 1000 * 60 * 5, // 5 minutes
    });
}