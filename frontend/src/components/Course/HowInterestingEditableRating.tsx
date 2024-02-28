import {EditableRatingBox} from "@/components/Course/EditableRatingBox.tsx";
import {useHowInterestingRating} from "@/hooks";
import {EditableRatingBoxProps} from "./EditableRatingBox.tsx";

interface HowInterestingEditableRatingProps {
    score?: number;
    compact?: boolean;
    onChange?: EditableRatingBoxProps['onChange'];

}

const HowInterestingEditableRating = (props: HowInterestingEditableRatingProps) => {
    const {score, ...rest} = props;
    const { message, color } = useHowInterestingRating(score);
    return <EditableRatingBox label="How easy" score={score} message={message} color={color} {...rest}/>

}

export {HowInterestingEditableRating}