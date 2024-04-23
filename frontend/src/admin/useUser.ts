import { User } from '@/admin/types.ts';
import { endpoints } from '@/api';
import { useQueryWithAuth } from "@/api/useQueryWithAuth.tsx";
import * as userLocalStorage from '@/auth/user.localstore.ts';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

async function getUser(token: string, userId: string): Promise<User | null> {
    const response = await fetch(endpoints.getUser(userId), {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);
    const data = await response.json();
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
