import { useForm } from '@mantine/form';
import { Anchor, Button, Checkbox, Flex, Group, LoadingOverlay, Paper, PasswordInput, Stack, Text, TextInput, ThemeIcon } from '@mantine/core';
import { useSignUp } from '@/auth/useSignUp';
import { ContextModalProps, modals } from '@mantine/modals';
import { IconMail } from '@tabler/icons-react';
import { openSignInModal } from './SignInModal';

const openSignUpModal = () => {
    modals.openContextModal({
        modal: 'signUp',
        title: 'Register',
        overlayProps: {
            opacity: 0.55,
            blur: 3,
        },
        fullScreen: window.innerWidth <= 900,
        closeOnClickOutside: false,
        innerProps: {},
    });
};

const SignUpModal = ({ context, id }: ContextModalProps) => {
    const { isSuccess,isLoading, mutate:signUp } = useSignUp();
    const form = useForm({
        initialValues: {
            email: '',
            username: '',
            password: '',
            terms: true,
        },
        validate: {
            email: (val: string) => (/^\S+@\S+$/.test(val) ? null : 'invalidEmail'),
        },
    });

    return (
        <Paper radius="md" p="xl" data-testid="cypress-sign-up-modal">
            <LoadingOverlay visible={isLoading} overlayBlur={2} />
            {isSuccess ? (
                <Flex direction="column" align="center" gap={25}>
                    <Group>
                        <ThemeIcon size="100px" radius={50} variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 105 }}>
                            <IconMail size={75} />
                        </ThemeIcon>
                    </Group>
                    <Text size="xl" fw={900} variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 105 }}>
                        Check Your Email{' '}
                    </Text>
                    <Text fw={500} px={30} align="center">
                        Please check you email
                        <Text component="span" fw={900} variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 105 }}>
                            {' '}
                            {form.values.email}{' '}
                        </Text>
                        for instructions to activate your account.
                    </Text>
                    <Button variant="outlined">Resend email</Button>
                </Flex>
            ) : (
                <>
                    <Text size="xl" mb="md" weight={600}>
                        Create an account
                    </Text>
                    <form
                        onSubmit={form.onSubmit((e) => {
                            signUp(e)
                        })}
                    >
                        <Stack>
                            <TextInput data-testid="cypress-login-username-input" label={'username'} placeholder={'username'} value={form.values.username} onChange={(event) => form.setFieldValue('username', event.currentTarget.value)} radius="md" />
                            <TextInput data-testid="cypress-login-email-input" required label="Email" placeholder="Email" value={form.values.email} onChange={(event) => form.setFieldValue('email', event.currentTarget.value)} error={form.errors.email} radius="md" />
                            <PasswordInput data-testid="cypress-login-password-input" autoComplete="on" required label="Password" placeholder="Password" value={form.values.password} onChange={(event) => form.setFieldValue('password', event.currentTarget.value)} error={form.errors.password} radius="md" />
                            <Checkbox label="Accept terms of usage" checked={form.values.terms} onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)} />
                        </Stack>
                        <Group position="apart" mt="xl">
                            <Anchor
                                component="button"
                                type="button"
                                color="dimmed"
                                onClick={() => {
                                    openSignInModal();
                                    context.closeModal(id);
                                }}
                                size="xs"
                            >
                                Already have an account?
                            </Anchor>
                            <Button type="submit" radius="xl">
                                Register
                            </Button>
                        </Group>
                    </form>
                </>
            )}
        </Paper>
    );
};

export { SignUpModal, openSignUpModal };
