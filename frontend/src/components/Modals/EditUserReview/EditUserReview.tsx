import { Badge, Button, Flex, LoadingOverlay, Select, Stack, Text, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ContextModalProps, modals } from '@mantine/modals';
import { IconStars } from '@tabler/icons-react';
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useUser } from '@/auth/useUser.tsx';
import { HowEasyEditableRating } from '@/components/Course/HowEasyEditableRating.tsx';
import { HowInterestingEditableRating } from '@/components/Course/HowInterestingEditableRating.tsx';
import { contextModalConfig } from '@/components/Modals/contextModalConfig.ts';
import { CloseButton } from '@/components/Modals/shared/CloseButton';
import { ModalHeader } from '@/components/Modals/shared/ModalHeader';
import { ModalResponsiveContainer } from '@/components/Modals/shared/ModalResponsiveContainer';
import { Skeleton } from '@/components/Skeleton';
import { DetailCourse } from '@/courses/types.ts';
import { useAddUserReview, UserAddReviewInput } from '@/courses/useAddUserReview.tsx';
import { useDetailCourse } from '@/courses/useCourse.tsx';

const openEditUserReviewModal = ({ courseId, userReview, ...props }) => {
    modals.openContextModal({
        ...contextModalConfig({
            modal: 'editUserReview',
        }),
        innerProps: {
            courseId,
            userReview,
        },
        ...props,
    });
};

const EditUserReviewModal = ({ context, id, innerProps }: ContextModalProps<{ courseId: string }>) => {
    const { courseId } = innerProps;
    const { mutate: editUserReview, isSuccess, isLoading } = useAddUserReview(courseId, 'PATCH');
    const { data: courseData, isLoading: courseDetailsLoading, isError: courseDetailsError } = useDetailCourse(courseId || '');
    const { data: user } = useUser();
    const { data: userReview }: { data: DetailCourse } = useDetailCourse(courseId, { retry: 0 });
    const location = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
        if (isSuccess) {
            document.querySelector("[data-comment='user-comment']")?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest',
            });
        }
    }, [isSuccess]);

    const offeredInSemesters = useMemo(
        () =>
            courseData?.offeredInSemesters.map((semester) => {
                return { value: semester, label: semester };
            }),
        [courseData],
    );

    useEffect(() => {
        const userReviewComment = userReview?.reviews.find((data) => data.userId === user.id);
        if (userReviewComment) {
            const { howEasyRating, howInterestingRating, comment, semester } = userReviewComment;
            form.setFieldValue('howEasyRating', howEasyRating);
            form.setFieldValue('howInterestingRating', howInterestingRating);
            form.setFieldValue('comment', comment);
            form.setFieldValue('semester', semester);
        } else {
            const pathWithoutHash = location.pathname.split('#')[0];
            navigate(pathWithoutHash);
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
        editUserReview({ ...form });
        context.closeModal(id);
    };

    if (courseDetailsError) {
        return (
            <Stack>
                <Text fw="600" c="red">
                    Unexpected error - course not found
                </Text>
                <Button
                    onClick={() => {
                        context.closeModal(id);
                    }}
                >
                    Back to Course
                </Button>
            </Stack>
        );
    }
    return (
        <ModalResponsiveContainer>
            <ModalHeader title="Edit your review" subTitle={courseData?.name} icon={<IconStars width={21} />} />
            <CloseButton
                onClick={() => {
                    context.closeModal(id);
                }}
            />
            <LoadingOverlay visible={isLoading || courseDetailsLoading} overlayProps={{ radius: 'sm', blur: 2 }} data-testid="loading" />
            <form
                className="modal-form"
                data-testid="form"
                style={{ height: '100%' }}
                onSubmit={form.onSubmit((e) => {
                    onEditUserReview(e);
                })}
            >
                <Flex direction="column" gap="xs" h="100%" p="sm">
                    <Textarea data-testid="textarea" placeholder="Your comment" label="Your comment" autosize maxRows={6} minRows={6} value={form.values.comment} {...form.getInputProps('comment')} onChange={(event) => form.setFieldValue('comment', event.currentTarget.value)} />
                    <Skeleton h={36} loading={courseDetailsLoading} component={<Select {...form.getInputProps('semester')} data-testid="select" label="Semester" placeholder="Semester" value={form.values.semester} onChange={(value: string) => form.setFieldValue('semester', value)} data={offeredInSemesters} />} />
                    <Flex w="100%" gap="xl" direction="row" justify="center" wrap="wrap" mt="md" mb="md">
                        <Stack>
                            <HowEasyEditableRating onChange={(value) => form.setFieldValue('howEasyRating', value)} score={form.values.howEasyRating} />
                            {form.errors.howEasyRating && (
                                <Badge data-testid="how-easy-error" variant="light" color="red">
                                    {form.errors.howEasyRating}
                                </Badge>
                            )}
                        </Stack>
                        <Stack>
                            <HowInterestingEditableRating onChange={(value) => form.setFieldValue('howInterestingRating', value)} score={form.values.howInterestingRating} />
                            {form.errors.howInterestingRating && (
                                <Badge data-testid="how-interesting-error" variant="light" color="red">
                                    {form.errors.howInterestingRating}
                                </Badge>
                            )}
                        </Stack>
                    </Flex>
                    <Flex mt="auto" justify="space-between" mb="xs">
                        <Button onClick={() => context.closeModal(id)} color={'gray'} variant={'subtle'}>
                            Cancel
                        </Button>
                        <Button type="submit">Update</Button>
                    </Flex>
                </Flex>
            </form>
        </ModalResponsiveContainer>
    );
};

export { EditUserReviewModal, openEditUserReviewModal };
