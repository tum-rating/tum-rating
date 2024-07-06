import {
    Button,
    Divider,
    Drawer as DrawerComponent,
    Flex,
    Stack,
} from '@mantine/core';
import {useNavigate} from 'react-router-dom';

import {useSignOut} from '@/auth/useSignOut.tsx';
import {useUser} from '@/auth/useUser.tsx';
import {ThemeToggleFloatingIndicator} from '@/components/ThemeToggle';
import {UserButton} from '@/components/UserButton';
import {DRAWER_Z_INDEX} from '@/constants';
import {getPath, Paths} from '@/routes/paths.ts';

interface DrawerProps {
    open: boolean;
    toggle: (flag?: boolean) => void;
}

const Drawer = (props: DrawerProps) => {
    const {data: user, isLoading} = useUser();
    const isAdmin = isLoading ? false : user?.isAdmin;
    const signOut = useSignOut();
    const navigate = useNavigate();
    const {open, toggle} = props;

    return (
        <>
            <DrawerComponent
                opened={open}
                onClose={toggle}
                transitionProps={{duration: 400, timingFunction: 'cubic-bezier(0.25, 1, 0.5, 1)'}}
                size="xs"
                style={{
                    zIndex: DRAWER_Z_INDEX,
                }}
            >
                <Stack h="100%" justify="space-between" p={0}>
                    <Flex>
                        <UserButton withoutDropdown/>
                    </Flex>
                    <ThemeToggleFloatingIndicator/>
                    {user ? (
                        <>
                            {
                                isAdmin && (
                                    <Button data-testid="admin-btn-mobile" variant="primary-gradient"
                                            onClick={() => navigate(getPath(Paths.admin))}>
                                        Admin panel
                                    </Button>
                                )
                            }
                            <Button data-testid="log-out-btn-mobile" variant="default" onClick={() => signOut()}>
                                Log out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button data-testid="sign-in-btn-mobile" onClick={() => navigate(getPath(Paths.signIn))}>
                                Sign In
                            </Button>
                            <Button data-testid="sign-up-btn-mobile" onClick={() => navigate(getPath(Paths.signUp))}>
                                Sign Up
                            </Button>
                        </>
                    )}
                    <Divider/>
                    <Stack></Stack>
                </Stack>
            </DrawerComponent>
        </>
    );
};

export {Drawer};
