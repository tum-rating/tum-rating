import {notifications} from '@mantine/notifications';

import * as userLocalStorage from '../auth/user.localstore.ts';

import {endpoints, useMutationWithAuth} from '@/api';
import {queryClient} from '@/react-query/client.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';


async function removeUser(token:string, userId: string): Promise<any> {
    if (!token) return null;
    const endpoint = endpoints.removeUser(userId);
    const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });
    const responseData = await response.json();
    if (!response.ok) {
        notifications.update({
            id: userId,
            title: 'Error',
            message: 'Failed' + responseData.message,
            autoClose: false,
            withCloseButton: true,
            color: 'red',
            loading: false,
        })
        throw new ResponseError("error", response);
    }
    responseData._id = userId;
    return responseData;
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
                message: 'User is being removed',
                autoClose: false,
                withCloseButton: false,
            })
            return variables;
        },
        onSuccess: (variables) => {
            queryClient.invalidateQueries({
                queryKey: ['users'],
            });
            notifications.update({
                id: variables._id,
                title: 'Success',
                message: 'User removed',
                autoClose: true,
                withCloseButton: true,
                color: 'green',
                loading: false,
            })
        },
    });
}
