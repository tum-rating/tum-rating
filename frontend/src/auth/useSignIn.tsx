import {Text} from '@mantine/core';
import {notifications} from '@mantine/notifications';

import {User} from './useUser.tsx';

import {endpoints, useMutationWithAuth} from '@/api';
import {fetchWithServices} from "@/api/fetchWithServices.ts";
import {USER_LOCAL_STORAGE_KEY} from '@/auth/user.localstore.ts';
import {QUERY_KEY} from '@/constants/queryKeys.ts';
import {queryClient} from '@/react-query/client.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

interface LoggedUser {
    token: string;
    user: User;
}

export async function signIn({email, password}: LoginInput): Promise<LoggedUser> {
    const response = await fetchWithServices(endpoints.signin, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
    });
    const data = await response.json();
    if (!response.ok) throw new ResponseError(data.message, response, 'sign-in');
    return data;
}

export type LoginInput = {
    email: string;
    password: string;
};

export function useSignIn() {
    return useMutationWithAuth({
        mutationFn: async ({email, password}: LoginInput) => await signIn({email, password}),
        onSuccess: (data) => {
            queryClient.setQueryData([QUERY_KEY.user], data.token);
            queryClient.setQueryData([QUERY_KEY.user_details], {
                ...data.user,
                isAdmin: data.user?.role === 'admin',
            });
            localStorage.setItem(USER_LOCAL_STORAGE_KEY, data.token);
            notifications.show({
                title: 'Success',
                id: 'signin-success',
                message: <Text size="xs">Sign in successful!</Text>,
                color: 'green',
                autoClose: 3000,
            });
        },
    });
}
