import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';

import { User } from './useUser.tsx';

import { endpoints } from '@/api';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { queryClient } from '@/react-query/client.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';


async function signIn({ email, password }: LoginInput): Promise<User> {
    const response = await fetch(endpoints.signin, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new ResponseError('Failed on sign in request', response);
    return await response.json();
}

export type LoginInput = {
    email: string;
    password: string;
};

export function useSignIn() {
    return useMutation({
        mutationFn: async ({ email, password }: LoginInput) => await signIn({ email, password }),
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEY.user], data);
            notifications.show({
                message: 'Sign in successful!',
                color: 'green',
                icon: <IconCheck />,
            });
        },
        onError: (error) => {
            const errorMessage = error instanceof ResponseError ? error.message : 'Ops.. Error on sign up. Try again!';
            notifications.show({
                message: errorMessage,
                color: 'red',
                icon: <IconX />,
            });
        },
    });
}
