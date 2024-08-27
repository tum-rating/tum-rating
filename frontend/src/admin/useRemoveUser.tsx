import {Text} from '@mantine/core';
import {notifications} from '@mantine/notifications';

import * as userLocalStorage from '../auth/user.localstore.ts';

import {endpoints, useMutationWithAuth} from '@/api';
import {fetchWithServices} from "@/api/fetchWithServices.ts";
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {queryClient} from '@/react-query/client.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

async function removeUser(token: string, userId: string): Promise<any> {
    if (!token) return null;
    const endpoint = endpoints.removeUser(userId);
    const response = await fetchWithServices(endpoint, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new ResponseError(data.message, response, userId);
    }
    data._id = userId;
    return data;
}

export function useRemoveUser(): any {
    const token = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async (userId: string) => removeUser(token, userId),
        onMutate: (variables) => {
            notifications.show({
                id: variables,
                loading: true,
                title: 'Removing user',
                message: <Text size="xs">User is being removed</Text>,
                autoClose: false,
                withCloseButton: false,
            });
            return variables;
        },
        onSuccess: (variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.all_users],
            });
            notifications.update({
                id: variables._id,
                title: 'Success',
                message: <Text size="xs">User removed</Text>,
                autoClose: true,
                withCloseButton: true,
                color: 'green',
                loading: false,
            });
        },
    });
}
