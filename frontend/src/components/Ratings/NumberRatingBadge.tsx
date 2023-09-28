import { Box } from '@mantine/core';
import { createStyles } from '@mantine/styles';

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

const useStyles = createStyles((theme, { score }: { score: number }) => ({
    badge: {
        display: 'flex',
        height: '20px',
        backgroundColor: `${theme.colors[getBadgeColor(score)][1]}`,
        color: `${theme.colors[getBadgeColor(score)][8]}`,
        border: `1px solid ${theme.colors[getBadgeColor(score)][2]}`,
        padding: '0.25rem .25rem',
        borderRadius: '0.25rem',
        fontWeight: 600,
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

export const NumberRatingBadge = ({ score }: NumberRatingBadgeProps) => {
    const { classes } = useStyles({ score });

    return <Box className={classes.badge}>{score}</Box>;
};
