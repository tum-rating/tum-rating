import {MRT_ColumnDef} from 'mantine-react-table';

import {Review} from '@/admin/types.ts';

export const useReviewsColumns = () => {
    const columns: MRT_ColumnDef<Review>[] = [
        {
            accessorKey: 'userName',
            header: 'User Name',
        },
        {
            accessorKey: 'comment',
            header: 'Comment',
            size: 500,
            mantineTableBodyCellProps: () => ({
                style: {
                    fontWeight: '500',
                },
            }),
            Cell: ({row}) => {
                return <span style={{wordBreak: 'break-word'}}>{row.original.comment}</span>;
            },
        },
        {
            accessorKey: 'howEasyRating',
            size: 50,
            header: 'er',
        },
        {
            accessorKey: 'howInterestingRating',
            size: 50,
            header: 'ir',
        },
        {
            size: 50,
            accessorKey: 'semester',
            header: 'Semester',
        },
        {
            header: 'Created at',
            accessorKey: 'createdAt',
        },
    ];

    return {
        columns,
    };
};
