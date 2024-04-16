import {ActionIcon, Badge, Box, Flex} from '@mantine/core';
import {useMediaQuery} from "@mantine/hooks";
import {IconX} from "@tabler/icons-react";
import {DataTable} from 'mantine-datatable';
import {useEffect, useMemo, useRef, useState} from 'react';
import {isMobile} from 'react-device-detect';
import {useLocation, useNavigate} from 'react-router-dom';

import classes from './CoursesTable.module.css';

import city from '@/assets/img/city.png';
import {columns} from '@/components/CoursesTable/Columns';
import {useTableScrollContext} from '@/context';
import {Course} from '@/courses/types';
import {usePaginatedCourses} from '@/courses/usePaginatedCourses';
import {useSearchCourses} from '@/courses/useSearchCourses.tsx';


const CoursesTable = () => {
    const columnsConfiguration = useMemo(() => {
        if (isMobile) {
            return columns.filter((x) => x.accessor !== 'professor');
        }
        return columns;
    }, []);
    const [records, setRecords] = useState<Course[]>([]);
    const [queryRecords, setQueryRecords] = useState<Course[]>([]);
    const [internalLoading, setInternalLoading] = useState(true);
    const {data, fetchNextPage, isFetching} = usePaginatedCourses();
    const [query, setQuery] = useState('');
    const {data: queryData, isFetching: isQueryDataFetching} = useSearchCourses(query);
    const navigate = useNavigate();
    const location = useLocation();
    const scrollViewportRef = useRef<HTMLDivElement>(null);
    const {scrollY, setScrollY} = useTableScrollContext();
    const matches = useMediaQuery('(min-width: 48em)');

    useEffect(() => {
        if (data) {
            const newRecords = data.pages.map((v) => v.courses.map((el) => el)).flat();
            setRecords([...newRecords]);
            setInternalLoading(false);
        }
    }, [data]);
    useEffect(() => {
        if (queryData) {
            const newRecords = queryData.courses;
            setQueryRecords([...newRecords]);
            setInternalLoading(false);
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

    useEffect(() => {
        if (scrollViewportRef.current) {
            scrollViewportRef.current?.scrollTo(0, scrollY);
        }
    }, [scrollViewportRef.current]);

    const loadMoreRecords = () => {
        fetchNextPage().then(() => {
        });
    };

    const handleRowClick = (record: Course) => {
        const dynamicPath = '/courses/' + record._id;
        setScrollY(scrollViewportRef.current.scrollTop);
        navigate(dynamicPath);
    };

    const removeQuery = () => {
        setQuery('');
        navigate('/');
    };

    return (
        <>
            <Box className={classes.dataTableContainer}>
                <Flex data-active={!!query} justify="space-between" align="center" className={classes.dataTableInfo}
                      style={{
                          backgroundImage: `url(${city})`,
                          backgroundSize: 'cover',
                      }}>
                    <Flex align="center" h="100%">
                        {query ? (
                            <>
                                <Badge color="red" fw={600} ml={4}>
                                    <Flex align="center">
                                        {query}
                                        <ActionIcon p={0} m={0} variant="transparent" c="white" aria-label="Remove query" loading={isQueryDataFetching}>
                                            <IconX size={16} onClick={removeQuery}/>
                                        </ActionIcon>
                                    </Flex>
                                </Badge>
                            </>
                        ) : null}
                    </Flex>
                </Flex>
                <DataTable
                    withRowBorders={false}
                    highlightOnHover
                    striped
                    verticalSpacing="lg"
                    idAccessor='_id'
                    data-query={true}
                    height={!matches && query ? 'calc(100% - 28px)' : '100%'}
                    columns={columnsConfiguration}
                    records={query ? queryRecords : records}
                    borderRadius={query ? 0 : 'lg'}
                    onScrollToBottom={!query ? loadMoreRecords : null}
                    scrollViewportRef={scrollViewportRef}
                    fetching={isFetching || isQueryDataFetching || internalLoading}
                    className={classes.dataTable}
                    rowClassName={classes.dataTableRow}
                    onRowClick={({record}) => handleRowClick(record)}
                ></DataTable>
            </Box>
        </>
    );
};

export {CoursesTable};
