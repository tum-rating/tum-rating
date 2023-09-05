
import { useForm } from '@mantine/form';
import {  Button, Group, Paper, Stack, Text, TextInput } from '@mantine/core';
// eslint-disable-next-line import/named
import { ContextModalProps, modals } from '@mantine/modals';
import {useAddReview,ReviewInput} from "../../reviews/useAddReview";
import {nanoid} from "nanoid";
import {useEffect} from "react";

const openAddCourseModal = () => {
    modals.openContextModal({
        modal: 'addCourse',
        title: 'Add Course',
        innerProps: {},
    });
};
const AddCourseModal = ({ context, id }: ContextModalProps) => {
    const {addReview,status} = useAddReview();
    const form = useForm({
        initialValues: {
            courseId: nanoid(),
            courseNumber: nanoid(),
            professor: "",
            course: "",
        },
    });

    useEffect(() => {
        if(status === 'success') {
            context.closeModal(id)
        }
    },[status])

    const onAddCourse = (form: ReviewInput) =>{
        const {courseId, courseNumber, professor, course} = form;
        addReview({courseId, courseNumber, professor, course})
    }

    return (
        <Paper radius="md" p="xl">
            <Text size="xl" weight={600}>
                Add New Course
            </Text>
            <form
                onSubmit={form.onSubmit((e) => {
                    onAddCourse(e);
                })}
            >
                <Stack>
                    <TextInput
                        required
                        label="Course name"
                        placeholder="Course name"
                        value={form.values.course}
                        onChange={(event) => form.setFieldValue('course', event.currentTarget.value)}
                        radius="md"
                    />
                    <TextInput
                        required
                        label="Professor"
                        placeholder="Professor"
                        value={form.values.professor}
                        onChange={(event) => form.setFieldValue('professor', event.currentTarget.value)}
                        radius="md"
                    />
                </Stack>
                <Group position="apart" mt="xl">
                    <Button type="submit" radius="xl">
                        Add New Course
                    </Button>
                </Group>
            </form>
        </Paper>
    );
};

export { AddCourseModal, openAddCourseModal };
