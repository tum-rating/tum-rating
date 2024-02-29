import {RatingBox} from "@/components/Course/RatingBox.tsx";
import {useHowInterestingRating} from "@/hooks";

interface HowInterestingRatingProps {
    score?: number;
    compact?: boolean;
    isLoading?: boolean;
}

const HowInterestingRating = (props: HowInterestingRatingProps) => {
    const {score, ...rest} = props;
    const {message, color} = useHowInterestingRating(score);
    return <RatingBox label="How interesting" score={score} message={message} color={color} {...rest}/>
}

export {HowInterestingRating}