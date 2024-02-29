import {useLocation} from 'react-router-dom';
import {endpoints} from '@/api';
import {notifications} from '@mantine/notifications';
import {IconCheck, IconX} from '@tabler/icons-react';
import {useMutation} from "@tanstack/react-query";
import {ResponseError} from "@/utils/Errors/ResponseError.ts";

async function activate(token: string | null) {
    const response = await fetch(endpoints.activate, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({token}),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new ResponseError(errorData.message, response);
    }
    return {success: true}
}

export function useActivate() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');

    return useMutation({
        mutationFn: async () => await activate(token),
        onSuccess: () => {
            notifications.show({
                message: 'Activation successful!',
                color: 'green',
                icon: <IconCheck/>,
            });
        },
        onError: (error) => {
            const errorMessage = error instanceof ResponseError ? error.message : 'Ops.. Error on sign up. Try again!';
            notifications.show({
                message: errorMessage,
                color: 'red',
                icon: <IconX/>,
            });
        },
    });
}
