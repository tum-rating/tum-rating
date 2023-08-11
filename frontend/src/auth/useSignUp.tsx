import {UseMutateFunction, useMutation, useQueryClient} from '@tanstack/react-query';
import {useNavigate} from 'react-router-dom';
import {QUERY_KEY} from '../constants/queryKeys';
import {ResponseError} from '../utils/Errors/ResponseError';
import {User} from './useUser';
import {notifications} from "@mantine/notifications";
import {IconCheck, IconX} from "@tabler/icons-react";
import {signIn} from "./useSignIn.tsx";
import {endpoints} from "../api";

async function signUp(email: string, password: string, username: string): Promise<User> {


    const response = await fetch(endpoints.signup, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password, username})
    })
    if (!response.ok)
        throw new ResponseError('Failed on sign up request', response);


    return signIn(email, password);
}

type IUseSignUp = UseMutateFunction<User, unknown, {
    email: string;
    password: string;
    username: string;
}, unknown>


export function useSignUp(): IUseSignUp {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {mutate: signUpMutation} = useMutation<User, unknown, {
        email: string,
        password: string,
        username: string
    }, unknown>(
        ({
             email,
             password,
             username
         }) => signUp(email, password, username), {
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

    return signUpMutation
}