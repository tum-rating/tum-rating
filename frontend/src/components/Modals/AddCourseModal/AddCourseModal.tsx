import {
    Alert,
    BackgroundImage,
    Button,
    Center,
    Container,
    LoadingOverlay,
    Select,
    Stack,
    Text,
    TextInput
} from '@mantine/core';
import {useForm} from '@mantine/form';
import {ContextModalProps, modals} from '@mantine/modals';
import {IconFaceIdError} from "@tabler/icons-react";
import {nanoid} from 'nanoid';
import {useEffect, useState} from 'react';

import {contextModalConfig} from '@/components/Modals/contextModalConfig.ts';
import {CourseInput, useAddCourseProposal} from '@/courses/useAddCourseProposal.tsx';


const openAddCourseModal = ({...props}) => {
    modals.openContextModal({
        ...contextModalConfig('addCourse', <Text fw={600}>Add Course Proposal</Text>),
        ...props,
    });
};

const AddCourseModal = ({context, id}: ContextModalProps) => {
    const {mutate: addReview, status, isLoading: addReviewLoading, error, isError} = useAddCourseProposal();
    const [apiError, setApiError] = useState(null);

    useEffect(() => {
        setApiError(isError)
    }, [isError]);

    const form = useForm({
        initialValues: {
            courseId: nanoid(),
            courseNumber: nanoid(),
            professor: '',
            name: '',
            semester: '',
        },
    });

    useEffect(() => {
        if (status === 'success') {
            context.closeModal(id);
        }
    }, [context, id, status]);

    const handleSubmit = (form: CourseInput) => {
        addReview({...form});
    };

    return (
        <Container p={0} data-testid="cypress-add-new-course-modal">
            <LoadingOverlay visible={addReviewLoading} overlayProps={{radius: 'sm', blur: 2}}/>
            <form onSubmit={form.onSubmit((e) => handleSubmit(e))}>
                <Stack>
                    <TextInput data-testid="cypress-add-new-course-name-input" required label="Course name"
                               placeholder="Course name" value={form.values.name}
                               onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
                               radius="md"/>
                    <TextInput data-testid="cypress-add-new-course-professor-input" required label="Professor"
                               placeholder="Professor" value={form.values.professor}
                               onChange={(event) => form.setFieldValue('professor', event.currentTarget.value)}
                               radius="md"/>
                    <Select data-testid="cypress-add-new-course-semester-select" label="Semester" placeholder="Semester"
                            value={form.values.semester}
                            onChange={(value: string) => form.setFieldValue('semester', value)}
                            data={[{value: '2023 S', label: '2023 S'}]}/>
                    {apiError && error && (
                        <Alert variant="light" color="red" title="Error" icon={<IconFaceIdError/>}
                               withCloseButton onClose={() => setApiError(false)}>
                            <Text size="xs">
                                {error.message || 'An error occurred'}
                            </Text>
                        </Alert>
                    )}
                    <Button loading={addReviewLoading} mt="xs" type="submit" variant="gradient"
                            gradient={{from: 'indigo', to: 'blue', deg: 90}}>
                        Add Course Proposal
                    </Button>
                    <BackgroundImage
                        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-6.png"
                        radius="md"
                        pos="relative"
                    >
                        <Center p="md">
                            <Text c="white" fw={800} pos='relative' style={{zIndex: 5}}>
                                Your course proposal will be reviewed in 24 hours. Thank you for your contribution!
                            </Text>
                        </Center>
                    </BackgroundImage>
                </Stack>
            </form>
        </Container>
    );
};

export {AddCourseModal, openAddCourseModal};
