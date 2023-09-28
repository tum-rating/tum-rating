import {useDisclosure} from '@mantine/hooks';
import {useForm} from '@mantine/form';
import {Anchor, Button, Group, LoadingOverlay, Paper, PasswordInput, Stack, Text, TextInput} from '@mantine/core';
import {ContextModalProps, modals} from '@mantine/modals';
import {useNavigate} from 'react-router-dom';

import {useSignIn} from '@/auth/useSignIn';
import {openSignUpModal} from './SignUpModal';
import {useEffect, useState} from 'react';

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
        attributes: {},
    });
};

const SignInModal = ({context, id}: ContextModalProps) => {
    const {signIn} = useSignIn();
    const [isRecoveryOpen, setRecoveryOpen] = useState(false);
    const [visible, {open, close}] = useDisclosure(false);
    const navigate = useNavigate();
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

    useEffect(() => {
        if (isRecoveryOpen) {
            context.modals[0].props.title = 'Recovery';
        }
    }, [isRecoveryOpen]);

    return (
        <Paper data-testid="cypress-sign-in-modal" radius="md" p="xl">
            <LoadingOverlay visible={visible} overlayBlur={2}/>
            {isRecoveryOpen ? (
                <form>
                    <Stack>
                        <TextInput data-testid="cypress-login-email-input" required label="Email" placeholder="Email"
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
            ) : (
                <>
                    <Text size="xl" mb="md" weight={600}>
                        Servus !
                    </Text>
                    <form
                        onSubmit={form.onSubmit((e) => {
                            open();
                            signIn(e)
                                .then(() => {
                                    close();
                                    context.closeModal(id);
                                    navigate('/');
                                })
                                .catch(() => {
                                    close();
                                });
                        })}
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
