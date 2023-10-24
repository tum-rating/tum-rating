import { PropsWithChildren } from 'react';
import { ActionIcon, Anchor, AppShell, Box, Burger, Button, createStyles, Drawer, Flex, Group, Header, Image, MediaQuery, Stack, Switch, Text, useMantineColorScheme } from '@mantine/core';
import { useDisclosure, useHotkeys } from '@mantine/hooks';
import { IconLogout, IconMoonStars, IconSun } from '@tabler/icons-react';
import { useUser } from '@/auth/useUser';
import { UserButton } from '@/components/UserButton';
import { openSignInModal, openSignUpModal } from '@/components/Modals';
import logo from '../assets/img/logo.png';
import AnimatedBackground from '../assets/img/AnimatedBackground';
import { SpotlightControl } from '@/components/Spotlight/SpotlightControl';
import { openSpotlight } from '@/components/Modals/SpotlightModal';
import { useSignOut } from '@/auth/useSignOut';

const useStyles = createStyles((theme) => ({
    appShell: {
        '& .mantine-AppShell-main': {
            padding: '100px 50px 0 50px',
        },
        [theme.fn.smallerThan('sm')]: {
            '& .mantine-AppShell-main': {
                padding: '50px 0 0 0 ',
            },
            '& .spotlightControl': {
                marginLeft: 'auto',
            },
        },
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
    applicationLogo: {
        background: theme.colorScheme === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)',
    },
    header: {
        background: 'transparent',
        width: '100%',
        borderBottom: `1px solid ${theme.colorScheme === 'dark' ? '#2C2E33' : '#e9ecef'}`,
        '& .headerContainer': {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'nowrap',
        },
        '& .insetBlur': {
            position: 'absolute',
            inset: '0',
            background: theme.colorScheme === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
            backdropFilter: 'blur(5px)',
        },
    },

    mobileDrawer: {
        '& .mobileDrawerHeader': {
            paddingBottom: theme.spacing.sm,
            borderBottom: `2px solid ${theme.colors.gray[2]}`,
        },
    },

    drawerFooter: {
        paddingTop: theme.spacing.md,
        marginTop: theme.spacing.md,
        borderTop: `2px solid ${theme.colors.gray[2]}`,
    },
    animatedBackground: {
        '@media (prefers-reduced-motion)': {
            display: 'none',
        },
        [theme.fn.smallerThan('sm')]: {
            display: 'none !important',
        },
    },
}));

export const MainLayout = ({ children }: PropsWithChildren) => {
    const { user } = useUser();
    const { classes, theme } = useStyles();
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const dark = colorScheme === 'dark';
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
    const signOut = useSignOut();

    useHotkeys([['/', openSpotlight]]);

    return (
        <AppShell
            className={classes.appShell}
            data-testid="cypress-appshell"
            navbar={
                <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
                    <Drawer
                        data-testid="cypress-drawer"
                        className={classes.mobileDrawer}
                        opened={drawerOpened}
                        onClose={closeDrawer}
                        title={
                            <Anchor href="/">
                                <Image data-test="app-logo" fit="contain" height={50} width={150} src={logo} alt="tum rating logo" />
                            </Anchor>
                        }
                    >
                        {user ? (
                            <>
                                <Flex align="flex-end" justify="space-between">
                                    <Text>Hello, {user.user.username}</Text>
                                    <Switch onClick={() => toggleColorScheme()} size="md" color={theme.colorScheme === 'dark' ? 'gray' : 'dark'} onLabel={<IconSun size="1rem" stroke={2.5} color={theme.colors.yellow[4]} />} offLabel={<IconMoonStars size="1rem" stroke={2.5} color={theme.colors.blue[6]} />} />
                                </Flex>

                                <Stack className={classes.drawerFooter}>
                                    <Button data-test="cypress-logout-btn" leftIcon={<IconLogout size={14} />} onClick={signOut} variant="default">
                                        Logout
                                    </Button>
                                </Stack>
                            </>
                        ) : (
                            <>
                                <Flex align="flex-end" justify="space-between">
                                    <Text>Hello</Text>
                                    <Switch onClick={() => toggleColorScheme()} size="md" color={theme.colorScheme === 'dark' ? 'gray' : 'dark'} onLabel={<IconSun size="1rem" stroke={2.5} color={theme.colors.yellow[4]} />} offLabel={<IconMoonStars size="1rem" stroke={2.5} color={theme.colors.blue[6]} />} />
                                </Flex>
                                <Stack className={classes.drawerFooter}>
                                    <Button data-testid="cypress-open-sign-in-modal-btn" onClick={openSignInModal} variant="default">
                                        Login
                                    </Button>
                                    <Button data-testid="cypress-open-sign-up-modal-btn" onClick={openSignUpModal}>
                                        Register
                                    </Button>
                                </Stack>
                            </>
                        )}
                    </Drawer>
                </MediaQuery>
            }
            header={
                <Header className={classes.header} height={51} px="md">
                    <Box className="insetBlur"></Box>
                    <Group className="headerContainer">
                        <Anchor href="/">
                            <Image fit="contain" height={50} width={150} src={logo} alt="tum rating logo" />
                        </Anchor>
                        <SpotlightControl className="spotlightControl" onClick={openSpotlight} />
                        <Burger data-testid="cypress-burger" opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
                        <Group className={classes.hiddenMobile}>
                            {user ? null : (
                                <>
                                    <Button data-testid="cypress-open-sign-in-modal-btn" compact onClick={openSignInModal} variant="default">
                                        Login
                                    </Button>
                                    <Button data-testid="cypress-open-sign-up-modal-btn" compact onClick={openSignUpModal}>
                                        Register
                                    </Button>
                                </>
                            )}
                            {user ? (
                                <>
                                    <UserButton {...user.user} />
                                </>
                            ) : null}
                            <ActionIcon variant="outline" color={dark ? 'yellow' : 'blue'} onClick={() => toggleColorScheme()} title="Toggle color scheme">
                                {dark ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
                            </ActionIcon>
                        </Group>
                    </Group>
                </Header>
            }
        >
            <Box style={{ width: '100%' }}>
                <Box className={classes.animatedBackground}>
                    <AnimatedBackground />
                </Box>
                {children}
            </Box>
        </AppShell>
    );
};
