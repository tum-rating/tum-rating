import {
    Alert,
    Anchor,
    Button,
    Container,
    Divider,
    Group,
    LoadingOverlay,
    PasswordInput,
    Stack,
    Text,
    TextInput
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {ContextModalProps, modals} from '@mantine/modals';
import {notifications} from '@mantine/notifications';
import {IconAt, IconFaceIdError, IconKey, IconLock} from '@tabler/icons-react';
import {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import classes from "./SSOButton.module.css";

import {endpoints} from "@/api";
import {LoginInput, useSignIn} from '@/auth/useSignIn.tsx';
import {useUser} from '@/auth/useUser.tsx';
import {contextModalConfig} from '@/components/Modals/contextModalConfig.ts';
import {CloseButton} from '@/components/Modals/shared/CloseButton';
import {ModalHeader} from '@/components/Modals/shared/ModalHeader';
import {ModalResponsiveContainer} from '@/components/Modals/shared/ModalResponsiveContainer';
import {getPath, Paths} from '@/routes/paths.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';


interface SignInModalProps extends ContextModalProps {
}

const openSignInModal = ({...props}: SignInModalProps) => {
    modals.openContextModal({
        ...contextModalConfig({modal: 'signIn'}),
        ...props,
    });
};

const SignInModal = ({context, id}: ContextModalProps) => {
    const {mutate: signIn, isPending: signInLoading, isSuccess: isSignInSuccess, error, isError} = useSignIn();
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const {data: user, isLoading: userLoading} = useUser();

    useEffect(() => {
        setApiError(isError);
    }, [isError]);

    useEffect(() => {
        notifications.clean();
    }, []);

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: (value) => {
                if (!value.includes('@')) {
                    return 'Invalid email';
                }
                return false;
            },
        },
    });

    useEffect(() => {
        if (isSignInSuccess) {
            if (location.pathname !== '/' && !location.pathname.includes('courses')) {
                navigate('/');
            } else {
                context?.closeModal(id);
            }
        }
    }, [context, id, isSignInSuccess, location.pathname, navigate]);

    const handleSubmit = (e: LoginInput) => {
        signIn(e);
    };
    if ((userLoading || user) && !isSignInSuccess) {
        return null;
    }
    return (
        <ModalResponsiveContainer>
            <ModalHeader
                title="Sign in"
                subTitle={
                    <>
                        Sign in with your{' '}
                        <Text mx={3} variant={'gradient'} fw="bold" fz="sm" display="inline">
                            TUM University
                        </Text>
                        email.
                    </>
                }
            />
            <CloseButton
                onClick={() => {
                    context.closeModal(id);
                }}
            />
            <Container p="sm">
                <LoadingOverlay visible={signInLoading} overlayProps={{radius: 'sm', blur: 2}}/>
                <form className="modal-form" data-testid="sign-in-form"
                      onSubmit={form.onSubmit((e) => handleSubmit(e))}>
                    <Stack>
                        <TextInput autoFocus data-autofocus type="email" leftSection={<IconAt size="1.1rem"/>}
                                   data-testid="email" required label="Email"
                                   placeholder="Email" {...form.getInputProps('email')} />
                        <PasswordInput leftSection={<IconLock size="1.1rem"/>} data-testid="password" autoComplete="on"
                                       required label="Password"
                                       placeholder="Password" {...form.getInputProps('password')} />
                        <Group justify="space-between">
                            <Anchor
                                component="button"
                                type="button"
                                onClick={() => {
                                    navigate(getPath(Paths.signUp));
                                }}
                                size="xs"
                            >
                                Don't have an account?
                            </Anchor>
                            <Anchor
                                component="button"
                                type="button"
                                onClick={() => {
                                    navigate(getPath(Paths.forgotPassword));
                                }}
                                size="xs"
                            >
                                Forgot password?
                            </Anchor>
                        </Group>
                        {apiError && error && (
                            <Alert data-testid="error-message" variant="light" color="red" title="Error"
                                   icon={<IconFaceIdError/>} withCloseButton onClose={() => setApiError(false)}>
                                <Text
                                    size="xs">{error instanceof ResponseError ? error?.message : 'An error occurred'}</Text>
                            </Alert>
                        )}
                        <Button data-testid="submit" mt="xs" type="submit" variant="gradient"
                                gradient={{from: 'indigo', to: 'blue', deg: 90}}>
                            Sign In
                        </Button>

                        {
                            import.meta.env.VITE_OAUTH_IS_ENABLED === "true" && (
                                <>
                                    <Divider label="or" orientation="horizontal"/>
                                    <Button component={'a'}
                                            variant='outline'
                                            className={classes.SSOButton}
                                            href={endpoints.sso}
                                            leftSection={<IconKey size="1.1rem"/>}
                                    >
                                        Sign In With ID
                                    </Button>
                                </>
                            )
                        }
                    </Stack>
                </form>
            </Container>
        </ModalResponsiveContainer>
    );
};

export {SignInModal, openSignInModal};
