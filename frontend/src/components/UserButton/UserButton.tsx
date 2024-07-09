import {ActionIcon, Box, Group, Menu, rem, Stack, Text, ThemeIcon} from '@mantine/core';
import {IconLego, IconLogout} from '@tabler/icons-react';
import {useNavigate} from 'react-router-dom';

import {useSignOut} from '@/auth/useSignOut.tsx';
import {useUser} from '@/auth/useUser.tsx';
import {INFO_PAGES} from '@/constants';

interface UserButtonProps {
    withoutDropdown?: boolean;
}

export function UserButton({withoutDropdown = false}: UserButtonProps) {
    const signOut = useSignOut();
    const {data: user, isLoading} = useUser();
    const navigate = useNavigate();
    if (isLoading || !user) return <div style={{visibility: 'hidden', position: 'fixed'}} data-testid="no_user_provided" />;
    if (withoutDropdown) {
        return (
            <Box data-testid="user-btn-mobile">
                <Group wrap="nowrap" p="xs">
                    <ThemeIcon>
                        <IconLego size="1.2rem" />
                    </ThemeIcon>
                    <Stack gap={0}>
                        <Text data-testid="user-btn-username-mobile" truncate="end" size="sm" fw={500}>
                            {user?.username}
                        </Text>
                        <Text data-testid="user-btn-email-mobile" truncate="end" c="dimmed" size="xs">
                            {user?.email}
                        </Text>
                    </Stack>
                </Group>
            </Box>
        );
    } else {
        return (
            <Menu position="bottom-end" shadow="xl" width={200} data-testid="user-btn-desktop">
                <Menu.Target>
                    <ActionIcon loading={isLoading} variant="outline">
                        <IconLego size="1.2rem" />
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    <Box maw={300} mx="auto">
                        <Group wrap="nowrap" p="xs">
                            <ThemeIcon>
                                <IconLego size="1.2rem" />
                            </ThemeIcon>
                            <Stack gap={0}>
                                <Text w={120} data-testid="user-btn-username-desktop" truncate="end" size="sm" fw={500}>
                                    {user?.username}
                                </Text>
                                <Text w={120} data-testid="user-btn-email-desktop" truncate="end" c="dimmed" size="xs">
                                    {user?.email}
                                </Text>
                            </Stack>
                        </Group>
                    </Box>
                    <Menu.Label>Application</Menu.Label>
                    <Menu.Item onClick={() => signOut()} leftSection={<IconLogout style={{width: rem(14), height: rem(14)}} data-testid="logout" />}>
                        Logout
                    </Menu.Item>
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
        );
    }
}
