import {Badge, Box, Flex, Skeleton, Text} from '@mantine/core';
import {useDebouncedState} from '@mantine/hooks';
import clsx from 'clsx';
import {MantineReactTable, useMantineReactTable} from 'mantine-react-table';
import {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router-dom';

import {useReviewsColumns} from './useReviewsColumns.tsx';
import classes from '../Shared/styles/TableStyles.module.css';

import {Review} from "@/admin/types.ts";
import {useReviews} from "@/admin/reviews/useReviews.ts";
import {ReviewExpansion} from "@/components/AdminTable/Reviews/ReviewExpansion.tsx";
import {TableToolbox} from '@/components/AdminTable/Shared/TableToolbox';
import {HEADER_HEIGHT, PAGE_SIZE} from '@/constants';

const AdminReviewsTable = () => {
    const tableContainerRef = useRef<HTMLDivElement>(null); //we can get access to the underlying TableContainer element and react to its scroll events
    const [records, setRecords] = useState<Review[]>([]);

    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useDebouncedState('', 350);

    const {data: searchData, isError: isSearchDataError, isLoading: isSearchDataLoading, fetchNextPage: fetchSearchNextPage, hasNextPage: hasSearchNextPage, isFetching: isSearchFetching, isFetched: isSearchFetched, refetch: refetchSearchQuery} = useReviews({query: debouncedQuery});
    const location = useLocation();
    const {columns} = useReviewsColumns();
    useEffect(() => {
        if (searchData) {
            const newRecords = searchData.pages.map((v) => v.results.map((el) => el)).flat();
            setRecords([...newRecords]);
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

    useEffect(() => {
        setDebouncedQuery(query);
    }, [query]);

    let fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
            if (containerRefElement) {
                const {scrollHeight, scrollTop, clientHeight} = containerRefElement;
                if (scrollHeight - scrollTop - clientHeight < clientHeight - 110 - HEADER_HEIGHT && !isSearchFetching) {
                    if (hasSearchNextPage) {
                        const newSkeletonLoaders = Array(PAGE_SIZE).fill(null);
                        setRecords((prevRecords) => [...prevRecords, ...newSkeletonLoaders]);
                    }
                    fetchSearchNextPage();
                }
            }
        },
        [fetchSearchNextPage, isSearchFetching],
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
        manualFiltering: true,
        onGlobalFilterChange: (value) => {
            setQuery(value ? value : '');
        },
        state: {
            showAlertBanner: isSearchDataError,
            isLoading: (isSearchDataLoading || records.length === 0) && !isSearchFetched,
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
        mantineTableBodyCellProps: ({row}) => ({
            className: clsx(classes.tableCellRow),
            children: row.original === null ? <Skeleton h={30} /> : undefined,
        }),
        displayColumnDefOptions: {
            'mrt-row-expand': {
                grow: false,
            },
        },
        renderTopToolbar: ({table}) => (
            <Flex justify="space-between" align="center" h={50} px="xs" bg="gray.1">
                <Flex gap="xs">
                    <Flex gap="6" align="center" mr="auto">
                        <Badge radius="sm" fw={800} c="white" px={6}>
                            {records.length}
                        </Badge>
                        <Text lineClamp={2} fw={600} className={classes.tableHeaderText}>
                            Active reviews
                        </Text>
                    </Flex>
                </Flex>
                <TableToolbox
                    table={table}
                    config={{
                        tableFilters: false,
                    }}
                    customActions={{
                        refresh: refetchSearchQuery,
                    }}
                />
            </Flex>
        ),
        rowVirtualizerOptions: {overscan: 25},
        mantineDetailPanelProps: {
            style: {
                width: '100%',
                padding: '0 !important',
                margin: 0,
            },
        },
        renderDetailPanel: ({row}) => <ReviewExpansion key={row.original.id} courseId={row.original.id} row={row} />,
    });

    return (
        <Box h="calc(100vh-110px)">
            <MantineReactTable table={table} />
        </Box>
    );
};

export {AdminReviewsTable};
