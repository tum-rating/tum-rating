import {AppShell, Burger, Flex, Group, Text, UnstyledButton} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Outlet, useNavigate} from "react-router-dom";

import classes from './AdminLayout.module.css';

import {useCoursesProposals} from "@/admin/useCoursesProposals.ts";
import {useUser} from "@/auth/useUser.tsx";
import {PageAdminNotFound} from "@/pages/PageNotFound";
import {getPath, Paths} from "@/routes/paths.ts";


const adminTabs = [
    {label: 'Proposals', link: getPath(Paths.adminCoursesProposals)},
    {label: 'Courses', link: getPath(Paths.adminCourses)},
    {label: 'Users', link: getPath(Paths.adminUsers)},
];

export function AdminLayout() {
    const [opened, {toggle}] = useDisclosure();
    const {error, isFetched, isFetchedAfterMount} = useCoursesProposals();
    const {user} = useUser();
    const navigate = useNavigate();
    if (!user || isFetchedAfterMount) {
        return <PageAdminNotFound/>;
    } else if (!error && isFetched) {
        return (
            <AppShell
                header={{height: 60}}
                navbar={{width: 300, breakpoint: 'sm', collapsed: {desktop: true, mobile: !opened}}}
                padding="md"
            >
                <AppShell.Header>
                    <Group h="100%" px="md">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                        <Group justify="space-between" style={{flex: 1}}>
                            <Flex align="center">
                                <Text
                                    size="lg"
                                    fw={900}
                                    variant="gradient"
                                    gradient={{from: 'grape', to: 'violet', deg: 90}}
                                >
                                    TUM-RATING ADMIN
                                </Text>
                            </Flex>lkk
                            <Group ml="xl" gap={0} visibleFrom="sm">
                                <Group gap={0}>
                                    {adminTabs.map((tab, index) => (
                                        <UnstyledButton key={index} className={classes.control}
                                                        onClick={() => navigate(tab.link)}>
                                            {tab.label}
                                        </UnstyledButton>
                                    ))}
                                </Group>
                            </Group>
                        </Group>
                    </Group>
                </AppShell.Header>
                <AppShell.Navbar py="md" px={4}>
                    {adminTabs.map((tab, index) => (
                        <UnstyledButton key={index} className={classes.control} onClick={() => navigate(tab.link)}>
                            {tab.label}
                        </UnstyledButton>
                    ))}
                </AppShell.Navbar>
                <AppShell.Main style={{background: "var(--primary-light-gradient)"}}>
                    {
                        user ? (
                            <Outlet/>
                        ) : null
                    }
                </AppShell.Main>


            </AppShell>
        );
    }
    return null;
}