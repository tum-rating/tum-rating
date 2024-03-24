import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import * as userLocalStorage from './user.localstore.ts';

import { endpoints } from '@/api';
import {handleAuthErrors} from "@/api/handleErrors.tsx";
import {useSignOut} from "@/auth/useSignOut.tsx";
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';


async function getUser(user: User | null | undefined): Promise<User | null> {
    if (!user) return null;
    const response = await fetch(endpoints.user, {
        headers: {
            Authorization: `Bearer ${user.token}`,
        },
    });
    if (!response.ok) throw new ResponseError('Failed on get user request', response);
    return await response.json();
}

export interface User {
    token: string;
    user: {
        username: string;
        email: string;
        id: number;
    };
}

interface IUseUser {
    user: User | null;
}

export function useUser(): IUseUser {
    const signOut = useSignOut(); // get the signOut function
    const { data: user, error, isError }  = useQuery({
        queryKey: [QUERY_KEY.user],
        queryFn: async () => getUser(user),
        initialData: userLocalStorage.getUser(),
        refetchIntervalInBackground: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false
    });

    useEffect(() => {
        if (isError) {
            handleAuthErrors({ error, signOut }); // handle the error
        }
        if (!user) userLocalStorage.removeUser();
        else {
            userLocalStorage.saveUser(user);
        }
    }, [user, isError, error]);

    return {
        user: user ?? null,
    };
}
