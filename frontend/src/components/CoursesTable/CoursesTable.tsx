import { ActionIcon, Badge, Flex, Skeleton } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import clsx from 'clsx';
import { MantineReactTable, MRT_RowVirtualizer, useMantineReactTable } from 'mantine-react-table';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import classes from './CoursesTable.module.css';

import { useCoursesTableColumns } from '@/components/CoursesTable/useCoursesTableColumns.tsx';
import { CONTENT_TOP_SPACING, HEADER_HEIGHT, MAX_SITE_WIDTH, PAGE_SIZE } from '@/constants';
import { useSearchContext, useTableScrollContext } from '@/context';
import { Course } from '@/courses/types.ts';
import { usePaginatedCourses } from '@/courses/usePaginatedCourses.tsx';
import { useSearchCourses } from '@/courses/useSearchCourses.tsx';

function CoursesTable() {
    const [tableTopSpacing, setTableTopSpacing] = useState<number>(CONTENT_TOP_SPACING);
    const { scrollIndex, setScrollIndex } = useTableScrollContext();
    const tableContainerRef = useRef<HTMLDivElement>(null);
    const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null);
    const [records, setRecords] = useState<Course[]>([]);
    const { searchQuery, setSearchQuery } = useSearchContext();

    const {
        data: paginatedData,
        fetchNextPage: fetchPaginatedNextPage,
        isFetching: isPaginatedFetching,
        isLoading: isPaginatedLoading,
        isError: isPaginatedError,
        hasNextPage: hasPaginatedNextPage
    } = usePaginatedCourses();

    const {
        data: searchData,
        fetchNextPage: fetchSearchNextPage,
        hasNextPage: hasSearchNextPage,
        // isFetchingNextPage: isSearchFetchingNextPage,
        isFetching: isSearchFetching,
        isFetched: isSearchFetched
    } = useSearchCourses(searchQuery);

    const navigate = useNavigate();
    const location = useLocation();
    const { columns } = useCoursesTableColumns();

    useEffect(() => {
        const spacingTopBarDiff = !!searchQuery ? 0 : 25;
        setTableTopSpacing(spacingTopBarDiff);
    }, [searchQuery]);

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
            setSearchQuery(decodedSearchParam);
        } else {
            setSearchQuery('');
        }
    }, [location]);

    const fetchMoreOnBottomReached = useCallback(
        (containerRefElement?: HTMLDivElement | null) => {
            if (containerRefElement) {
                const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
                if (scrollHeight - scrollTop - clientHeight < clientHeight - tableTopSpacing - HEADER_HEIGHT && !isPaginatedFetching && !isSearchFetching) {
                    if (searchQuery) {
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

    useEffect(() => {
        if (rowVirtualizerInstanceRef.current) {
            if (scrollIndex && records.length) {
                rowVirtualizerInstanceRef.current?.scrollToIndex(scrollIndex, {
                    align: 'start',
                });
                setScrollIndex(0);
            }
        }
    }, [rowVirtualizerInstanceRef.current, records]);

    const handleRowClick = (record: Course) => {
        const dynamicPath = '/courses/' + record._id;
        setScrollIndex(rowVirtualizerInstanceRef.current.range.startIndex);
        navigate(dynamicPath);
    };

    const removeQuery = () => {
        setSearchQuery('');
        navigate('#');
    };

    const table = useMantineReactTable({
        // @ts-ignore
        columns,
        data: records,
        mantinePaperProps: {
            style: {
                marginTop: CONTENT_TOP_SPACING + 'px',
            },
            className: classes.tablePaper,
            withBorder: false,
        },
        mantineTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                if (row.original !== null) {
                    handleRowClick(row.original as Course);
                }
            },
            style:
                !records.length || isPaginatedLoading || isSearchFetching || row.original === null
                    ? {
                        pointerEvents: 'none',
                        cursor: 'not-allowed',
                    }
                    : {
                        pointerEvents: 'auto',
                        cursor: 'pointer',
                    },
        }),
        mantineTableHeadCellProps: {
            className: clsx(classes.tableHeadRow),
        },
        mantineTableBodyCellProps: ({ row }) => ({
            className: clsx(classes.tableCellRow),
            children: row.original === null ? <Skeleton h={30} /> : undefined,
        }),
        enablePagination: false,
        enableFilters: false,
        enableFullScreenToggle: false,
        enableTopToolbar: !!searchQuery,
        enableGlobalFilterModes: false,
        enableBottomToolbar: false,
        enableGlobalFilter: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableSorting: false,
        manualFiltering: true,
        enableRowVirtualization: true,
        mantineTableContainerProps: {
            style: {
                height: 'calc(100% - ' + (CONTENT_TOP_SPACING - tableTopSpacing) + 'px)',
                maxWidth: MAX_SITE_WIDTH + 'px',
                width: '100vw',
            },
            onScroll: (
                // @ts-ignore
                event: UIEvent<HTMLDivElement>,
            ) => fetchMoreOnBottomReached(event.target as HTMLDivElement),
            className: classes.tableContainer,
        },
        mantineToolbarAlertBannerProps: {
            color: 'red',
            children: 'Error loading data',
        },
        mantineTableProps: {
            highlightOnHover: true,
            striped: 'odd',
            withColumnBorders: true,
            withRowBorders: true,
            withTableBorder: true,
        },
        renderTopToolbar: () => {
            return (
                <Flex data-active={!!searchQuery} justify="space-between" align="center" className={classes.dataTableInfo}>
                    <Flex align="center" h="100%">
                        {searchQuery ? (
                            <>
                                <Badge color="green" radius="xs" fw={600}>
                                    <Flex align="center">
                                        {searchQuery}
                                        <ActionIcon p={0} m={0} variant="transparent" c="white" aria-label="Remove query" loading={isSearchFetching}>
                                            <IconX size={16} onClick={removeQuery} />
                                        </ActionIcon>
                                    </Flex>
                                </Badge>
                            </>
                        ) : null}
                    </Flex>
                </Flex>
            );
        },
        state: {
            showAlertBanner: isPaginatedError,
            isLoading: (isPaginatedLoading || records.length === 0) && !isSearchFetched,
        },
        rowVirtualizerInstanceRef,
        rowVirtualizerOptions: { overscan: 15 },
    });

    return (
        <>
            <MantineReactTable table={table} />
        </>
    );
}

export { CoursesTable };
