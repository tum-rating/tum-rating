import { UseMutateFunction, useMutation, useQueryClient } from '@tanstack/react-query';

import { useNavigate } from 'react-router-dom';
import { QUERY_KEY } from '../constants/queryKeys';
import { ResponseError } from '../utils/Errors/ResponseError';
import { User } from './useUser';
import {notifications} from "@mantine/notifications";
import {IconCheck, IconX} from "@tabler/icons-react";
import {endpoints} from "../api"

async function signIn(email: string, password: string): Promise<User> {
    const response = await fetch(endpoints.signin, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    if (!response.ok)
        throw new ResponseError('Failed on sign in request', response);
    return await response.json();
}

type IUseSignIn = UseMutateFunction<User, unknown, {
    email: string;
    password: string;
}, unknown>



export function useSignIn(): IUseSignIn {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mutate: signInMutation } = useMutation<User, unknown, { email: string, password: string }, unknown>(
        ({
             email,
             password
         }) => signIn(email, password), {
            onSuccess: (data) => {
                queryClient.setQueryData([QUERY_KEY.user], data);
                notifications.show({
                    title: 'Success',
                    message: 'udalo sie',
                    color: "green",
                    icon: <IconCheck/>
                })
                navigate('/');
            },
            onError: () => {
                notifications.show({
                    title: 'Error',
                    message: 'Ops.. Error on sign in. Try again!',
                    color: "red",
                    icon: <IconX/>
                })
            }
        });

    return signInMutation

}

export {signIn}