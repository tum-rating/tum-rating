import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';

import { endpoints } from '@/api';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

async function signUp({ email, password, username }: RegisterInput): Promise<{ success: boolean }> {
    const response = await fetch(endpoints.signup, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
    });
    if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData)
        throw new ResponseError(errorData.message, response);
    }
    return { success: true };
}

type RegisterInput = {
    email: string;
    password: string;
    username: string;
};

export function useSignUp() {
    return useMutation({
        mutationFn: async ({ email, password, username }: RegisterInput) => await signUp({ email, password, username }),
        onSuccess: () => {
            notifications.show({
                message: 'Sign up successful! Check your email!',
                color: 'green',
                icon: <IconCheck />,
            });
        },
        onError: (error) => {
            const errorMessage = error instanceof ResponseError ? error.message : 'Ops.. Error on sign up. Try again!';
            notifications.show({
                message: errorMessage,
                withCloseButton: true,
                autoClose: 10000,
                title: 'Error',
                color: 'red',
                icon: <IconX />,
            });
        },
    });
}
