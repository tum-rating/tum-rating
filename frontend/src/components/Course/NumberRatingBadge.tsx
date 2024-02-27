import {Badge} from "@mantine/core";

export const NumberRatingBadge = ({score}: { score: number }) => {
    let color = 'gray';
    if (score > 0 && score < 2) {
        color = 'red';
    } else if (score >= 2 && score < 4) {
        color = 'yellow';
    } else if (score >= 4 && score <= 5) {
        color = 'green';
    }
    return <Badge size="lg" variant="light" color={color}>{score}</Badge>;
}