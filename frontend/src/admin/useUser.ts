import {User} from '@/admin/types.ts';
import {endpoints} from '@/api';
import {fetchWithServices} from "@/api/fetchWithServices.ts";
import {useQueryWithAuth} from '@/api/useQueryWithAuth.tsx';
import * as userLocalStorage from '@/auth/user.localstore.ts';
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

async function getUser(token: string, userId: string): Promise<User | null> {
    const response = await fetchWithServices(endpoints.getUser(userId), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) throw new ResponseError(data.message, response, userId);
    return await data;
}

export function useUser(userId: string) {
    const token = userLocalStorage.getUser();
    return useQueryWithAuth({
        queryKey: [QUERY_KEY.admin_user_details, userId],
        queryFn: async () => getUser(token, userId),
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        retry: false,
    });
}
