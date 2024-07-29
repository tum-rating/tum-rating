import {EditableRatingBox, EditableRatingBoxProps} from '@/components/Course/EditableRating/EditableRatingBox.tsx';
import {useHowEasyRating} from '@/hooks';

interface HowEasyEditableRatingProps {
    score?: number;
    compact?: boolean;
    onChange?: EditableRatingBoxProps['onChange'];
}

const HowEasyEditableRating = (props: HowEasyEditableRatingProps) => {
    const {score, ...rest} = props;
    const {message, color} = useHowEasyRating(score);
    return <EditableRatingBox data-testid="editable-rating-how-easy" label="How easy" score={score} message={message} color={color} {...rest} />;
};

export {HowEasyEditableRating};
