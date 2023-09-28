import { ContextModalProps } from '@mantine/modals';
declare const openAddUserReviewModal: (courseId: string, userReview?: any) => void;
declare const AddUserReviewModal: ({ context, id, innerProps }: ContextModalProps<{
    courseId: string;
    userReview: any;
}>) => import("react/jsx-runtime").JSX.Element;
export { AddUserReviewModal, openAddUserReviewModal };
