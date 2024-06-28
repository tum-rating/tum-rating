import { Badge, Button, Container, Divider, Flex, LoadingOverlay, Select, Stack, Text, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ContextModalProps, modals } from '@mantine/modals';
import { IconStars } from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUser } from '@/auth/useUser.tsx';
import { HowEasyEditableRating } from '@/components/Course/HowEasyEditableRating.tsx';
import { HowInterestingEditableRating } from '@/components/Course/HowInterestingEditableRating.tsx';
import { contextModalConfig } from '@/components/Modals/contextModalConfig.ts';
import { CloseButton } from '@/components/Modals/shared/CloseButton';
import { ModalHeader } from '@/components/Modals/shared/ModalHeader';
import { Skeleton } from '@/components/Skeleton';
import { useAddUserReview, UserAddReviewInput } from '@/courses/useAddUserReview.tsx';
import { useDetailCourse } from '@/courses/useCourse.tsx';
import { useVisualViewportHeight } from '@/hooks/useVisualViewportHeight/useVisualViewportHeight.tsx';
import classes from '@/pages/PageNotFound/PageNotFound.module.css';
import { Paths } from '@/routes/paths.ts';

const openAddUserReviewModal = ({ courseId, ...props }) => {
    modals.openContextModal({
        ...contextModalConfig({
            modal: 'addUserReview',
        }),
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
    const { courseId } = innerProps;

    const { data: user } = useUser();

    const { data: courseData, isLoading: courseDetailsLoading, isError: courseDetailsError } = useDetailCourse(courseId || '');

    const navigate = useNavigate();
    const { mutate: addUserReview, isSuccess, isLoading } = useAddUserReview(courseId, 'POST');

    const offeredInSemesters = useMemo(
        () =>
            courseData?.offeredInSemesters.map((semester) => {
                return { value: semester, label: semester };
            }),
        [courseData],
    );

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
        addUserReview({ ...form });
        if (id) closeModal();
    };

    const closeModal = () => {
        context.closeModal(id);
    };

    const visualViewport = useVisualViewportHeight();

    if (courseDetailsError) {
        return (
            <Stack>
                <Text fw="600" c="red">
                    Unexpected error - course not found
                </Text>
                <Button
                    onClick={() => {
                        if (id) closeModal();
                    }}
                >
                    Back to Course
                </Button>
            </Stack>
        );
    }

    if (!user) {
        return (
            <Flex direction="column" gap="xs" h="100%" justify="center" align="center" py="md">
                <svg className={classes.notFoundImg} viewBox="0 0 72 72" width="64px" height="64px">
                    <path d="M17.0312 64.4375C26.25 64.4375 33.5625 52.9688 33.5625 36.4375C33.5625 19.9062 26.25 8.46875 17.0312 8.46875C7.8125 8.46875 0.5 19.9062 0.5 36.4375C0.5 52.9688 7.8125 64.4375 17.0312 64.4375ZM54.9688 64.4375C64.1875 64.4375 71.5 52.9688 71.5 36.4375C71.5 19.9062 64.1875 8.46875 54.9688 8.46875C45.75 8.46875 38.4375 19.9062 38.4375 36.4375C38.4375 52.9688 45.75 64.4375 54.9688 64.4375ZM10.0625 47.1875C15.125 47.1875 18.4688 43.6562 18.4688 38.3438C18.4688 33.0938 15.125 29.5625 10.0625 29.5625C7.6875 29.5625 5.71875 30.3125 4.25 31.6875C5.375 19.9375 10.6875 11.9375 17.0312 11.9062C24.25 11.875 30.125 22.0312 30.125 36.4375C30.125 50.7812 24.25 60.9688 17.0312 61C11.5312 61.0312 6.78125 54.9688 4.90625 45.5938C6.28125 46.625 8.03125 47.1875 10.0625 47.1875ZM47.9688 47.1875C53 47.1875 56.4062 43.6562 56.4062 38.3438C56.4062 33.0938 53 29.5625 47.9688 29.5625C45.5938 29.5625 43.5938 30.3438 42.1562 31.6875C43.2812 19.9375 48.5938 11.9375 54.9688 11.9375C62.1562 11.9062 68 22.0938 68 36.4375C68 50.7812 62.1562 60.9688 54.9688 60.9688C49.4375 61 44.6875 54.9375 42.7812 45.5938C44.1562 46.5938 45.9375 47.1875 47.9688 47.1875ZM45.5312 37.4062C44.4375 37.25 43.75 35.9688 44.0312 34.6562C44.3125 33.3125 45.3125 32.3438 46.375 32.5312C47.4688 32.75 48.0938 34.0312 47.8438 35.3125C47.5938 36.6562 46.5938 37.5938 45.5312 37.4062ZM7.625 37.4062C6.53125 37.25 5.84375 35.9688 6.09375 34.6562C6.375 33.3125 7.40625 32.3438 8.4375 32.5312C9.5625 32.7812 10.1875 34.0312 9.9375 35.3125C9.6875 36.6562 8.65625 37.5938 7.625 37.4062Z" />
                </svg>
                <Text data-testid="message" fw="600">
                    Only registered users can add reviews.
                </Text>
                <Button onClick={() => navigate(Paths.signIn)} mt="md" fullWidth data-testid="sign-in-btn">
                    Sign In
                </Button>
                <Divider w="100%" variant="dotted" my="xs" size="md" label="or" labelPosition="center" />
                <Button onClick={() => navigate(Paths.signUp)} fullWidth variant="outline" data-testid="sign-up-btn">
                    Sign Up
                </Button>
            </Flex>
        );
    }
    return (
        <Container px={0} pos="relative" h={visualViewport}>
            <ModalHeader title="Add review" subTitle={courseData.name} icon={<IconStars width={21} />} />
            <CloseButton
                onClick={() => {
                    context.closeModal(id);
                }}
            />
            <LoadingOverlay visible={isLoading} overlayProps={{ radius: 'sm', blur: 2 }} />
            <form
                data-testid="form"
                className="modal-form"
                style={{ height: '100%', overflowY: 'auto' }}
                onSubmit={form.onSubmit((e) => {
                    handleSubmit(e);
                })}
            >
                <Flex direction="column" gap="xs" h="100%" p="sm">
                    <Textarea
                        data-testid="textarea"
                        autoFocus
                        data-autofocus
                        autosize
                        minRows={6}
                        maxRows={6}
                        label="Your comment"
                        h="auto"
                        value={form.values.comment}
                        {...form.getInputProps('comment')}
                        onChange={(event) => form.setFieldValue('comment', event.currentTarget.value)}
                        placeholder="Course Review: Loved the course! Learned a lot... &#10;&#10;Exercise: Challenging but fun... &#10;&#10;Exam: The exams were difficult and I recommend a lot of studying before them. "
                    />
                    <Skeleton h={36} loading={courseDetailsLoading} component={<Select data-testid="select" {...form.getInputProps('semester')} label="Semester" placeholder="Semester" value={form.values.semester} onChange={(value: string) => form.setFieldValue('semester', value)} data={offeredInSemesters} />} />
                    <Flex w="100%" gap="xl" direction="row" justify="center" wrap="wrap" mt="md" mb="md">
                        <Stack>
                            <HowEasyEditableRating onChange={(value) => form.setFieldValue('howEasyRating', value)} score={form.values.howEasyRating} />
                            {form.errors.howEasyRating && (
                                <Badge variant="light" color="red">
                                    {form.errors.howEasyRating}
                                </Badge>
                            )}
                        </Stack>
                        <Stack>
                            <HowInterestingEditableRating onChange={(value) => form.setFieldValue('howInterestingRating', value)} score={form.values.howInterestingRating} />
                            {form.errors.howInterestingRating && (
                                <Badge variant="light" color="red">
                                    {form.errors.howInterestingRating}
                                </Badge>
                            )}
                        </Stack>
                    </Flex>

                    <Flex justify="space-between" mb="xs">
                        <Button onClick={() => closeModal()} color={'gray'} variant={'subtle'}>
                            Cancel
                        </Button>
                        <Button type="submit">Send</Button>
                    </Flex>
                </Flex>
            </form>
        </Container>
    );
};

export { AddUserReviewModal, openAddUserReviewModal };
