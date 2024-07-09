import {ActionIcon, Badge, Box, Flex, Text, Tooltip} from '@mantine/core';
import {IconPlus} from '@tabler/icons-react';
import clsx from 'clsx';
import {MantineReactTable, useMantineReactTable} from 'mantine-react-table';
import {useNavigate} from 'react-router-dom';

import classes from '../Shared/styles/TableStyles.module.css';

import {useCoursesProposals} from '@/admin/useCoursesProposals.ts';
import {ProposalExpansion} from '@/components/AdminTable/CoursesProposals/ProposalExpansion.tsx';
import {useProposalsColumns} from '@/components/AdminTable/CoursesProposals/useProposalsColumns.tsx';
import {TableToolbox} from '@/components/AdminTable/Shared/TableToolbox';

const AdminCoursesProposalsTable = () => {
    const navigate = useNavigate();
    const {data, isLoading, refetch} = useCoursesProposals();
    const {columns} = useProposalsColumns();

    const table = useMantineReactTable({
        columns,
        data,
        enableBottomToolbar: false,
        enableGlobalFilterModes: true,
        enablePagination: false,
        enableRowVirtualization: true,
        mantineTableProps: {
            striped: 'odd',
            withColumnBorders: true,
            highlightOnHover: false,
            withRowBorders: true,
            withTableBorder: true,
        },
        state: {isLoading},
        initialState: {
            density: 'xs',
            showGlobalFilter: true,
        },
        mantineTableContainerProps: () => ({
            className: clsx(classes.table),
        }),
        mantineTableBodyCellProps: () => ({
            className: clsx(classes.tableCellRow),
        }),
        displayColumnDefOptions: {
            'mrt-row-expand': {
                grow: false,
            },
        },
        rowVirtualizerOptions: {overscan: 15},
        renderTopToolbar: ({table}) => (
            <Flex justify="space-between" align="center" h={50} px="xs" bg="gray.1">
                <Flex gap="xs" w={240}>
                    <Flex gap="6" align="center" mr="auto">
                        <Badge radius="sm" fw={800} c="white" px={6}>
                            {data.length}
                        </Badge>
                        <Text lineClamp={2} fw={600} className={classes.tableHeaderText}>
                            Active proposals
                        </Text>
                    </Flex>
                    <Tooltip label="Add course proposal" openDelay={400}>
                        <ActionIcon variant="lg" onClick={() => navigate('#modal=add-course')} visibleFrom={'sm'}>
                            <IconPlus size={20}/>
                        </ActionIcon>
                    </Tooltip>
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
        renderDetailPanel: ({row}) => <ProposalExpansion key={row.original.id} courseProposalId={row.original.id}
                                                         row={row}/>,
    });

    return (
        <Box h="calc(100vh-110px)">
            <MantineReactTable table={table}/>
        </Box>
    );
};

export {AdminCoursesProposalsTable};
