import {Badge} from '@mantine/core';

export const useUsersColumns = () => {
    const columns = [
        {
            accessorKey: 'email',
            header: 'Email',
        },
        {
            accessorKey: 'username',
            header: 'Username',
        },
        {
            accessorKey: 'id',
            header: 'ID',
        },
        {
            accessorKey: 'role',
            header: 'Role',
        },
        {
            accessorKey: 'isBanned',
            header: 'Banned',
            Cell: ({row}) => {
                return <>{row.original.isBanned && <Badge color="red">Banned</Badge>}</>;
            },
        },
        {
            accessorKey: 'isEmailActivated',
            header: 'Activation',
            Cell: ({row}) => {
                return (
                    <>
                        <Badge color={row.original.isEmailActivated ? 'green' : 'red'}>{row.original.isEmailActivated ? 'Activated' : 'Not activated'}</Badge>
                    </>
                );
            },
        },
    ];

    return {
        columns,
    };
};
