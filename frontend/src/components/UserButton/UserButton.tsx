import { ActionIcon, Box, Group, Menu, rem, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconLego, IconLogout } from '@tabler/icons-react';

import { useSignOut } from '@/auth/useSignOut.tsx';
import { useUser } from '@/auth/useUser.tsx';

interface UserButtonProps {
    withoutDropdown?: boolean;
}

export function UserButton({ withoutDropdown = false }: UserButtonProps) {
    const signOut = useSignOut();
    const {data: user} = useUser();
    if (!user) return null;
    if (withoutDropdown) {
        return (
            <Box>
                <Group wrap="nowrap" p="xs">
                    <ThemeIcon>
                        <IconLego size="1.2rem" />
                    </ThemeIcon>
                    <Stack gap={0}>
                        <Text truncate="end" size="sm" fw={500}>
                            {user.username}
                        </Text>
                        <Text truncate="end" c="dimmed" size="xs">
                            {user.email}
                        </Text>
                    </Stack>
                </Group>
            </Box>
        );
    } else {
        return (
            <Menu position="bottom-end" shadow="md" width={200}>
                <Menu.Target>
                    <ActionIcon variant="outline">
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
                                <Text w={120} truncate="end" size="sm" fw={500}>
                                    {user.username}
                                </Text>
                                <Text w={120} truncate="end" c="dimmed" size="xs">
                                    {user.email}
                                </Text>
                            </Stack>
                        </Group>
                    </Box>
                    <Menu.Label>Application</Menu.Label>
                    <Menu.Item
                        onClick={() => {
                            signOut();
                        }}
                        leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
                    >
                        Logout
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        );
    }
}
