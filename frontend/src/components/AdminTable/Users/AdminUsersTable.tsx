import {ActionIcon, Box, Flex, Text} from "@mantine/core";
import {IconRefresh} from "@tabler/icons-react";
import sortBy from 'lodash/sortBy';
import {DataTable, DataTableProps, DataTableSortStatus} from "mantine-datatable";
import {useEffect, useState} from "react";

import {columns} from "./columns.tsx"
import rowClasses from "../Shared/styles/RowStyles.module.css"

import {useBanUser} from "@/admin/banUser.ts";
import {User} from "@/admin/types.ts";
import {useAllUsers} from "@/admin/useAllUsers.ts";
import {useRemoveUser} from "@/admin/useRemoveUser.ts";
import {UserExpansion} from "@/components/AdminTable/Users/UserExpansion.tsx";

const AdminUsersTable = () => {
    const {data, isFetching, refetch, isFetched} = useAllUsers();
    const {mutate: removeUser} = useRemoveUser();
    const {mutate: banUser} = useBanUser()
    const [users, setUsers] = useState([]);
    const [userColumns, setUsersColumns] = useState([]);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<User>>(null);
    useEffect(() => {
        if (data && sortStatus) {
            const sortedData = sortBy(data, (item: User) => {
                const value = item[sortStatus.columnAccessor];
                if (Array.isArray(value)) {
                    return value.join('');
                }
                return value;
            }) as User[];
            setUsers(sortStatus.direction === 'desc' ? sortedData.reverse() : sortedData);
        }
    }, [sortStatus]);

    useEffect(() => {
        if (isFetched && data?.users) {
            setUsers(data.users || []);
        }
    }, [data]);

    useEffect(() => {
        setUsersColumns(columns({
            onRemove: (id) => removeUser(id),
            onBan: (id) => banUser({userId: id, flag: true}),
            onUnban: (id) => banUser({userId: id, flag: false})
        }))
    }, []);


    const rowExpansion: DataTableProps<any>['rowExpansion'] = {
        allowMultiple: true,
        content: ({record}) => <UserExpansion user={record} editing={false}/>
    }

    return (
        <Box h="calc(100vh - 240px)">
            <Text fw={600}>
                Courses Proposals
            </Text>
            <Flex justify="space-between" align="center" h={50} pr="xs">
                <Flex gap="xs">
                    <Text size="sm" fw={500}>
                        All Users:
                    </Text>
                    <Text size="sm" fw={800}>
                        {users.length}
                    </Text>
                </Flex>
                <ActionIcon
                    variant="light"
                    size="xs"
                    onClick={() => refetch()}>
                    <IconRefresh size={16}/>
                </ActionIcon>
            </Flex>
            <DataTable
                withTableBorder
                borderRadius="sm"
                withColumnBorders
                idAccessor='_id'
                striped
                pinLastColumn
                rowClassName={({isBanned}) => (isBanned ? rowClasses.redRow : undefined)}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                fetching={isFetching}
                records={users}
                columns={userColumns}
                rowExpansion={rowExpansion}
            />
        </Box>
    );
}

export {AdminUsersTable};