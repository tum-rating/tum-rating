import {RatingProps} from './types';
import {Flex, Rating, Stack, Text} from '@mantine/core';
import {useEffect, useState} from 'react';
import {HowInterestingBadge} from "./HowInterestingBadge";
interface HowInterestingRatingProps extends RatingProps {}
export const HowInterestingRating = (props: HowInterestingRatingProps) => {
    const {initialScore = 0, readonly = false, onChange} = props;
    const [score, setScore] = useState(0);
    useEffect(() => {
        setScore(initialScore)
    }, [initialScore])

    return (
        <Stack w={120} align="center" spacing="0">
            <Text weight={500}>How interesting</Text>
            <Flex gap={10} align="center">
                <Text fz={36} weight={500}>
                    {score}
                </Text>
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
                            onChange(value)
                        }
                        setScore(value)
                    }
                }}
            />
            <HowInterestingBadge score={score}/>
        </Stack>
    );
};
