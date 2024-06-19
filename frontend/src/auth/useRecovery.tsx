import { endpoints, useMutationWithAuth } from '@/api';
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

    if (!response.ok) throw new ResponseError(`${response.status}:${response.statusText}`, response, 'recovery');
    return true;
}

export interface RecoveryBody {
    email?: string;
    password?: string;
    token?: string;

    [key: string]: string | undefined;
}

export function useRecovery() {
    return useMutationWithAuth({
        mutationFn: async ({ email, password, token }: RecoveryBody) =>
            await recovery({
                email,
                password,
                token,
            }),
    });
}
