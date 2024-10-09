import {Alert, Anchor, Box, Button, Card, Flex, Loader, Text, TextInput} from "@mantine/core";
import {useForm} from "@mantine/form";
import {notifications} from "@mantine/notifications";
import {IconFaceId, IconFaceIdError} from "@tabler/icons-react";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from 'react-router-dom';

import classes from "./OAuthRedirect.module.css";

import {endpoints} from "@/api";
import {fetchWithServices} from "@/api/fetchWithServices.ts";
import {useSetUser} from "@/auth/useSetUser.tsx"; // Import the useSetUser hook
import {signInClient} from "@/auth/useSignIn.tsx";
import {Logo} from "@/components/Logo";
import {getPath, Paths} from "@/routes/paths.ts";
import {ResponseError} from "@/utils/Errors/ResponseError.ts";


const useOAuth = () => {
    const location = useLocation();
    return useQuery({
        queryKey: ['oauth', location.search],
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        queryFn: async () => {
            const response = await fetchWithServices(endpoints.sso, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    redirectURL: `${location.pathname}${location.search}`,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new ResponseError(data.message, response, 'oauth-error');
            }
            return data;
        }
    });
}

interface UserDataProps {
    user: {
        id: string;
        email: string;
        username: string;
    };
    token: string;
}

export const OAuthRedirect = () => {
    const {data, status, isError, error} = useOAuth();
    const [userData, setUserData] = useState<UserDataProps | null>(null);
    const [unsetUsernameFlag, setUnsetUsernameFlag] = useState(false);
    const navigate = useNavigate();
    const setUserMutation = useSetUser(); // Use the useSetUser hook

    useEffect(() => {
        if (status === 'success') {
            const pattern = /^unset-.*@.*$/;
            if (pattern.test(data.user.username)) {
                setUnsetUsernameFlag(true);
                setUserData(data);
            }else{
                signInClient(data, data.token);
                navigate("/");

            }

        }
    }, [data, status]);

    const form = useForm({
        initialValues: {
            username: '',
        },
        validate: {
            username: (value) => value.length > 0 ? null : 'Username is required',
        }
    });

    const handleSubmit = (values: { username: string }) => {
        setUserMutation.mutate({
            username: values.username,
            token: userData?.token,
        })
    };


    useEffect(() => {
        if (setUserMutation.isSuccess && unsetUsernameFlag) {
            navigate("/");
            notifications.show({
                title: 'Success',
                id: 'signin-success',
                message: <Text size="xs">Sign in successful!</Text>,
                color: 'green',
                autoClose: 3000,
            })
        }
    }, [setUserMutation.isSuccess]);

    return (
        <Box className={classes.OAuthRedirectContainer}>
            <Logo/>
            <Card shadow="sm" radius="md" mt="lg" withBorder className={classes.userStatusGuardCard}>
                {status === 'pending' && (
                    <Alert icon={<Loader size={"xs"}/>} title="Single Sign-On Login" color="blue">
                        <Text fw={500} fz='sm'>We are verifying your identity...</Text>
                    </Alert>
                )}
                {status === 'success' && (
                    <Alert icon={<IconFaceId height={25}/>} title="Single Sign-On Login" color="blue">
                        <Text fw={500} fz='sm'>Your identity has been verified</Text>
                    </Alert>
                )}
                {isError && (
                    <Alert icon={<IconFaceIdError height={25}/>} title="Single Sign-On Login" color="red">
                        <Text fw={500} fz='sm'>An error occurred while verifying your identity</Text>
                        <Text mt='sm' fz='sm' fw={600} c='red'>{error?.message}</Text>
                        <Button mt='xs' onClick={() => navigate("/" + getPath(Paths.signIn))}>Try again</Button>
                    </Alert>
                )}
                {status === 'success' && unsetUsernameFlag && (
                    <Flex mt={"sm"} direction="column" gap="sm" className="children-animation">
                        <Text fz="sm">
                            Your account for email:
                        </Text>
                        <Card shadow={'none'} withBorder>
                            <Text component='span' fw="600" mx="6" variant="gradient" truncate="end">
                                {userData?.user?.email}
                            </Text>
                        </Card>
                        <Text fz="sm">
                            has been successfully verified.
                            To complete the
                            sign-up process, please enter your username.
                        </Text>
                        <form onSubmit={form.onSubmit(handleSubmit)}>
                            <TextInput
                                autoFocus
                                label="Username"
                                placeholder="Enter your username"
                                value={form.values.username}
                                onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
                                required
                            />
                            <Text fz="xs" fw="bold" mt="sm">
                                By submitting, you agree to our{' '}
                                <Anchor target="_blank" style={{whiteSpace: 'nowrap'}} fz="xs" fw="bold"
                                        href={getPath(Paths.privacyPolicy)}>
                                    Privacy Policy
                                </Anchor>{' '}
                                and{' '}
                                <Anchor target="_blank" style={{whiteSpace: 'nowrap'}} fz="xs" fw="bold"
                                        href={getPath(Paths.termsOfService)}>
                                    Terms of Service.
                                </Anchor>
                            </Text>
                            <Button loading={setUserMutation.isPending} fullWidth data-testid="submit" type="submit"
                                    mt="xs" variant="primary-gradient">
                                Submit
                            </Button>
                        </form>
                    </Flex>
                )}
            </Card>
        </Box>
    );
};