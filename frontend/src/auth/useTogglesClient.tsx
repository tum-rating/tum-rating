import {endpoints} from '@/api';
import {fetchWithServices} from '@/api/fetchWithServices.ts';
import {useQueryWithAuth} from '@/api/useQueryWithAuth.tsx';
import * as userLocalStorage from '@/auth/user.localstore.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

const getTogglesClient = async (_: string) => {
    const endpoint = endpoints.toggles;
    const response = await fetchWithServices(endpoint, {});
    const data = await response.json();
    if (!response.ok) {
        throw new ResponseError(data.message, response, "toggles_client");
    }
    return data;
};

const useTogglesClient = () => {
    const token = userLocalStorage.getUser();
    return useQueryWithAuth({
        queryKey: ['toggles_client'],
        queryFn: async () => getTogglesClient(token),
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};

export {useTogglesClient};
