import {
    Alert,
    Anchor,
    Button,
    Container,
    Flex,
    Group,
    LoadingOverlay,
    PasswordInput,
    Stack,
    Text,
    TextInput,
    ThemeIcon
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {ContextModalProps, modals} from '@mantine/modals';
import {notifications} from '@mantine/notifications';
import {IconFaceIdError, IconMail} from '@tabler/icons-react';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {useSignUp} from '@/auth/useSignUp.tsx';
import {useUser} from '@/auth/useUser.tsx';
import {contextModalConfig} from '@/components/Modals/contextModalConfig.ts';
import {CloseButton} from '@/components/Modals/shared/CloseButton';
import {ModalHeader} from '@/components/Modals/shared/ModalHeader';
import {ModalResponsiveContainer} from '@/components/Modals/shared/ModalResponsiveContainer';
import {getPath, Paths} from '@/routes/paths.ts';
import {ResponseError} from '@/utils/Errors/ResponseError.ts';

interface SignUpModalProps extends ContextModalProps {
}

const openSignUpModal = ({...props}: SignUpModalProps) => {
    modals.openContextModal({
        ...contextModalConfig({modal: 'signUp'}),
        closeOnClickOutside: false,
        ...props,
    });
};

const SignUpModal = ({context, id}: ContextModalProps) => {
    const {isSuccess, isPending: isLoading, mutate: signUp, error, isError} = useSignUp();
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();
    const {data: user, isLoading: userLoading} = useUser();

    useEffect(() => {
        notifications.clean();
    }, []);

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
            email: (value) => {
                if (!value.includes('@')) {
                    return 'Invalid email';
                }
                return false;
            },
            username: (value) => value.length < 3 && 'Username should contain at least 3 characters',
            password: (value) => value.length < 6 && 'Password should contain at least 6 characters',
        },
    });

    if ((userLoading || user) && !isSuccess) {
        return null;
    }

    return (
        <ModalResponsiveContainer>
            {!isSuccess && (
                <ModalHeader
                    title="Sign up"
                    subTitle={
                        <>
                            Sign up with your{' '}
                            <Text mx={3} variant={'gradient'} fw="bold" fz="sm" display="inline">
                                TUM University
                            </Text>
                            email.
                        </>
                    }
                />
            )}
            <CloseButton
                onClick={() => {
                    context.closeModal(id);
                }}
            />
            <LoadingOverlay visible={isLoading} overlayProps={{radius: 'sm', blur: 2}}/>
            <Container p="sm">
                {isSuccess ? (
                    <Flex direction="column" align="center" gap="xs" my="xl">
                        <Group>
                            <ThemeIcon size="80px" radius={50} variant="gradient"
                                       gradient={{from: 'indigo', to: 'blue', deg: 90}}>
                                <IconMail size={55}/>
                            </ThemeIcon>
                        </Group>
                        <Text size="xl" fw={900} variant="gradient" gradient={{from: 'indigo', to: 'blue', deg: 90}}>
                            Check Your Email{' '}
                        </Text>
                        <Text fw={400} px={30} ta="center">
                            Please check you email
                            <Text component="span" size="md" fw={900} variant="gradient"
                                  gradient={{from: 'indigo', to: 'blue', deg: 90}}>
                                {' '}
                                {form.values.email}{' '}
                            </Text>
                            for instructions to activate your account.
                        </Text>
                    </Flex>
                ) : (
                    <form
                        className="modal-form"
                        style={{height: '100%'}}
                        data-testid="sign-up-form"
                        onSubmit={form.onSubmit((e) => {
                            signUp(e);
                        })}
                    >
                        <Stack h="100%">
                            <TextInput autoFocus data-autofocus data-testid="username" label={'Your name'} required
                                       placeholder={'Your name'} value={form.values.username}
                                       onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}/>

                            <TextInput type="email" data-testid="email" required label="Email" placeholder="Email"
                                       value={form.values.email}
                                       onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
                                       error={form.errors.email}/>
                            <PasswordInput data-testid="password" autoComplete="on" required label="Password"
                                           placeholder="Password" value={form.values.password}
                                           onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                                           error={form.errors.password}/>
                            <Text fz="xs" fw="bold">
                                By signing up, you agree to our {' '}
                                <Anchor style={{whiteSpace: 'nowrap'}}  fz="xs" fw="bold" href={getPath(Paths.privacyPolicy)}>Privacy Policy</Anchor>
                                {' '} and {' '}
                                <Anchor style={{whiteSpace: 'nowrap'}}   fz="xs" fw="bold" href={getPath(Paths.termsOfService)}>Terms of
                                    Service.</Anchor>
                            </Text>
                            {apiError && error && (
                                <Alert data-testid="error-message" variant="light" color="red" title="Error"
                                       icon={<IconFaceIdError/>} withCloseButton onClose={() => setApiError(false)}>
                                    <Text
                                        size="xs">{error instanceof ResponseError ? error?.message : 'An error occurred'}</Text>
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
                            <Button data-testid="submit" type="submit" mt="xs" variant="primary-gradient">
                                Sign Up
                            </Button>
                        </Stack>
                    </form>
                )}
            </Container>
        </ModalResponsiveContainer>
    );
};

export {SignUpModal, openSignUpModal};
