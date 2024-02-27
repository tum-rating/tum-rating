import {Badge} from '@mantine/core';
import {useHowEasyRating} from "@/hooks";

export const HowEasyBadge = ({score}: { score: number }) => {
    const {color, message} = useHowEasyRating(score);
    return (
        <Badge variant="light" color={color}>
            {message}
        </Badge>
    );
};
