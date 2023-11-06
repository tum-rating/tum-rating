import { Image, Container, Title, Text, Button, SimpleGrid } from '@mantine/core';
import classes from './PageNotFound.module.css';
import { useNavigate } from 'react-router-dom';

export function PageNotFound() {
    const navigate = useNavigate();
    return (
        <Container className={classes.root}>
            <SimpleGrid spacing={{ base: 40, sm: 80 }} cols={{ base: 1, sm: 2 }}>
                <Image src="https://ui.mantine.dev/_next/static/media/image.11cd6c19.svg" className={classes.mobileImage} />
                <div>
                    <Title className={classes.title}>Something is not right...</Title>
                    <Text c="dimmed" size="lg">
                        Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to another URL. If you think this is an error contact support.
                    </Text>
                    <Button onClick={() => navigate('/')} variant="outline" size="md" mt="xl" className={classes.control}>
                        Get back to home page
                    </Button>
                </div>
                <Image src="https://ui.mantine.dev/_next/static/media/image.11cd6c19.svg" className={classes.desktopImage} />
            </SimpleGrid>
        </Container>
    );
}
