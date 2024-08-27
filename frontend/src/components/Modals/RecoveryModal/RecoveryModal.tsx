import {Alert, Anchor, Box, Button, Flex, Group, LoadingOverlay, Stack, Text, TextInput, ThemeIcon} from '@mantine/core';
import {useForm} from '@mantine/form';
import {ContextModalProps, modals} from '@mantine/modals';
import {IconAt, IconFaceIdError, IconMail} from '@tabler/icons-react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {RecoveryBody, useRecovery} from '@/auth/useRecovery.tsx';
import {useUser} from '@/auth/useUser.tsx';
import {contextModalConfig} from '@/components/Modals/contextModalConfig.ts';
import {CloseButton} from '@/components/Modals/shared/CloseButton';
import {ModalHeader} from '@/components/Modals/shared/ModalHeader';
import {getPath, Paths} from '@/routes/paths.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

interface RecoveryModalProps extends ContextModalProps {}

const openRecoveryModal = ({...props}: RecoveryModalProps) => {
    modals.openContextModal({
        ...contextModalConfig({modal: 'recovery'}),
        ...props,
    });
};

const RecoveryModal = ({context, id}: ContextModalProps) => {
    const a = useRecovery();
    const {mutate: recovery, isPending: recoveryLoading, isSuccess: isRecoverySuccess, error, isError} = a;
    const [apiError, setApiError] = useState(null);
    const {data: user, isLoading: userLoading} = useUser();
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
                return null;
            },
        },
    });

    const handleSubmit = (e: RecoveryBody) => {
        recovery(e);
    };

    if (userLoading || user) {
        return null;
    }
    return (
        <Box h="100%">
            <CloseButton
                onClick={() => {
                    context.closeModal(id);
                }}
            />
            <form className="modal-form" onSubmit={form.onSubmit((e) => handleSubmit(e))}>
                {!isRecoverySuccess && <ModalHeader title="Recovery" subTitle={'Send recovery link to your email.'} />}
                <LoadingOverlay visible={recoveryLoading} overlayProps={{radius: 'sm', blur: 2}} />
                {isRecoverySuccess ? (
                    <Flex p="sm" direction="column" align="center" gap="xs" mt="xl" mb="xl" data-testid="success-message">
                        <Group>
                            <ThemeIcon size="80px" radius={50} variant="gradient" gradient={{from: 'indigo', to: 'blue', deg: 90}}>
                                <IconMail size={55} />
                            </ThemeIcon>
                        </Group>
                        <Text size="xl" fw={900} variant="gradient" gradient={{from: 'indigo', to: 'blue', deg: 90}}>
                            Check Your Email{' '}
                        </Text>
                        <Text fw={400} px={30} size="md" ta="center">
                            Please check you email
                            <Text component="span" size="md" fw={900} variant="gradient" gradient={{from: 'indigo', to: 'blue', deg: 90}}>
                                {' '}
                                {form.values.email}{' '}
                            </Text>
                            for instructions to recover your password. Sending the email may take up to{' '}
                            <Text component="span" size="md" fw={900} variant="gradient" gradient={{from: 'indigo', to: 'blue', deg: 90}}>
                                15 minutes.
                            </Text>
                        </Text>
                    </Flex>
                ) : (
                    <Stack p="sm">
                        <TextInput autoFocus data-autofocus leftSection={<IconAt size="1.1rem" />} data-testid="email" required label="Email" placeholder="Email" radius="sm" {...form.getInputProps('email')} />
                        {apiError && error && (
                            <Alert data-testid="error-message" variant="light" color="red" title="Error" icon={<IconFaceIdError />} withCloseButton onClose={() => setApiError(false)}>
                                <Text size="xs">{error instanceof ResponseError ? error?.message : 'An error occurred'}</Text>
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
                        <Button data-testid="submit" variant="gradient" gradient={{from: 'indigo', to: 'blue', deg: 90}} type="submit">
                            Send recovery email
                        </Button>
                    </Stack>
                )}
            </form>
        </Box>
    );
};

export {RecoveryModal, openRecoveryModal};
