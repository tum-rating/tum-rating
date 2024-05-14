import { User } from '@/admin/types.ts';
import { endpoints } from '@/api';
import { useQueryWithAuth } from '@/api/useQueryWithAuth.tsx';
import * as userLocalStorage from '@/auth/user.localstore.ts';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

async function getAllUsers(token: string): Promise<User[] | undefined> {
    const response = await fetch(endpoints.getAllUsers, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new ResponseError(data.message, response, 'get-all-users');
    }
    return data.users || [];
}

export function useAllUsers() {
    const token = userLocalStorage.getUser();
    return useQueryWithAuth({
        queryKey: [QUERY_KEY.all_users],
        initialData: [],
        queryFn: async () => getAllUsers(token),
        refetchIntervalInBackground: true,
        refetchInterval: 1000 * 60 * 5, // 5 minutes
    });
}
