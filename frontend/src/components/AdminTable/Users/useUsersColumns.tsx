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
            accessorKey: 'role',
            header: 'Role',
        },
        {
            accessorKey: 'isBanned',
            header: 'Banned',
        },
        {
            accessorKey: 'isEmailActivated',
            header: 'Activation',
        },
    ];

    return {
        columns,
    };
};
