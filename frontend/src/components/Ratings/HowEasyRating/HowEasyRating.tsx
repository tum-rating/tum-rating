import { useEffect, useState } from 'react';
import { RatingProps } from '../types.ts';
import { Flex, Rating, Stack, Text } from '@mantine/core';
import {HowEasyBadge, NumberRatingBadge} from '@/components/Ratings';

interface HowEasyRatingProps extends RatingProps {}

export const HowEasyRating = (props: HowEasyRatingProps) => {
    const { initialScore = 0, readonly = false, onChange } = props;
    const [score, setScore] = useState(0);

    useEffect(() => {
        setScore(initialScore);
    }, [initialScore]);

    return (
        <Stack align="center" gap={0}>
            <Text fw={500}>How Easy</Text>
            <Flex gap={10} align="center">
                <NumberRatingBadge score={score}/>
                <Text>/ 5</Text>
            </Flex>
            <Rating
                mb={10}
                value={score}
                fractions={2}
                readOnly={readonly}
                onChange={(value) => {
                    if (!readonly) {
                        if (onChange) {
                            onChange(value);
                        }
                        setScore(value);
                    }
                }}
            />
            <HowEasyBadge score={score} />
        </Stack>
    );
};
