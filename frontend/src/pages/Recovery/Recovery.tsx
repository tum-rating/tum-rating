import { Alert, Box, Button, Center, Container, Flex, LoadingOverlay, PasswordInput, Stack, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconFaceIdError } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import classes from './Recovery.module.css';

import { useRecovery } from '@/auth/useRecovery.tsx';
import { useVisualViewportHeight } from '@/hooks/useVisualViewportHeight/useVisualViewportHeight.tsx';
import { ResponseError } from '@/utils/Errors/ResponseError.ts';

interface RecoveryFormProps {
    password: string;
    confirmPassword: string;
}

export const Recovery = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const { mutate: recovery, isPending: recoveryLoading, isSuccess: isRecoverySuccess, isError, error } = useRecovery();
    const [apiError, setApiError] = useState(null);
    useEffect(() => {
        setApiError(isError);
    }, [isError]);
    const form = useForm({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validate: {
            password: (value) => value.length < 6 && 'Password should be at least 6 characters long',
            confirmPassword: (value, values) => (value !== values.password ? 'Passwords did not match' : null),
        },
    });

    const handleResetPassword = (form: RecoveryFormProps) => {
        recovery({ password: form.password, token: token });
    };

    const visualViewport = useVisualViewportHeight();

    return (
        <Stack mx="auto" align="center" justify="center" className={classes.wrapper} h={visualViewport}>
            {!token ? (
                <Center h="100%">
                    <Flex justify="center" align="center" direction="column" gap="md">
                        <svg className={classes.notFoundImg} viewBox="0 0 72 72" width="64px" height="64px">
                            <path d="M17.0312 64.4375C26.25 64.4375 33.5625 52.9688 33.5625 36.4375C33.5625 19.9062 26.25 8.46875 17.0312 8.46875C7.8125 8.46875 0.5 19.9062 0.5 36.4375C0.5 52.9688 7.8125 64.4375 17.0312 64.4375ZM54.9688 64.4375C64.1875 64.4375 71.5 52.9688 71.5 36.4375C71.5 19.9062 64.1875 8.46875 54.9688 8.46875C45.75 8.46875 38.4375 19.9062 38.4375 36.4375C38.4375 52.9688 45.75 64.4375 54.9688 64.4375ZM10.0625 47.1875C15.125 47.1875 18.4688 43.6562 18.4688 38.3438C18.4688 33.0938 15.125 29.5625 10.0625 29.5625C7.6875 29.5625 5.71875 30.3125 4.25 31.6875C5.375 19.9375 10.6875 11.9375 17.0312 11.9062C24.25 11.875 30.125 22.0312 30.125 36.4375C30.125 50.7812 24.25 60.9688 17.0312 61C11.5312 61.0312 6.78125 54.9688 4.90625 45.5938C6.28125 46.625 8.03125 47.1875 10.0625 47.1875ZM47.9688 47.1875C53 47.1875 56.4062 43.6562 56.4062 38.3438C56.4062 33.0938 53 29.5625 47.9688 29.5625C45.5938 29.5625 43.5938 30.3438 42.1562 31.6875C43.2812 19.9375 48.5938 11.9375 54.9688 11.9375C62.1562 11.9062 68 22.0938 68 36.4375C68 50.7812 62.1562 60.9688 54.9688 60.9688C49.4375 61 44.6875 54.9375 42.7812 45.5938C44.1562 46.5938 45.9375 47.1875 47.9688 47.1875ZM45.5312 37.4062C44.4375 37.25 43.75 35.9688 44.0312 34.6562C44.3125 33.3125 45.3125 32.3438 46.375 32.5312C47.4688 32.75 48.0938 34.0312 47.8438 35.3125C47.5938 36.6562 46.5938 37.5938 45.5312 37.4062ZM7.625 37.4062C6.53125 37.25 5.84375 35.9688 6.09375 34.6562C6.375 33.3125 7.40625 32.3438 8.4375 32.5312C9.5625 32.7812 10.1875 34.0312 9.9375 35.3125C9.6875 36.6562 8.65625 37.5938 7.625 37.4062Z" />
                        </svg>
                        <Text c="dimmed" ta="center" fz="15">
                            Password recovery link is invalid or expired 🕒
                        </Text>
                        <Button onClick={() => navigate('/')}>Go back to home</Button>
                    </Flex>
                </Center>
            ) : isRecoverySuccess ? (
                <Box maw={300}>
                    <Text ta="center" fw="bold" fz="xl" mb="xs">
                        Password Recovery Complete 🎉
                    </Text>
                    <Container p={0} size={600} mb="xl">
                        <Text c="dimmed" ta="center" fz="15">
                            Good news – your password has been recovered! You can now log in to your account using your new credentials.
                        </Text>
                    </Container>

                    <Button mt={10} fullWidth variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }} className={classes.control} onClick={() => navigate('/#modal=sign-in')}>
                        Log In
                    </Button>
                </Box>
            ) : (
                <Box maw={300}>
                    <Text ta="center" fw="bold" fz="xl" mb="xs">
                        Reset Your Password
                    </Text>
                    <Container p={0} size={600} mb="xl">
                        <Text c="dimmed" ta="center" fz="sm">
                            You are just a step aw ay from resetting your password. Please enter your new password below to regain access to your account.
                        </Text>
                    </Container>
                    <form
                        onSubmit={form.onSubmit((e) => {
                            handleResetPassword(e);
                        })}
                    >
                        <LoadingOverlay visible={recoveryLoading} />
                        <Stack>
                            <PasswordInput autoFocus data-autofocus data-testid="password" autoComplete="on" required label="Password" placeholder="Password" value={form.values.password} onChange={(event) => form.setFieldValue('password', event.currentTarget.value)} error={form.errors.password} />
                            <PasswordInput data-testid="confirm-password" autoComplete="on" required label="Confirm Password" placeholder="Confirm Password" value={form.values.confirmPassword} onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)} error={form.errors.confirmPassword} />
                            {apiError && error && (
                                <Alert variant="light" color="red" title="Error" icon={<IconFaceIdError />} withCloseButton onClose={() => setApiError(false)}>
                                    <Text size="xs">{error instanceof ResponseError ? error?.message : 'An error occurred'}</Text>
                                </Alert>
                            )}
                            <Button mt={10} fullWidth variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }} type="submit">
                                Reset Password
                            </Button>
                        </Stack>
                    </form>
                </Box>
            )}
        </Stack>
    );
};
