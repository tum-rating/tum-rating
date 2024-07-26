import {Badge} from '@mantine/core';

import {useHowInterestingRating} from '@/hooks';

export const HowInterestingBadge = ({score}: {score: number}) => {
    const {message, color} = useHowInterestingRating(score);
    return (
        <Badge radius="xs" variant="light" color={color}>
            {message}
        </Badge>
    );
};
