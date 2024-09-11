import {Badge, BadgeProps} from '@mantine/core';

import {useHowEasyRating} from '@/hooks';

interface HowEasyBadgeProps extends BadgeProps {
    score: number;
}

export const HowEasyBadge = ({score, ...props}: HowEasyBadgeProps) => {
    const {color, message} = useHowEasyRating(score);
    return (
        <Badge variant="light" color={color} {...props}>
            {message}
        </Badge>
    );
};
