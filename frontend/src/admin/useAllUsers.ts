import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { endpoints } from '@/api';
import { handleAuthErrors } from '@/api/handleErrors.tsx';
import { useSignOut } from '@/auth/useSignOut.tsx';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

async function getAllUsers(): Promise<any[] | null> {
    const response = await fetch(endpoints.getAllUsers);
    if (!response.ok) throw new ResponseError('Failed on get reviews request', response);
    const data = await response.json();
    return await data;
}

export function useAllUsers() {
    const signOut = useSignOut(); // get the signOut function
    const { data: users, error, isError } = useQuery({
        queryKey: [QUERY_KEY.all_users],
        queryFn: async () => getAllUsers(),
        refetchIntervalInBackground: true,
        refetchInterval: 1000 * 60 * 5, // 5 minutes
    });

    useEffect(() => {
        if (isError) {
            handleAuthErrors({ error, signOut });
        }
    }, [isError, error, signOut]);

    return {
        users: users ?? null,
    };
}