import {Button, CopyButton, Flex, rem, Text, Tooltip} from "@mantine/core";
import {notifications} from "@mantine/notifications";
import {IconCheck, IconCopy} from "@tabler/icons-react";

import {useSignOutProps} from "@/auth/useSignOut.tsx";
import {getPath, Paths} from "@/routes/paths.ts";
import {ResponseError} from "@/utils/Errors/ResponseError.ts";

interface handleAuthErrorsProps {
    error: any;
    signOut: (props: useSignOutProps) => void;
    callback?: () => void;
    navigate?: any;
}

export function handleAuthErrors({error, callback = () => null, signOut, navigate}: handleAuthErrorsProps) {
    if (error instanceof ResponseError) {
        if (error.response.status === 401) {
            notifications.show({
                title: 'Error',
                message: <Text size="xs">
                    401: {error.response.statusText}
                </Text>,
                color: 'red',
                id: 'unauthorized',
                withCloseButton: true,
                className: 'sign-out-notification',
            });
            callback && callback();
        }
        if (error.response.status === 403) {
            signOut({
                title: `You have been signed out due to an error: 403`,
                icon: null,
                message:
                    <Flex align="center" gap={4}>
                        <Button h={24} p={0} m={0} size="xs" variant="transparent" onClick={() => {
                            navigate(getPath(Paths.signIn));
                            notifications.hide('forbidden-sign-out');
                        }}>Sign in again</Button>
                        <Text size="xs">
                            or contact support
                        </Text>
                        <CopyButton value={import.meta.env.VITE_SUPPORT_EMAIL} timeout={5000}>
                            {({copied, copy}) => (
                                <Tooltip zIndex={99999999} label={copied ? 'Copied' : 'Copy'}>
                                    <Button h={24} p={0} m={0} size="xs" color={copied ? 'teal' : 'blue'}
                                            variant="transparent"
                                            onClick={copy}>
                                        {import.meta.env.VITE_SUPPORT_EMAIL}
                                        {copied ? (
                                            <IconCheck style={{marginLeft: "4px", width: rem(16)}}/>
                                        ) : (
                                            <IconCopy style={{marginLeft: "4px", width: rem(16)}}/>
                                        )}
                                    </Button>
                                </Tooltip>
                            )}
                        </CopyButton>
                    </Flex>,
                color: 'red',
                id: 'forbidden-sign-out',
                withCloseButton: true,
                autoClose: false,
            });
            callback && callback();
        }
    }
}