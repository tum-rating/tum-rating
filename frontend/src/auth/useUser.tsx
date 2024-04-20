import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import * as userLocalStorage from './user.localstore.ts';

import { endpoints } from '@/api';
import { handleAuthErrors } from '@/api/handleErrors.tsx';
import { useSignOut } from '@/auth/useSignOut.tsx';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

async function getUser(token: string | null): Promise<User | null> {
    if (!token) return null;
    const response = await fetch(endpoints.user, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new ResponseError('Failed on get user request', response);
    return response.json();
}

export interface User {
    username: string;
    email: string;
    id: number;
}

export function useUser() {
    const signOut = useSignOut(); // get the signOut function
    const userFromLocalStorage = userLocalStorage.getUser();
    const reseponse = useQuery({
        queryKey: [QUERY_KEY.user_details],
        queryFn: async () => getUser(userFromLocalStorage),
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: false,
    });

    const { isError, error } = reseponse;

    useEffect(() => {
        if (isError) {
            handleAuthErrors({ error, signOut });
            userLocalStorage.removeUser();
        }
    }, [isError]);

    return reseponse;
}
