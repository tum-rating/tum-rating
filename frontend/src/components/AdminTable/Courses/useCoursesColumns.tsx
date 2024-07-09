import {Flex} from '@mantine/core';
import {MRT_ColumnDef} from 'mantine-react-table';
import {useMemo} from 'react';

import {NumberRatingBadge} from '@/components/Course';
import {Course} from '@/courses/types.ts';

export const useCoursesColumns = () => {
    const columns: MRT_ColumnDef<Course | null>[] = useMemo(() => {
        return [
            {
                header: 'Course',
                accessorKey: 'name',
                size: 200,
                mantineTableBodyCellProps: () => ({
                    style: {
                        fontWeight: '500',
                    },
                }),
                Cell: ({row}) => {
                    return (
                        <>
                            <span>{row.original.name} </span>
                        </>
                    );
                },
            },
            {
                header: 'Professor',
                accessorKey: 'professor',
                size: 80,
            },
            {
                header: 'How interesting',
                accessorKey: 'howInterestingRatingAverage',
                size: 60,
                Cell: ({row}) => {
                    return (
                        <>
                            <Flex align="center" gap="xs">
                                <NumberRatingBadge score={row.original.howInterestingRatingAverage} />
                            </Flex>
                        </>
                    );
                },
            },
            {
                header: 'How easy',
                accessorKey: 'howEasyRatingAverage',
                size: 50,
                Cell: ({row}) => {
                    return (
                        <>
                            <Flex align="center" gap="xs">
                                <NumberRatingBadge score={row.original.howEasyRatingAverage} />
                            </Flex>
                        </>
                    );
                },
            },
            {
                header: 'Votes',
                size: 50,
                accessorKey: 'votesNumber',
            },
        ];
    }, []);
    return {columns};
};
