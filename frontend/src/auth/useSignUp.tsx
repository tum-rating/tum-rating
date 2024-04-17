import {Text} from "@mantine/core";
import {notifications} from '@mantine/notifications';
import {useMutation} from '@tanstack/react-query';

import {endpoints} from '@/api';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

async function signUp({email, password, username}: RegisterInput): Promise<{ success: boolean }> {
    const response = await fetch(endpoints.signup, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password, username}),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new ResponseError(errorData.message, response);
    }
    return {success: true};
}

type RegisterInput = {
    email: string;
    password: string;
    username: string;
};

export function useSignUp() {
    return useMutation({
        mutationFn: async ({email, password, username}: RegisterInput) => await signUp({email, password, username}),
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                id: 'signup-success',
                message: <Text size="xs">Sign up successful! Check your email!</Text>,
                color: 'green',
                autoClose: 3000,
            });
        },
        onError: (error) => {
            const errorMessage = error instanceof ResponseError ? error.message : 'Ops.. Error on sign up. Try again!';
            notifications.show({
                message: <Text size="xs">{errorMessage}</Text>,
                withCloseButton: true,
                id: 'signup-error',
                autoClose: 10000,
                title: 'Error',
                color: 'red',
            });
        },
    });
}
