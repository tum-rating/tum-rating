import { useInfiniteQuery, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { handleAuthErrors } from '@/api/handleErrors.tsx';
import { useSignOut } from '@/auth/useSignOut.tsx';

export function useInfiniteQueryWithAuth(options: UseInfiniteQueryOptions<any>) {
    const signOut = useSignOut();
    const navigate = useNavigate();
    const query = useInfiniteQuery({
        ...options,
    });
    const { isError, error } = query;
    useEffect(() => {
        if (isError) {
            handleAuthErrors({ error, signOut, navigate });
        }
    }, [isError]);

    return query;
}
