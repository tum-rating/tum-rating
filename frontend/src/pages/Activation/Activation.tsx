import { Button, Container, Image, SimpleGrid, Text, Title } from '@mantine/core';
import { useActivate } from '@/auth/useActivate.tsx';
import { useNavigate } from 'react-router-dom';
import activated from '@/assets/img/activated.svg';
import classes from './Activation.module.css';
import {getPath, Paths} from "@/routes/paths.ts";

export const Activation = () => {
    const status = useActivate();
    const navigate = useNavigate();

    status.then((res) => {
        if (!res) {
            navigate('/404');
            return null;
        } else return true;
    });
    return (
        <Container className={classes.root}>
            <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
                <Image src={activated} className={classes.mobileImage} />
                <div>
                    <Title className={classes.title}>Your Account is Activated!</Title>
                    <Text c="dimmed" size="lg">
                        Congratulations! Your account is now activated. You can log in and start exploring and enjoying our platform's features.
                    </Text>
                    <Button onClick={()=>navigate(getPath(Paths.signIn))} variant="outline" size="md" mt="xl" className={classes.control}>
                        Log In
                    </Button>
                </div>
                <Image src={activated} className={classes.desktopImage} />
            </SimpleGrid>
        </Container>
    );
};
