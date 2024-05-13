import {Badge, Box, Flex, Group, Text} from '@mantine/core';
import clsx from "clsx";
import {
    MantineReactTable,
    MRT_GlobalFilterTextInput,
    MRT_RowVirtualizer,
    MRT_ShowHideColumnsButton,
    MRT_ToggleFiltersButton,
    MRT_ToggleFullScreenButton,
    MRT_ToggleGlobalFilterButton,
    useMantineReactTable
} from "mantine-react-table";
import {useCallback, useEffect, useRef, useState} from 'react';
import {useLocation} from "react-router-dom";

import classes from '../Shared/styles/TableStyles.module.css';

import {useCourses} from "@/admin/useCourses.tsx";
import {CourseExpansion} from '@/components/AdminTable/Courses/CourseExpansion.tsx';
import {useCoursesTableColumns} from "@/components/CoursesTable/useCoursesTableColumns.tsx";
import {HEADER_HEIGHT, PAGE_SIZE} from "@/constants";
import {Course} from "@/courses/types.ts";
import {useSearchCourses} from "@/courses/useSearchCourses.tsx";



const AdminCoursesTable = () => {
    const [skeletonLoaders, setSkeletonLoaders] = useState([]);
    const tableContainerRef = useRef<HTMLDivElement>(null); //we can get access to the underlying TableContainer element and react to its scroll events
    const [records, setRecords] = useState<Course[]>([]);
    const [queryRecords, setQueryRecords] = useState<Course[]>([]);

    const [query, setQuery] = useState('');
    const {
        data,
        fetchNextPage,
        isFetching,
        isLoading,
        hasNextPage
    } = useCourses();
    const {data: queryData, isFetching: isQueryDataFetching} = useSearchCourses(query);
    const location = useLocation();
    const {columns} = useCoursesTableColumns();

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
                    scrollHeight - scrollTop - clientHeight < clientHeight - 110 - HEADER_HEIGHT && !isFetching
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

    useEffect(() => {
        fetchMoreOnBottomReached(tableContainerRef.current);
    }, [fetchMoreOnBottomReached]);


    const table = useMantineReactTable({
        columns,
        data: query ? queryRecords : [...records,...skeletonLoaders],
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
        manualFiltering: true, //turn off client-side filtering
        onGlobalFilterChange: setQuery, //hoist internal global state to your state
        state: {isLoading: isLoading || isQueryDataFetching},
        initialState: {
            globalFilter: query,
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
                            {records.length}
                        </Badge>
                        <Text fw={600}>Active courses</Text>
                    </Flex>
                </Flex>

                <MRT_GlobalFilterTextInput size="sm" variant="default" hidden={false} table={table}/>
                <Group gap="xs">
                    <MRT_ToggleGlobalFilterButton size="lg" variant="default" table={table}/>
                    <MRT_ToggleFiltersButton size="lg" variant="default" table={table}/>
                    <MRT_ShowHideColumnsButton size="lg" variant="default" table={table}/>
                    <MRT_ToggleFullScreenButton size="lg" variant="default" table={table}/>
                    {/*    <Tooltip label="Refresh proposals">*/}
                    {/*        <ActionIcon size="lg" variant="default" onClick={() => refetch()}>*/}
                    {/*            <IconRefresh size={20}/>*/}
                    {/*        </ActionIcon>*/}
                    {/*    </Tooltip>*/}
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
        renderDetailPanel: ({row}) => <CourseExpansion course={row.original} row={row}/>
    });

    return (
        <Box h="calc(100vh-110px)">
            <MantineReactTable
                table={table}
            />
        </Box>
    );
};

export {AdminCoursesTable};
