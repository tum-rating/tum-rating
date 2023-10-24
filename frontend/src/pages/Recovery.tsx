import {
    Button,
    Container,
    createStyles,
    LoadingOverlay,
    Paper,
    PasswordInput,
    rem,
    Stack,
    Text,
    Title
} from '@mantine/core';
import {useLocation, useNavigate} from 'react-router-dom';
import {useForm} from "@mantine/form";
import {useRecovery} from "@/auth/useRecovery";
import {openSignInModal} from "@/components/Modals";

const useStyles = createStyles((theme) => ({
    wrapper: {
        paddingTop: rem(120),
        paddingBottom: rem(80),
        paddingLeft: rem(40),
        paddingRight: rem(40),
        position: 'relative',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        background: theme.fn.rgba(theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.white, 0.95),
        zIndex: 1,
        [theme.fn.smallerThan('sm')]: {
            paddingTop: rem(80),
            paddingBottom: rem(60),
        },
    },

    inner: {
        position: 'relative',
        zIndex: 1,
        maxWidth: '500px',
    },

    opacity: {
        position: 'absolute',
        inset: 0,
        opacity: 0.88,
        background: theme.colorScheme === 'dark' ? theme.black : theme.white,
    },

    dots: {
        position: 'absolute',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],

        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    dotsLeft: {
        left: 0,
        top: 0,
    },

    title: {
        textAlign: 'center',
        fontWeight: 800,
        fontSize: rem(40),
        letterSpacing: -1,
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        marginBottom: theme.spacing.xs,
        [theme.fn.smallerThan('xs')]: {
            fontSize: rem(28),
            textAlign: 'left',
        },
    },

    highlight: {
        color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6],
    },

    description: {
        textAlign: 'center',

        [theme.fn.smallerThan('xs')]: {
            textAlign: 'left',
            fontSize: theme.fontSizes.md,
        },
    },

    controls: {
        marginTop: theme.spacing.lg,
        display: 'flex',
        justifyContent: 'center',

        [theme.fn.smallerThan('xs')]: {
            flexDirection: 'column',
        },
    },

    control: {
        '&:not(:first-of-type)': {
            marginLeft: theme.spacing.md,
        },

        [theme.fn.smallerThan('xs')]: {
            height: rem(42),
            fontSize: theme.fontSizes.md,

            '&:not(:first-of-type)': {
                marginTop: theme.spacing.md,
                marginLeft: 0,
            },
        },
    },
}));


interface RecoveryFormProps {
    password: string;
    confirmPassword: string;
}


export const Recovery = () => {
    const {classes} = useStyles();
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const {mutate: recovery, isLoading: recoveryLoading, isSuccess: isRecoverySuccess} = useRecovery();
    const form = useForm({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validate: {
            password: (value) => value.length < 6 && 'Password should be at least 6 characters long',
            confirmPassword: (value, values) =>
                value !== values.password ? 'Passwords did not match' : null,
        },
    });

    if (!token) {
        navigate("/404")
        return false
    }

    const handleResetPassword = (form: RecoveryFormProps) => {
        recovery({password: form.password, token: token})
    }

    return (
        <Paper className={classes.wrapper}>
            <div className={classes.inner}>
                {isRecoverySuccess ? (
                    <>
                        <Title className={classes.title}>Password Recovery Complete! 🎉</Title>
                        <Container p={0} size={600}>
                            <Text size="lg" color="dimmed" className={classes.description}>
                                Good news – your password has been recovered! You can now log in to your account using your new credentials.
                            </Text>
                        </Container>
                        <div className={classes.controls}>
                            <Button className={classes.control} size="lg" onClick={openSignInModal}>
                                Log In
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <Title className={classes.title}>Reset Your Password</Title>
                        <Container p={0} size={600}>
                            <Text size="lg" color="dimmed" className={classes.description}>
                                You are just a step away from resetting your password. Please enter your new password
                                below to regain access to your account.
                            </Text>
                        </Container>
                        <form onSubmit={form.onSubmit((e) => {
                            handleResetPassword(e)
                        })}>
                            <LoadingOverlay visible={recoveryLoading}/>
                            <Stack>
                                <PasswordInput
                                    data-testid="cypress-login-password-input"
                                    autoComplete="on"
                                    required
                                    label="Password"
                                    placeholder="Password" value={form.values.password}
                                    onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
                                    error={form.errors.password}
                                    radius="md"/>
                                <PasswordInput
                                    data-testid="cypress-login-confirm-password-input"
                                    autoComplete="on"
                                    required
                                    label="Confirm Password"
                                    placeholder="Confirm Password"
                                    value={form.values.confirmPassword}
                                    onChange={(event) => form.setFieldValue('confirmPassword', event.currentTarget.value)}
                                    error={form.errors.confirmPassword}
                                    radius="md"/>
                                <div className={classes.controls}>
                                    <Button type="submit" className={classes.control} size="lg">
                                        Reset Password
                                    </Button>
                                </div>
                            </Stack>
                        </form>
                    </>
                )}

            </div>
        </Paper>
    );
};
