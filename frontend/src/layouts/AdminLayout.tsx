import {Anchor, AppShell, Burger, Button, Flex, Group, NavLink, Text} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {PropsWithChildren, useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

import classes from "./AdminLayout.module.css"

import {useCoursesProposals} from '@/admin/useCoursesProposals.ts';
import {useUser} from '@/auth/useUser.tsx';
import {PageAdminNotFound} from '@/pages/PageNotFound';
import {getPath, Paths} from '@/routes/paths.ts';


const adminTabs = [
    {label: 'Dashboard', link: getPath(Paths.admin)},
    {label: 'Proposals', link: getPath(Paths.adminCoursesProposals)},
    {label: 'Courses', link: getPath(Paths.adminCourses)},
    {label: 'Users', link: getPath(Paths.adminUsers)},
];

const HEADER_HEIGHT = 60;

export function AdminLayout({children}: PropsWithChildren) {
    const [opened, {toggle}] = useDisclosure();
    const [active, setActive] = useState(adminTabs[0].link);
    const {error, isFetched, isLoading, isError} = useCoursesProposals();
    const {data: user, isFetched: userFetched} = useUser();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        const tab = adminTabs.find((tab) => tab.link === path);
        if (tab) {
            setActive(tab.link);
        }
    }, [location]);

    if (isLoading || !userFetched) return null;
    if (!user || (isFetched && isError)) {
        return <PageAdminNotFound/>;
    } else if (!error && isFetched) {
        return (
            <AppShell
                header={{height: HEADER_HEIGHT}}
                navbar={{width: 300, breakpoint: 'sm', collapsed: {desktop: true, mobile: !opened}}}
                style={{
                    overflow: 'hidden',
                    height: '100vh',
                }}
            >
                <AppShell.Header>
                    <Group h="100%" px="md">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                        <Group justify="space-between" style={{flex: 1}}>
                            <Flex align="flex-end">
                                <Anchor underline="never" href={getPath(Paths.admin)}>
                                    <Flex align="flex-end">
                                        <Text size="xl" fw={900} p={0} m={0} variant="white">
                                            TUM-RATING
                                        </Text>
                                        <Text
                                            ml="4"
                                            fw={500}
                                            pos={'relative'}
                                            c="dimmed"
                                            top={-6}
                                            size="xs"
                                            variant="italic"
                                            style={{
                                                fontFamily: 'monospace',
                                            }}
                                        >
                                            ADMIN
                                        </Text>
                                    </Flex>
                                </Anchor>
                            </Flex>
                            <Group ml="xl" gap={0} visibleFrom="sm">
                                <Button.Group className={classes.desktopNavigation}>
                                    {adminTabs.map((link) => (
                                        <Button
                                            key={link.label}
                                            size="xs"
                                            className={classes["admin-tab"]}
                                            variant={active === link.link ? 'filled' : 'outline'}
                                            onClick={() => {
                                                navigate(link.link);
                                            }}
                                        >
                                            {link.label}
                                        </Button>
                                    ))}
                                </Button.Group>
                                <Button size="xs" ml="sm" color="gray" onClick={() => navigate('/')} variant="outline">
                                    Back to app
                                </Button>
                            </Group>
                        </Group>
                    </Group>
                </AppShell.Header>
                <AppShell.Navbar py="md" px={4}>
                    {adminTabs.map((link) => (
                        <NavLink
                            href="#required-for-focus"
                            key={link.label}
                            active={active === link.link}
                            label={link.label}
                            onClick={() => {
                                navigate(link.link);
                                toggle();
                            }}
                        />
                    ))}
                    <NavLink href="#required-for-focus" label="Back to app" onClick={() => navigate('/')}></NavLink>
                </AppShell.Navbar>
                <AppShell.Main pt={HEADER_HEIGHT} style={{background: 'var(--primary-light-gradient)'}}>
                    {user ? children : null}
                </AppShell.Main>
            </AppShell>
        );
    }
    return null;
}
