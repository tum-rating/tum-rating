import {Flex} from '@mantine/core';
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
                mantineTableBodyCellProps: () => ({
                    style: {
                        fontWeight: '500',
                    },
                }),
                Cell: ({row, renderedCellValue}) => {
                    return (
                        <>
                            <span>
                                <SearchHighlight value={searchedWords} text={renderedCellValue} />
                                {isMobileOnly ? (
                                    <>
                                        <span style={{color: 'var(--mantine-color-dimmed'}}>
                                            <SearchHighlight value={searchedWords} text={row.original.professor} />
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
                                <SearchHighlight value={searchedWords} text={renderedCellValue} />
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
