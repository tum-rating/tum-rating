import { ActionIcon, Badge, Box, Flex, Group, Skeleton, Text, Tooltip } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import clsx from 'clsx';
import { MantineReactTable, MRT_GlobalFilterTextInput, MRT_ShowHideColumnsButton, MRT_ToggleFiltersButton, MRT_ToggleFullScreenButton, MRT_ToggleGlobalFilterButton, useMantineReactTable } from 'mantine-react-table';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useCoursesColumns } from './useCoursesColumns.tsx';
import classes from '../Shared/styles/TableStyles.module.css';

import { useCourses as usePaginatedCourses } from '@/admin/useCourses.tsx';
import { CourseExpansion } from '@/components/AdminTable/Courses/CourseExpansion.tsx';
import { HEADER_HEIGHT, PAGE_SIZE } from '@/constants';
import { Course } from '@/courses/types.ts';
import { useSearchCourses } from '@/courses/useSearchCourses.tsx';

const AdminCoursesTable = () => {
    const tableContainerRef = useRef<HTMLDivElement>(null); //we can get access to the underlying TableContainer element and react to its scroll events
    const [records, setRecords] = useState<Course[]>([]);

    const [query, setQuery] = useState('');
    const { data: paginatedData, fetchNextPage: fetchPaginatedNextPage, isFetching: isPaginatedFetching, isLoading: isPaginatedLoading, isError: isPaginatedError, hasNextPage: hasPaginatedNextPage, refetch: refetchPaginatedData } = usePaginatedCourses();
    const { data: searchData, fetchNextPage: fetchSearchNextPage, hasNextPage: hasSearchNextPage, isFetching: isSearchFetching, isFetched: isSearchFetched, refetch: refetchSearchQuery } = useSearchCourses(query);
    const location = useLocation();
    const { columns } = useCoursesColumns();

    useEffect(() => {
        if (paginatedData) {
            const newRecords = paginatedData.pages.map((v) => v.courses.map((el) => el)).flat();
            setRecords([...newRecords]);
        }
    }, [paginatedData]);

    useEffect(() => {
        if (searchData) {
            const newRecords = searchData.pages.map((v) => v.courses.map((el) => el)).flat();
            setRecords([...newRecords]);
        } else {
            if (paginatedData) {
                const newRecords = paginatedData.pages.map((v) => v.courses.map((el) => el)).flat();
                setRecords([...newRecords]);
            }
        }
    }, [searchData]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchParam = params.get('search');
        if (searchParam) {
            const decodedSearchParam = decodeURIComponent(searchParam);
            setQuery(decodedSearchParam);
        } else {
            setQuery('');
        }
    }, [location]);

    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
            if (containerRefElement) {
                const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
                if (scrollHeight - scrollTop - clientHeight < clientHeight - 110 - HEADER_HEIGHT && !isSearchFetching) {
                    if (query) {
                        if (hasSearchNextPage) {
                            const newSkeletonLoaders = Array(PAGE_SIZE).fill(null);
                            setRecords((prevRecords) => [...prevRecords, ...newSkeletonLoaders]);
                        }
                        fetchSearchNextPage();
                    } else {
                        if (hasPaginatedNextPage) {
                            const newSkeletonLoaders = Array(PAGE_SIZE).fill(null);
                            setRecords((prevRecords) => [...prevRecords, ...newSkeletonLoaders]);
                        }
                        fetchPaginatedNextPage();
                    }
                }
            }
        },
        [fetchPaginatedNextPage, fetchSearchNextPage, isPaginatedFetching, isSearchFetching],
    );

    useEffect(() => {
        fetchMoreOnBottomReached(tableContainerRef.current);
    }, [fetchMoreOnBottomReached]);

    const table = useMantineReactTable({
        columns,
        data: records,
        enableBottomToolbar: false,
        enableGlobalFilterModes: true,
        enablePagination: false,
        enableRowVirtualization: true,
        enableFilters: false,
        enableSorting: false,
        mantineTableProps: {
            striped: 'odd',
            withColumnBorders: true,
            highlightOnHover: false,
            withRowBorders: true,
            withTableBorder: true,
        },
        manualFiltering: true, //turn off client-side filtering
        onGlobalFilterChange: setQuery, //hoist internal global state to your state
        state: {
            showAlertBanner: isPaginatedError,
            isLoading: (isPaginatedLoading || records.length === 0) && !isSearchFetched,
        },
        initialState: {
            globalFilter: query,
            density: 'xs',
            showGlobalFilter: true,
        },
        mantineTableContainerProps: () => ({
            className: clsx(classes.table),
            onScroll: (
                // @ts-ignore
                event: UIEvent<HTMLDivElement>,
            ) => fetchMoreOnBottomReached(event.target as HTMLDivElement),
        }),
        mantineTableBodyCellProps: ({ row }) => ({
            className: clsx(classes.tableCellRow),
            children: row.original === null ? <Skeleton h={30} /> : undefined,
        }),
        displayColumnDefOptions: {
            'mrt-row-expand': {
                grow: false,
            },
        },
        renderTopToolbar: ({ table }) => (
            <Flex justify="space-between" align="center" h={50} px="xs" bg="gray.1">
                <Flex gap="xs">
                    <Flex gap="6" align="center" mr="auto">
                        <Badge radius="sm" fw={800} c="white" px={6}>
                            {records.length}
                        </Badge>
                        <Text fw={600}>Active courses</Text>
                    </Flex>
                </Flex>

                <MRT_GlobalFilterTextInput size="sm" variant="default" hidden={false} table={table} />
                <Group gap="xs">
                    <MRT_ToggleGlobalFilterButton size="lg" variant="default" table={table} />
                    <MRT_ToggleFiltersButton size="lg" variant="default" table={table} />
                    <MRT_ShowHideColumnsButton size="lg" variant="default" table={table} />
                    <MRT_ToggleFullScreenButton size="lg" variant="default" table={table} />
                    <Tooltip label="Refresh proposals">
                        <ActionIcon
                            size="lg"
                            variant="default"
                            onClick={() => {
                                if (!query) {
                                    refetchPaginatedData();
                                } else {
                                    refetchSearchQuery();
                                }
                            }}
                        >
                            <IconRefresh size={20} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Flex>
        ),
        rowVirtualizerOptions: { overscan: 25 },
        mantineDetailPanelProps: {
            style: {
                width: '100%',
                padding: '0 !important',
                margin: 0,
            },
        },
        renderDetailPanel: ({ row }) => <CourseExpansion key={row.original._id} course={row.original} row={row} />,
    });

    return (
        <Box h="calc(100vh-110px)">
            <MantineReactTable table={table} />
        </Box>
    );
};

export { AdminCoursesTable };
