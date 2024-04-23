import {Alert, Anchor, Button, Container, LoadingOverlay, Stack, Text, Textarea} from '@mantine/core';
import {useForm} from '@mantine/form';
import {ContextModalProps, modals} from '@mantine/modals';
import {IconFaceIdError, IconInfoCircle} from '@tabler/icons-react';
import {useEffect, useState} from 'react';

import {contextModalConfig} from '@/components/Modals/contextModalConfig.ts';
import {CourseInput, useAddCourseProposal} from '@/courses/useAddCourseProposal.tsx';

const openAddCourseModal = ({...props}) => {
    modals.openContextModal({
        ...contextModalConfig('addCourse', <Text fw={600}>Add Course Proposal</Text>),
        ...props,
    });
};
const regex = /https:\/\/campus\.tum\.de\/tumonline\/.*\/student\/courses\/\d+/
const example_course = "https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/slc.tm.cp/student/courses/950600157?$scrollTo=toc_overview"
const tum_portal = "https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/slc.tm.cp/student/courses"

const AddCourseModal = ({context, id}: ContextModalProps) => {
    const {mutate: addReview, status, isLoading: addReviewLoading, error, isError} = useAddCourseProposal();
    const [apiError, setApiError] = useState(null);

    useEffect(() => {
        setApiError(isError);
    }, [isError]);

    const form = useForm({
        initialValues: {
            url: '',
        },
        validate: {
            url: (value) => {
                if (!value.match(regex)) {
                    return 'Please provide a valid course URL from TUM Campus Portal';
                }
                return null;
            },
        }

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
                    <Textarea
                        label="Course URL"
                        required
                        placeholder={`Example: ${example_course}`}
                        description="Please provide a valid course URL from TUM Campus Portal"
                        value={form.values.url}
                        onChange={(event) => form.setFieldValue('url', event.currentTarget.value)}
                        error={form.errors.url}
                        radius="md"
                        minRows={5}
                        maxRows={10}
                        autosize
                    />
                    {apiError && error && (
                        <Alert variant="light" color="red" title="Error" icon={<IconFaceIdError/>} withCloseButton
                               onClose={() => setApiError(false)}>
                            <Text size="xs">{error.message || 'An error occurred'}</Text>
                        </Alert>
                    )}
                    <Button loading={addReviewLoading} mt="xs" type="submit" variant="gradient"
                            gradient={{from: 'indigo', to: 'blue', deg: 90}}>
                        Add Course Proposal
                    </Button>
                    <Alert variant="light" color="green" title="How to add a course" icon={<IconInfoCircle/>}>
                        <Text size="sm" >
                            To add a course you are interested in, you must first find it on <Anchor size="sm" fw={600} target={"_blank"} href={tum_portal}>TUM Campus Portal</Anchor>.
                            Copy the link and paste it into our form.
                            If everything is ok, the course will appear within 24 hours.
                            <Text fw={500} mt="xs">
                                Example course URL: <Anchor style={{overflowWrap: 'anywhere'}} target={"_blank"} href={example_course}>{example_course}</Anchor>
                            </Text>
                        </Text>
                    </Alert>
                </Stack>
            </form>
        </Container>
    );
};

export {AddCourseModal, openAddCourseModal};
