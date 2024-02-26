import {Badge, TextProps} from '@mantine/core';

interface HowEasyText extends TextProps {
    score: number;
}

export const HowEasyBadge = (props: HowEasyText) => {
    const { score, ...rest } = props;
    let message = 'No reviews';
    let color = 'gray';
    if (score > 0 && score < 2) {
        message = 'Very Difficult';
        color = 'red';
    } else if (score >= 2 && score < 4) {
        message = 'Moderate';
        color = 'yellow';
    } else if (score >= 4 && score <= 5) {
        message = 'Easy';
        color = 'green';
    }
    return (
        <Badge radius="xs" variant="light" color={color} {...rest}>
            {message}
        </Badge>
    );
};