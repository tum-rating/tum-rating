import {UseQueryResult} from '@tanstack/react-query';

import {Toggle} from '@/admin/types.ts';
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
        throw new ResponseError(data.message, response, 'toggles_client');
    }
    return data;
};

const useTogglesClient = (toggleName?: string) => {
    const token = userLocalStorage.getUser();
    return useQueryWithAuth({
        queryKey: ['toggles_client'],
        queryFn: async () => getTogglesClient(token),
        refetchInterval: 300000,
        refetchIntervalInBackground: true,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
        select: (data) => {
            return toggleName ? data.toggles.find((toggle: Toggle) => toggle.name === toggleName) : data;
        },
    });
};

const getSpecificToggleIsEnabled = async (togglesQuery: UseQueryResult<Toggle[], any>, key: string) => {
    const data = togglesQuery.data;
    const toggle = data.find((toggle: Toggle) => toggle.name === key);
    return toggle.enabled;
};

export {useTogglesClient, getSpecificToggleIsEnabled};
