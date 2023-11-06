import { DataTable } from 'mantine-datatable';
import { useEffect, useMemo, useRef, useState } from 'react';
import { columns } from '@/components/ClassesTable/Columns';
import { Review } from '@/reviews/types';
import { usePaginatedReviews } from '@/reviews/usePaginatedReviews';
import { useNavigate } from 'react-router-dom';
import { useViewportSize } from '@mantine/hooks';
import classes from './ClassesTable.module.css';
import { useTableScrollContext } from '@/context';

const ClassesTable = () => {
    const columnsConfiguration = useMemo(() => columns, []);
    const [records, setRecords] = useState<Review[]>([]);
    const [internalLoading, setInternalLoading] = useState(true);
    const { data, fetchNextPage, isFetching, isLoading, isInitialLoading } = usePaginatedReviews();
    const { height } = useViewportSize();
    const navigate = useNavigate();
    const scrollViewportRef = useRef<HTMLDivElement>(null);
    const { scrollY, setScrollY } = useTableScrollContext();

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
        fetchNextPage().then(() => {});
    };

    const handleRowClick = (record: Review) => {
        const dynamicPath = '/courses/' + record._id;
        setScrollY(scrollViewportRef.current.scrollTop);
        navigate(dynamicPath);
    };

    console.log(records, {
        data,
        isFetching,
        isLoading,
        isInitialLoading,
    });
    return (
        <>
            <DataTable withColumnBorders highlightOnHover striped height={height - 45} columns={columnsConfiguration} records={records} onScrollToBottom={loadMoreRecords} scrollViewportRef={scrollViewportRef} fetching={isFetching || internalLoading} className={classes.dataTable} rowClassName={classes.dataTableRow} onRowClick={({ record }) => handleRowClick(record)}></DataTable>
        </>
    );
};

export { ClassesTable };
