import {ActionIcon, Anchor, AppShell, Box, Button, Flex, Group, Image, Menu, rem, useMantineColorScheme} from '@mantine/core';
import {useHotkeys, useMediaQuery} from '@mantine/hooks';
import {IconDotsVertical} from '@tabler/icons-react';
import {PropsWithChildren, useState} from 'react';
import {isMobileOnly} from 'react-device-detect';
import {useNavigate} from 'react-router-dom';

import logoDark from '@/assets/img/logo-dark.png';
import logo from '@/assets/img/logo.png';
import {useUser} from '@/auth/useUser';
import {Burger} from '@/components/Burger';
import {Drawer} from '@/components/Drawer';
import {FloatingMenu} from '@/components/FloatingMenu';
import {SearchInputDesktop} from '@/components/Search';
import {ThemeToggleActionIcon} from '@/components/ThemeToggle';
import {UserButton} from '@/components/UserButton';
import {INFO_PAGES} from '@/constants';
import {HEADER_HEIGHT, HEADER_Z_INDEX, MAX_SITE_WIDTH} from '@/constants/styles.ts';
import {getPath, Paths} from '@/routes/paths.ts';

export const MainLayout = ({children}: PropsWithChildren) => {
    const {data: user, isLoading} = useUser();
    const isAdmin = isLoading ? false : user?.isAdmin;
    const navigate = useNavigate();

    const [drawerOpened, setDrawerOpened] = useState(false);

    const toggleDrawer = (flag?: boolean) => {
        if (flag === undefined) setDrawerOpened(!drawerOpened);
        else setDrawerOpened(flag);
    };
    const {colorScheme} = useMantineColorScheme();
    const smallerMode = useMediaQuery('(max-width: 48em)');
    useHotkeys([['/', () => navigate(getPath(Paths.spotlight))]]);
    return (
        <AppShell header={{height: HEADER_HEIGHT}} padding="md">
            <FloatingMenu />
            <Box
                style={{
                    inset: 0,
                    position: 'fixed',
                    background: 'var(--primary-layout-gradient)',
                    zIndex: -1,
                }}
            />
            <AppShell.Header maw="100vw" zIndex={HEADER_Z_INDEX}>
                <Flex visibleFrom="sm" h="100%" px="md" justify="space-between" align="center" gap={20}>
                    <Anchor href="/">{colorScheme === 'light' ? <Image data-test="app-logo" fit="contain" height={28} width={129} src={logo} alt="tum rating logo" /> : <Image data-test="app-logo" fit="contain" height={28} width={129} src={logoDark} alt="tum rating logo" />}</Anchor>
                    {!isMobileOnly && !smallerMode && (
                        <Flex maw={580} style={{flexGrow: 1}}>
                            <SearchInputDesktop />
                        </Flex>
                    )}
                    <Flex gap={20}>
                        {!user ? (
                            <>
                                <Button data-testid="sign-in-btn-desktop" loading={!user && isLoading} size="xs" variant="outline" onClick={() => navigate(getPath(Paths.signIn))}>
                                    Sign In
                                </Button>
                                <Button
                                    loading={!user && isLoading}
                                    data-testid="sign-up-btn-desktop"
                                    size="xs"
                                    variant="primary-gradient"
                                    onClick={() => {
                                        navigate(getPath(Paths.signUp));
                                    }}
                                >
                                    Sign Up
                                </Button>
                                <Menu shadow="xl" position="bottom-end">
                                    <Menu.Target>
                                        <ActionIcon variant="outline">
                                            <IconDotsVertical size="1.2rem" />
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>Information</Menu.Label>
                                        {INFO_PAGES.map((page) => {
                                            const Icon = page.icon;
                                            return (
                                                <Menu.Item
                                                    key={page.path + page.title}
                                                    leftSection={<Icon style={{width: rem(14), height: rem(14)}} />}
                                                    onClick={() => {
                                                        navigate(page.path);
                                                    }}
                                                >
                                                    {page.title}
                                                </Menu.Item>
                                            );
                                        })}
                                    </Menu.Dropdown>
                                </Menu>
                            </>
                        ) : null}
                        <UserButton />
                        <ThemeToggleActionIcon />
                        {isAdmin && (
                            <Button
                                size="xs"
                                variant="primary-gradient"
                                onClick={() => {
                                    navigate(getPath(Paths.admin));
                                    toggleDrawer();
                                }}
                            >
                                Admin
                            </Button>
                        )}
                    </Flex>
                </Flex>
                <Group hiddenFrom="sm" h="100%" px="md" justify="space-between" pos="relative">
                    <Burger open={drawerOpened} toggle={toggleDrawer}></Burger>
                    <Anchor href="/">{colorScheme === 'light' ? <Image data-test="app-logo" fit="contain" height={28} width={129} src={logo} alt="tum rating logo" /> : <Image data-test="app-logo" fit="contain" height={28} width={129} src={logoDark} alt="tum rating logo" />}</Anchor>
                    <SearchInputDesktop />
                </Group>
            </AppShell.Header>
            <AppShell.Main p={0} m={0}>
                <Box hiddenFrom={'sm'}>
                    <Drawer open={drawerOpened} toggle={toggleDrawer} />
                </Box>
                <Flex justify="center" pt={HEADER_HEIGHT} mx="auto" h={`calc(100vh)`} maw={MAX_SITE_WIDTH}>
                    {children}
                </Flex>
            </AppShell.Main>
        </AppShell>
    );
};
