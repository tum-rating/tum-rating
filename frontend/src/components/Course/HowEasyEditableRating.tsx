import { EditableRatingBox , EditableRatingBoxProps } from '@/components/Course/EditableRatingBox.tsx';
import { useHowEasyRating } from '@/hooks';

interface HowEasyEditableRatingProps {
    score?: number;
    compact?: boolean;
    onChange?: EditableRatingBoxProps['onChange'];
}

const HowEasyEditableRating = (props: HowEasyEditableRatingProps) => {
    const { score, ...rest } = props;
    const { message, color } = useHowEasyRating(score);
    return <EditableRatingBox label="How easy" score={score} message={message} color={color} {...rest} />;
};

export { HowEasyEditableRating };
