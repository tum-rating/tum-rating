import {Button, Flex, Text} from '@mantine/core';
import {notifications} from '@mantine/notifications';

import {useSignOutProps} from '@/auth/useSignOut.tsx';
import {getPath, Paths} from '@/routes/paths.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

interface handleAuthErrorsProps {
    error: any;
    signOut: (props: useSignOutProps) => void;
    callback?: () => void;
    navigate?: any;
}

export function handleAuthErrors({error, callback = () => null, signOut, navigate}: handleAuthErrorsProps) {
    if (error instanceof ResponseError) {
        if (error.response.status === 401) {
            signOut({
                title: `You have been signed out`,
                icon: null,
                message: (
                    <Flex align="center" gap={4}>
                        <Button
                            h={24}
                            p={0}
                            m={0}
                            size="xs"
                            variant="transparent"
                            onClick={() => {
                                navigate(getPath(Paths.signIn));
                                notifications.hide('unauthorized-sign-out');
                            }}
                        >
                            Sign in again
                        </Button>
                    </Flex>
                ),
                color: 'red',
                id: 'unauthorized-sign-out',
                withCloseButton: true,
                autoClose: false,
            });
            callback && callback();
        }
        if (error.response.status === 403) {
            notifications.show({
                title: 'Error',
                message: <Text size="xs">{error.response.statusText}</Text>,
                color: 'red',
                id: 'unauthorized',
                withCloseButton: true,
                className: 'sign-out-notification',
            });
            callback && callback();
        }
    }
}
