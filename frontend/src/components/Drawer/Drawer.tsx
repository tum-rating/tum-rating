import { Button, Divider, Drawer as DrawerComponent, Flex, Stack } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

import classes from "./Drawer.module.css";

import { useSignOut } from '@/auth/useSignOut.tsx';
import { useUser } from '@/auth/useUser.tsx';
import { ThemeToggleFloatingIndicator } from '@/components/ThemeToggle';
import { UserButton } from '@/components/UserButton';
import { DRAWER_Z_INDEX, INFO_PAGES } from '@/constants';
import { getPath, Paths } from '@/routes/paths.ts';

interface DrawerProps {
    open: boolean;
    toggle: (flag?: boolean) => void;
}

const Drawer = (props: DrawerProps) => {
    const { data: user, isLoading } = useUser();
    const isAdmin = isLoading ? false : user?.isAdmin;
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
                    <ThemeToggleFloatingIndicator />
                    {user ? (
                        <>
                            {isAdmin && (
                                <Button variant="primary-gradient" onClick={() => navigate(getPath(Paths.admin))}>
                                    Admin panel
                                </Button>
                            )}
                            <Button variant="default" onClick={() => signOut()}>
                                Log out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button data-testid="sign-in-btn" onClick={() => navigate(getPath(Paths.signIn))}>
                                Sign In
                            </Button>
                            <Button data-testid="sign-up-btn" onClick={() => navigate(getPath(Paths.signUp))}>
                                Sign Up
                            </Button>
                        </>
                    )}
                    <Divider />
                    <Stack mt="auto">
                        <Button.Group orientation="vertical" className={classes.drawerMenu}>
                            {INFO_PAGES.map((page) => {
                                const Icon = page.icon;
                                return (
                                    <Button
                                        key={page.title}
                                        fullWidth
                                        variant="default"
                                        leftSection={<Icon style={{ width: '1.2rem', height: '1.2rem' }} />}
                                        onClick={() => {
                                            navigate(page.path);
                                            toggle();
                                        }}
                                    >
                                        {page.title}
                                    </Button>
                                );
                            })}
                        </Button.Group>
                    </Stack>
                </Stack>
            </DrawerComponent>
        </>
    );
};

export { Drawer };
