import {Text} from '@mantine/core';
import {notifications} from '@mantine/notifications';

import {endpoints, useMutationWithAuth} from '@/api';
import {fetchWithServices} from '@/api/fetchWithServices.ts';
import * as userLocalStorage from '@/auth/user.localstore.ts';
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {queryClient} from '@/react-query/client.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

async function setToggle(token: string, toggleId: string, newState: boolean): Promise<any> {
    const endpoint = endpoints.setToggle(toggleId);
    const response = await fetchWithServices(endpoint, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({state: newState}),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new ResponseError(data.message, response, toggleId);
    }
    return data;
}

export function useSetToggle() {
    const token = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async ({toggleId, newState}: {toggleId: string, newState: boolean}) => setToggle(token, toggleId, newState),
        onMutate: ({toggleId, newState}) => {
            console.log(toggleId,newState)
            notifications.show({
                id: toggleId,
                loading: true,
                title: 'Updating toggle',
                message: <Text size="xs">Your toggle is being updated</Text>,
                autoClose: false,
                withCloseButton: false,
            });
            return {toggleId, newState};
        },
        onSuccess: (data, {toggleId}) => {
            console.log(data)
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY['admin_toggles_details'], toggleId],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.admin_toggles],
            });
            notifications.update({
                id: toggleId,
                title: 'Success',
                message: <Text size="xs">Toggle updated</Text>,
                autoClose: true,
                withCloseButton: true,
                color: 'green',
                loading: false,
            });
        },
        onError: (error, {toggleId}) => {
            notifications.update({
                id: toggleId,
                title: 'Error',
                message: <Text size="xs">Failed to update toggle: {error.message}</Text>,
                autoClose: true,
                withCloseButton: true,
                color: 'red',
                loading: false,
            });
        },
    });
}