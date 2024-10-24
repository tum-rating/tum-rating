import {endpoints} from '@/api';
import {fetchWithServices} from '@/api/fetchWithServices.ts';
import {useQueryWithAuth} from '@/api/useQueryWithAuth.tsx';
import * as userLocalStorage from '@/auth/user.localstore.ts';
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

const getToggle = async (token: string, toggleId: string) => {
    const endpoint = endpoints.getSingleToggle(toggleId);
    const response = await fetchWithServices(endpoint, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new ResponseError(data.message, response, toggleId);
    }
    return data;
};

const useToggle = (toggleId: string) => {
    const token = userLocalStorage.getUser();
    return useQueryWithAuth({
        queryKey: [QUERY_KEY['admin_toggles_details'], toggleId],
        queryFn: async () => getToggle(token, toggleId),
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};

export {useToggle};
