import {Box, Flex, Text} from '@mantine/core';
import {IconUsersGroup} from '@tabler/icons-react';

import classes from './RatingBox.module.css';

import {Skeleton} from '@/components/Skeleton';

interface ReviewsBoxProps {
    votes: number;
    isLoading: boolean;
}

const ReviewsBox = (props: ReviewsBoxProps) => {
    const {votes, isLoading} = props;
    let color = votes ? 'black' : 'gray';
    return (
        <Flex className={classes.ratingBox} direction="column" px="md" py="md" align="flex-start" pos="relative">
            <Flex align="center" gap={6} mb="xs">
                <Box
                    w={7}
                    h={20}
                    style={{
                        borderRadius: '8px',
                        background: `var(--mantine-color-text)`,
                    }}
                />
                <Text mt={1} fw="bold">
                    Number of reviews
                </Text>
            </Flex>
            <Flex mt="3" direction="column" px={12}>
                <Flex align="center">
                    <Skeleton
                        w={15}
                        h={31}
                        loading={isLoading}
                        component={
                            <Text
                                mr="xs"
                                fz="xl"
                                fw="bold"
                                style={{
                                    color: votes ? 'var(--mantine-color-text)' : 'var(--mantine-color-gray-text)',
                                }}
                            >
                                {votes}
                            </Text>
                        }
                    />

                    <IconUsersGroup
                        strokeWidth="2"
                        width={30}
                        height={40}
                        style={{
                            fill: 'var(--mantine-color-dimmed)',
                            stroke: color,
                        }}
                    />
                </Flex>
            </Flex>
        </Flex>
    );
};

export {ReviewsBox};
