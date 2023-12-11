import { ContextModalProps, modals } from '@mantine/modals';
import { RecoveryBody, useRecovery } from '@/auth/useRecovery.tsx';
import { Anchor, Button, Flex, Group, LoadingOverlay, Stack, Text, TextInput, ThemeIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAt, IconMail } from '@tabler/icons-react';
import { contextModalConfig } from '@/components/Modals/contextModalConfig.ts';
import {getPath, Paths} from "@/routes/paths.ts";
import {useNavigate} from "react-router-dom";

interface RecoveryModalProps extends ContextModalProps {}

const openRecoveryModal = ({...props}:RecoveryModalProps) => {
    modals.openContextModal({
        ...contextModalConfig('recovery', <Text fw={600}>Recover Your Password</Text>),
        ...props
    });
};

const RecoveryModal = () => {
    const { mutate: recovery, isPending: recoveryLoading, isSuccess: isRecoverySuccess } = useRecovery();
    const navigate = useNavigate();
    const form = useForm({
        initialValues: {
            email: '',
        },
        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid Email'),
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
                    <TextInput leftSection={<IconAt size="1.1rem" />} data-testid="cypress-login-email-input" required label="Email" placeholder="Email" radius="md" {...form.getInputProps('email')} />
                    <Group>
                        <Anchor
                            component="button"
                            type="button"
                            onClick={() => {
                                navigate(getPath(Paths.signIn))
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
