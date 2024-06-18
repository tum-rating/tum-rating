import { ActionIcon, Button, Divider, Flex, Stack, TagsInput, Text, TextInput, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconExternalLink, IconMasksTheater, IconMoodCheck, IconTrashX } from '@tabler/icons-react';
import { MRT_Row } from 'mantine-react-table';
import { HTMLAttributes, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import classes from '../Shared/styles/ExpansionStyles.module.css';

import { Course, CourseProposal } from '@/admin/types.ts';
import { useAddCourseProposal } from '@/admin/useAddCourseProposal.tsx';
import { useCourseProposal } from '@/admin/useCourseProposal.tsx';
import { useGetScrapedCourseProposal } from '@/admin/useCourseScraper.tsx';
import { useRemoveProposal } from '@/admin/useRemoveProposal.tsx';
import { CollectionDetailsStatusAlert } from '@/components/AdminTable/Shared/CollectionDetailsStatusAlert';
import { UserInfoAction } from '@/components/AdminTable/Shared/UserInfoAction';
import { Skeleton } from '@/components/Skeleton';
import { QUERY_KEY } from '@/constants/queryKeys.ts';
import { queryClient } from '@/react-query/client.ts';
import { getPath, Paths } from '@/routes/paths.ts';

interface ProposalExpansionProps extends HTMLAttributes<HTMLElement> {
    courseProposalId: string;
    row?: MRT_Row<CourseProposal>;
}

const ProposalExpansion = ({ courseProposalId, row, ...rest }: ProposalExpansionProps) => {
    const { data: courseProposalDetails, isLoading, error, isError, refetch } = useCourseProposal(courseProposalId);
    const { refetch: scrapeCourse, data: scrapedData, isLoading: scraperIsLoading, isError: scraperIsError, isSuccess: scraperIsSuccess } = useGetScrapedCourseProposal(courseProposalId);

    const [statusAlertFlag, setStatusAlertFlag] = useState(false);

    const [scraperTUMRequestError, setScraperTUMRequestError] = useState<{
        message?: string;
        name?: string;
        status?: number;
    } | null>();

    const [fetchedProposal, setFetchedProposal] = useState<Partial<Course>>({
        courseId: '',
        courseNumber: '',
        name: '',
        professor: '',
        otherLecturers: [],
        offeredInSemesters: [],
    });

    const { mutate: acceptProposal, isPending: acceptProposalPending, isSuccess: acceptProposalSuccess } = useAddCourseProposal();
    const { mutate: removeProposal, isSuccess: removeProposalSuccess } = useRemoveProposal();

    const navigate = useNavigate();

    useEffect(() => {
        setStatusAlertFlag(isError || removeProposalSuccess || acceptProposalSuccess);
    }, [isError, removeProposalSuccess, acceptProposalSuccess]);

    useEffect(() => {
        if (acceptProposalSuccess) {
            if (row) {
                row.toggleExpanded();
            }
            removeProposal(courseProposalDetails.id);
        }
    }, [acceptProposalSuccess]);

    useEffect(() => {
        if (scraperIsSuccess) {
            if (scrapedData.error) {
                setScraperTUMRequestError(scrapedData.error);
            } else {
                setFetchedProposal(scrapedData.course);
            }
        }
    }, [scraperIsSuccess]);

    useEffect(() => {
        form.setValues(fetchedProposal);
    }, [fetchedProposal]);

    const form = useForm({
        initialValues: {
            courseId: '',
            courseNumber: '',
            name: '',
            professor: '',
            otherLecturers: [],
            offeredInSemesters: [],
        },
        validate: {
            courseId: (value) => !value && 'Course ID is required',
            courseNumber: (value) => !value && 'Course Number is required',
            name: (value) => !value && 'Course Name is required',
            professor: (value) => !value && 'Main Professor is required',
            offeredInSemesters: (value) => !value.length && 'Semester is required',
        },
    });

    return (
        <Flex wrap={{ base: 'wrap', sm: 'nowrap' }} className={classes.expansionContainer} gap="md" w="100%" {...rest}>
            {statusAlertFlag ? (
                <Flex justify="center" w="100%" direction="column" gap="lg">
                    <CollectionDetailsStatusAlert status={isError} message={error?.message} type="error" />
                    <CollectionDetailsStatusAlert status={acceptProposalSuccess} message={`Course proposal ${courseProposalId} accepted`} />
                    <CollectionDetailsStatusAlert status={removeProposalSuccess} message={`Course proposal ${courseProposalId} removed.`} />
                    {isError && (
                        <Button
                            variant="subtle"
                            onClick={() => {
                                refetch();
                            }}
                        >
                            Refetch
                        </Button>
                    )}
                </Flex>
            ) : (
                <>
                    <Flex direction="column" gap="xs" className={classes.expansionDetails}>
                        <Flex align="center" gap="xs" wrap="wrap">
                            <Text fz="sm" fw={500}>
                                Details
                            </Text>
                        </Flex>
                        <Divider variant="dashed" size="sm" />
                        <Flex direction="column" gap="xs">
                            <Flex justify="flex-start" gap="xs" wrap="wrap">
                                <Flex align="center" gap="3">
                                    <Text style={{ whiteSpace: 'nowrap' }} fz="xs" fw="bold">
                                        User:{' '}
                                    </Text>
                                    <Skeleton
                                        width={82}
                                        height={16}
                                        radius="sm"
                                        loading={isLoading}
                                        component={
                                            <UserInfoAction userId={courseProposalDetails?.userId}>
                                                {(user) => (
                                                    <Button px={4} m={0} h={20} variant="subtle" fz="xs" fw="600" c={user?.isBanned ? 'gray' : 'blue'} style={user?.isBanned ? { textDecorationLine: 'line-through' } : {}}>
                                                        {user?.username}
                                                    </Button>
                                                )}
                                            </UserInfoAction>
                                        }
                                    ></Skeleton>
                                </Flex>
                                <Flex align="center" gap="3">
                                    <Text style={{ whiteSpace: 'nowrap' }} fz="xs" fw="bold">
                                        Proposal ID:{' '}
                                    </Text>
                                    <Skeleton
                                        width={155}
                                        height={16}
                                        radius="sm"
                                        loading={isLoading}
                                        component={
                                            <Button
                                                px={4}
                                                m={0}
                                                h={20}
                                                variant="subtle"
                                                fz="xs"
                                                fw="600"
                                                c={'blue'}
                                                onClick={() => {
                                                    const dynamicPath = getPath(Paths.adminCoursesProposalsDetails).replace(':courseProposalId', courseProposalId);
                                                    navigate(dynamicPath);
                                                }}
                                            >
                                                {courseProposalDetails?.id}
                                            </Button>
                                        }
                                    ></Skeleton>
                                </Flex>
                                <Flex align="center" gap="3">
                                    <Text style={{ whiteSpace: 'nowrap' }} fz="xs" fw="bold">
                                        Created at:{' '}
                                    </Text>
                                    <Skeleton
                                        width={155}
                                        height={16}
                                        radius="sm"
                                        loading={isLoading}
                                        component={
                                            <Text truncate fz="xs" fw="600" c="dimmed">
                                                {new Date(courseProposalDetails?.createdAt).toLocaleString()}
                                            </Text>
                                        }
                                    ></Skeleton>
                                </Flex>
                                <Flex w="100%" align="flex-end" pos="relative">
                                    <TextInput w="100%" label="Course URL" value={courseProposalDetails?.url} description="This is the course URL provided by the user" readOnly placeholder="Enter course URL" error={scraperIsError || scraperTUMRequestError ? error?.message || 'Scraper TUM request error ' + scraperTUMRequestError.message || 'scraper error' : undefined} />
                                    <Flex pos="absolute" right={0} top={0}>
                                        <Tooltip label="Open in new tab">
                                            <ActionIcon
                                                variant="subtle"
                                                onClick={() => {
                                                    window.open(courseProposalDetails?.url, '_blank');
                                                }}
                                            >
                                                <IconExternalLink size={19} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Flex>
                                </Flex>
                            </Flex>
                            {fetchedProposal && (
                                <form>
                                    <Flex wrap="wrap" gap="xs" direction="column">
                                        <Skeleton height={36} radius="sm" mt={22} loading={isLoading} component={<TextInput label="Course Name" placeholder="Enter course name" value={form.values.name} error={form.errors.name} onChange={(event) => form.setFieldValue('name', event.currentTarget.value)} />}></Skeleton>
                                        <Flex gap="xs" wrap={{ base: 'wrap', sm: 'nowrap' }} w="100%">
                                            <Skeleton height={36} radius="sm" mt={22} loading={isLoading} component={<TextInput w={{ base: '100%', sm: '50%' }} label="Course ID" placeholder="Enter course id" value={form.values.courseId} error={form.errors.courseId} onChange={(event) => form.setFieldValue('courseId', event.currentTarget.value)} />}></Skeleton>
                                            <Skeleton height={36} radius="sm" mt={22} loading={isLoading} component={<TextInput w={{ base: '100%', sm: '50%' }} label="Course Number" placeholder="Enter course number" value={form.values.courseNumber} error={form.errors.courseNumber} onChange={(event) => form.setFieldValue('courseNumber', event.currentTarget.value)} />}></Skeleton>
                                        </Flex>

                                        <Flex direction="column" gap="xs" w="100%">
                                            <Skeleton height={36} radius="sm" mt={22} loading={isLoading} component={<TextInput label="Main Professor" placeholder="Enter professor name" value={form.values.professor} error={form.errors.professor} onChange={(event) => form.setFieldValue('professor', event.currentTarget.value)} />}></Skeleton>
                                        </Flex>
                                        <Flex gap="xs" wrap={{ base: 'wrap', sm: 'nowrap' }} w="100%">
                                            <Skeleton
                                                height={104}
                                                radius="sm"
                                                mt={22}
                                                loading={isLoading}
                                                component={
                                                    <TagsInput
                                                        w={{ base: '100%', sm: '50%' }}
                                                        label="Semester"
                                                        error={form.errors.offeredInSemesters}
                                                        placeholder="Click enter to add semester"
                                                        value={form.values.offeredInSemesters}
                                                        onRemove={(value) => {
                                                            form.setFieldValue(
                                                                'offeredInSemesters',
                                                                form.values.offeredInSemesters.filter((v) => v !== value),
                                                            );
                                                        }}
                                                        onOptionSubmit={(value) => {
                                                            form.setFieldValue('offeredInSemesters', [...form.values.offeredInSemesters, value]);
                                                        }}
                                                    />
                                                }
                                            ></Skeleton>
                                            <Skeleton
                                                height={104}
                                                radius="sm"
                                                mt={22}
                                                loading={isLoading}
                                                component={
                                                    <TagsInput
                                                        w={{ base: '100%', sm: '50%' }}
                                                        label="Other professors"
                                                        placeholder="Click enter to add other professors"
                                                        value={form.values.otherLecturers}
                                                        error={form.errors.otherLecturers}
                                                        onRemove={(value) => {
                                                            form.setFieldValue(
                                                                'otherLecturers',
                                                                form.values.otherLecturers.filter((v) => v !== value),
                                                            );
                                                        }}
                                                        onOptionSubmit={(value) => {
                                                            form.setFieldValue('otherLecturers', [...form.values.otherLecturers, value]);
                                                        }}
                                                    />
                                                }
                                            ></Skeleton>
                                        </Flex>
                                    </Flex>
                                </form>
                            )}
                        </Flex>
                    </Flex>
                </>
            )}
            <Flex direction="column" gap="xs" className={classes.expansionActions}>
                <Flex align="center" gap="xs">
                    <Text fz="sm" fw={500}>
                        Actions
                    </Text>
                </Flex>
                <Stack gap="xs">
                    <Divider variant="dashed" size="sm" />
                    <Button
                        onClick={() => {
                            if (scrapedData) {
                                if (scrapedData.error) {
                                    setScraperTUMRequestError(scrapedData.error);
                                } else {
                                    setFetchedProposal(scrapedData.course);
                                }
                            } else {
                                scrapeCourse();
                            }
                        }}
                        loading={scraperIsLoading || isLoading}
                        leftSection={<IconMasksTheater width={16} />}
                        disabled={statusAlertFlag}
                    >
                        Scrape Course
                    </Button>
                    {fetchedProposal.courseId && (
                        <Button
                            loading={isLoading}
                            onClick={() => {
                                queryClient.removeQueries({ queryKey: [QUERY_KEY.scrape_course, fetchedProposal.courseId] });
                                setFetchedProposal({
                                    courseId: '',
                                    courseNumber: '',
                                    name: '',
                                    professor: '',
                                    otherLecturers: [],
                                    offeredInSemesters: [],
                                });
                            }}
                            leftSection={<IconTrashX width={16} />}
                            disabled={statusAlertFlag}
                            color="red"
                        >
                            Clear Scraped Data
                        </Button>
                    )}
                    <Divider variant="dashed" size="sm" />
                    <Button
                        onClick={() => {
                            const validate = form.validate();
                            if (!validate.hasErrors) {
                                acceptProposal(form.values);
                            }
                        }}
                        loading={acceptProposalPending || scraperIsLoading || isLoading}
                        disabled={statusAlertFlag}
                        color="green"
                        leftSection={<IconMoodCheck width={16} />}
                    >
                        Accept Proposal
                    </Button>
                    <Button
                        onClick={() => {
                            removeProposal(courseProposalDetails.id);
                        }}
                        loading={acceptProposalPending || scraperIsLoading || isLoading}
                        disabled={statusAlertFlag}
                        leftSection={<IconTrashX width={16} />}
                        color="red"
                    >
                        Remove Proposal
                    </Button>
                </Stack>
            </Flex>
        </Flex>
    );
};

export { ProposalExpansion };
