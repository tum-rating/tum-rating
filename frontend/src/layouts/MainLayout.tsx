import {
    ActionIcon,
    Anchor,
    AppShell,
    Box,
    Burger,
    Button,
    Drawer,
    Flex,
    Group,
    Image,
    Stack,
    Switch,
    Text,
    useMantineColorScheme
} from '@mantine/core';
import {useDisclosure, useHotkeys, useMediaQuery} from '@mantine/hooks';
import {IconMoonStars, IconSun} from '@tabler/icons-react';
import {PropsWithChildren} from 'react';
import {isMobileOnly} from 'react-device-detect';
import {useNavigate} from 'react-router-dom';

import logoDark from '@/assets/img/logo-dark.png';
import logo from '@/assets/img/logo.png';
import {useSignOut} from '@/auth/useSignOut';
import {useUser} from '@/auth/useUser';
import {SearchInputDesktop} from '@/components/Search';
import {UserButton} from '@/components/UserButton';
import {getPath, Paths} from '@/routes/paths.ts';


const HEADER_HEIGHT = 54;
const MAX_SITE_WIDTH = 1320;

export const MainLayout = ({children}: PropsWithChildren) => {
    const {data: user, isLoading} = useUser();
    const navigate = useNavigate();
    const [mobileOpened, {toggle: toggleMobile}] = useDisclosure();
    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    const smallerMode = useMediaQuery('(max-width: 48em)');
    const signOut = useSignOut();
    const matches = useMediaQuery('(min-width: 48em)');
    const hDiff = !matches ? 0 : 28;
    useHotkeys([['/', () => navigate(getPath(Paths.spotlight))]]);
    return (
        <AppShell header={{height: HEADER_HEIGHT}} padding="md">
            <Box style={{
                inset: 0,
                position: "fixed",
                background: 'var(--primary-layout-gradient)',
                zIndex: -1,
            }}/>
            <AppShell.Header maw="100vw">
                <Flex visibleFrom="sm" h="100%" px="md" justify="space-between" align="center">
                    <Anchor href="/">
                        {colorScheme === 'light' ?
                            <Image data-test="app-logo" fit="contain" height={28} width={129} src={logo}
                                   alt="tum rating logo"/> :
                            <Image data-test="app-logo" fit="contain" height={28} width={129} src={logoDark}
                                   alt="tum rating logo"/>}
                    </Anchor>
                    {!isMobileOnly && !smallerMode && (
                        <Flex maw={580} style={{flexGrow: 1}}>
                            <SearchInputDesktop/>
                        </Flex>
                    )}
                    <Flex gap={20}>
                        {!user ? (
                            <>
                                <Button loading={!user && isLoading} data-testid="cypress-open-sign-in-modal-btn"
                                        size="xs" variant="outline" onClick={() => navigate(getPath(Paths.signIn))}>
                                    Sign In
                                </Button>
                                <Button loading={!user && isLoading}
                                        data-testid="cypress-open-sign-up-modal-btn"
                                        size="xs"
                                        variant="primary-gradient"
                                        onClick={() => {
                                            navigate(getPath(Paths.signUp));
                                        }}
                                >
                                    Sign Up
                                </Button>
                            </>
                        ) : null}

                        <UserButton/>
                        <ActionIcon variant="outline" onClick={toggleColorScheme}>
                            {colorScheme === 'dark' ? <IconSun size="1.1rem"/> : <IconMoonStars size="1.1rem"/>}
                        </ActionIcon>
                    </Flex>
                </Flex>
                <Group hiddenFrom="sm" h="100%" px="md" justify="space-between" pos="relative">
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm"/>
                    <Anchor href="/">
                        <Image data-test="app-logo" fit="contain" height={28} width={129} src={logo}
                               alt="tum rating logo"/>
                    </Anchor>
                    <SearchInputDesktop/>
                </Group>
            </AppShell.Header>
            <AppShell.Main p={0} m={0}>
                <Drawer
                    style={{zIndex: 6}}
                    title={
                        <Anchor href="/">
                            <Image data-test="app-logo" fit="contain" height={28} width={129} src={logo}
                                   alt="tum rating logo"/>
                        </Anchor>
                    }
                    opened={mobileOpened}
                    onClose={toggleMobile}
                    overlayProps={{backgroundOpacity: 0.5, blur: 4}}
                >
                    <Stack h="100%" justify="space-between">
                        <Flex align="center" justify="space-between">
                            {user ? <UserButton withoutDropdown/> : <Text>Hello</Text>}
                            <Switch size="md" onChange={toggleColorScheme} checked={colorScheme === 'light'}
                                    onLabel={<IconSun size="1.1rem"/>} offLabel={<IconMoonStars size="1.1rem"/>}/>
                        </Flex>
                        <Flex direction="column" w="100%" wrap="nowrap" gap="sm">
                            {user ? (
                                <Button fullWidth size="lg" variant="outline" onClick={() => signOut({
                                    message: 'You have been signed out',
                                })}>
                                    Log out
                                </Button>
                            ) : (
                                <>
                                    <Button data-testid="cypress-open-sign-in-modal-btn" fullWidth size="md"
                                            variant="outline" onClick={() => {
                                        navigate(getPath(Paths.signIn))
                                        toggleMobile()
                                    }}>
                                        Sign In
                                    </Button>
                                    <Button data-testid="cypress-open-sign-up-modal-btn" fullWidth size="md"
                                            variant="primary-gradient" onClick={() => {
                                        navigate(getPath(Paths.signUp))
                                        toggleMobile()
                                    }}>
                                        Sign Up
                                    </Button>
                                </>
                            )}
                        </Flex>
                    </Stack>
                </Drawer>
                <Flex justify="center" pt={HEADER_HEIGHT} mx="auto" h={`calc(100vh - ${hDiff}px)`} maw={MAX_SITE_WIDTH}>
                    {children}
                </Flex>
            </AppShell.Main>
        </AppShell>
    );
};
