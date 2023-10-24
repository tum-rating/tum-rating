import {useForm} from '@mantine/form';
import {
    Anchor,
    Button,
    Flex,
    Group,
    LoadingOverlay,
    Paper,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    ThemeIcon
} from '@mantine/core';
import {ContextModalProps, modals} from '@mantine/modals';
import {useLocation, useNavigate} from 'react-router-dom';

import {LoginInput, useSignIn} from '@/auth/useSignIn';
import {openSignUpModal} from './SignUpModal';
import {useEffect, useState} from 'react';
import {useRecovery} from "@/auth/useRecovery";
import {IconMail} from "@tabler/icons-react";

const openSignInModal = () => {
    modals.openContextModal({
        modal: 'signIn',
        title: 'Login',
        overlayProps: {
            opacity: 0.55,
            blur: 3,
        },
        fullScreen: window.innerWidth <= 900,
        innerProps: {},
    });
};

const SignInModal = ({context, id}: ContextModalProps) => {
    const {mutate: signIn, isLoading: signInLoading, isSuccess: isSignInSuccess} = useSignIn();
    const {mutate: recovery, isLoading: recoveryLoading, isSuccess: isRecoverySuccess} = useRecovery();
    const [isRecoveryOpen, setRecoveryOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const form = useForm({
        initialValues: {
            email: '',
            username: '',
            password: '',
            terms: true,
        },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'invalidEmail'),
        },
    });
    console.log(location)
    useEffect(() => {
        if (isSignInSuccess) {
            if (location.pathname !== "/" && !location.pathname.includes("courses")) {
                navigate("/")
            }
            context.closeModal(id);
        }
    }, [isSignInSuccess])

    const handleSubmit = (e: LoginInput, action: "login" | "recovery") => {
        if (action === "login") {
            signIn(e)
        } else if (action === "recovery") {
            recovery(e)
        }
    }

    return (
        <Paper data-testid="cypress-sign-in-modal" radius="md" p="xl">
            <LoadingOverlay visible={recoveryLoading || signInLoading} overlayBlur={2}/>
            {isRecoveryOpen ? (
                isRecoverySuccess ? (
                    <Flex direction="column" align="center" gap={25}>
                        <Group>
                            <ThemeIcon size="100px" radius={50} variant="gradient"
                                       gradient={{from: 'red', to: 'orange', deg: 105}}>
                                <IconMail size={75}/>
                            </ThemeIcon>
                        </Group>
                        <Text size="xl" fw={900} variant="gradient" gradient={{from: 'red', to: 'orange', deg: 105}}>
                            Check Your Email{' '}
                        </Text>
                        <Text fw={500} px={30} align="center">
                            Please check you email
                            <Text component="span" fw={900} variant="gradient"
                                  gradient={{from: 'red', to: 'orange', deg: 105}}>
                                {' '}
                                {form.values.email}{' '}
                            </Text>
                            for instructions to recover your password.
                        </Text>
                        <Button variant="outlined">Resend email</Button>
                    </Flex>
                ) : (
                    <form onSubmit={form.onSubmit((e) => handleSubmit(e, "recovery"))}>
                        <Stack>
                            <TextInput data-testid="cypress-login-email-input" required label="Email"
                                       placeholder="Email"
                                       radius="md" {...form.getInputProps('email')} />
                        </Stack>
                        <Group position="apart" mt="xl">
                            <Anchor
                                component="button"
                                type="button"
                                color="dimmed"
                                onClick={() => {
                                    setRecoveryOpen(false);
                                }}
                                size="xs"
                            >
                                Back to login
                            </Anchor>
                            <Button type="submit" radius="xl">
                                Send recovery email
                            </Button>
                        </Group>
                    </form>
                )
            ) : (
                <>
                    <Text size="xl" mb="md" weight={600}>
                        Servus !
                    </Text>
                    <form
                        onSubmit={form.onSubmit((e) => handleSubmit(e, "login"))}
                    >
                        <Stack>
                            <TextInput data-testid="cypress-login-email-input" required label="Email"
                                       placeholder="Email" radius="md" {...form.getInputProps('email')} />
                            <PasswordInput data-testid="cypress-login-password-input" autoComplete="on" required
                                           label="Password" placeholder="Password"
                                           radius="md" {...form.getInputProps('password')} />
                        </Stack>
                        <Group position="apart" mt="xl">
                            <Anchor
                                component="button"
                                type="button"
                                color="dimmed"
                                onClick={() => {
                                    openSignUpModal();
                                    context.closeModal(id);
                                }}
                                size="xs"
                            >
                                Don't have an account?
                            </Anchor>
                            <Anchor
                                component="button"
                                type="button"
                                color="dimmed"
                                onClick={() => {
                                    setRecoveryOpen(true);
                                }}
                                size="xs"
                            >
                                Forgot password?
                            </Anchor>
                            <Button type="submit" radius="xl">
                                Login
                            </Button>
                        </Group>
                    </form>
                </>
            )}
        </Paper>
    );
};

export {SignInModal, openSignInModal};
