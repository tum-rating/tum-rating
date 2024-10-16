import {Toggle} from "@/admin/types.ts";
import {endpoints, useMutationWithAuth} from "@/api";

import * as userLocalStorage from '@/auth/user.localstore.ts';
import {ResponseError} from "@/utils/Errors/ResponseError.ts";
import {queryClient} from "@/react-query/client.ts";
import {QUERY_KEY} from "@/constants/queryKeys.ts";

import {Text} from '@mantine/core';
import {notifications} from '@mantine/notifications';

async function addToggle(token: string, toggle: Toggle) {
    const endpoint = endpoints.toggles;
    if (!toggle) return;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(toggle)
    });

    const data = await response.json();
    if (!response.ok) {
        throw new ResponseError(data.message, response, toggle.name);
    }

    return data;
}

interface AddToggleInput extends Toggle {
}

export function useAddToggle() {
    const token = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async (toggle: AddToggleInput) => addToggle(token, toggle),
        onMutate: (toggle) => {
            notifications.show({
                id: toggle.name,
                loading: true,
                title: 'Adding toggle',
                message: <Text size="xs">Your toggle is being added</Text>,
                autoClose: false,
                withCloseButton: false,
            });
            return toggle;
        },
        onSuccess: (data, toggle) => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEY.admin_toggles]});
            notifications.update({
                id: toggle.name,
                title: 'Success',
                message: <Text size="xs">Toggle <Text component='span' size="xs" fw='bold'
                                                      c='black'>{toggle.name}</Text> added successfully</Text>,
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
                message: <Text size="xs">Failed to add toggle: {error.message}</Text>,
                autoClose: true,
                withCloseButton: true,
                color: 'red',
                loading: false,
            });
        },
    });
}
