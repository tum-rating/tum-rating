import {Button, Center, Container, Flex, Image, Text} from '@mantine/core';
import {isRouteErrorResponse, useNavigate, useRouteError} from 'react-router-dom';

import classes from './PageNotFound.module.css';

import wh from '@/assets/img/wh5.png';

export function AdminErrorBoundary() {
    const navigate = useNavigate();
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
        return (
            <Container className={classes.root}>
                <Center h="100%">
                    <Flex justify="center" align="center" direction="column" gap="xs">
                        <Image className={classes.whereAreYouGoing} src={wh} />
                        <Text fw="500" style={{zIndex: 1}}>
                            You are lost? 🤔
                        </Text>
                        <Button onClick={() => navigate('/')}>Go back to home</Button>
                    </Flex>
                </Center>
            </Container>
        );
    }
    return (
        <Container className={classes.root}>
            <Center h="100%">
                <Flex justify="center" align="center" direction="column" gap="xs">
                    <Image className={classes.whereAreYouGoing} src={wh} />
                    <Text fw="500" style={{zIndex: 1}}>
                        Admin? 🤔
                    </Text>
                    <Button onClick={() => navigate('/')}>Go back to home</Button>
                </Flex>
            </Center>
        </Container>
    );
}
