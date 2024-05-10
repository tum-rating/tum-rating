import {Button, Flex} from '@mantine/core';
import {notifications} from '@mantine/notifications';

import * as userLocalStorage from "@/auth/user.localstore.ts";
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
        const initialErrorConfig = {
            id: error.errorId,
            title: error.status,
            message: error.message,
            loading: false,
            withCloseButton: true,
        }
        switch (error.status) {
            case 400:
                notifications.show({
                    ...initialErrorConfig,
                    color: 'red',
                    withCloseButton: true,
                    className: 'bad-request-notification',
                });
                callback && callback();
                break;
            case 401:
                const userFromLocalStorage = userLocalStorage.getUser();
                if (userFromLocalStorage) {
                    signOut({
                        ...initialErrorConfig,
                        title: error.message,
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
                                        navigate("/" + getPath(Paths.signIn));
                                        notifications.hide('unauthorized-sign-out');
                                    }}
                                >
                                    Sign in again
                                </Button>
                            </Flex>
                        ),
                        color: 'red',
                        withCloseButton: true,
                        autoClose: false,
                    });
                }else{
                    notifications.show({
                        ...initialErrorConfig,
                        color: 'red',
                        withCloseButton: true,
                        className: 'unauthorized-sign-out',
                    });
                }
                callback && callback();
                break;
            case 403:
                notifications.show({
                    ...initialErrorConfig,
                    color: 'red',
                    withCloseButton: true,
                    className: 'sign-out-notification',
                });
                callback && callback();
                break;

            case 404:
                notifications.show({
                    ...initialErrorConfig,
                    color: 'red',
                    withCloseButton: true,
                    className: 'not-found-notification',
                });
                callback && callback();
                break;
            default:
                break;

        }
    }
}
