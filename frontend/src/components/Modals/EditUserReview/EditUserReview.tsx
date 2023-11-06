import { ContextModalProps, modals } from '@mantine/modals';
import { Button, Container, Flex, LoadingOverlay, Select, Stack, Text, Textarea } from '@mantine/core';
import { useAddUserReview, UserAddReviewInput } from '@/reviews/useAddUserReview.tsx';
import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { HowEasyRating, HowInterestingRating } from '@/components/Ratings';
import { contextModalConfig } from '@/components/Modals/contextModalConfig.ts';

const openEditUserReviewModal = (courseId: string, userReview?: any) => {
    modals.openContextModal({
        ...contextModalConfig('editUserReview', <Text fw={600}>Edit your review</Text>),
        innerProps: {
            courseId,
            userReview,
        },
    });
};

const EditUserReviewModal = ({
    context,
    id,
    innerProps,
}: ContextModalProps<{
    courseId: string;
    userReview: any;
}>) => {
    const { courseId, userReview } = innerProps;
    const { mutate: editUserReview, isSuccess, isLoading } = useAddUserReview(courseId, 'PUT');

    useEffect(() => {
        if (isSuccess) {
            context.closeModal(id);
            document.querySelector("[data-comment='user-comment']")?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
        }
    }, [isSuccess]);

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

    const onEditUserReview = (form: UserAddReviewInput) => {
        if (form.howInterestingRating === 0 || form.howEasyRating === 0) return;
        editUserReview({ ...form });
    };

    return (
        <Container pt="xl">
            <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />
            <form
                onSubmit={form.onSubmit((e) => {
                    onEditUserReview(e);
                })}
            >
                <Stack>
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
                </Stack>
            </form>
        </Container>
    );
};

export { EditUserReviewModal, openEditUserReviewModal };
