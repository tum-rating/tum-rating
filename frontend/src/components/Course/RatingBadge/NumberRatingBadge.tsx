import {Badge, BadgeProps} from '@mantine/core';

interface NumberRatingBadgeProps extends BadgeProps {
    score: number;
}

export const NumberRatingBadge = (props: NumberRatingBadgeProps) => {
    const {score, ...badgeProps} = props;
    let color = 'gray';
    if (score > 0 && score < 2) {
        color = 'red';
    } else if (score >= 2 && score < 4) {
        color = 'yellow';
    } else if (score >= 4 && score <= 5) {
        color = 'green';
    }
    return (
        <Badge variant="light" color={color} {...badgeProps}>
            {score}
        </Badge>
    );
};
