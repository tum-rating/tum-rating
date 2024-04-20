import {NotificationData, notifications} from '@mantine/notifications';
import {useQueryClient} from '@tanstack/react-query';
import {useCallback} from 'react';
import {useNavigate} from 'react-router-dom';

import * as userLocalStorage from "@/auth/user.localstore.ts";
import {QUERY_KEY} from '@/constants/queryKeys.ts';


export interface useSignOutProps extends NotificationData {
}

type IUseSignOut = (notification: useSignOutProps) => void;


export function useSignOut(): IUseSignOut {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useCallback((notification) => {
        queryClient.setQueryData([QUERY_KEY.user], null);
        queryClient.setQueryData([QUERY_KEY.user_details], null);
        userLocalStorage.removeUser()
        notifications.show({
            color: 'blue',
            withCloseButton: true,
            className: 'sign-out-notification',
            title: 'You have been signed out',
            ...notification,
        });
    }, [navigate, queryClient]);
}
