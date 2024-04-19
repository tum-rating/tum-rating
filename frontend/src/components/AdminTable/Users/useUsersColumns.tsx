import {ActionIcon, Badge, Center, Group, Tooltip} from '@mantine/core';
import {IconBan, IconEdit, IconHammer, IconHammerOff} from "@tabler/icons-react";
import {useEffect, useState} from "react";

import {useTableColumns} from '../Shared/useTableColumns';

import {User} from "@/admin/types.ts";
import {useAllUsers} from "@/admin/useAllUsers.ts";
import {useBanUser} from "@/admin/useBanUser.tsx";
import {useRemoveUser} from '@/admin/useRemoveUser';
import {ColumnFilterCombobox} from "@/components/AdminTable/Shared/ColumnFilterCombobox";

export const useUsersColumns = () => {
    const {data} = useAllUsers();
    const {mutate: changeBanStatus, isLoading: isBanLoading} = useBanUser()
    const {mutate: removeUser, isLoading: isRemoveLoading} = useRemoveUser()

    const [users, setUsers] = useState<User[]>([])
    const [columns, setColumns] = useState([])
    const filterableColumns = ['email', 'username', 'role', 'isBanned', 'isEmailActivated']
    const {
        sortState,
        setSortState,
        filterState,
        setFilter,
        resetFilters,
        resetSorting,
        isAnyFilterActive
    } = useTableColumns(data, filterableColumns, setUsers);

    useEffect(() => {
        if (data) {
            setUsers(data);
            setColumns(columnsTemplate());
        }
    }, [data]);

    useEffect(() => {
        setColumns(columnsTemplate());
    }, [filterState, sortState])


    const columnsTemplate = () => [
        {
            accessor: 'email',
            title: 'Email',
            sortable: true,
            ellipsis: true,
            filtering: filterState?.email?.selected.length > 0,
            filter: (
                <ColumnFilterCombobox
                    label="Emails"
                    description="Filter by emails"
                    data={filterState?.email?.records || []}
                    value={filterState?.email?.selected || []}
                    placeholder="Search emails…"
                    onChange={(value) => {
                        setFilter('email', value)
                    }}
                    clearable
                    searchable
                />
            ),
        },
        {
            accessor: 'username',
            title: 'Username',
            sortable: true,
            ellipsis: true,
            filtering: filterState?.username?.selected.length > 0,
            filter: (
                <ColumnFilterCombobox
                    label="Usernames"
                    description="Filter by usernames"
                    data={filterState?.username?.records || []}
                    value={filterState?.username?.selected || []}
                    placeholder="Search usernames…"
                    onChange={(value) => {
                        setFilter('username', value)
                    }}
                    clearable
                    searchable
                />
            ),
        },
        {
            accessor: 'role',
            title: 'Role',
            sortable: true,
            ellipsis: true,
            filtering: filterState?.role?.selected.length > 0,
            filter: (
                <ColumnFilterCombobox
                    label="Roles"
                    description="Filter by roles"
                    data={filterState?.role?.records || []}
                    value={filterState?.role?.selected || []}
                    placeholder="Search roles…"
                    onChange={(value) => {
                        setFilter('role', value)
                    }}
                    clearable
                    searchable
                />
            ),
        },
        {
            accessor: 'isBanned',
            title: 'Banned',
            sortable: true,
            render: ({isBanned}) => {
                return isBanned ? <Badge color={'red'}>Ban</Badge> : null;
            },
            filtering: filterState?.isBanned?.selected.length > 0,
            filter: (
                <ColumnFilterCombobox
                    label="Banned"
                    description="Filter by banned status"
                    data={filterState?.isBanned?.records || []}
                    value={filterState?.isBanned?.selected || []}
                    placeholder="Search banned status…"
                    onChange={(value) => {
                        setFilter('isBanned', value)
                    }}
                    clearable
                    searchable
                />
            ),

        },
        {
            accessor: 'isEmailActivated',
            title: 'Activation',
            sortable: true,
            render: ({isEmailActivated}) => {
                return isEmailActivated ? '🥨' : '';
            },
            filtering: filterState?.isEmailActivated?.selected.length > 0,
            filter: (
                <ColumnFilterCombobox
                    label="Activation"
                    description="Filter by activation status"
                    data={filterState?.isEmailActivated?.records || []}
                    value={filterState?.isEmailActivated?.selected || []}
                    placeholder="Search activation status…"
                    onChange={(value) => {
                        setFilter('isEmailActivated', value)
                    }}
                    clearable
                    searchable
                />
            ),
        },
        {
            accessor: 'actions',
            title: (
                <Center>
                    <IconEdit size={16}/>
                </Center>
            ),
            width: '0%',
            render: (record: User) => (
                <Group gap={4} justify="right" wrap="nowrap">
                    {record.isBanned ?
                        <Tooltip
                            openDelay={500}
                            label="Unban user">
                            <ActionIcon
                                size="sm"
                                color="black"
                                loading={isBanLoading}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    changeBanStatus({userId: record.id, flag: false});
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
                                loading={isBanLoading}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    changeBanStatus({userId: record.id, flag: true});
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
                            loading={isRemoveLoading}
                            onClick={(e) => {
                                e.stopPropagation();
                                removeUser(record.id);
                            }}
                        >
                            <IconBan size={16}/>
                        </ActionIcon>
                    </Tooltip>
                </Group>
            ),
        },
    ];

    return {
        data: users,
        sortStatus: sortState,
        setSortStatus: setSortState,
        columns,
        resetFilters,
        resetSorting,
        isAnyFilterActive
    }
};