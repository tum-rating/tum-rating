import {
    ActionIcon,
    Box,
    Burger,
    Button,
    createStyles,
    Divider,
    Drawer,
    Group,
    Header,
    Modal,
    rem,
    ScrollArea,
    useMantineColorScheme,
} from '@mantine/core';

import {useDisclosure} from '@mantine/hooks';
import {
    IconMoonStars,
    IconSun,
} from '@tabler/icons-react';
import {PropsWithChildren, useState} from "react";
import {LanguageSwitcher} from "../components/LanguageSwitcher/LanguageSwitcher.tsx";
import {useTranslation} from "react-i18next";
import {AuthenticationModal} from "../components/AuthenticationModal";

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

    dropdownFooter: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        margin: `calc(${theme.spacing.md} * -1)`,
        marginTop: theme.spacing.sm,
        padding: `${theme.spacing.md} calc(${theme.spacing.md} * 2)`,
        paddingBottom: theme.spacing.xl,
        borderTop: `${rem(1)} solid ${
            theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
        }`,
    },

    hiddenMobile: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    hiddenDesktop: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },
    authModal: {
        ".mantine-Modal-header":{
            position: "absolute",
            right:0
        }
    }
}));


export const MainLayout = ({children}: PropsWithChildren) => {
    const [drawerOpened, {toggle: toggleDrawer, close: closeDrawer}] = useDisclosure(false);
    const [modalType, setModalType] = useState<'login' | 'register'>('login');
    const [opened, {open, close}] = useDisclosure(false);
    const {classes, theme} = useStyles();
    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    const dark = colorScheme === "dark";
    const openLoginModal = () => {
        setModalType('login');
        open();
    };

    const openRegisterModal = () => {
        setModalType('register');
        open();
    };
    const {t} = useTranslation();
    return (
        <Box pb={120} h={"100%"}>
            <Header height={60} px="md">
                <Group position="apart" sx={{height: '100%'}}>
                    <h3>Tum-rating</h3>
                    <ActionIcon
                        variant="outline"
                        color={dark ? "yellow" : "blue"}
                        onClick={() => toggleColorScheme()}
                        title="Toggle color scheme"
                    >
                        {dark ? (
                            <IconSun size="1.1rem"/>
                        ) : (
                            <IconMoonStars size="1.1rem"/>
                        )}
                    </ActionIcon>
                    <LanguageSwitcher/>
                    <Group className={classes.hiddenMobile}>
                        <Button onClick={openLoginModal} variant="default">
                            {t('login')}
                        </Button>
                        <Button onClick={openRegisterModal}>{t('register')}</Button>
                        <Modal className={classes.authModal} opened={opened} onClose={close} >
                            <AuthenticationModal defaultType={modalType} />
                        </Modal>
                    </Group>

                    <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop}/>
                </Group>
            </Header>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                className={classes.hiddenDesktop}
                zIndex={1000000}
            >
                <ScrollArea h={`calc(100vh - ${rem(60)})`} mx="-md">
                    <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'}/>
                    <a href="#" className={classes.link}>
                        Home
                    </a>
                    <Group position="center" grow pb="xl" px="md">
                        <Button variant="default">{t('login')}</Button>
                        <Button>{t('register')}</Button>
                    </Group>
                </ScrollArea>
            </Drawer>
            <Box>
                {children}
            </Box>
        </Box>
    )
};