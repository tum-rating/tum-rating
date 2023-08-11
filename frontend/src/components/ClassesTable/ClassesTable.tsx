import { useEffect, useMemo, useRef, useState } from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
    type MRT_SortingState,
    type MRT_Virtualizer,
} from 'mantine-react-table';
import { makeData, type Course } from './makeData';

const ClassesTable = () => {
    const columns = useMemo<MRT_ColumnDef<Course>[]>(
        () => [
            {
                accessorKey: 'course',
                header: 'course',
                size: 150,
            },
            {
                accessorKey: 'professor',
                header: 'Professor',
                size: 150,
            },
            {
                accessorKey: 'howEasyRating',
                header: 'ease',
                size: 150,
            },
            {
                accessorKey: 'howInterestingRating',
                header: 'interest',
                size: 300,
            }
        ],
        [],
    );

    //optionally access the underlying virtualizer instance
    const rowVirtualizerInstanceRef =
        useRef<MRT_Virtualizer<HTMLDivElement, HTMLTableRowElement>>(null);

    const [data, setData] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState<MRT_SortingState>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setData(makeData(10_000));
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        //scroll to the top of the table when the sorting changes
        rowVirtualizerInstanceRef.current?.scrollToIndex(0);
    }, [sorting]);

    const table = useMantineReactTable({
        columns,
        data, //10,000 rows
        enableBottomToolbar: false,
        enableColumnVirtualization: true,
        enablePagination: false,
        enableRowVirtualization: true,
        mantineTableContainerProps: { sx: { maxHeight: '400px' } },
        onSortingChange: setSorting,
        state: { isLoading, sorting },
        rowVirtualizerInstanceRef, //optional
        rowVirtualizerProps: { overscan: 5 }, //optionally customize the row virtualizer
        columnVirtualizerProps: { overscan: 2 }, //optionally customize the column virtualizer
        enableColumnActions: false,
        enableColumnFilters: false,
        enablePagination: false,
        enableSorting: false,
        mantineTableProps: {
            highlightOnHover: false,
            withColumnBorders: true,
        },
    });

    return <MantineReactTable table={table} />;
};

export {ClassesTable};
