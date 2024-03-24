
import { notifications, NotificationData } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { QUERY_KEY } from '@/constants/queryKeys.ts';
import * as userLocalStorage from "@/auth/user.localstore.ts";


type IUseSignOut = (notification: useSignOutProps) => void;

export interface useSignOutProps extends NotificationData {}

export function useSignOut(): IUseSignOut {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useCallback((notification) => {
        queryClient.setQueryData([QUERY_KEY.user], null);
        userLocalStorage.removeUser()
        notifications.show({
            message: 'Sign out successful!',
            color: 'green',
            withCloseButton: true,
            className: 'sign-out-notification',
            icon: <IconCheck />,
            ...notification,
        });
    }, [navigate, queryClient]);
}
