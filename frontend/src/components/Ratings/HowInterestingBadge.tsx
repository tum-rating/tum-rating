import {Badge} from "@mantine/core";

export const HowInterestingBadge = ({score}:{score:number}) => {
    let message = '';
    if (score === 0) message = 'No reviews yet';
    else if (score > 0 && score < 2) {
        message = 'Boring';
    } else if (score >= 2 && score < 4) {
        message = 'Moderate';
    } else if (score >= 4 && score <= 5) {
        message = 'Interesting';
    }
    return (
        <Badge color={message === 'Boring' ? 'red' : message === 'Moderate' ? 'yellow' : 'green'}>{message}</Badge>
    );
};