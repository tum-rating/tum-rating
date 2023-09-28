import { Badge } from '@mantine/core';

export const HowEasyBadge = ({ score }: { score: number }) => {
    let message = 'No reviews yet';
    if (score > 0 && score < 2) {
        message = 'Very Difficult';
    } else if (score >= 2 && score < 4) {
        message = 'Moderate';
    } else if (score >= 4 && score <= 5) {
        message = 'Easy';
    }
    return <Badge color={message === 'Very Difficult' ? 'red' : message === 'Moderate' ? 'yellow' : 'green'}>{message}</Badge>;
};
