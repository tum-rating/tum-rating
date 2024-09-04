import {Badge, BadgeProps} from '@mantine/core';

import {useHowInterestingRating} from '@/hooks';

interface HowInterestingBadgeProps extends BadgeProps {
    score: number;
}

export const HowInterestingBadge = ({score, ...props}: HowInterestingBadgeProps) => {
    const {message, color} = useHowInterestingRating(score);
    return (
        <Badge radius="xs" variant="light" color={color} {...props}>
            {message}
        </Badge>
    );
};
