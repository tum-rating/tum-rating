import { EditableRatingBox , EditableRatingBoxProps } from '@/components/Course/EditableRatingBox.tsx';
import { useHowInterestingRating } from '@/hooks';

interface HowInterestingEditableRatingProps {
    score?: number;
    compact?: boolean;
    onChange?: EditableRatingBoxProps['onChange'];
}

const HowInterestingEditableRating = (props: HowInterestingEditableRatingProps) => {
    const { score, ...rest } = props;
    const { message, color } = useHowInterestingRating(score);
    return <EditableRatingBox label="How easy" score={score} message={message} color={color} {...rest} />;
};

export { HowInterestingEditableRating };
