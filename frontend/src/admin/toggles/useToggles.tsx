import {Toggle} from "@/admin/types.ts";
import {endpoints} from "@/api";
import {fetchWithServices} from "@/api/fetchWithServices.ts";
import {useQueryWithAuth} from '@/api/useQueryWithAuth.tsx';
import * as userLocalStorage from "@/auth/user.localstore.ts";
import {QUERY_KEY} from "@/constants/queryKeys.ts";
import {ResponseError} from "@/utils/Errors/ResponseError.ts";

async function getToggles(token: string): Promise<Toggle[] | null> {
    const response = await fetchWithServices(endpoints.toggles, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) throw new ResponseError(data.message, response, token);
    return data ;
}

export function useToggles() {
    const token = userLocalStorage.getUser();
    return useQueryWithAuth({
        queryKey: [QUERY_KEY.admin_toggles],
        queryFn: async () => getToggles(token),
        refetchIntervalInBackground: true,
        refetchInterval: 1000 * 60 * 5, // 5 minutes
        retry: 0,
    });
}
