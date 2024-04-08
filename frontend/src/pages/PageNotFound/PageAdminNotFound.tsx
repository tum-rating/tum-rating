import {Button, Center, Container, Flex, Text, Image} from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import classes from './PageNotFound.module.css';

import wh from '@/assets/img/wh5.png';

export function PageAdminNotFound() {
    const navigate = useNavigate();
    return (
        <Container className={classes.root}>
            <Center h="100%">
                <Flex justify="center" align="center" direction="column" gap="xs">
                    <Image className={classes.whereAreYouGoing} src={wh}/>
                    <Text fw="500" style={{zIndex: 1}}>
                        Admin? 🤔
                    </Text>
                    <Button onClick={() => navigate('/')}>Go back to home</Button>
                </Flex>
            </Center>
        </Container>
    );
}
