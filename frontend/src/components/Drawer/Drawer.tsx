import {
    Button,
    Divider,
    Drawer as DrawerComponent,
    Flex,
    Stack,
    Switch,
    Text,
    useMantineColorScheme
} from '@mantine/core';
import {IconMoonStars, IconSun} from "@tabler/icons-react";
import {useNavigate} from "react-router-dom";

import {useSignOut} from "@/auth/useSignOut.tsx";
import {useUser} from "@/auth/useUser.tsx";
import {ThemeToggleFloatingIndicator} from "@/components/ThemeToggle";
import {UserButton} from "@/components/UserButton";
import { DRAWER_Z_INDEX } from '@/constants';
import {getPath, Paths} from "@/routes/paths.ts";


interface DrawerProps {
    open: boolean;
    toggle: (flag?: boolean) => void;
}

const Drawer = (props: DrawerProps) => {
    const { data: user, isLoading } = useUser();
    const isAdmin = isLoading ? false : user?.isAdmin;
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const signOut = useSignOut();
    const navigate = useNavigate();
    const { open, toggle } = props;

    return (
        <>
            <DrawerComponent
                opened={open}
                onClose={toggle}
                transitionProps={{ duration: 400, timingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)' }}
                size="xs"
                style={{
                    zIndex: DRAWER_Z_INDEX,
                }}
            >

                <Stack h="100%" justify="space-between" p={0}>
                    <Flex>
                        <UserButton withoutDropdown />
                    </Flex>
                    <ThemeToggleFloatingIndicator/>
                    {
                        user ? (
                            <>
                                <Button
                                    variant="primary-gradient"
                                    onClick={()=> navigate(getPath(Paths.admin))}>
                                    Admin panel
                                </Button>
                                <Button variant="default" onClick={()=>signOut()}>
                                    Log out
                                </Button>
                            </>

                        ) : (
                            <>
                                <Button onClick={()=>navigate(getPath(Paths.signIn))}>
                                    Sign In
                                </Button>
                                <Button onClick={()=>navigate(getPath(Paths.signUp))}>
                                    Sign Up
                                </Button>
                            </>

                        )
                    }
                    <Divider/>
                    <Stack>

                    </Stack>
                </Stack>

                <Stack h="100%" justify="space-between" p="sm" style={{display:"none"}}>
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
                                            toggle();
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
                                    data-testid="sign-in-btn"
                                    variant="outline"
                                    onClick={() => {
                                        navigate(getPath(Paths.signIn));
                                        toggle();
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
                                        toggle();
                                    }}
                                >
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </Flex>
                </Stack>
            </DrawerComponent>
        </>
    );
};

export { Drawer };
