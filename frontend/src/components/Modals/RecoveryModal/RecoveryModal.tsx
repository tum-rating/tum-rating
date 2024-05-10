import { Alert, Anchor, Button, Flex, Group, LoadingOverlay, Stack, Text, TextInput, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ContextModalProps, modals } from '@mantine/modals';
import { IconAt, IconFaceIdError, IconMail } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { RecoveryBody, useRecovery } from '@/auth/useRecovery.tsx';
import { contextModalConfig } from '@/components/Modals/contextModalConfig.ts';
import { getPath, Paths } from '@/routes/paths.ts';

interface RecoveryModalProps extends ContextModalProps {}

const openRecoveryModal = ({ ...props }: RecoveryModalProps) => {
    modals.openContextModal({
        ...contextModalConfig('recovery', <Text fw={600}>Recover Your Password</Text>),
        ...props,
    });
};

const RecoveryModal = () => {
    const { mutate: recovery, isPending: recoveryLoading, isSuccess: isRecoverySuccess, error, isError } = useRecovery();
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        setApiError(isError);
    }, [isError]);
    const form = useForm({
        initialValues: {
            email: '',
        },
        validate: {
            email: (val) => {
                if (!/^\S+@\S+$/.test(val)) {
                    return 'Invalid Email';
                }
                if (!val.endsWith('@tum.de')) {
                    return 'Email must end with @tum.de';
                }
                return null;
            },
        },
    });

    const handleSubmit = (e: RecoveryBody) => {
        recovery(e);
    };

    return (
        <form onSubmit={form.onSubmit((e) => handleSubmit(e))}>
            <LoadingOverlay visible={recoveryLoading} overlayProps={{ radius: 'sm', blur: 2 }} />
            {isRecoverySuccess ? (
                <Flex direction="column" align="center" gap="xs" mt="xl">
                    <Group>
                        <ThemeIcon size="80px" radius={50} variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }}>
                            <IconMail size={55} />
                        </ThemeIcon>
                    </Group>
                    <Text size="xl" fw={900} variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }}>
                        Check Your Email{' '}
                    </Text>
                    <Text fw={400} px={30} size="md" ta="center">
                        Please check you email
                        <Text component="span" size="md" fw={900} variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }}>
                            {' '}
                            {form.values.email}{' '}
                        </Text>
                        for instructions to recover your password.
                    </Text>
                    <Button variant="subtle" color="indigo" mt="xl">
                        Resend email
                    </Button>
                </Flex>
            ) : (
                <Stack>
                    <TextInput autoFocus data-autofocus leftSection={<IconAt size="1.1rem" />} data-testid="cypress-login-email-input" required label="Email" placeholder="Email" radius="sm" {...form.getInputProps('email')} />
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
                            Back to login
                        </Anchor>
                    </Group>
                    <Button variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }} type="submit">
                        Send recovery email
                    </Button>
                </Stack>
            )}
        </form>
    );
};

export { RecoveryModal, openRecoveryModal };
