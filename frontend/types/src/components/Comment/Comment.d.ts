interface CommentProps {
    comment: string;
    createdAt: string;
    howEasyRating: number;
    howInterestingRating: number;
    userId: string;
    _id: string;
}
export declare const Comment: ({ comment, userId, howEasyRating, howInterestingRating }: CommentProps) => import("react/jsx-runtime").JSX.Element;
export {};
