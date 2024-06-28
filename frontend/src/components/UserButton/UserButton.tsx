import { ActionIcon, Box, Group, Menu, rem, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconLego, IconLogout } from '@tabler/icons-react';

import { useSignOut } from '@/auth/useSignOut.tsx';
import { useUser } from '@/auth/useUser.tsx';

interface UserButtonProps {
    withoutDropdown?: boolean;
}

export function UserButton({ withoutDropdown = false }: UserButtonProps) {
    const signOut = useSignOut();
    const { data: user, isLoading } = useUser();
    if (isLoading || !user) return <div style={{ visibility: 'hidden', position: 'fixed' }} data-testid="no_user_provided" />;
    if (withoutDropdown) {
        return (
            <Box>
                <Group wrap="nowrap" p="xs">
                    <ThemeIcon>
                        <IconLego size="1.2rem" />
                    </ThemeIcon>
                    <Stack gap={0}>
                        <Text data-testid="username-loaded" truncate="end" size="sm" fw={500}>
                            {user?.username}
                        </Text>
                        <Text data-testid="email-loaded" truncate="end" c="dimmed" size="xs">
                            {user?.email}
                        </Text>
                    </Stack>
                </Group>
            </Box>
        );
    } else {
        return (
            <Menu position="bottom-end" shadow="md" width={200} data-testid="menu">
                <Menu.Target data-testid="menu-button">
                    <ActionIcon loading={isLoading} variant="outline" data-testid="menu-button">
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
                                <Text w={120} data-testid="username-loaded" truncate="end" size="sm" fw={500}>
                                    {user?.username}
                                </Text>
                                <Text w={120} data-testid="email-loaded-dropdown" truncate="end" c="dimmed" size="xs">
                                    {user?.email}
                                </Text>
                            </Stack>
                        </Group>
                    </Box>
                    <Menu.Label>Application</Menu.Label>
                    <Menu.Item onClick={() => signOut()} leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} data-testid="logout" />}>
                        Logout
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        );
    }
}
