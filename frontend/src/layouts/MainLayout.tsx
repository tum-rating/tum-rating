import {PropsWithChildren} from 'react';
import {
    ActionIcon,
    Box,
    Burger,
    Button,
    Center,
    createStyles,
    Divider,
    Drawer,
    Group,
    Header,
    Image,
    rem,
    ScrollArea, TextInput,
    useMantineColorScheme,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {IconLogout, IconMoonStars, IconPlus, IconSun,IconSearch} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {useUser} from '../auth/useUser';
import {UserButton} from '../components/UserButton';
import {openSignInModal, openSignUpModal} from '../components/Modals';
import logo from "../assets/img/logo.png"
import {useNavigate} from "react-router-dom";
import {openAddCourseModal} from "../components/Modals/AddCourseModal";
import AnimatedBackground from "../assets/img/AnimatedBackground";
import {useSignOut} from "../auth/useSignOut";
import { useSpotlight } from '@mantine/spotlight';

const useStyles = createStyles((theme) => ({
    link: {
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontWeight: 500,
        fontSize: theme.fontSizes.sm,

        [theme.fn.smallerThan('sm')]: {
            height: rem(42),
            display: 'flex',
            alignItems: 'center',
            width: '100%',
        },

        ...theme.fn.hover({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        }),
    },

    subLink: {
        width: '100%',
        padding: `${theme.spacing.xs} ${theme.spacing.md}`,
        borderRadius: theme.radius.md,

        ...theme.fn.hover({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        }),

        '&:active': theme.activeStyles,
    },

    hiddenMobile: {
        [theme.fn.smallerThan('xs')]: {
            display: 'none',
        },
    },

    hiddenDesktop: {
        [theme.fn.largerThan('xs')]: {
            display: 'none',
        },
    },
    authModal: {
        '.mantine-Modal-header': {
            position: 'absolute',
            right: 0,
        },
    },
}));

export const MainLayout = ({children}: PropsWithChildren) => {
    const {user} = useUser();
    const {classes, theme} = useStyles();
    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    const spotlight = useSpotlight();
    const dark = colorScheme === 'dark';
    const {t} = useTranslation();
    const [drawerOpened, {toggle: toggleDrawer, close: closeDrawer}] = useDisclosure(false);
    const navigate = useNavigate()
    const signOut = useSignOut();
    return (
        <Box sx={{overflow: 'hidden', height: '100%'}}>
            <Header height={60} px="md">
                <Group position="apart" fw={600} sx={{height: '100%'}}>
                    <ActionIcon w={150} onClick={() => navigate("/")}>
                        <Image fit="contain" src={logo} alt="Random image"/>
                    </ActionIcon>

                    <TextInput type='search'
                               onClick={(e)=>{
                                   e.preventDefault()
                                   spotlight.openSpotlight()
                               }}
                               icon={<IconSearch size={18}/>}
                    >
                    </TextInput>
                    <Group>
                        <Group className={classes.hiddenMobile}>
                            {user ? null : (
                                <>
                                    <Button compact onClick={openSignInModal} variant="default">
                                        {t('login')}
                                    </Button>
                                    <Button compact onClick={openSignUpModal}>
                                        {t('register')}
                                    </Button>
                                </>
                            )}
                            {user ? (
                                <>
                                    <Button onClick={openAddCourseModal} leftIcon={<IconPlus/>}>Add
                                        course</Button>
                                    <UserButton {...user.user} />
                                </>
                            ) : null}
                            <ActionIcon
                                variant="outline"
                                color={dark ? 'yellow' : 'blue'}
                                onClick={() => toggleColorScheme()}
                                title="Toggle color scheme"
                            >
                                {dark ? <IconSun size="1.1rem"/> : <IconMoonStars size="1.1rem"/>}
                            </ActionIcon>
                        </Group>
                    </Group>
                    <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop}/>
                </Group>
            </Header>
            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                className={classes.hiddenDesktop}
                zIndex={1000000}
            >
                <a href="/" className={classes.link}>
                    Home
                </a>
                <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'}/>
                {user ? (
                    <Button leftIcon={<IconLogout size={14}/>} onClick={() => {
                        signOut();
                        closeDrawer()
                    }} variant="default">
                        Logout
                    </Button>
                ) : (
                    <>
                        <Group position="center" grow pb="xl" px="md">
                            <Button onClick={() => {
                                openSignInModal();
                                closeDrawer()
                            }}
                                    variant="default">
                                {t('login')}
                            </Button>
                            <Button onClick={() => {
                                openSignUpModal();
                                closeDrawer()
                            }}>
                                {t('register')}
                            </Button>
                        </Group>
                    </>
                )}

            </Drawer>
            <Box w={'100%'} h={'100%'}
                 sx={{position: 'relative', overflow: 'hidden', display: 'flex', paddingBottom: '60px'}}>
                <AnimatedBackground/>
                {children}
            </Box>
        </Box>
    );
};
