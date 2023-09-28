import { Anchor, Button, Container, createStyles, Image, rem, SimpleGrid, Text, Title } from '@mantine/core';

const useStyles = createStyles((theme) => ({
    root: {
        paddingTop: rem(120),
        paddingBottom: rem(80),
        paddingLeft: rem(40),
        paddingRight: rem(40),
        position: 'relative',
        background: theme.fn.rgba(theme.colorScheme === 'dark' ? theme.colors.gray[9] : theme.white, 0.95),
        zIndex: 1,
        [theme.fn.smallerThan('sm')]: {
            paddingTop: rem(80),
            paddingBottom: rem(60),
        },
    },

    title: {
        fontWeight: 900,
        fontSize: 34,
        marginBottom: theme.spacing.md,
        [theme.fn.smallerThan('sm')]: {
            fontSize: 32,
        },
    },

    control: {
        [theme.fn.smallerThan('sm')]: {
            width: '100%',
        },
    },

    mobileImage: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    desktopImage: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },
}));
const PageNotFound = () => {
    const { classes } = useStyles();
    return (
        <Container className={classes.root}>
            <SimpleGrid spacing={80} cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1, spacing: 40 }]}>
                <Image src="https://ui.mantine.dev/_next/static/media/image.11cd6c19.svg" className={classes.mobileImage} />
                <div>
                    <Title className={classes.title}>Something is not right...</Title>
                    <Text color="dimmed" size="lg">
                        Page you are trying to open does not exist. You may have mistyped the address, or the page has been moved to another URL. If you think this is an error contact support.
                    </Text>
                    <Anchor href={'/'}>
                        <Button variant="outline" size="md" mt="xl" className={classes.control}>
                            Get back to home page
                        </Button>
                    </Anchor>
                </div>
                <Image src="https://ui.mantine.dev/_next/static/media/image.11cd6c19.svg" className={classes.desktopImage} />
            </SimpleGrid>
        </Container>
    );
};

export { PageNotFound };
