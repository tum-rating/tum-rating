import { Alert, Anchor, Box, Button, Checkbox, Container, Flex, Group, LoadingOverlay, PasswordInput, Stack, Text, TextInput, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ContextModalProps, modals } from '@mantine/modals';
import { IconFaceIdError, IconMail } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useSignUp } from '@/auth/useSignUp.tsx';
import { contextModalConfig } from '@/components/Modals/contextModalConfig.ts';
import { getPath, Paths } from '@/routes/paths.ts';

interface SignUpModalProps extends ContextModalProps {}

const openSignUpModal = ({ ...props }: SignUpModalProps) => {
    modals.openContextModal({
        ...contextModalConfig('signUp', <Text fw={600}>Sign Up</Text>),
        closeOnClickOutside: false,
        ...props,
    });
};

const SignUpModal = () => {
    const { isSuccess, isPending: isLoading, mutate: signUp, error, isError } = useSignUp();
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setApiError(isError);
    }, [isError]);

    const form = useForm({
        initialValues: {
            email: '',
            username: '',
            password: '',
            terms: true,
        },
        validate: {
            email: (value) => !value.includes('@') && 'Invalid email',
            password: (value) => value.length < 6 && 'Password should contain at least 6 characters',
            terms: (value) => !value && 'You should accept terms of usage',
        },
    });

    return (
        <Box pos="relative">
            <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />
            <Container p={0} data-testid="cypress-sign-up-modal">
                {isSuccess ? (
                    <Flex direction="column" align="center" gap="xs" mt="xl">
                        <Group>
                            <ThemeIcon size="80px" radius={50} variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }}>
                                <IconMail size={55} />
                            </ThemeIcon>
                        </Group>
                        <Text size="xl" fw={900} variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }}>
                            Check Your Email{' '}
                        </Text>
                        <Text fw={400} px={30} ta="center">
                            Please check you email
                            <Text component="span" size="md" fw={900} variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }}>
                                {' '}
                                {form.values.email}{' '}
                            </Text>
                            for instructions to activate your account.
                        </Text>
                    </Flex>
                ) : (
                    <form
                        onSubmit={form.onSubmit((e) => {
                            signUp(e);
                        })}
                    >
                        <Stack>
                            <TextInput  data-testid="cypress-login-username-input" label={'Your name'} required placeholder={'Your name'} value={form.values.username} onChange={(event) => form.setFieldValue('username', event.currentTarget.value)} />
                            <TextInput type="email" data-testid="cypress-login-email-input" required label="Email" placeholder="Email" value={form.values.email} onChange={(event) => form.setFieldValue('email', event.currentTarget.value)} error={form.errors.email} />
                            <PasswordInput data-testid="cypress-login-password-input" autoComplete="on" required label="Password" placeholder="Password" value={form.values.password} onChange={(event) => form.setFieldValue('password', event.currentTarget.value)} error={form.errors.password} />
                            <Checkbox label="Accept terms of usage" checked={form.values.terms} onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)} />
                            {form.errors.terms && (
                                <Text c="red" size="sm">
                                    {form.errors.terms}
                                </Text>
                            )}
                            {apiError && error && (
                                <Alert variant="light" color="red" title="Error" icon={<IconFaceIdError />} withCloseButton onClose={() => setApiError(false)}>
                                    <Text size="xs">{error.message || 'An error occurred'}</Text>
                                </Alert>
                            )}
                            <Group>
                                <Anchor
                                    component="button"
                                    type="button"
                                    onClick={() => {
                                        navigate(getPath(Paths.signIn));
                                    }}
                                    size="xs"
                                >
                                    Already have an account?
                                </Anchor>
                            </Group>
                            <Button type="submit" mt="xs" variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }}>
                                Sign Up
                            </Button>
                        </Stack>
                    </form>
                )}
            </Container>
        </Box>
    );
};

export { SignUpModal, openSignUpModal };
