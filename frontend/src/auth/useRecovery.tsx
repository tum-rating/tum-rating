import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import { endpoints } from '@/api';

async function recovery({ email }: RecoveryBody) {
    const response = await fetch(endpoints.recovery, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        throw new Error('Password recovery failed');
    }

    return true;
}

interface RecoveryBody {
    email: string;
}

export function useRecovery() {
    return (recoveryBody: RecoveryBody) =>
        recovery(recoveryBody).then((status) => {
            if (status) {
                notifications.show({
                    title: 'Success',
                    message: 'Recovery successful!',
                    color: 'green',
                    icon: <IconCheck />,
                });
                return true;
            } else {
                notifications.show({
                    title: 'Error',
                    message: 'Ops.. Error on recovery. Try again!',
                    color: 'red',
                    icon: <IconX />,
                });
                return false;
            }
        });
}
