import {RatingBox, RatingBoxProps} from "@/components/Course/RatingBox.tsx";
import {useHowInterestingRating} from "@/hooks";

interface HowInterestingRatingProps {
    score?: number;
    onChange?: RatingBoxProps['onChange'];
    readOnly?: RatingBoxProps['readOnly'];
}

const HowInterestingRating = (props: HowInterestingRatingProps) => {
    const {score, ...rest} = props;
    const {message, color} = useHowInterestingRating(score);
    return <RatingBox label="How interesting" score={score} message={message} color={color} {...rest}/>
}

export {HowInterestingRating}