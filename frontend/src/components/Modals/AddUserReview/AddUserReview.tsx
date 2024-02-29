import {ContextModalProps, modals} from '@mantine/modals';
import {Badge, Button, Container, Flex, LoadingOverlay, Select, Stack, Text, Textarea} from '@mantine/core';
import {useAddUserReview, UserAddReviewInput} from '@/reviews/useAddUserReview.tsx';
import {useEffect} from 'react';
import {useForm} from '@mantine/form';
import {contextModalConfig} from '@/components/Modals/contextModalConfig.ts';
import {HowEasyEditableRating} from "@/components/Course/HowEasyEditableRating.tsx";
import {HowInterestingEditableRating} from "@/components/Course/HowInterestingEditableRating.tsx";

const openAddUserReviewModal = ({courseId, ...props}) => {
    modals.openContextModal({
        ...contextModalConfig('addUserReview', <Text fw={600}>Add your review</Text>),
        ...props,
    });
};

const AddUserReviewModal = ({
                                context,
                                id,
                                innerProps,
                            }: ContextModalProps<{
    courseId: string;
}>) => {
    const {courseId} = innerProps;
    const {mutate: addUserReview, isSuccess, isLoading} = useAddUserReview(courseId, 'POST');

    useEffect(() => {
        if (isSuccess) {
            document.querySelector("[data-comment='user-comment']")?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
            });
        }
    }, [isSuccess]);

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

    const handleSubmit = (form: UserAddReviewInput) => {
        if (form.howInterestingRating === 0 || form.howEasyRating === 0) return;
        addUserReview({...form});
        context.closeModal(id);
    };

    return (
        <Container px={0} pos="relative" h="100%">
            <LoadingOverlay visible={isLoading} overlayProps={{radius: 'sm', blur: 2}}/>
            <form style={{height: '100%',overflowY: "auto"}}
                onSubmit={form.onSubmit((e) => {
                    handleSubmit(e);
                })}
            >
                <Flex direction="column" gap="xs" h="100%">
                    <Textarea
                        autosize
                        minRows={6}
                        maxRows={6}
                        placeholder="Your comment"
                        label="Your comment"
                        h="auto"
                        value={form.values.comment}
                        {...form.getInputProps("comment")}
                        onChange={(event) => form.setFieldValue('comment', event.currentTarget.value)}/>
                    <Select
                        {...form.getInputProps('semester')}
                        label="Semester" placeholder="Semester" value={form.values.semester}
                        onChange={(value: string) => form.setFieldValue('semester', value)}
                        data={[{value: '2023 S', label: '2023 S'}]}/>
                    <Flex w="100%" gap="lg"  direction="column" wrap="wrap" mt="md" mb="md">
                        <Stack>
                            <HowEasyEditableRating onChange={(value) => form.setFieldValue('howEasyRating', value)}
                                                   score={form.values.howEasyRating}/>
                            {form.errors.howEasyRating &&
                                <Badge variant="light" color="red">{form.errors.howEasyRating}</Badge>}
                        </Stack>
                        <Stack>
                            <HowInterestingEditableRating
                                onChange={(value) => form.setFieldValue('howInterestingRating', value)}
                                score={form.values.howInterestingRating}/>
                            {form.errors.howInterestingRating &&
                                <Badge variant="light" color="red">{form.errors.howInterestingRating}</Badge>}
                        </Stack>
                    </Flex>

                    <Flex mt="auto" justify="space-between">
                        <Button onClick={() => context.closeModal(id)} color={'gray'} variant={'subtle'}>Cancel</Button>
                        <Button type="submit">Send</Button>
                    </Flex>
                </Flex>
            </form>
        </Container>
    );
};

export {AddUserReviewModal, openAddUserReviewModal};
