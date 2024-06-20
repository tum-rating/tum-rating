import { Alert, Anchor, Button, Container, Divider, Flex, LoadingOverlay, Stack, Text, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ContextModalProps, modals } from '@mantine/modals';
import { IconFaceIdError, IconInfoCircle } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUser } from '@/auth/useUser.tsx';
import { contextModalConfig } from '@/components/Modals/contextModalConfig.ts';
import { CourseInput, useAddCourseProposal } from '@/courses/useAddCourseProposal.tsx';
import classes from '@/pages/PageNotFound/PageNotFound.module.css';
import { Paths } from '@/routes/paths.ts';

const openAddCourseModal = ({ ...props }) => {
    modals.openContextModal({
        ...contextModalConfig({
            modal: 'addCourse',
        }),
        ...props,
    });
};
const regex = /https:\/\/campus\.tum\.de\/tumonline\/.*\/student\/courses\/\d+/;
const example_course = 'https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/slc.tm.cp/student/courses/950600157?$scrollTo=toc_overview';
const tum_portal = 'https://campus.tum.de/tumonline/ee/ui/ca2/app/desktop/#/slc.tm.cp/student/courses';

const AddCourseModal = ({ context, id }: ContextModalProps) => {
    const { mutate: addReview, status, isLoading: addReviewLoading, error, isError } = useAddCourseProposal();
    const [apiError, setApiError] = useState(null);
    const navigate = useNavigate();
    const { data: user, isLoading: userLoading } = useUser();

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
        },
    });

    useEffect(() => {
        if (status === 'success') {
            context.closeModal(id);
        }
    }, [context, id, status]);

    const handleSubmit = (form: CourseInput) => {
        addReview({ ...form });
    };

    if (!user && !userLoading) {
        return (
            <Flex direction="column" gap="xs" h="100%" justify="center" align="center" py="md">
                <svg className={classes.notFoundImg} viewBox="0 0 72 72" width="64px" height="64px">
                    <path d="M17.0312 64.4375C26.25 64.4375 33.5625 52.9688 33.5625 36.4375C33.5625 19.9062 26.25 8.46875 17.0312 8.46875C7.8125 8.46875 0.5 19.9062 0.5 36.4375C0.5 52.9688 7.8125 64.4375 17.0312 64.4375ZM54.9688 64.4375C64.1875 64.4375 71.5 52.9688 71.5 36.4375C71.5 19.9062 64.1875 8.46875 54.9688 8.46875C45.75 8.46875 38.4375 19.9062 38.4375 36.4375C38.4375 52.9688 45.75 64.4375 54.9688 64.4375ZM10.0625 47.1875C15.125 47.1875 18.4688 43.6562 18.4688 38.3438C18.4688 33.0938 15.125 29.5625 10.0625 29.5625C7.6875 29.5625 5.71875 30.3125 4.25 31.6875C5.375 19.9375 10.6875 11.9375 17.0312 11.9062C24.25 11.875 30.125 22.0312 30.125 36.4375C30.125 50.7812 24.25 60.9688 17.0312 61C11.5312 61.0312 6.78125 54.9688 4.90625 45.5938C6.28125 46.625 8.03125 47.1875 10.0625 47.1875ZM47.9688 47.1875C53 47.1875 56.4062 43.6562 56.4062 38.3438C56.4062 33.0938 53 29.5625 47.9688 29.5625C45.5938 29.5625 43.5938 30.3438 42.1562 31.6875C43.2812 19.9375 48.5938 11.9375 54.9688 11.9375C62.1562 11.9062 68 22.0938 68 36.4375C68 50.7812 62.1562 60.9688 54.9688 60.9688C49.4375 61 44.6875 54.9375 42.7812 45.5938C44.1562 46.5938 45.9375 47.1875 47.9688 47.1875ZM45.5312 37.4062C44.4375 37.25 43.75 35.9688 44.0312 34.6562C44.3125 33.3125 45.3125 32.3438 46.375 32.5312C47.4688 32.75 48.0938 34.0312 47.8438 35.3125C47.5938 36.6562 46.5938 37.5938 45.5312 37.4062ZM7.625 37.4062C6.53125 37.25 5.84375 35.9688 6.09375 34.6562C6.375 33.3125 7.40625 32.3438 8.4375 32.5312C9.5625 32.7812 10.1875 34.0312 9.9375 35.3125C9.6875 36.6562 8.65625 37.5938 7.625 37.4062Z" />
                </svg>
                <Text data-testid="message" fw="600">
                    Only registered users can add courses proposals.
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
        <Container p={0} data-testid="modal-content">
            <LoadingOverlay visible={addReviewLoading} overlayProps={{ radius: 'sm', blur: 2 }} />
            <form className="modal-form" data-testid="form" onSubmit={form.onSubmit((e) => handleSubmit(e))}>
                <Stack>
                    <Textarea data-testid="textarea" label="Course URL" required placeholder={`Example: ${example_course}`} description="Provide a valid course URL from TUM Campus Portal" value={form.values.url} onChange={(event) => form.setFieldValue('url', event.currentTarget.value)} error={form.errors.url} radius="md" minRows={5} maxRows={10} autosize />
                    {apiError && error && (
                        <Alert data-testid="error-message" variant="light" color="red" title="Error" icon={<IconFaceIdError />} withCloseButton onClose={() => setApiError(false)}>
                            <Text size="xs">{error.message || 'An error occurred'}</Text>
                        </Alert>
                    )}
                    <Button data-testid="submit-button" loading={addReviewLoading} mt="xs" type="submit" variant="gradient" gradient={{ from: 'indigo', to: 'blue', deg: 90 }}>
                        Add Course Proposal
                    </Button>
                    <Alert variant="light" color="green" title="How to add a course" icon={<IconInfoCircle />}>
                        <Text size="sm">
                            To add a course you are interested in, you must first find it on{' '}
                            <Anchor size="sm" fw={600} target={'_blank'} href={tum_portal}>
                                TUM Campus Portal
                            </Anchor>
                            . Copy the link and paste it into our form. If everything is ok, the course will appear within 24 hours.
                            <Text span fw={500} mt="xs" display="block">
                                Example course URL:{' '}
                                <Anchor style={{ overflowWrap: 'anywhere' }} target={'_blank'} href={example_course}>
                                    {example_course}
                                </Anchor>
                            </Text>
                        </Text>
                    </Alert>
                </Stack>
            </form>
        </Container>
    );
};

export { AddCourseModal, openAddCourseModal };
