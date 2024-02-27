import { Flex } from '@mantine/core';

import { Review } from '@/reviews/types.ts';
import { NumberRatingBadge } from '@/components/Course';
export const columns = [
    {
        title: 'Course',
        accessor: 'course',
        width: '40%',
        render: (element: Review) => {
            return (
                <>
                    <span style={{ fontWeight: 500 }}>{element.course}</span>
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
