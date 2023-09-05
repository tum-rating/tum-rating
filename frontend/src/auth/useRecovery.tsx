import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { endpoints } from '../api';

async function recovery({ email, token, password }) {
    const response = await fetch(endpoints.recovery, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, token, password }),
    });

    if (!response.ok) {
        throw new Error('Password recovery failed');
    }

    return true;
}

export function useRecovery() {
    const navigate = useNavigate();
    const recoveryMutation = useMutation(recovery, {
        onSuccess: () => {
            notifications.show({
                title: 'Success',
                message: 'Password recovery successful!',
                color: 'green',
                icon: <IconCheck />,
            });
            navigate('/');
        },
        onError: () => {
            notifications.show({
                title: 'Error',
                message: 'Ops.. Password recovery failed. Try again!',
                color: 'red',
                icon: <IconX />,
            });
        },
    });

    return recoveryMutation.mutate;
}