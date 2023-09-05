import {useMutation} from '@tanstack/react-query';
import {ResponseError} from '../utils/Errors/ResponseError';
import {notifications} from '@mantine/notifications';
import {IconX} from '@tabler/icons-react';
import {endpoints} from '../api';

async function signUp({email, password, username}: RegisterInput): Promise<{ success: boolean }> {
    const response = await fetch(endpoints.signup, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password, username})
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new ResponseError(errorData.message, response);
    }
    return {success: true};
}

type RegisterInput = {
    email: string;
    password: string;
    username: string;
}
export function useSignUp(): { signUp: any; isSuccess: boolean } {
    const {mutateAsync: signUpMutation, isSuccess} = useMutation({
        mutationFn: async ({email, password, username}: RegisterInput) => await signUp({email, password, username}),
        onSuccess: () => {
            notifications.show({
                message: 'Sign up successful! Check your email!',
                color: 'green',
                icon: <IconX/>,
            });
        },
        onError: (error) => {
            const errorMessage = error instanceof ResponseError ? error.message : 'Ops.. Error on sign up. Try again!';
            notifications.show({
                message: errorMessage,
                color: 'red',
                icon: <IconX/>,
            });
        },
    })
    return {signUp: signUpMutation, isSuccess}
}
