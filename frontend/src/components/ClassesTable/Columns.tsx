import { Flex } from '@mantine/core';
import { isMobile } from 'react-device-detect';

import { NumberRatingBadge } from '@/components/Course';
import { Review } from '@/reviews/types.ts';

export const columns = [
    {
        title: 'Course',
        accessor: 'course',
        width: '40%',
        render: (element: Review) => {
            return (
                <>
                    <span style={{ fontWeight: 500 }}>
                        {element.course}{' '}
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
        render: (element: Review) => {
            return (
                <>
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
        render: (element: Review) => {
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
