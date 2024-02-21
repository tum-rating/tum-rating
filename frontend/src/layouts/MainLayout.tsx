import {PropsWithChildren} from 'react';
import {
    ActionIcon,
    Anchor,
    AppShell,
    Burger,
    Button,
    Drawer,
    Flex,
    getGradient,
    Group,
    Image,
    Stack,
    Switch,
    Text,
    useMantineColorScheme,
    useMantineTheme
} from '@mantine/core';
import {useDisclosure, useHotkeys} from '@mantine/hooks';
import logo from '@/assets/img/logo.png';
import {IconMoonStars, IconSearch, IconSun} from '@tabler/icons-react';
import {useUser} from '@/auth/useUser';
import {UserButton} from '@/components/UserButton';
import {useSignOut} from '@/auth/useSignOut';
import {SpotlightControl} from '@/components/Spotlight/SpotlightControl';
import {getPath, Paths} from '@/routes/paths.ts';
import {useNavigate} from 'react-router-dom';

import {useGradient} from "@/hooks";


const HEADER_HEIGHT = 45;
const MAX_SITE_WIDTH = 1320;

export const MainLayout = ({children}: PropsWithChildren) => {
    const {user} = useUser();
    const navigate = useNavigate();
    const [mobileOpened, {toggle: toggleMobile}] = useDisclosure();
    const theme = useMantineTheme();
    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    const signOut = useSignOut();


    const {layoutGradient, primaryGradient} = useGradient();


    useHotkeys([['/', () => navigate(getPath(Paths.spotlight))]]);
    const Logo = () => (
        <Anchor href="/">
            <Image data-test="app-logo" fit="contain" height={28} width={129} src={logo} alt="tum rating logo"/>
        </Anchor>
    );
    return (
        <AppShell header={{height: HEADER_HEIGHT}} padding="md">
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
                            <Button
                                data-testid="cypress-open-sign-up-modal-btn"
                                size="xs"
                                variant="gradient"
                                gradient={primaryGradient}
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
            <AppShell.Main p={0} m={0} bg={getGradient(layoutGradient, theme)}>
                <Drawer style={{zIndex: 6}} title={<Logo/>} opened={mobileOpened} onClose={toggleMobile}
                        overlayProps={{backgroundOpacity: 0.5, blur: 4}}>
                    <Stack h="100%" justify="space-between">
                        <Flex align="center" justify="space-between">
                            {user ? <UserButton withoutDropdown/> : <Text>Hello</Text>}
                            <Switch size="md" onChange={toggleColorScheme} checked={colorScheme === 'light'}
                                    onLabel={<IconSun size="1.1rem"/>} offLabel={<IconMoonStars size="1.1rem"/>}/>
                        </Flex>
                        <Flex direction="column" w="100%" wrap="nowrap" gap="sm">
                            {user ? (
                                <Button fullWidth size="lg" variant="outline" onClick={signOut}>
                                    Log out
                                </Button>
                            ) : (
                                <>
                                    <Button data-testid="cypress-open-sign-in-modal-btn" fullWidth size="md"
                                            variant="outline" onClick={() => navigate(getPath(Paths.signIn))}>
                                        Sign In
                                    </Button>
                                    <Button data-testid="cypress-open-sign-up-modal-btn" fullWidth size="md"
                                            variant="gradient" gradient={primaryGradient}
                                            onClick={() => navigate(getPath(Paths.signUp))}>
                                        Sign Up
                                    </Button>
                                </>
                            )}
                        </Flex>
                    </Stack>
                </Drawer>
                <Flex justify="center" pt={HEADER_HEIGHT} mx="auto" h="100%" maw={MAX_SITE_WIDTH}>{children}</Flex>
            </AppShell.Main>
        </AppShell>
    );
};
