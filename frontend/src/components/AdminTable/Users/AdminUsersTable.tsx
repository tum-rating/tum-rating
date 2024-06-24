import { Badge, Box, Flex, Text } from '@mantine/core';
import clsx from 'clsx';
import { MantineReactTable, MRT_RowVirtualizer, MRT_SortingState, useMantineReactTable } from 'mantine-react-table';
import { useRef, useState } from 'react';

import { useUsersColumns } from './useUsersColumns.tsx';
import rowClasses from '../Shared/styles/RowStyles.module.css';

import { User } from '@/admin/types.ts';
import { useAllUsers } from '@/admin/useAllUsers.ts';
import { useBanUser } from '@/admin/useBanUser.tsx';
import classes from '@/components/AdminTable/Shared/styles/TableStyles.module.css';
import { TableToolbox } from '@/components/AdminTable/Shared/TableToolbox';
import { UserExpansion } from '@/components/AdminTable/Users/UserExpansion.tsx';

const rowClassFn = (user: User) => {
    if (user.isBanned) {
        return rowClasses.redRow;
    }
    if (user.role === 1) {
        return rowClasses.goldRow;
    }
    return rowClasses.grayRow;
};

const AdminUsersTable = () => {
    const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
    const { data, isLoading, refetch } = useAllUsers();
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const { isLoading: banLoading } = useBanUser();
    const { columns } = useUsersColumns();

    const table = useMantineReactTable({
        columns,
        data,
        enableBottomToolbar: false,
        enableGlobalFilterModes: true,
        enablePagination: false,
        enableRowVirtualization: true,
        onSortingChange: setSorting,
        mantineTableProps: {
            withColumnBorders: true,
            highlightOnHover: false,
            withRowBorders: true,
            withTableBorder: true,
        },
        state: { isLoading: isLoading || banLoading, sorting },
        initialState: {
            density: 'xs',
            showGlobalFilter: true,
        },
        mantineTableContainerProps: () => ({
            className: clsx(classes.table),
        }),
        mantineTableBodyCellProps: ({ row }) => ({
            className: clsx(classes.tableCellRow, rowClassFn(row.original)),
        }),
        displayColumnDefOptions: {
            'mrt-row-expand': {
                grow: false,
            },
        },
        rowVirtualizerOptions: { overscan: 15 },
        renderTopToolbar: ({ table }) => (
            <Flex justify="space-between" align="center" h={50} px="xs" bg="gray.1">
                <Flex gap="xs">
                    <Flex gap="6" align="center" mr="auto">
                        <Badge radius="sm" fw={800} c="white" px={6}>
                            {data.length}
                        </Badge>
                        <Text lineClamp={2} fw={600} className={classes.tableHeaderText}>
                            Active users
                        </Text>
                    </Flex>
                </Flex>
                <TableToolbox
                    table={table}
                    customActions={{
                        refresh: refetch,
                    }}
                />
            </Flex>
        ),

        mantineDetailPanelProps: {
            style: {
                width: '100%',
                padding: '0 !important',
                margin: 0,
            },
        },
        rowVirtualizerInstanceRef,
        renderDetailPanel: ({ row }) => <UserExpansion key={row.original.id} row={row} userId={row.original.id} />,
    });

    return (
        <Box h="calc(100vh-110px)">
            <MantineReactTable table={table} />
        </Box>
    );
};

export { AdminUsersTable };
