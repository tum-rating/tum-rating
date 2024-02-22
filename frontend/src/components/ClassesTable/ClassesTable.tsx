import {DataTable} from 'mantine-datatable';
import {useEffect, useMemo, useRef, useState} from 'react';
import {columns} from '@/components/ClassesTable/Columns';
import {Review} from '@/reviews/types';
import {usePaginatedReviews} from '@/reviews/usePaginatedReviews';
import {useLocation, useNavigate} from 'react-router-dom';
import {useViewportSize} from '@mantine/hooks';
import classes from './ClassesTable.module.css';
import {useTableScrollContext} from '@/context';
import {isMobile} from 'react-device-detect';
import {ActionIcon, Box, Flex, Skeleton, Text} from "@mantine/core";
import {useSearchReviews} from "@/reviews/useSearchReviews.tsx";
import {IconX} from "@tabler/icons-react";

const ClassesTable = () => {
    const columnsConfiguration = useMemo(() => {
        if (isMobile) {
            return columns.filter((x) => x.accessor !== 'professor');
        }
        return columns;
    }, []);
    const [records, setRecords] = useState<Review[]>([]);
    const [queryRecords, setQueryRecords] = useState<Review[]>([]);
    const [internalLoading, setInternalLoading] = useState(true);
    const {data, fetchNextPage, isFetching} = usePaginatedReviews();
    const [query, setQuery] = useState('');
    const {data: queryData, isFetching: isQueryDataFetching} = useSearchReviews(query);
    const {height} = useViewportSize();
    const navigate = useNavigate();
    const location = useLocation()
    const scrollViewportRef = useRef<HTMLDivElement>(null);
    const {scrollY, setScrollY} = useTableScrollContext();

    useEffect(() => {
        if (data) {
            const newRecords = data.pages.map((v) => v.reviews.map((el) => el)).flat();
            setRecords([...newRecords]);
            setInternalLoading(false);
        }
    }, [data]);
    useEffect(() => {
        if (queryData) {
            const newRecords = queryData.reviews;
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

    const handleRowClick = (record: Review) => {
        const dynamicPath = '/courses/' + record._id;
        setScrollY(scrollViewportRef.current.scrollTop);
        navigate(dynamicPath);
    };

    const removeQuery = () => {
        setQuery('');
        navigate('/');
    }

    return (
        <>
            <Box className={classes.dataTableContainer} h={height - 250}>
                <Flex justify="space-between" align="center" className={classes.dataTableInfo}>
                    <Flex align="center">
                        {query ? (
                            <>
                                <Text fw="500" size="xs">
                                    Search results for:
                                </Text>
                                <Text
                                    ml="5"
                                    size="xs"
                                    fw="bold"
                                    c="blue">
                                    {query}
                                </Text>
                                <ActionIcon ml={4} size="13" variant="filled" color="red" aria-label="Remove Query"
                                            onClick={removeQuery}>
                                    <IconX/>
                                </ActionIcon>
                            </>
                        ) : null}
                    </Flex>
                    <Flex align="center">
                        <Text fw="500" size="xs">
                            Courses loaded:
                        </Text>
                        <Text
                            ml="5"
                            size="xs"
                            fw="bold"
                            c="blue">
                            {isFetching || isQueryDataFetching || records.length === 0 ?
                                <Skeleton w={20} h={15}/> : query ? queryRecords.length : records.length}
                        </Text>
                    </Flex>
                </Flex>
                <DataTable withRowBorders={false}
                           highlightOnHover
                           striped
                           verticalSpacing="lg"
                           height="100%"
                           columns={columnsConfiguration}
                           records={query ? queryRecords : records}
                           onScrollToBottom={!query ? loadMoreRecords : null}
                           scrollViewportRef={scrollViewportRef}
                           fetching={isFetching || isQueryDataFetching || internalLoading}
                           className={classes.dataTable}
                           rowClassName={classes.dataTableRow}
                           onRowClick={({record}) => handleRowClick(record)}></DataTable>
            </Box>

        </>
    );
};

export {ClassesTable};
