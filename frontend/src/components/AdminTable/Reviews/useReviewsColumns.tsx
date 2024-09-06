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
        },
        {
            accessorKey: 'howEasyRating',
            header: 'How easy rating',
        },
        {
            accessorKey: 'howInterestingRating',
            header: 'How interesting rating',
        },
        {
            accessorKey: 'semester',
            header: 'Semester',
        },
        {
            accessorKey: 'userId',
            header: 'User Id',
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
