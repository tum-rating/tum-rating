import { ActionIcon, Anchor, AppShell, Box, Button, Flex, Group, Image, Stack, Switch, Text, useMantineColorScheme } from '@mantine/core';
import { useHotkeys, useMediaQuery } from '@mantine/hooks';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { PropsWithChildren, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { useNavigate } from 'react-router-dom';

import logoDark from '@/assets/img/logo-dark.png';
import logo from '@/assets/img/logo.png';
import { useSignOut } from '@/auth/useSignOut';
import { useUser } from '@/auth/useUser';
import { Burger } from '@/components/Burger';
import { Drawer } from '@/components/Drawer';
import { SearchInputDesktop } from '@/components/Search';
import { UserButton } from '@/components/UserButton';
import { HEADER_HEIGHT, MAX_SITE_WIDTH } from '@/constants/styles.ts';
import { getPath, Paths } from '@/routes/paths.ts';

export const MainLayout = ({ children }: PropsWithChildren) => {
    const { data: user, isLoading } = useUser();
    const isAdmin = isLoading ? false : user?.isAdmin;
    const navigate = useNavigate();

    const [drawerOpened, setDrawerOpened] = useState(false);

    const toggleDrawer = (flag?: boolean) => {
        if (flag === undefined) setDrawerOpened(!drawerOpened);
        else setDrawerOpened(flag);
    };

    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const smallerMode = useMediaQuery('(max-width: 48em)');
    const signOut = useSignOut();
    useHotkeys([['/', () => navigate(getPath(Paths.spotlight))]]);
    return (
        <AppShell header={{ height: HEADER_HEIGHT }} padding="md">
            <Box
                style={{
                    inset: 0,
                    position: 'fixed',
                    background: 'var(--primary-layout-gradient)',
                    zIndex: -1,
                }}
            />
            <AppShell.Header maw="100vw" zIndex={1001}>
                <Flex visibleFrom="sm" h="100%" px="md" justify="space-between" align="center">
                    <Anchor href="/">{colorScheme === 'light' ? <Image data-test="app-logo" fit="contain" height={28} width={129} src={logo} alt="tum rating logo" /> : <Image data-test="app-logo" fit="contain" height={28} width={129} src={logoDark} alt="tum rating logo" />}</Anchor>
                    {!isMobileOnly && !smallerMode && (
                        <Flex maw={580} style={{ flexGrow: 1 }}>
                            <SearchInputDesktop />
                        </Flex>
                    )}
                    <Flex gap={20}>
                        {!user ? (
                            <>
                                <Button loading={!user && isLoading} size="xs" variant="outline" onClick={() => navigate(getPath(Paths.signIn))}>
                                    Sign In
                                </Button>
                                <Button
                                    loading={!user && isLoading}
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

                        <UserButton />
                        <ActionIcon data-testid="color-scheme-toggle" variant="outline" onClick={toggleColorScheme}>
                            {colorScheme === 'dark' ? <IconSun size="1.1rem" /> : <IconMoonStars size="1.1rem" />}
                        </ActionIcon>
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
                    <Drawer open={drawerOpened} toggle={toggleDrawer}>
                        <Stack h="100%" justify="space-between" p="sm">
                            <Flex align="center" justify="space-between">
                                {user ? <UserButton withoutDropdown /> : <Text>Hello</Text>}
                                <Switch data-testid="color-scheme-toggle" size="md" onChange={toggleColorScheme} checked={colorScheme === 'light'} onLabel={<IconSun size="1.1rem" />} offLabel={<IconMoonStars size="1.1rem" />} />
                            </Flex>
                            <Flex direction="column" w="100%" wrap="nowrap" gap="sm">
                                {user ? (
                                    <>
                                        {isAdmin ?? (
                                            <Button
                                                fullWidth
                                                size="lg"
                                                variant="primary-gradient"
                                                onClick={() => {
                                                    navigate(getPath(Paths.admin));
                                                    toggleDrawer();
                                                }}
                                            >
                                                Admin
                                            </Button>
                                        )}
                                        <Button fullWidth size="lg" variant="outline" onClick={() => signOut()}>
                                            Log out
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button
                                            fullWidth
                                            size="md"
                                            variant="outline"
                                            onClick={() => {
                                                navigate(getPath(Paths.signIn));
                                                toggleDrawer();
                                            }}
                                        >
                                            Sign In
                                        </Button>
                                        <Button
                                            fullWidth
                                            size="md"
                                            variant="primary-gradient"
                                            onClick={() => {
                                                navigate(getPath(Paths.signUp));
                                                toggleDrawer();
                                            }}
                                        >
                                            Sign Up
                                        </Button>
                                    </>
                                )}
                            </Flex>
                        </Stack>
                    </Drawer>
                </Box>
                <Flex justify="center" pt={HEADER_HEIGHT} mx="auto" h={`calc(100vh)`} maw={MAX_SITE_WIDTH}>
                    {children}
                </Flex>
            </AppShell.Main>
        </AppShell>
    );
};
