import {Badge, Flex} from '@mantine/core';
import {MRT_ColumnDef} from 'mantine-react-table';
import {useMemo} from 'react';
import {isMobileOnly} from 'react-device-detect';

import {NumberRatingBadge} from '@/components/Course';
import {SearchHighlight} from '@/components/Highlight';
import {useSearchContext} from '@/context';
import {Course} from '@/courses/types.ts';

const useCoursesTableColumns = () => {
    const {searchQuery} = useSearchContext();
    const splitSearchQueryIntoWords = (value: string) => {
        const separators = [' ', ',', '.', '-'];
        const words = value.split(new RegExp(`[${separators.join('')}]`));
        return words.filter(Boolean);
    };
    const columns: MRT_ColumnDef<Course | null>[] = useMemo(() => {
        const searchedWords = splitSearchQueryIntoWords(searchQuery);
        return [
            {
                header: 'Course',
                accessorKey: 'name',

                size: isMobileOnly ? 100 : 200,
                Cell: ({row, renderedCellValue}) => {
                    return (
                        <>
                            <span style={{wordBreak: 'break-word'}}>
                                <SearchHighlight fw="500" fz="sm" highlight={searchedWords}>
                                    {renderedCellValue}
                                </SearchHighlight>
                                {isMobileOnly ? (
                                    <>
                                        <span style={{wordBreak: 'break-word'}}>
                                            <SearchHighlight highlight={searchedWords} fz="sm">
                                                {row.original.professor}
                                            </SearchHighlight>
                                        </span>
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
                Cell: ({renderedCellValue}) => {
                    return (
                        <>
                            <span>
                                {' '}
                                <SearchHighlight highlight={searchedWords} fz="sm">
                                    {renderedCellValue}
                                </SearchHighlight>
                            </span>
                        </>
                    );
                },
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
                Cell: ({row}) => {
                    return (
                        <>
                            <Flex align="center" gap="xs">
                                <Badge variant="light" color={row.original.votesNumber ? 'blue' : 'gray'}>
                                    {row.original.votesNumber}
                                </Badge>
                            </Flex>
                        </>
                    );
                },
                accessorKey: 'votesNumber',
            },
        ].filter((x) => {
            if (isMobileOnly) {
                return x.header !== 'Professor';
            }
            return true;
        });
    }, [isMobileOnly, searchQuery]);

    return {columns};
};

export {useCoursesTableColumns};
