import { Flex } from '@mantine/core';
import { isMobile } from 'react-device-detect';

import { NumberRatingBadge } from '@/components/Course';
import { Course } from '@/courses/types.ts';

export const columns = [
    {
        title: 'Course',
        accessor: 'course',
        width: '40%',
        render: (element: Course) => {
            return (
                <>
                    <span style={{ fontWeight: 500 }}>
                        {element.name}{' '}
                        {isMobile ? (
                            <>
                                <br /> <span style={{ color: 'var(--mantine-color-dimmed' }}>{element.professor}</span>
                            </>
                        ) : null}
                    </span>
                </>
            );
        },
    },
    {
        title: 'Professor',
        width: 75,
        accessor: 'professor',
    },
    {
        title: 'How interesting',
        accessor: 'howInterestingRatingAverage',
        width: 70,
        ellipsis: true,
        render: (element: Course) => {
            return (
                <>jig
                    <Flex align="center" gap="xs">
                        <NumberRatingBadge score={element.howInterestingRatingAverage} />
                    </Flex>
                </>
            );
        },
    },
    {
        title: 'How easy',
        accessor: 'howEasyRatingAverage',
        ellipsis: true,
        width: 100,
        render: (element: Course) => {
            return (
                <>
                    <Flex align="center" gap="xs">
                        <NumberRatingBadge score={element.howEasyRatingAverage} />
                    </Flex>
                </>
            );
        },
    },
];
