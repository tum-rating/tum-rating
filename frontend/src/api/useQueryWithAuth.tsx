
import {UseQueryResult, UseQueryOptions, useQuery} from '@tanstack/react-query';
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

import {handleAuthErrors} from "@/api/handleErrors.tsx";
import {useSignOut} from "@/auth/useSignOut.tsx";

export function useQueryWithAuth<TQueryFnData = unknown, TError = unknown, TData = void>(options: UseQueryOptions<TQueryFnData, TError, TData>): UseQueryResult<TData, TError> {
    const signOut = useSignOut();
    const navigate = useNavigate()
    const query = useQuery<TQueryFnData, TError, TData>({
        ...options,
    });
    const { isError, error } = query;
    useEffect(() => {
        if (isError) {
            handleAuthErrors({ error, signOut,navigate });
        }
    }, [isError]);

    return query;
}
