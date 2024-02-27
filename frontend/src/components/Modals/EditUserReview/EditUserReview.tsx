import {ContextModalProps, modals} from '@mantine/modals';
import {Button, Container, Flex, LoadingOverlay, Select, Stack, Text, Textarea,Badge} from '@mantine/core';
import {useAddUserReview, UserAddReviewInput} from '@/reviews/useAddUserReview.tsx';
import {useEffect} from 'react';
import {useForm} from '@mantine/form';
import {HowEasyRating, HowInterestingRating} from '@/components/Course';
import {contextModalConfig} from '@/components/Modals/contextModalConfig.ts';
import {useUser} from '@/auth/useUser.tsx';
import {useDetailReview} from '@/reviews/useReview.tsx';
import {DetailReview} from '@/reviews/types.ts';

const openEditUserReviewModal = ({courseId, userReview, ...props}) => {
    modals.openContextModal({
        ...contextModalConfig('editUserReview', <Text fw={600}>Edit your review</Text>),
        innerProps: {
            courseId,
            userReview,
        },
        ...props,
    });
};

const EditUserReviewModal = ({
                                 context,
                                 id,
                                 innerProps,
                             }: ContextModalProps<{
    courseId: string;
}>) => {
    const {courseId} = innerProps;
    const {mutate: editUserReview, isSuccess, isLoading} = useAddUserReview(courseId, 'PATCH');
    const {user} = useUser();
    const {data: userReview}: { data: DetailReview } = useDetailReview(courseId, {staleTime: Infinity});

    useEffect(() => {
        if (isSuccess) {
            document.querySelector("[data-comment='user-comment']")?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
            });
        }
    }, [isSuccess]);

    useEffect(() => {
        const userReviewComment = userReview?.reviews.find((data) => data.userId === user?.user.id);
        if (userReviewComment) {
            const {howEasyRating, howInterestingRating, comment, semester} = userReviewComment;
            form.setFieldValue('howEasyRating', howEasyRating);
            form.setFieldValue('howInterestingRating', howInterestingRating);
            form.setFieldValue('comment', comment);
            form.setFieldValue('semester', semester);
        }
    }, [userReview]);

    const form = useForm({
        initialValues: {
            howInterestingRating: 0,
            howEasyRating: 0,
            comment: '',
            semester: '',
        },
        validate: {
            howInterestingRating: (value) => value === 0 && 'This field is required',
            howEasyRating: (value) => value === 0 && 'This field is required',
            comment: (value) => value.length < 5 && 'Comment should be at least 5 characters long',
            semester: (value) => !value && 'This field is required',
        },
    });


    const onEditUserReview = (form: UserAddReviewInput) => {
        if (form.howInterestingRating === 0 || form.howEasyRating === 0) return;
        editUserReview({...form});
        context.closeModal(id);
    };

    return (
        <Container pt="xl" pos="relative">
            <LoadingOverlay visible={isLoading} overlayProps={{radius: 'sm', blur: 2}}/>
            <form
                onSubmit={form.onSubmit((e) => {
                    onEditUserReview(e);
                })}
            >
                <Stack>
                    <Flex w="100%" align="center" justify="space-between" wrap="wrap">
                        <Stack>
                            <HowEasyRating readOnly={false}
                                           onChange={(value) => form.setFieldValue('howEasyRating', value)}
                                           score={form.values.howEasyRating}/>
                            {form.errors.howEasyRating &&
                                <Badge variant="light" color="red">{form.errors.howEasyRating}</Badge>}
                        </Stack>
                        <Stack>
                            <HowInterestingRating readOnly={false}
                                                  onChange={(value) => form.setFieldValue('howInterestingRating', value)}
                                                  score={form.values.howInterestingRating}/>
                            {form.errors.howInterestingRating &&
                                <Badge variant="light" color="red">{form.errors.howInterestingRating}</Badge>}
                        </Stack>
                    </Flex>
                    <Textarea
                        mt={24}
                        placeholder="Your comment"
                        label="Your comment"
                        value={form.values.comment}
                        {...form.getInputProps("comment")}
                        onChange={(event) => form.setFieldValue('comment', event.currentTarget.value)}/>
                    <Select
                        {...form.getInputProps('semester')}
                        label="Semester" placeholder="Semester" value={form.values.semester}
                        onChange={(value: string) => form.setFieldValue('semester', value)}
                        data={[{value: '2023 S', label: '2023 S'}]}/>
                    <Flex mt={38} justify="space-between">
                        <Button onClick={() => context.closeModal(id)} color={'gray'} variant={'subtle'}>Cancel</Button>
                        <Button type="submit">Update</Button>
                    </Flex>
                </Stack>
            </form>
        </Container>
    );
};

export {EditUserReviewModal, openEditUserReviewModal};
