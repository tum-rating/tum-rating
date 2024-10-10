import {useMutation} from '@tanstack/react-query';

import * as userLocalStorage from './user.localstore.ts';
import {USER_LOCAL_STORAGE_KEY} from './user.localstore.ts';

import {endpoints} from '@/api';
import {fetchWithServices} from '@/api/fetchWithServices.ts';
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {queryClient} from '@/react-query/client.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

async function setUser(username: string, token?: string | null) {
    if (!token) return null;
    const response = await fetchWithServices(endpoints.user, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username}),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new ResponseError(data.message, response, 'user-details');
    }
    return { token: token};
}

export function useSetUser() {
    const userTokenFromLocalStorage = userLocalStorage.getUser();
    return useMutation({
        mutationFn: async ({username, token}: {
            username: string,
            token?: string | null
        }) => await setUser(username, token || userTokenFromLocalStorage),
        onSuccess: ({token}) => {
            if(!userTokenFromLocalStorage){
                queryClient.setQueryData([QUERY_KEY.user], token);
                localStorage.setItem(USER_LOCAL_STORAGE_KEY, token);
            }
            return true
        },
    });
}