import {useLocation} from 'react-router-dom';
import {endpoints} from '../api';
import {notifications} from '@mantine/notifications';
import {IconCheck, IconX} from '@tabler/icons-react';
import {useMemo} from "react";

async function activate(token: string | null): Promise<boolean> {
    const response = await fetch(endpoints.activate, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({token}),
    });

    if (!response.ok) {
        return false;
    }
    return true;
}

export async function useActivate() {
    //TODO: fix double rerender
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    return useMemo(() => {
        if (token) {
            return activate(token).then((status) => {
                if (status) {
                    notifications.show({
                        title: 'Success',
                        message: 'Activation successful!',
                        color: 'green',
                        icon: <IconCheck/>,
                    });
                    return true;
                } else {
                    notifications.show({
                        title: 'Error',
                        message: 'Ops.. Error on activation. Try again!',
                        color: 'red',
                        icon: <IconX/>,
                    });
                    return false;
                }
            });
        } else {
            return false;
        }
    }, [token]);
}
