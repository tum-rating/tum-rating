import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';
import { useMutation } from '@tanstack/react-query';

import { endpoints } from '@/api';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

async function recovery(props: RecoveryBody) {
    const requestBody = Object.entries(props).reduce((acc: RecoveryBody, [key, value]) => {
        if (value) {
            acc[key] = value;
        }
        return acc;
    }, {});

    const response = await fetch(endpoints.recovery, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        throw new Error('Password recovery failed');
    }

    return true;
}

export interface RecoveryBody {
    email?: string;
    password?: string;
    token?: string;
    [key: string]: string | undefined;
}

export function useRecovery() {
    return useMutation({
        mutationFn: async ({ email, password, token }: RecoveryBody) =>
            await recovery({
                email,
                password,
                token,
            }),
        onError: (error) => {
            const errorMessage = error instanceof ResponseError ? error.message : 'Ops.. Error on sign up. Try again!';
            notifications.show({
                message: errorMessage,
                color: 'red',
                icon: <IconX />,
            });
        },
    });
}
