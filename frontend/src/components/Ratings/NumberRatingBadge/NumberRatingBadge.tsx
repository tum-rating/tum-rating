import { Box } from '@mantine/core';

import classes from './NumberRatingBadge.module.css';

interface NumberRatingBadgeProps {
    score: number;
}

const getBadgeColor = (score: number) => {
    let color = 'gray';
    if (score === 0) {
        color = 'gray';
    } else if (score > 0 && score < 2) {
        color = 'orange';
    } else if (score >= 2 && score < 3) {
        color = 'yellow';
    } else if (score >= 3 && score < 4) {
        color = 'lime';
    } else if (score >= 4 && score <= 5) {
        color = 'green';
    }
    return color;
};

export const NumberRatingBadge = ({ score }: NumberRatingBadgeProps) => {
    return (
        <Box
            className={classes.badge}
            style={{
                backgroundColor: `var(--mantine-color-${getBadgeColor(score)}-1)`,
                color: `var(--mantine-color-${getBadgeColor(score)}-8)`,
                border: `1px solid var(--mantine-color-${getBadgeColor(score)}-2)`,
            }}
        >
            {score}
        </Box>
    );
};
