import { Badge, Flex } from '@mantine/core';

import { Review } from '@/reviews/types';
import { NumberRatingBadge } from '../Ratings';

export const columns = [
    {
        title: 'Course',
        accessor: 'course',
        width: '60%',
    },
    {
        title: 'Semester',
        accessor: 'offeredInSemesters',
        render: (element: Review) => {
            return (
                <>
                    {element.offeredInSemesters.map((offeredInSemester, index) => (
                        <Badge key={index} variant="filled">
                            {offeredInSemester}
                        </Badge>
                    ))}
                </>
            );
        },
        visibleMediaQuery: (theme: { breakpoints: { xs: any } }) => `(min-width: ${theme.breakpoints.xs})`,
    },
    {
        title: 'Professor',
        accessor: 'professor',
        visibleMediaQuery: (theme: { breakpoints: { xs: any } }) => `(min-width: ${theme.breakpoints.xs})`,
    },
    {
        title: 'How interesting',
        accessor: 'howInterestingRatingAverage',
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
