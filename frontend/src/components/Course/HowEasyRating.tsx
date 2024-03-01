import { RatingBox } from '@/components/Course/RatingBox.tsx';
import { useHowEasyRating } from '@/hooks';

interface HowEasyRatingProps {
    score?: number;
    compact?: boolean;
    isLoading?: boolean;
}

const HowEasyRating = (props: HowEasyRatingProps) => {
    const { score, ...rest } = props;
    const { message, color } = useHowEasyRating(score);
    return <RatingBox label="How easy" score={score} message={message} color={color} {...rest} />;
};

export { HowEasyRating };
