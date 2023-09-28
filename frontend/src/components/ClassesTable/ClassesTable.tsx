import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResizeObserver, useWindowScroll } from '@mantine/hooks';
import { Box, createStyles } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

import { usePaginatedReviews } from '@/reviews/usePaginatedReviews';
import { Review } from '@/reviews/types';
import { BottomTableLoader } from '../Loaders/BottomTableLoader';
import { columns } from './Columns';

const useStyles = createStyles((theme) => ({
    tableContainer: {
        position: 'relative',
        overflowX: 'hidden',
        width: '100%',
        background: 'transparent',
        paddingBottom: theme.spacing.xl,
        zIndex: 1,
        [theme.fn.smallerThan('xs')]: {
            padding: '0',
        },
    },

    tableRelativeContainer: {
        position: 'relative',
        height: '100%',
        width: '100%',
    },

    dataTable: {
        background: theme.colorScheme === 'dark' ? theme.black : theme.white,
    },
}));

const ClassesTable = () => {
    const columnsConfiguration = useMemo(() => columns, []);
    const navigate = useNavigate();
    const { classes } = useStyles();
    const [ref] = useResizeObserver();
    const [records, setRecords] = useState<Review[]>([]);
    const [scroll] = useWindowScroll();
    const { data, fetchNextPage, isFetching } = usePaginatedReviews();

    useEffect(() => {
        if (data) {
            console.log(data);
            const newRecords = data.pages.map((v) => v.reviews.map((el) => el)).flat();
            setRecords([...newRecords]);
        }
    }, [data]);

    useEffect(() => {
        if (scroll.y >= ref.current?.clientHeight - window.innerHeight - 150) {
            loadMoreRecords();
        }
    }, [ref, scroll]);

    const handleRowClick = (record: Review) => {
        const dynamicPath = '/courses/' + record._id;
        navigate(dynamicPath);
    };

    const loadMoreRecords = () => {
        fetchNextPage().then(() => {});
    };

    return (
        <Box className={classes.tableContainer}>
            <Box className={classes.tableRelativeContainer}>
                <DataTable fontSize={'xs'} className={classes.dataTable} withBorder minHeight={window.innerHeight} withColumnBorders highlightOnHover onRowClick={handleRowClick} columns={columnsConfiguration} records={records} fetching={isFetching} customLoader={<BottomTableLoader />} scrollViewportRef={ref} />
            </Box>
        </Box>
    );
};

export { ClassesTable };
