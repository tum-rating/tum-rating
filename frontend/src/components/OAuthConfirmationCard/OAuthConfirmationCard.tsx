import {Alert, Anchor, Box, Button, Card, Flex, Loader, Text, TextInput} from '@mantine/core';
import {IconFaceId, IconFaceIdError} from '@tabler/icons-react';
import {useNavigate} from 'react-router-dom';

import classes from './OAuthConfirmationCard.module.css';
import {useOAuthForm} from './useOAuthForm';

import {Logo} from '@/components/Logo';
import {useOAuth} from '@/oauth/useOAuth.tsx';
import {getPath, Paths} from '@/routes/paths.ts';

export const OAuthConfirmationCard = () => {
    const {data, status, isError, error} = useOAuth();
    const navigate = useNavigate();
    const {form, handleSubmit, userData, unsetUsernameFlag, setUserMutation} = useOAuthForm(data, status);

    return (
        <Box className={classes.OAuthRedirectContainer}>
            <Logo />
            <Card shadow="sm" radius="md" mt="lg" withBorder className={classes.userStatusGuardCard}>
                {status === 'pending' && (
                    <Alert icon={<Loader size={'xs'} />} title="Single Sign-On Login" color="blue">
                        <Text fw={500} fz="sm">
                            We are verifying your identity...
                        </Text>
                    </Alert>
                )}
                {status === 'success' && (
                    <Alert icon={<IconFaceId height={25} />} title="Single Sign-On Login" color="blue">
                        <Text fw={500} fz="sm">
                            Your identity has been verified
                        </Text>
                    </Alert>
                )}
                {isError && (
                    <Alert icon={<IconFaceIdError height={25} />} title="Single Sign-On Login" color="red">
                        <Text fw={500} fz="sm">
                            An error occurred while verifying your identity
                        </Text>
                        <Text mt="sm" fz="sm" fw={600} c="red">
                            {error?.message}
                        </Text>
                        <Button mt="xs" onClick={() => navigate('/' + getPath(Paths.signIn))}>
                            Try again
                        </Button>
                    </Alert>
                )}
                {status === 'success' && unsetUsernameFlag && (
                    <Flex mt={'sm'} direction="column" gap="sm" className="children-animation">
                        <Text fz="sm">Your account for email:</Text>
                        <Card shadow={'none'} withBorder>
                            <Text component="span" fw="600" mx="6" variant="gradient" truncate="end">
                                {userData?.user?.email}
                            </Text>
                        </Card>
                        <Text fz="sm">has been successfully verified. To complete the sign-up process, please enter your username.</Text>
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <TextInput autoFocus label="Username" placeholder="Enter your username" value={form.values.username} onChange={(event) => form.setFieldValue('username', event.currentTarget.value)} required />
                            <Text fz="xs" fw="bold" mt="sm">
                                By submitting, you agree to our{' '}
                                <Anchor target="_blank" style={{whiteSpace: 'nowrap'}} fz="xs" fw="bold" href={getPath(Paths.privacyPolicy)}>
                                    Privacy Policy
                                </Anchor>{' '}
                                and{' '}
                                <Anchor target="_blank" style={{whiteSpace: 'nowrap'}} fz="xs" fw="bold" href={getPath(Paths.termsOfService)}>
                                    Terms of Service.
                                </Anchor>
                            </Text>
                            <Button loading={setUserMutation.isPending} fullWidth data-testid="submit" type="submit" mt="xs" variant="primary-gradient">
                                Submit
                            </Button>
                        </form>
                    </Flex>
                )}
            </Card>
        </Box>
    );
};
