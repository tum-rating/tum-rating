import {ActionIcon, Center, Group, Tooltip} from '@mantine/core';
import {IconBan, IconEdit, IconHammer, IconHammerOff} from "@tabler/icons-react";


interface UsersTableColumnsProps {
    onRemove?: (id: string) => void;
    onBan?: (id: string) => void;
    onUnban?: (id: string) => void;
}

export const columns = ({
                            onRemove,
                            onBan,
                            onUnban
                        }: UsersTableColumnsProps) => {
    return [
        {
            accessor: 'email',
            title: 'Email',
            sortable: true,
            ellipsis: true,
        },
        {
            accessor: 'username',
            title: 'Username',
            sortable: true,
            ellipsis: true,
        },
        {
            accessor: 'id',
            title: 'ID',
            hidden: true,
            ellipsis: true,
        },
        {
            accessor: 'role',
            title: 'Role',
            sortable: true,
            ellipsis: true,
        },
        {
            accessor: 'isBanned',
            title: 'Banned',
            sortable: true,
            // render: ({isBanned}) => {
            //     return <Badge color={isBanned ? 'red' : 'green'}>{isBanned ? 'Yes' : 'No'}</Badge>
            // }
        },
        {
            accessor: 'isEmailActivated',
            title: 'Activation',
            sortable: true,
            // render: ({isEmailActivated}) => {
            //     return <Badge color={isEmailActivated ? 'green' : 'red'}>{isEmailActivated ? 'Yes' : 'No'}</Badge>
            // }
        },
        {
            accessor: 'actions',
            title: (
                <Center>
                    <IconEdit size={16}/>
                </Center>
            ),
            width: '0%', // 👈 use minimal width
            render: (record) => (
                <Group gap={4} justify="right" wrap="nowrap">
                    {record.isBanned ?
                        <Tooltip
                            openDelay={500}
                            label="Unban user">
                            <ActionIcon
                                size="sm"
                                color="black"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onUnban(record.id);
                                }}
                            >
                                <IconHammerOff size={16}/>
                            </ActionIcon></Tooltip> :
                        <Tooltip
                            openDelay={500}
                            label="Ban user">
                            <ActionIcon
                                size="sm"
                                color="black"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onBan(record.id);
                                }}
                            >
                                <IconHammer size={16}/>
                            </ActionIcon>
                        </Tooltip>
                    }
                    <Tooltip
                        openDelay={500}
                        label="Remove user">
                        <ActionIcon
                            size="sm"
                            color="red"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(record.id);
                            }}
                        >
                            <IconBan size={16}/>
                        </ActionIcon>
                    </Tooltip>

                </Group>
            ),
        },
    ]
};