import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUERY_KEY } from '@/constants/queryKeys';
import { notifications } from '@mantine/notifications';
import { IconX } from '@tabler/icons-react';

type IUseSignOut = () => void;

export function useSignOut(): IUseSignOut {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useCallback(() => {
        queryClient.setQueryData([QUERY_KEY.user], null);
        navigate('/');
        notifications.show({
            message: 'Sign out successful!',
            autoClose: 10000,
            color: 'green',
            className: 'sign-out-notification',
            icon: <IconX />,
        });
    }, [navigate, queryClient]);
}
