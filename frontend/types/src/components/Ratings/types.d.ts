export interface RatingProps {
    initialScore: number;
    readonly?: boolean;
    onChange?: (score: number) => void;
}
