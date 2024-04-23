import {DefaultError, QueryKey} from "@tanstack/query-core";
import {useQuery, UseQueryOptions, UseQueryResult} from '@tanstack/react-query';
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

import {handleAuthErrors} from "@/api/handleErrors.tsx";
import {useSignOut} from "@/auth/useSignOut.tsx";

export function useQueryWithAuth<
    TQueryFnData = unknown,
    TError = DefaultError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> {
    const signOut = useSignOut();
    const navigate = useNavigate();
    const query = useQuery({
        ...options,
    });
    const {isError, error} = query;
    useEffect(() => {
        if (isError) {
            handleAuthErrors({error, signOut, navigate});
        }
    }, [isError]);

    return query;
}
