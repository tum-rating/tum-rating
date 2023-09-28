import { useForm } from '@mantine/form';
import { Button, Flex, Paper, Select, Textarea } from '@mantine/core';

import { ContextModalProps, modals } from '@mantine/modals';
import { useAddUserReview, UserAddReviewInput } from '@/reviews/useAddUserReview';
import { HowEasyRating, HowInterestingRating } from '../Ratings';
import { useEffect } from 'react';

const openAddUserReviewModal = (courseId: string, userReview?: any) => {
    modals.openContextModal({
        modal: 'addUserReview',
        title: userReview ? 'Edit your review' : 'Add your review',
        innerProps: {
            courseId,
            userReview,
        },
        fullScreen: window.innerWidth <= 900,
    });
};
const AddUserReviewModal = ({
    context,
    id,
    innerProps,
}: ContextModalProps<{
    courseId: string;
    userReview: any;
}>) => {
    const { courseId, userReview } = innerProps;
    const { mutate: addUserReview, status } = useAddUserReview(courseId, userReview ? 'PUT' : 'POST');

    useEffect(() => {
        if (status === 'success') {
            context.closeModal(id);
        }
    }, [status]);
    useEffect(() => {
        if (userReview) {
            const { howEasyRating, howInterestingRating, comment, semester } = userReview;
            form.setFieldValue('howEasyRating', howEasyRating);
            form.setFieldValue('howInterestingRating', howInterestingRating);
            form.setFieldValue('comment', comment);
            form.setFieldValue('semester', semester);
        }
    }, []);

    const form = useForm({
        initialValues: {
            howInterestingRating: 0,
            howEasyRating: 0,
            comment: '',
            semester: '',
        },
    });

    const onAddUserReview = (form: UserAddReviewInput) => {
        if (form.howInterestingRating === 0 || form.howEasyRating === 0) return;
        addUserReview({ ...form });
    };

    return (
        <Paper radius="md" p="xl">
            <form
                onSubmit={form.onSubmit((e) => {
                    onAddUserReview(e);
                })}
            >
                <Flex w="100%" justify="space-around" align="center">
                    <HowEasyRating onChange={(value) => form.setFieldValue('howEasyRating', value)} initialScore={form.values.howEasyRating} />
                    <HowInterestingRating onChange={(value) => form.setFieldValue('howInterestingRating', value)} initialScore={form.values.howInterestingRating} />
                </Flex>
                <Textarea mt={24} placeholder="Your comment" label="Your comment" value={form.values.comment} onChange={(event) => form.setFieldValue('comment', event.currentTarget.value)} />
                <Select label="Semester" placeholder="Semester" value={form.values.semester} onChange={(value: string) => form.setFieldValue('semester', value)} data={[{ value: '2023 S', label: '2023 S' }]} />
                <Flex mt={38} justify="space-between">
                    <Button onClick={() => context.closeModal(id)} color={'gray'} variant={'subtle'}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={() => context.closeModal(id)}>
                        Send
                    </Button>
                </Flex>
            </form>
        </Paper>
    );
};

export { AddUserReviewModal, openAddUserReviewModal };
