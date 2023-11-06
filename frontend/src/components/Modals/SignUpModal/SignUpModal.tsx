import { useForm } from '@mantine/form';
import { Anchor, Button, Checkbox, Container, Flex, Group, LoadingOverlay, PasswordInput, Stack, Text, TextInput, ThemeIcon } from '@mantine/core';
import { useSignUp } from '@/auth/useSignUp.tsx';
import { ContextModalProps, modals } from '@mantine/modals';
import { IconMail } from '@tabler/icons-react';
import { openSignInModal } from '@/components/Modals';
import { contextModalConfig } from '@/components/Modals/contextModalConfig.ts';

const openSignUpModal = () => {
    modals.openContextModal({
        ...contextModalConfig('signUp', <Text fw={600}>Sign Up</Text>),
        closeOnClickOutside: false,
    });
};

const SignUpModal = ({ context, id }: ContextModalProps) => {
    const { isSuccess, isLoading, mutate: signUp } = useSignUp();
    const form = useForm({
        initialValues: {
            email: '',
            username: '',
            password: '',
            terms: true,
        },
        validate: {
            email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'Invalid Email'),
        },
    });

    return (
        <Container p={0} data-testid="cypress-sign-up-modal">
            <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />
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
                    <Button variant="subtle" color="indigo" mt="xl">
                        Resend email
                    </Button>
                </Flex>
            ) : (
                <form
                    onSubmit={form.onSubmit((e) => {
                        signUp(e);
                    })}
                >
                    <Stack>
                        <TextInput data-testid="cypress-login-username-input" label={'Your name'} required placeholder={'Your name'} value={form.values.username} onChange={(event) => form.setFieldValue('username', event.currentTarget.value)} />
                        <TextInput data-testid="cypress-login-email-input" required label="Email" placeholder="Email" value={form.values.email} onChange={(event) => form.setFieldValue('email', event.currentTarget.value)} error={form.errors.email} />
                        <PasswordInput data-testid="cypress-login-password-input" autoComplete="on" required label="Password" placeholder="Password" value={form.values.password} onChange={(event) => form.setFieldValue('password', event.currentTarget.value)} error={form.errors.password} />
                        <Checkbox label="Accept terms of usage" checked={form.values.terms} onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)} />
                        <Group>
                            <Anchor
                                component="button"
                                type="button"
                                onClick={() => {
                                    openSignInModal();
                                    context.closeModal(id);
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
    );
};

export { SignUpModal, openSignUpModal };
