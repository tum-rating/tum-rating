import { ActionIcon, Avatar, createStyles, Group, Menu, Text, UnstyledButtonProps } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { useSignOut } from '../../auth/useSignOut';

interface UserButtonProps extends UnstyledButtonProps {
  username: string;
  email: string;
}

const useStyles = createStyles((theme) => ({
  user: {
    display: 'flex',
    width: '100%',
    padding: theme.spacing.md,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
  },
}));

export function UserButton({ username, email }: UserButtonProps) {
  const { classes } = useStyles();
  const signOut = useSignOut();

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <ActionIcon variant="outline" title="Toggle color scheme">
          <Avatar color="blue" radius="xs" size={30}>
            {username.slice(0, 1).toUpperCase()}
          </Avatar>
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Group className={classes.user}>
          <Avatar color="blue" radius="xs" size={30}>
            {username.slice(0, 1).toUpperCase()}
          </Avatar>
          <div style={{ flex: 1 }}>
            <Text size="sm" weight={500}>
              {username}
            </Text>

            <Text color="dimmed" size="xs">
              {email}
            </Text>
          </div>
        </Group>
        <Menu.Label>Application</Menu.Label>
        <Menu.Item
          onClick={() => {
            signOut();
          }}
          icon={<IconLogout size={14} />}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
