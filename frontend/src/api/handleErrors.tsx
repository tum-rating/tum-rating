import {Button, Flex, Text} from '@mantine/core';
import {notifications} from '@mantine/notifications';

import {useSignOutProps} from '@/auth/useSignOut.tsx';
import {getPath, Paths} from '@/routes/paths.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';
import * as userLocalStorage from "@/auth/user.localstore.ts";

interface handleAuthErrorsProps {
    error: any;
    signOut: (props: useSignOutProps) => void;
    callback?: () => void;
    navigate?: any;
}

export function handleAuthErrors({error, callback = () => null, signOut, navigate}: handleAuthErrorsProps) {
    if (error instanceof ResponseError) {
        if (error.response.status === 401) {
            const userFromLocalStorage = userLocalStorage.getUser();
            if (userFromLocalStorage) {
                signOut({
                    title: error.response.statusText,
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
                    id: 'unauthorized-sign-out',
                    withCloseButton: true,
                    autoClose: false,
                });
            }
            callback && callback();
        }
        if (error.response.status === 403) {
            notifications.show({
                title: 'Error:403',
                message: <Text size="xs">{error.response.statusText}</Text>,
                color: 'red',
                id: 'unauthorized',
                withCloseButton: true,
                className: 'sign-out-notification',
            });
            callback && callback();
        }
        if(error.response.status === 404) {
            const userFromLocalStorage = userLocalStorage.getUser();
            if (userFromLocalStorage) {
                signOut({
                    title: error.response.statusText,
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
                    id: 'unauthorized-sign-out',
                    withCloseButton: true,
                    autoClose: false,
                });
            }else{
                notifications.show({
                    title: 'Error:404',
                    message: <Text size="xs">{error.response.statusText}</Text>,
                    color: 'red',
                    id: 'not-found',
                    withCloseButton: true,
                    className: 'not-found-notification',
                });
            }
            callback && callback();
        }
    }
}
