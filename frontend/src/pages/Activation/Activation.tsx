import {Button, Flex, Text, Title} from '@mantine/core';
import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import classes from './Activation.module.css';

import {useActivate} from '@/auth/useActivate.tsx';
import {ActivationImg} from '@/pages/Activation/ActivationImg.tsx';
import {getPath, Paths} from '@/routes/paths.ts';

export const Activation = () => {
    const {mutate, isError} = useActivate();
    const navigate = useNavigate();
    useEffect(() => {
        mutate();
    }, []);

    useEffect(() => {
        if (isError) {
            navigate('/404');
        }
    }, [isError]);

    return (
        <Flex className={classes.root} justify="center" align="center">
            <Flex direction="column" w={300} align="center">
                <ActivationImg />
                <Title fz="lg" className={classes.title}>
                    Your Account is Activated!
                </Title>
                <Text ta="center" c="dimmed" size="md">
                    Congratulations! Your account is now activated. You can log in and start exploring and enjoying our platform's features.
                </Text>
                <Button
                    onClick={() => {
                        navigate(getPath(Paths.signIn));
                    }}
                    variant="outline"
                    size="md"
                    mt="xl"
                    data-testid="sign-in-btn"
                    className={classes.control}
                >
                    Sign in
                </Button>
            </Flex>
        </Flex>
    );
};
