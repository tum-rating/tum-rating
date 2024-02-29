import {useForm} from '@mantine/form';
import {
    Anchor,
    Box,
    Button,
    Container,
    Group,
    LoadingOverlay,
    PasswordInput,
    Stack,
    Text,
    TextInput
} from '@mantine/core';
import {ContextModalProps, modals} from '@mantine/modals';
import {useLocation, useNavigate} from 'react-router-dom';

import {LoginInput, useSignIn} from '@/auth/useSignIn.tsx';
import {useEffect} from 'react';
import {IconAt, IconLock} from '@tabler/icons-react';
import {contextModalConfig} from '@/components/Modals/contextModalConfig.ts';
import {getPath, Paths} from '@/routes/paths.ts';

interface SignInModalProps extends ContextModalProps {
}

const openSignInModal = ({...props}: SignInModalProps) => {
    modals.openContextModal({
        ...contextModalConfig('signIn', <Text fw={600}>Sign In</Text>),
        ...props,
    });
};

const SignInModal = ({
                         context,
                         id
                     }: ContextModalProps) => {

    const {mutate: signIn, isPending: signInLoading, isSuccess: isSignInSuccess} = useSignIn();
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
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid Email'),
        },
    });

    useEffect(() => {
        if (isSignInSuccess) {
            if (location.pathname !== '/' && !location.pathname.includes('courses')) {
                navigate('/');
            }else{
                context.closeModal(id);
            }
        }
    }, [isSignInSuccess]);

    const handleSubmit = (e: LoginInput) => {
        signIn(e);
    };

    return (
        <Box pos="relative">
            <Container p={0} data-testid="cypress-sign-in-modal">
                <LoadingOverlay visible={signInLoading} overlayProps={{radius: 'sm', blur: 2}}/>
                <form onSubmit={form.onSubmit((e) => handleSubmit(e))}>
                    <Stack>
                        <TextInput leftSection={<IconAt size="1.1rem"/>} data-testid="cypress-login-email-input"
                                   required label="Email" placeholder="Email" {...form.getInputProps('email')} />
                        <PasswordInput leftSection={<IconLock size="1.1rem"/>}
                                       data-testid="cypress-login-password-input" autoComplete="on" required
                                       label="Password" placeholder="Password" {...form.getInputProps('password')} />
                        <Group justify="space-between">
                            <Anchor
                                component="button"
                                type="button"
                                onClick={() => {
                                    navigate(getPath(Paths.signUp));
                                }}
                                size="xs"
                            >
                                Don't have an account?
                            </Anchor>
                            <Anchor
                                component="button"
                                type="button"
                                onClick={() => {
                                    navigate(getPath(Paths.forgotPassword));
                                }}
                                size="xs"
                            >
                                Forgot password?
                            </Anchor>
                        </Group>
                        <Button mt="xs" type="submit" variant="gradient"
                                gradient={{from: 'indigo', to: 'blue', deg: 90}}>
                            Sign In
                        </Button>
                    </Stack>
                </form>
            </Container>
        </Box>
    );
};

export {SignInModal, openSignInModal};
