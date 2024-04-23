import * as userLocalStorage from './user.localstore.ts';

import {endpoints} from '@/api';
import {useQueryWithAuth} from "@/api/useQueryWithAuth.tsx";
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

async function getUser(token: string | null): Promise<User | null> {
    if (!token) return null;
    const response = await fetch(endpoints.user, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new ResponseError('Failed on get user request', response);
    return response.json();
}

export interface User {
    username: string;
    email: string;
    id: number;
}

export function useUser() {
    const userFromLocalStorage = userLocalStorage.getUser();
    return useQueryWithAuth({
        queryKey: [QUERY_KEY.user_details],
        queryFn: async () => getUser(userFromLocalStorage),
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: false,
        throwOnError: !!userFromLocalStorage,
    });
}
