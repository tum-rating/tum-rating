import {Text} from '@mantine/core';
import {notifications} from '@mantine/notifications';

import {endpoints, useMutationWithAuth} from '@/api';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

async function signUp({email, password, username}: RegisterInput): Promise<{success: boolean}> {
    const response = await fetch(endpoints.signup, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password, username}),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new ResponseError(data.message, response, 'sign-up');
    }
    return {success: true};
}

type RegisterInput = {
    email: string;
    password: string;
    username: string;
};

export function useSignUp() {
    return useMutationWithAuth({
        mutationFn: async ({email, password, username}: RegisterInput) => await signUp({email, password, username}),
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                id: 'sign-up',
                message: <Text size="xs">Sign up successful! Check your email!</Text>,
                color: 'green',
                autoClose: 3000,
            });
        },
    });
}
