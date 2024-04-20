import { Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';

import * as userLocalStorage from '../auth/user.localstore.ts';

import { endpoints, useMutationWithAuth } from '@/api';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { queryClient } from '@/react-query/client.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

async function banUser(token: string, userId: string, flag: boolean): Promise<any> {
    if (!token) return null;
    const endpoint = endpoints.banUser(userId);
    const response = await fetch(endpoint, {
        method: flag ? 'POST' : 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            body: JSON.stringify({ userId: userId }),
        },
    });
    if (response.status === 204) {
        return {
            _id: userId,
            isBanned: flag,
        };
    }
    const responseData = await response.json();
    if (!response.ok) {
        notifications.update({
            id: userId,
            title: 'Error',
            message: <Text size="xs">{responseData.message || 'An error occurred'}</Text>,
            autoClose: false,
            withCloseButton: true,
            color: 'red',
            loading: false,
        });
        throw new ResponseError('error', response);
    }
    responseData._id = userId;
    return responseData;
}

export function useBanUser(): any {
    const token = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async ({ userId, flag }: { userId: string; flag: boolean }) => banUser(token, userId, flag),
        onMutate: (variables) => {
            notifications.show({
                id: variables.userId,
                loading: true,
                title: variables.flag ? 'Banning user' : 'Unbanning user',
                message: <Text size="xs">Please wait...</Text>,
                autoClose: false,
                withCloseButton: false,
            });
            return variables;
        },
        onSuccess: (variables) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.all_users],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.admin_user_details],
            });
            notifications.update({
                id: variables._id,
                title: 'Success',
                message: <Text size="xs"> {variables.isBanned ? 'User banned' : 'User unbanned'}</Text>,
                autoClose: true,
                withCloseButton: true,
                color: 'green',
                loading: false,
            });
        },
    });
}
