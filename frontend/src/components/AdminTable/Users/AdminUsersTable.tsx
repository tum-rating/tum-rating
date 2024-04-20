import {Badge, Box, Button, Flex, Group, Text, ActionIcon} from "@mantine/core";
import {IconFilterX, IconRefresh} from "@tabler/icons-react";
import {DataTable, DataTableProps} from "mantine-datatable";

import {useUsersColumns} from "./useUsersColumns.tsx"
import rowClasses from "../Shared/styles/RowStyles.module.css"

import {User} from "@/admin/types.ts";
import {useAllUsers} from "@/admin/useAllUsers.ts";
import {useBanUser} from "@/admin/useBanUser.tsx";
import classes from "@/components/AdminTable/Shared/styles/TableStyles.module.css";
import {UserExpansion} from "@/components/AdminTable/Users/UserExpansion.tsx";

const rowClassFn = (user: User) => {
    if (user.isBanned) {
        return rowClasses.redRow
    }
    if (user.role === 1) {
        return rowClasses.goldRow
    }
    return undefined
}

const AdminUsersTable = () => {
    const {isFetching, refetch} = useAllUsers();
    const {isLoading: banLoading} = useBanUser();

    const rowExpansion: DataTableProps<any>['rowExpansion'] = {
        allowMultiple: true,
        collapseProps: {
            transitionDuration: 0,
            animateOpacity: false,
            transitionTimingFunction: 'ease-out',
        },
        content: ({record}) => <UserExpansion user={record} editing={false}/>
    }

    const {data: users, sortStatus, setSortStatus, columns, resetFilters, isAnyFilterActive} = useUsersColumns()
    return (
        <Box h="calc(100vh-110px)">
            <Flex justify="space-between" align="center" h={50} px="xs" bg="gray.1">
                <Flex gap="4" align="center">
                    <Badge radius="sm" fw={800} c="white" px={6}>
                        {(isFetching || banLoading) ? "..." : users?.length}
                    </Badge>
                    <Text fw={600}>
                        Users
                    </Text>
                </Flex>
                <Group>
                    {isAnyFilterActive && (
                        <>
                            <Box visibleFrom="xs">
                                <Button
                                    variant="light"
                                    size="xs"
                                    rightSection={<IconFilterX size={16}/>}
                                    onClick={() => resetFilters()}>
                                    Reset filters
                                </Button>
                            </Box>
                            <Box hiddenFrom="xs">
                                <ActionIcon
                                    variant="light"
                                    onClick={() => resetFilters()}>
                                    <IconFilterX size={16}/>
                                </ActionIcon>
                            </Box>
                        </>
                    )}
                    <Box visibleFrom="xs">
                        <Button
                            variant="light"
                            size="xs"
                            rightSection={<IconRefresh size={16}/>}
                            onClick={() => refetch()}>
                            Refresh
                        </Button>
                    </Box>
                    <Box hiddenFrom="xs">
                        <ActionIcon
                            variant="light"
                            onClick={() => refetch()}>
                            <IconRefresh size={16}/>
                        </ActionIcon>
                    </Box>
                </Group>
            </Flex>
            <DataTable
                height={100}
                withTableBorder
                withColumnBorders
                idAccessor='_id'
                striped
                pinLastColumn
                fetching={isFetching || banLoading}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                rowClassName={(record) => rowClassFn(record)}
                className={classes.table}
                rowExpansion={rowExpansion}
                records={users}
                columns={columns}
            />
        </Box>
    );
}

export {AdminUsersTable};