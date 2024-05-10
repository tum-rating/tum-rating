import {ActionIcon, Badge, Box, Flex, Group, Text, Tooltip} from '@mantine/core';
import {IconPlus, IconRefresh} from '@tabler/icons-react';
import clsx from "clsx";
import {
    MantineReactTable,
    MRT_GlobalFilterTextInput,
    type MRT_RowVirtualizer,
    MRT_ShowHideColumnsButton,
    type MRT_SortingState,
    MRT_ToggleFiltersButton,
    MRT_ToggleFullScreenButton,
    MRT_ToggleGlobalFilterButton,
    useMantineReactTable,
} from 'mantine-react-table';
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

import classes from "../Shared/styles/TableStyles.module.css"

import {useCoursesProposals} from '@/admin/useCoursesProposals.ts';
import {ProposalExpansion} from '@/components/AdminTable/CoursesProposals/ProposalExpansion.tsx';
import {useProposalsColumns} from '@/components/AdminTable/CoursesProposals/useProposalsColumns.tsx';
import {getPath, Paths} from "@/routes/paths.ts";

const AdminCoursesProposalsTable = () => {
    const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
    const navigate = useNavigate();
    const {data, isLoading, refetch} = useCoursesProposals();
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const {
        columns,
    } = useProposalsColumns();


    useEffect(() => {
        try {
            //scroll to the top of the table when the sorting changes
            rowVirtualizerInstanceRef.current?.scrollToIndex(0);
        } catch (e) {
        }
    }, [sorting]);


    const table = useMantineReactTable({
        columns,
        data,
        enableBottomToolbar: false,
        enableGlobalFilterModes: true,
        enablePagination: false,
        enableRowVirtualization: true,
        onSortingChange: setSorting,
        mantineTableProps: {
            striped: 'odd',
            withColumnBorders: true,
            highlightOnHover: false,
            withRowBorders: true,
            withTableBorder: true,
        },
        state: {isLoading, sorting},
        initialState: {
            density: "xs",
            showGlobalFilter: true,
        },
        mantineTableContainerProps: () => ({
            className: clsx(classes.table)
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
                <Flex gap="xs">
                    <Flex gap="6" align="center" mr="auto">
                        <Badge radius="sm" fw={800} c="white" px={6}>
                            {data.length}
                        </Badge>
                        <Text fw={600}>Active proposals</Text>
                    </Flex>
                    <Tooltip label="Add course proposal" openDelay={400}>
                        <ActionIcon variant="light" onClick={() => navigate(getPath(Paths.addCourse))}>
                            <IconPlus size={16}/>
                        </ActionIcon>
                    </Tooltip>
                </Flex>
                <MRT_GlobalFilterTextInput size="sm" variant="default" hidden={false} table={table}/>
                <Group gap="xs">
                    <MRT_ToggleGlobalFilterButton size="lg" variant="default" table={table}/>
                    <MRT_ToggleFiltersButton size="lg" variant="default" table={table}/>
                    <MRT_ShowHideColumnsButton size="lg" variant="default" table={table}/>
                    <MRT_ToggleFullScreenButton size="lg" variant="default" table={table}/>
                    <Tooltip label="Refresh proposals">
                        <ActionIcon size="lg" variant="default" onClick={() => refetch()}>
                            <IconRefresh size={20}/>
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Flex>
        ),
        mantineDetailPanelProps: {
            style: {
                width: "100%",
                padding: "0 !important",
                margin: 0
            },
        },
        renderDetailPanel: ({row}) => <ProposalExpansion proposal={row.original} row={row}/>
    });


    return (
        <Box h="calc(100vh-110px)">
            <MantineReactTable
                table={table}
            />
        </Box>
    );
};

export {AdminCoursesProposalsTable};
