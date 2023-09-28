import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { Button, Group, Paper, Select, Stack, Text, TextInput } from '@mantine/core';
import { ContextModalProps, modals } from '@mantine/modals';
import { nanoid } from 'nanoid';

import { ReviewInput, useAddReview } from '@/reviews/useAddReview';

const openAddCourseModal = () => {
    modals.openContextModal({
        modal: 'addCourse',
        title: 'Add Course',
        innerProps: {},
        fullScreen: window.innerWidth <= 900,
    });
};
const AddCourseModal = ({ context, id }: ContextModalProps) => {
    const { mutate: addReview, status } = useAddReview();
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

    const onAddCourse = (form: ReviewInput) => {
        addReview({ ...form });
    };

    return (
        <Paper data-testid="cypress-add-new-course-modal" radius="md" p="xl">
            <Text size="xl" weight={600}>
                Add New Course
            </Text>
            <form
                onSubmit={form.onSubmit((e) => {
                    onAddCourse(e);
                })}
            >
                <Stack>
                    <TextInput data-testid="cypress-add-new-course-name-input" required label="Course name" placeholder="Course name" value={form.values.course} onChange={(event) => form.setFieldValue('course', event.currentTarget.value)} radius="md" />
                    <TextInput data-testid="cypress-add-new-course-professor-input" required label="Professor" placeholder="Professor" value={form.values.professor} onChange={(event) => form.setFieldValue('professor', event.currentTarget.value)} radius="md" />
                    <Select data-testid="cypress-add-new-course-semester-select" label="Semester" placeholder="Semester" value={form.values.semester} onChange={(value: string) => form.setFieldValue('semester', value)} data={[{ value: '2023 S', label: '2023 S' }]} />
                </Stack>
                <Group position="apart" mt="xl">
                    <Button data-testid="cypress-add-new-course-submit-btn" type="submit" radius="xl">
                        Add New Course
                    </Button>
                </Group>
            </form>
        </Paper>
    );
};

export { AddCourseModal, openAddCourseModal };
