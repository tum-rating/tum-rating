import {RatingBox, RatingBoxProps} from "@/components/Course/RatingBox.tsx";

interface HowInterestingRatingProps {
    score?: number;
    onChange?: RatingBoxProps['onChange'];
    readOnly?: RatingBoxProps['readOnly'];
}

const HowInterestingRating = (props: HowInterestingRatingProps) => {
    const {score, ...rest} = props;
    let message = 'No reviews';
    let color = 'gray';
    if (score === 0) message = 'No reviews';
    else if (score > 0 && score < 2) {
        message = 'Boring';
        color = 'red';
    } else if (score >= 2 && score < 4) {
        message = 'Moderate';
        color = 'yellow';
    } else if (score >= 4 && score <= 5) {
        message = 'Interesting';
        color = 'green';
    }
    return <RatingBox label="How interesting" score={score} message={message} color={color} {...rest}/>

}

export {HowInterestingRating}