import {useMutation, UseMutationOptions, UseMutationResult} from '@tanstack/react-query';

import {handleAuthErrors} from "@/api/handleErrors.tsx";
import {useSignOut} from "@/auth/useSignOut.tsx";
import {ResponseError} from "@/utils/Errors/ResponseError.ts";
import {useNavigate} from "react-router-dom";
import {Paths} from "@/routes/paths.ts";


export function useMutationWithAuth<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
    options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
    const signOut = useSignOut();
    const navigate = useNavigate();
    return useMutation<TData, TError, TVariables, TContext>({
        ...options,
        onError: (error: TError, variables: TVariables, context: TContext) => {
            if (error instanceof ResponseError) {
                handleAuthErrors({error, signOut, callback: () => navigate(Paths.signIn)});
            }
            if (options.onError) {
                options.onError(error, variables, context);
            }
        },
    });
}