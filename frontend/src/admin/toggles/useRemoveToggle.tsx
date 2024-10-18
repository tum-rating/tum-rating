import {Text} from '@mantine/core';
import {notifications} from '@mantine/notifications';

import {endpoints, useMutationWithAuth} from "@/api";
import * as userLocalStorage from '@/auth/user.localstore.ts';
import {QUERY_KEY} from "@/constants/queryKeys.ts";
import {queryClient} from "@/react-query/client.ts";
import {ResponseError} from "@/utils/Errors/ResponseError.ts";

async function removeToggle(token: string, toggleId: string): Promise<void> {
    const endpoint = endpoints.setToggle(toggleId);
    const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const data = await response.json();
        throw new ResponseError(data.message, response, toggleId);
    }
}

export function useRemoveToggle() {
    const token = userLocalStorage.getUser();
    return useMutationWithAuth({
        mutationFn: async (toggleId: string) => removeToggle(token, toggleId),
        onMutate: (toggleId) => {
            notifications.show({
                id: toggleId,
                loading: true,
                title: 'Removing toggle',
                message: <Text size="xs">Your toggle is being removed</Text>,
                autoClose: false,
                withCloseButton: false,
            });
            return toggleId;
        },
        onSuccess: (_, toggleId) => {
            queryClient.invalidateQueries({queryKey: [QUERY_KEY.admin_toggles]});
            notifications.update({
                id: toggleId,
                title: 'Success',
                message: <Text size="xs">Toggle with ID
                    <Text size="xs" fw='bold' c='black'>{toggleId}</Text>
                    removed successfully</Text>,
                autoClose: true,
                withCloseButton: true,
                color: 'green',
                loading: false,
            });
        },
        onError: (error, toggleId) => {
            notifications.update({
                id: toggleId,
                title: 'Error',
                message: <Text size="xs">Failed to remove toggle: {(error as ResponseError).message}</Text>,
                autoClose: true,
                withCloseButton: true,
                color: 'red',
                loading: false,
            });
        },
    });
}
