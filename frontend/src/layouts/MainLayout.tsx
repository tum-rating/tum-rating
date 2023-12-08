import {PropsWithChildren} from 'react';
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
import {useDisclosure, useHotkeys} from '@mantine/hooks';
import logo from '@/assets/img/logo.png';
import {IconMoonStars, IconSearch, IconSun} from '@tabler/icons-react';
import {openSignInModal, openSignUpModal} from '@/components/Modals';
import {useUser} from '@/auth/useUser';
import {UserButton} from '@/components/UserButton';
import {useSignOut} from '@/auth/useSignOut';
import {SpotlightControl} from '@/components/Spotlight/SpotlightControl';
import {getPath, Paths} from "@/routes/paths.ts";
import {useNavigate} from "react-router-dom";

export const MainLayout = ({children}: PropsWithChildren) => {
    const {user} = useUser();
    const navigate = useNavigate()
    const [mobileOpened, {toggle: toggleMobile}] = useDisclosure();
    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    const signOut = useSignOut();
    useHotkeys([['/', () => navigate(getPath(Paths.spotlight))]]);
    const Logo = () => (
        <Anchor href="/">
            <Image data-test="app-logo" fit="contain" height={28} width={129} src={logo} alt="tum rating logo"/>
        </Anchor>
    );
    return (
        <AppShell header={{height: 45}} padding="md">
            <AppShell.Header maw="100vw">
                <Group visibleFrom="sm" h="100%" px="md" justify="space-between">
                    <Logo/>
                    <SpotlightControl onClick={() => navigate(getPath(Paths.spotlight))}/>
                    {!user ? (
                        <>
                            <Button data-testid="cypress-open-sign-in-modal-btn" size="xs" variant="outline"
                                    onClick={() => navigate(getPath(Paths.signIn))}>
                                Sign In
                            </Button>
                            <Button data-testid="cypress-open-sign-up-modal-btn" size="xs" variant="gradient"
                                    gradient={{from: 'indigo', to: 'blue', deg: 90}} onClick={() => {
                                navigate(getPath(Paths.signUp))
                            }}>
                                Sign Up
                            </Button>
                        </>
                    ) : null}

                    <UserButton/>
                    <ActionIcon variant="outline" onClick={toggleColorScheme}>
                        {colorScheme === 'dark' ? <IconSun size="1.1rem"/> : <IconMoonStars size="1.1rem"/>}
                    </ActionIcon>
                </Group>
                <Group hiddenFrom="sm" h="100%" px="md" justify="space-between">
                    <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm"/>
                    <Logo/>
                    <ActionIcon variant="outline" data-testid="cypress-global-search"
                                onClick={() => navigate(getPath(Paths.spotlight))}>
                        <IconSearch size="1.1rem"/>
                    </ActionIcon>
                </Group>
            </AppShell.Header>
            <AppShell.Main p={0} m={0}>
                <Drawer style={{zIndex: 6}} title={<Logo/>} opened={mobileOpened} onClose={toggleMobile}
                        overlayProps={{backgroundOpacity: 0.5, blur: 4}}>
                    <Stack h="100%" justify="space-between">
                        <Flex align="center" justify="space-between">
                            {user ? <UserButton withoutDropdown/> : <Text>Hello</Text>}
                            <Switch size="md" onChange={toggleColorScheme} checked={colorScheme === 'light'}
                                    onLabel={<IconSun size="1.1rem"/>} offLabel={<IconMoonStars size="1.1rem"/>}/>
                        </Flex>
                        <Group w="100%" wrap="nowrap">
                            {user ? (
                                <Button fullWidth size="xs" variant="outline" onClick={signOut}>
                                    Log out
                                </Button>
                            ) : (
                                <>
                                    <Button data-testid="cypress-open-sign-in-modal-btn" fullWidth size="xs"
                                            variant="outline" onClick={openSignInModal}>
                                        Sign In
                                    </Button>
                                    <Button data-testid="cypress-open-sign-up-modal-btn" fullWidth size="xs"
                                            variant="gradient" gradient={{from: 'indigo', to: 'blue', deg: 90}}
                                            onClick={openSignUpModal}>
                                        Sign Up
                                    </Button>
                                </>
                            )}
                        </Group>
                    </Stack>
                </Drawer>
                <Box pt={45}>{children}</Box>
            </AppShell.Main>
        </AppShell>
    );
};
