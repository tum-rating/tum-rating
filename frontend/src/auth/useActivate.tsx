import {Text} from "@mantine/core";
import { notifications } from '@mantine/notifications';
import { useMutation } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

import { endpoints } from '@/api';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

async function activate(token: string | null) {
    const response = await fetch(endpoints.activate, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new ResponseError(errorData.message, response);
    }
    return { success: true };
}

export function useActivate() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    return useMutation({
        mutationFn: async () => await activate(token),
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                id: 'activation',
                message: <Text size="xs">Activation successful!</Text>,
                color: 'green',
            });
        },
        onError: (error) => {
            const errorMessage = error instanceof ResponseError ? error.message : 'Ops.. Error on sign up. Try again!';
            notifications.show({
                message: <Text size="xs">{errorMessage}</Text>,
                title: 'Error',
                id: 'activation-error',
                withCloseButton: true,
                autoClose: 10000,
                color: 'red',
            });
        },
    });
}
