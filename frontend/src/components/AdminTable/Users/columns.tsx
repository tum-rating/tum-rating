import {ActionIcon, Badge, Center, Group} from '@mantine/core';
import {IconCircleCheckFilled, IconEdit} from "@tabler/icons-react";

export const columns = [
    {
        accessor: 'email',
        title: 'Email',
        sortable: true,
        ellipsis: true,
width: 300,
        resizable: true
    },
    {
        accessor: 'username',
        title: 'Username',
        sortable: true,
        ellipsis: true,
        resizable: true
    },
    {
        accessor: 'id',
        title: 'ID',
        sortable: true,
        hidden: true,
        resizable: true
    },
    {
        accessor: 'role',
        title: 'Role',
        sortable: true,
        render: ({role}) => {
            if (role === 0) {
                return <Badge color="blue">User</Badge>
            }
            if (role === 1) {
                return <Badge color="gold">Admin</Badge>
            }
            return <Badge color="gray">{role}</Badge>
        }
    },
    {
        accessor: 'isBanned',
        title: 'Banned',
        sortable: true,
        render: ({isBanned}) => {
            return <Badge color={isBanned ? 'red' : 'green'}>{isBanned ? 'Yes' : 'No'}</Badge>
        }
        ,
    },
    {
        accessor: 'isEmailActivated',
        title: 'Activation',
        sortable: true,
        ellipsis: true,
        render: ({isEmailActivated}) => {
            return <Badge color={isEmailActivated ? 'green' : 'red'}>{isEmailActivated ? 'Yes' : 'No'}</Badge>
        }
    },
    {
        accessor: 'actions',
        title: (
            <Center>
                <IconEdit size={16}/>
            </Center>
        ),
        width: '0%', // 👈 use minimal width
        render: () => (
            <Group gap={4} justify="right" wrap="nowrap">
                <ActionIcon
                    size="sm"
                    variant="transparent"
                    color="green"
                    onClick={(e) => {
                        e.stopPropagation(); // 👈 prevent triggering the row click function
                    }}
                >
                    <IconCircleCheckFilled size={16}/>
                </ActionIcon>
                <ActionIcon
                    size="sm"
                    variant="transparent"
                    onClick={(e) => {
                        e.stopPropagation(); // 👈 prevent triggering the row click function
                    }}
                >
                    <IconEdit size={16}/>
                </ActionIcon>
            </Group>
        ),
    },
];