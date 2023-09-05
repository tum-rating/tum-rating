import {Button, Container, createStyles, Paper, rem, Text, Title} from '@mantine/core';
import {Dots} from '../assets/img/Dots';
import {openSignInModal} from '../components/Modals';
import {useActivate} from "../auth/useActivate";
import {useNavigate} from "react-router-dom";

const useStyles = createStyles((theme) => ({
    wrapper: {
        position: 'relative',
        paddingTop: rem(120),
        paddingBottom: rem(80),
        paddingLeft: rem(40),
        paddingRight: rem(40),
        background: 'transparent',
        [theme.fn.smallerThan('sm')]: {
            paddingTop: rem(80),
            paddingBottom: rem(60),
        },
    },

    inner: {
        position: 'relative',
        zIndex: 1,
    },

    opacity: {
        position: 'absolute',
        inset: 0,
        opacity: .88,
        background:  theme.colorScheme === 'dark' ? theme.black : theme.white,
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
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,

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

export const Activation = () => {
    const {classes} = useStyles();
    const status = useActivate();
    const navigate = useNavigate();

    status.then((res) => {
        console.log(res)
        if (!res) {
            navigate("/404")
            return null
        }else return true
    })

    return <Paper className={classes.wrapper} >
        <Paper className={classes.opacity}></Paper>
        <div className={classes.inner}>
            <Title className={classes.title}>Your Account is Activated!</Title>

            <Container p={0} size={600} sx={{opacity: .85}}>
                <Text size="lg" color="dimmed" className={classes.description}>
                    Congratulations! Your account is now activated. You can log in and start exploring and
                    enjoying
                    our
                    platform's features. You are now able to search for courses and even add your own reviews to
                    share your
                    experience with others.
                </Text>
            </Container>
            <div className={classes.controls}>
                <Button className={classes.control} size="lg" onClick={openSignInModal}>
                    Log In
                </Button>
            </div>
        </div>
    </Paper>

};
