import { Badge, Box, Flex, Rating, Text } from '@mantine/core';

import classes from './RatingBox.module.css';

import { Skeleton } from '@/components/Skeleton';


interface RatingBoxProps {
    label: string;
    score: number;
    message: string;
    color: string;
    isLoading?: boolean;
}

const RatingBox = (props: RatingBoxProps) => {
    const { score, message, color, label, isLoading } = props;
    return (
        <Flex className={classes.ratingBox} direction="column" px="md" py="md" align="flex-start" pos="relative">
            <Flex direction="column">
                <Flex align="center" gap={6} mb="4">
                    <Box
                        w={7}
                        h={20}
                        style={{
                            borderRadius: '8px',
                            background: `var(--mantine-color-text)`,
                        }}
                    />
                    <Text mt={1} fw="bold">
                        {label}
                    </Text>
                </Flex>
                <Rating visibleFrom="xs" px={12} value={isLoading ? 0 : score} fractions={2} readOnly={true} />
                <Rating size="lg" hiddenFrom="xs" px={12} value={isLoading ? 0 : score} fractions={2} readOnly={true} />
            </Flex>
            <Flex mt="3" px="md" align="center" gap={6}>
                <Flex mt={2}>
                    <Skeleton
                        w={32}
                        h={31}
                        radius="md"
                        loading={isLoading}
                        component={
                            <Text c={color} fz="xl" fw="bold">
                                {score}
                            </Text>
                        }
                    />
                </Flex>
                <Skeleton
                    w={50}
                    h={26}
                    radius="lg"
                    loading={isLoading}
                    component={
                        <Badge mt={2} radius="md" variant="filled" size="md" color={color}>
                            {message}
                        </Badge>
                    }
                />
            </Flex>
        </Flex>
    );
};

export { RatingBox, RatingBoxProps };
