import {Flex, Text} from '@mantine/core';

import {HowEasyBadge, HowInterestingBadge} from '@/components/Course';
import {Course} from '@/courses/types.ts';

interface SearchItemCourseDetailsProps {
    course: Course;
}

const SearchItemCourseDetails = ({course}: SearchItemCourseDetailsProps) => {
    return (
        <Flex gap="2" align='center'>
            <Flex gap={course.votesNumber ? '3' : '2'}>
                <Text c={course.votesNumber === 0 ? 'dimmed' : 'blue'} size="xs" fw="bold">
                    {course.votesNumber || 'No'}
                    {'  '}
                </Text>
                <Text
                    style={{
                        color: course.votesNumber === 0 ? 'var(--mantine-color-dimmed)' : 'var(--mantine-colors-text)',
                    }}
                    size="xs"
                    fw="bold"
                >
                    {course.votesNumber === 1 ? 'review' : 'reviews'}
                </Text>
            </Flex>
            {
                course.votesNumber !== 0 && (
                    <>
                        •
                        <HowInterestingBadge score={course.howInterestingRatingAverage} variant="transparent" px={0} />
                        •
                        <HowEasyBadge score={course.howEasyRatingAverage} variant="transparent" px={0} />
                    </>
                )
            }
        </Flex>
    );
};

export {SearchItemCourseDetails};
