import {Flex} from '@mantine/core';
import {MRT_ColumnDef} from 'mantine-react-table';
import {useMemo} from 'react';
import {isMobileOnly} from 'react-device-detect';

import {NumberRatingBadge} from '@/components/Course';
import {Course} from '@/courses/types.ts';

const useCoursesTableColumns = () => {
    const columns: MRT_ColumnDef<Course | null>[] = useMemo(() => {
        return [
            {
                header: 'Course',
                accessorKey: 'name',

                size: isMobileOnly ? 100 : 200,
                mantineTableBodyCellProps: () => ({
                    style: {
                        fontWeight: '500',
                    },
                }),
                Cell: ({row}) => {
                    return (
                        <>
                            <span>
                                {row.original.name}{' '}
                                {isMobileOnly ? (
                                    <>
                                        <br /> <span style={{color: 'var(--mantine-color-dimmed'}}>{row.original.professor}</span>
                                    </>
                                ) : null}
                            </span>
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
        ].filter((x) => {
            if (isMobileOnly) {
                return x.header !== 'Professor';
            }
            return true;
        });
    }, [isMobileOnly]);

    return {columns};
};

export {useCoursesTableColumns};
