import {DataTable} from 'mantine-datatable';
import {useEffect, useMemo, useRef, useState} from 'react';
import {columns} from '@/components/ClassesTable/Columns';
import {Review} from '@/reviews/types';
import {usePaginatedReviews} from '@/reviews/usePaginatedReviews';
import {useNavigate} from 'react-router-dom';
import {useViewportSize} from '@mantine/hooks';
import classes from './ClassesTable.module.css';
import {useTableScrollContext} from '@/context';
import {isMobile} from 'react-device-detect';
import {Box, Flex, Skeleton, Text} from "@mantine/core";

const ClassesTable = () => {
    const columnsConfiguration = useMemo(() => {
        if (isMobile) {
            return columns.filter((x) => x.accessor !== 'professor');
        }
        return columns;
    }, []);
    const [records, setRecords] = useState<Review[]>([]);
    const [internalLoading, setInternalLoading] = useState(true);
    const {data, fetchNextPage, isFetching} = usePaginatedReviews();
    const {height} = useViewportSize();
    const navigate = useNavigate();
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
    return (
        <>
            <Box className={classes.dataTableContainer} h={height - 250}>
                <Flex justify="space-between" align="center" className={classes.dataTableInfo}>
                    <Flex></Flex>
                    <Flex>
                        <Text fw="500" size="xs">
                            Courses loaded:
                        </Text>
                        <Text
                            ml="5"
                            size="xs"
                            fw="bold"
                            c="blue">
                            {isFetching || records.length === 0 ? <Skeleton w={20} h={15}/> : records.length}
                        </Text>
                    </Flex>
                </Flex>
                <DataTable withRowBorders={false}
                           highlightOnHover
                           striped
                           verticalSpacing="lg"
                           height="100%"
                           columns={columnsConfiguration}
                           records={records}
                           onScrollToBottom={loadMoreRecords}
                           scrollViewportRef={scrollViewportRef}
                           fetching={isFetching || internalLoading}
                           className={classes.dataTable}
                           rowClassName={classes.dataTableRow}
                           onRowClick={({record}) => handleRowClick(record)}></DataTable>
            </Box>

        </>
    );
};

export {ClassesTable};
