import {ActionIcon, Badge, Flex, Skeleton} from "@mantine/core";
import {useCallback, useEffect, useRef, useState} from 'react'
import {useLocation, useNavigate} from "react-router-dom";

import classes from './CoursesTable.module.css';
import {CONTENT_TOP_SPACING, HEADER_HEIGHT, MAX_SITE_WIDTH, PAGE_SIZE} from "@/constants";
import {Course} from "@/courses/types.ts";
import {usePaginatedCourses} from "@/courses/usePaginatedCourses.tsx";
import {MantineReactTable, MRT_RowVirtualizer, useMantineReactTable} from "mantine-react-table";
import {useSearchCourses} from "@/courses/useSearchCourses.tsx";
import {useCoursesTableColumns} from "@/components/CoursesTable/useCoursesTableColumns.tsx";
import city from "@/assets/img/city.png";
import {IconX} from "@tabler/icons-react";
import {useTableScrollContext} from "@/context";
import clsx from "clsx";

function CoursesTable() {

    const [contentTopSpacing, setContentTopSpacing] = useState<number>(CONTENT_TOP_SPACING);
    const {scrollIndex, setScrollIndex} = useTableScrollContext();
    const [skeletonLoaders, setSkeletonLoaders] = useState([]);
    const tableContainerRef = useRef<HTMLDivElement>(null); //we can get access to the underlying TableContainer element and react to its scroll events
    const rowVirtualizerInstanceRef = useRef<MRT_RowVirtualizer>(null); //we can get access to the underlying Virtualizer instance and call its scrollToIndex method
    const [records, setRecords] = useState<Course[]>([]);
    const [queryRecords, setQueryRecords] = useState<Course[]>([]);

    const {
        data,
        fetchNextPage,
        isFetching,
        isLoading,
        isError,
        hasNextPage
    } = usePaginatedCourses();
    const [query, setQuery] = useState('');
    const {data: queryData, isFetching: isQueryDataFetching} = useSearchCourses(query);
    const navigate = useNavigate();
    const location = useLocation();
    const {columns} = useCoursesTableColumns();

    useEffect(() => {
        const spacingTopBarDiff = !!query ? 0 : 15;
        setContentTopSpacing(spacingTopBarDiff)
    }, [query]);

    useEffect(() => {
        if (data) {
            const newRecords = data.pages.map((v) => v.courses.map((el) => el)).flat();
            setRecords([...newRecords]);
            // Remove skeleton loaders
            setSkeletonLoaders([]);
        }
    }, [data]);

    useEffect(() => {
        if (queryData) {
            const newRecords = queryData.courses;
            setQueryRecords([...newRecords]);
        }
    }, [queryData]);

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
                const {scrollHeight, scrollTop, clientHeight} = containerRefElement;
                if (
                    scrollHeight - scrollTop - clientHeight < clientHeight - contentTopSpacing - HEADER_HEIGHT && !isFetching
                ) {
                    // Add skeleton loaders
                    if (hasNextPage) {
                        const newSkeletonLoaders = Array(PAGE_SIZE).fill(null);
                        setSkeletonLoaders(prevSkeletonLoaders => [...prevSkeletonLoaders, ...newSkeletonLoaders]);
                    }

                    fetchNextPage();
                }
            }
        },
        [fetchNextPage, isFetching],
    );


    //a check on mount to see if the table is already scrolled to the bottom and immediately needs to fetch more data
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
        setQuery('');
        navigate('/');
    };

    const table = useMantineReactTable({
        // @ts-ignore
        columns,
        data: query ? queryRecords : [...records,...skeletonLoaders],
        mantinePaperProps: {
            style: {
                marginTop: CONTENT_TOP_SPACING + 'px',
            },
            className: classes.tablePaper,
        },
        mantineTableBodyRowProps: ({row}) => ({
            onClick: () => {
                if (row.original !== null) {
                    handleRowClick(row.original as Course)
                }
            },
            style: !records.length || isLoading || row.original === null ? {
                pointerEvents: 'none',
                cursor: 'not-allowed',
            } : {
                pointerEvents: 'auto',
                cursor: 'pointer',
            }
        }),
        mantineTableHeadCellProps: {
            className: clsx(classes.tableHeadRow),
        },
        headCellProps: {
            className: clsx(classes.tableHeadRow),
        },
        mantineTableBodyCellProps: ({row}) => ({
            className: clsx(classes.tableCellRow),
            children: row.original === null ? <Skeleton h={30} /> : undefined,
        }),
        enablePagination: false,
        enableFilters: false,
        enableFullScreenToggle: false,
        enableTopToolbar: !!query,
        enableGlobalFilterModes: false,
        enableBottomToolbar: false,
        enableGlobalFilter: false,
        enableColumnActions: false,
        enableColumnFilters: false,
        enableSorting: false,
        manualFiltering: true,
        enableRowVirtualization: true,
        mantineTableContainerProps: {
            // ref: tableContainerRef, //get access to the table container element
            style: {
                maxHeight: 'calc(100% - ' + ((CONTENT_TOP_SPACING - contentTopSpacing)) + 'px)',
                maxWidth: MAX_SITE_WIDTH + 'px',
                width: '100vw',
            }, //give the table a max height
            onScroll: (
                // @ts-ignore
                event: UIEvent<HTMLDivElement>, //add an event listener to the table container element
            ) => fetchMoreOnBottomReached(event.target as HTMLDivElement),
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
                <Flex
                    data-active={!!query}
                    justify="space-between"
                    align="center"
                    className={classes.dataTableInfo}
                    style={{
                        backgroundImage: `url(${city})`,
                    }}
                >
                    <Flex align="center" h="100%">
                        {query ? (
                            <>
                                <Badge color="green" radius="xs" fw={600}>
                                    <Flex align="center">
                                        {query}
                                        <ActionIcon p={0} m={0} variant="transparent" c="white"
                                                    aria-label="Remove query" loading={isQueryDataFetching}>
                                            <IconX size={16} onClick={removeQuery}/>
                                        </ActionIcon>
                                    </Flex>
                                </Badge>
                            </>
                        ) : null}
                    </Flex>
                </Flex>
            )
        },
        state: {
            showAlertBanner: isError,
            isLoading: isLoading || records.length === 0,
        },
        rowVirtualizerInstanceRef,
        rowVirtualizerOptions: {overscan: 15},
    });

    return <>
        <MantineReactTable table={table}/>
    </>

}

export {CoursesTable}