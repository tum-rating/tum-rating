import {Text} from '@mantine/core';
import {notifications} from '@mantine/notifications';

import {Toggle} from '@/admin/types.ts';
import {endpoints, useMutationWithAuth} from '@/api';
import {fetchWithServices} from '@/api/fetchWithServices.ts';
import * as userLocalStorage from '@/auth/user.localstore.ts';
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {queryClient} from '@/react-query/client.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

async function setToggle(token: string, toggle: Toggle): Promise<any> {
    const endpoint = endpoints.setToggle(toggle.id);
    delete toggle.id
    const response = await fetchWithServices(endpoint, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(toggle),
    });
    const data = await response.json();
    if (!response.ok) {
        throw new ResponseError(data.message, response, toggle.id);
    }
    return data;
}

export function useSetToggle() {
    const token = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async (toggle: Toggle) => setToggle(token, toggle),
        onMutate: (toggle) => {
            notifications.show({
                id: toggle.name,
                loading: true,
                title: 'Updating toggle',
                message: <Text size="xs">Your toggle is being updated</Text>,
                autoClose: false,
                withCloseButton: false,
            });
            return toggle;
        },
        onSuccess: (_, toggle) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY['admin_toggles_details'], toggle.id],
            });
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.admin_toggles],
            });
            notifications.update({
                id: toggle.name,
                title: 'Success',
                message: <Text size="xs">Toggle <Text component='span' size="xs" fw='bold' c='black'>{toggle.name}</Text> updated</Text>,
                autoClose: true,
                withCloseButton: true,
                color: 'green',
                loading: false,
            });
        },
        onError: (error, toggle) => {
            notifications.update({
                id: toggle.name,
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