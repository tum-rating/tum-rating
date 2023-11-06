import { Button, Container, LoadingOverlay, PasswordInput, Stack, Text, Title } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { useRecovery } from '@/auth/useRecovery.tsx';
import { openSignInModal } from '@/components/Modals';
import classes from './Recovery.module.css';
interface RecoveryFormProps {
    password: string;
    confirmPassword: string;
}
export const Recovery = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const { mutate: recovery, isLoading: recoveryLoading, isSuccess: isRecoverySuccess } = useRecovery();
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

    if (!token) {
        navigate('/404');
        return false;
    }

    const handleResetPassword = (form: RecoveryFormProps) => {
        recovery({ password: form.password, token: token });
    };

    return (
        <Stack my={30} mx="auto" className={classes.wrapper}>
            {isRecoverySuccess ? (
                <>
                    <Title ta="center" className={classes.title}>
                        Password Recovery Complete! 🎉
                    </Title>
                    <Container p={0} size={600}>
                        <Text c="dimmed" fz="md" ta="center">
                            Good news – your password has been recovered! You can now log in to your account using your new credentials.
                        </Text>
                    </Container>
                    <div className={classes.controls}>
                        <Button mt={10} fullWidth variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }} className={classes.control} onClick={openSignInModal}>
                            Log In
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <Title ta="center" className={classes.title}>
                        Reset Your Password
                    </Title>
                    <Container p={0} size={600}>
                        <Text c="dimmed" fz="md" ta="center">
                            You are just a step away from resetting your password. Please enter your new password below to regain access to your account.
                        </Text>
                    </Container>
                    <form
                        onSubmit={form.onSubmit((e) => {
                            handleResetPassword(e);
                        })}
                    >
                        <LoadingOverlay visible={recoveryLoading} />
                        <Stack>
                            <PasswordInput data-testid="cypress-login-password-input" autoComplete="on" required label="Password" placeholder="Password" value={form.values.password} onChange={(event) => form.setFieldValue('password', event.currentTarget.value)} error={form.errors.password} />
                            <PasswordInput data-testid="cypress-login-confirm-password-input" autoComplete="on" required label="Confirm Password" placeholder="Confirm Password" value={form.values.confirmPassword} onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)} error={form.errors.confirmPassword} />
                            <div className={classes.controls}>
                                <Button mt={10} fullWidth variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }} type="submit" className={classes.control}>
                                    Reset Password
                                </Button>
                            </div>
                        </Stack>
                    </form>
                </>
            )}
        </Stack>
    );
};
