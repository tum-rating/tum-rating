import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { Button, Container, LoadingOverlay, Select, Stack, TextInput, Text } from '@mantine/core';
import { ContextModalProps, modals } from '@mantine/modals';
import { nanoid } from 'nanoid';
import { ReviewInput, useAddReview } from '@/reviews/useAddReview.tsx';
import { contextModalConfig } from '@/components/Modals/contextModalConfig.ts';

const openAddCourseModal = ({ courseId, ...props }) => {
    modals.openContextModal({
        ...contextModalConfig('addCourse', <Text fw={600}>Add New Course</Text>),
        ...props,
    });
};

const AddCourseModal = ({ context, id }: ContextModalProps) => {
    const { mutate: addReview, status, isLoading: addReviewLoading } = useAddReview();
    const form = useForm({
        initialValues: {
            courseId: nanoid(),
            courseNumber: nanoid(),
            professor: '',
            course: '',
            semester: '',
        },
    });

    useEffect(() => {
        if (status === 'success') {
            context.closeModal(id);
        }
    }, [status]);

    const handleSubmit = (form: ReviewInput) => {
        addReview({ ...form });
    };

    return (
        <Container p={0} data-testid="cypress-add-new-course-modal">
            <LoadingOverlay visible={addReviewLoading} overlayProps={{ radius: 'sm', blur: 2 }} />
            <form onSubmit={form.onSubmit((e) => handleSubmit(e))}>
                <Stack>
                    <TextInput data-testid="cypress-add-new-course-name-input" required label="Course name" placeholder="Course name" value={form.values.course} onChange={(event) => form.setFieldValue('course', event.currentTarget.value)} radius="md" />
                    <TextInput data-testid="cypress-add-new-course-professor-input" required label="Professor" placeholder="Professor" value={form.values.professor} onChange={(event) => form.setFieldValue('professor', event.currentTarget.value)} radius="md" />
                    <Select data-testid="cypress-add-new-course-semester-select" label="Semester" placeholder="Semester" value={form.values.semester} onChange={(value: string) => form.setFieldValue('semester', value)} data={[{ value: '2023 S', label: '2023 S' }]} />
                    <Button mt="xs" type="submit" variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }}>
                        Add New Course
                    </Button>
                </Stack>
            </form>
        </Container>
    );
};

export { AddCourseModal, openAddCourseModal };
