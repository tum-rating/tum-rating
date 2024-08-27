import {Text} from '@mantine/core';
import {notifications} from '@mantine/notifications';
import {useLocation} from 'react-router-dom';

import {endpoints, useMutationWithAuth} from '@/api';
import {fetchWithServices} from "@/api/fetchWithServices.ts";
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

async function activate(token: string | null) {
    const response = await fetchWithServices(endpoints.activate, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({token}),
    });

    if (!response.ok) {
        throw new ResponseError('Unknown error', response, 'activate');
    }

    return {success: true};
}

export function useActivate() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    return useMutationWithAuth({
        mutationFn: async () => await activate(token),
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                id: 'activation',
                message: <Text size="xs">Activation successful!</Text>,
                color: 'green',
            });
        },
    });
}
