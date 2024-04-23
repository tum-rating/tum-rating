import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Center,
    Divider,
    Flex, Loader,
    Pill,
    PillsInput,
    Stack,
    Text,
    TextInput
} from '@mantine/core';
import {IconDatabaseX, IconMasksTheater, IconMoodCheck, IconTrashX} from '@tabler/icons-react';
import {useEffect, useState} from 'react';

import classes from '../Shared/styles/ExpansionStyles.module.css';

import {CourseProposal} from '@/admin/types.ts';
import {useCourseProposal} from '@/admin/useCourseProposal.tsx';
import {useRemoveProposal} from '@/admin/useRemoveProposal.tsx';
import {useCourseScraper} from "@/admin/useCourseScraper.tsx";
import {UserInfoAction} from '@/components/AdminTable/Shared/UserInfoAction';
import {Skeleton} from '@/components/Skeleton';
import {useAddCourseProposal} from "@/admin/useAddCourseProposal.tsx";
import {notifications} from "@mantine/notifications";

interface ProposalExpansionProps {
    proposal: CourseProposal;
}

const ProposalExpansion = ({proposal: IProposal}: ProposalExpansionProps) => {
    const {data: courseProposalDetails, isLoading, error, isError, refetch} = useCourseProposal(IProposal.id);
    const {
        refetch: scrapeCourse,
        data: scrapedData,
        isLoading: scraperIsLoading,
        // isError: scraperIsError,
        isSuccess: scraperIsSuccess
    } = useCourseScraper(IProposal.url || "");
    const [newLecturer, setNewLecturer] = useState('');
    const [fetchedProposal, setFetchedProposal] = useState({
        courseId: "",
        courseNumber: "",
        name: "",
        professor: "",
        otherLecturers: [],
        offeredInSemesters: []
    });
    const {mutate: acceptProposal, isPending: acceptProposalPending, isSuccess:acceptProposalSuccess} = useAddCourseProposal();
    const {mutate: removeProposal} = useRemoveProposal();


    useEffect(() => {
        if(acceptProposalSuccess){
            removeProposal(courseProposalDetails.id);
        }
    }, [acceptProposalSuccess]);

    useEffect(() => {
        if (scraperIsSuccess) {
            console.log(scrapedData)
            setFetchedProposal(scrapedData);
        }
    }, [scraperIsSuccess]);


    return (
        <Flex wrap={{base: 'wrap', sm: 'nowrap'}} className={classes.expansionContainer} gap="md">
            <button onClick={()=>{
                notifications.show({
                    title: 'Accepting proposal',
                    message: <Flex direction="column">
                        <Flex align="center" gap="3">
                            <Loader size="13" />
                            <Text size="xs">Accepting proposal</Text>
                        </Flex>
                        <Flex align="center" gap="3">
                            <Box size="xs" w={13} h={13} bg="gray.3" style={{borderRadius: '50%'}}/>
                            <Text size="xs">Remove accepted proposal</Text>

                        </Flex>

                    </Flex>,
                    autoClose: false,
                    withCloseButton: false,
                });
            }}></button>
            {isError ? (
                <Center h={270}>
                    <Flex direction="column">
                        <Text fw={600}>Error occurred - {IProposal.id}</Text>
                        <Alert variant="light" color="red" title="Alert title"
                               icon={<IconDatabaseX height={120} width={120}/>}>
                            {error?.message || 'An error occurred while fetching the data - error message not provided'}
                        </Alert>
                        <Button
                            variant={'white'}
                            c="black"
                            onClick={() => {
                                refetch();
                            }}
                        >
                            Refetch
                        </Button>
                    </Flex>
                </Center>
            ) : (
                <>
                    <Flex direction="column" gap="xs" className={classes.expansionDetails}>
                        <Flex align="center" gap="xs" wrap="wrap">
                            <Text fz="sm" fw={500}>
                                Details
                            </Text>
                        </Flex>
                        <Divider variant="dashed" size="sm"/>
                        <Flex direction="column" gap="xs">
                            <Flex justify="flex-start" gap="xs" wrap="wrap">
                                <Flex align="center" gap="3">
                                    <Text style={{whiteSpace: 'nowrap'}} fz="xs" fw="bold">
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
                                                    <Button px={4} m={0} h={20} variant="subtle" fz="xs" fw="600"
                                                            c={user?.isBanned ? 'gray' : 'blue'}
                                                            style={user?.isBanned ? {textDecorationLine: 'line-through'} : {}}>
                                                        {user?.username}
                                                    </Button>
                                                )}
                                            </UserInfoAction>
                                        }
                                    ></Skeleton>
                                </Flex>
                                <Flex align="center" gap="3">
                                    <Text style={{whiteSpace: 'nowrap'}} fz="xs" fw="bold">
                                        Course ID:{' '}
                                    </Text>
                                    <Skeleton
                                        width={155}
                                        height={16}
                                        radius="sm"
                                        loading={isLoading}
                                        component={
                                            <Text truncate fz="xs" fw="600" c="dimmed">
                                                {courseProposalDetails?.id}
                                            </Text>
                                        }
                                    ></Skeleton>
                                </Flex>
                                <Flex align="center" gap="3">
                                    <Text style={{whiteSpace: 'nowrap'}} fz="xs" fw="bold">
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
                                <Flex w="100%">
                                    <TextInput
                                        w="100%"
                                        label="Course URL"
                                        value={courseProposalDetails?.url}
                                        description="This is the course URL provided by the user"
                                        readOnly
                                        disabled
                                        placeholder="Enter course URL"
                                    />
                                </Flex>

                            </Flex>
                            {fetchedProposal &&
                                <form>
                                    <Flex wrap="wrap" gap="xs" direction="column">
                                        <Skeleton
                                            height={36}
                                            radius="sm"
                                            mt={22}
                                            loading={isLoading}
                                            component={
                                                <TextInput
                                                    value={fetchedProposal?.name}
                                                    label="Course Name"
                                                    placeholder="Enter course name"
                                                    onChange={(event) =>
                                                        setFetchedProposal({
                                                            ...fetchedProposal,
                                                            name: event.currentTarget.value,
                                                        })
                                                    }
                                                />
                                            }
                                        ></Skeleton>
                                        <Flex gap="xs" wrap={{base: 'wrap', sm: 'nowrap'}}>
                                            <Flex direction="column" gap="xs" w={{base: '100%', sm: '40%'}}>
                                                <Skeleton
                                                    height={36}
                                                    radius="sm"
                                                    mt={22}
                                                    loading={isLoading}
                                                    component={
                                                        <Autocomplete
                                                            label="Semester"
                                                            placeholder="Select semester"
                                                            data={['2023 S']}
                                                            value={fetchedProposal?.offeredInSemesters[0]}
                                                            onChange={(value) =>
                                                                setFetchedProposal({
                                                                    ...fetchedProposal,
                                                                    offeredInSemesters: [value],
                                                                })
                                                            }
                                                        />
                                                    }
                                                ></Skeleton>
                                                <Skeleton
                                                    height={36}
                                                    radius="sm"
                                                    mt={22}
                                                    loading={isLoading}
                                                    component={
                                                        <TextInput
                                                            value={fetchedProposal?.professor}
                                                            label="Main Professor"
                                                            placeholder="Enter professor name"
                                                            onChange={(event) =>
                                                                setFetchedProposal({
                                                                    ...fetchedProposal,
                                                                    professor: event.currentTarget.value,
                                                                })
                                                            }
                                                        />
                                                    }
                                                ></Skeleton>
                                            </Flex>
                                            <Skeleton
                                                height={104}
                                                radius="sm"
                                                mt={22}
                                                loading={isLoading}
                                                component={
                                                    <PillsInput w={{base: '100%', sm: '100%'}}
                                                                multiline
                                                                label="Other Professors">
                                                        <Pill.Group h={91} style={{alignItems: 'flex-start'}}>
                                                            {fetchedProposal?.otherLecturers.map((lecturer: string) => (
                                                                <Pill
                                                                    key={lecturer}
                                                                    withRemoveButton
                                                                    onRemove={() => {
                                                                        setFetchedProposal({
                                                                            ...fetchedProposal,
                                                                            otherLecturers: fetchedProposal.otherLecturers.filter((l) => l !== lecturer),
                                                                        });
                                                                    }}
                                                                >
                                                                    {lecturer}
                                                                </Pill>
                                                            ))}
                                                            <PillsInput.Field
                                                                onChange={(event) => setNewLecturer(event.currentTarget.value)}
                                                                onKeyDown={(event) => {
                                                                    if (event.key === 'Enter') {
                                                                        if (newLecturer.length <= 3) return;
                                                                        if (fetchedProposal.otherLecturers.includes(newLecturer)) return;
                                                                        setFetchedProposal({
                                                                            ...fetchedProposal,
                                                                            otherLecturers: [...fetchedProposal.otherLecturers, event.currentTarget.value],
                                                                        });
                                                                        setNewLecturer('');
                                                                    }
                                                                }}
                                                                value={newLecturer}
                                                                placeholder=""
                                                            />
                                                        </Pill.Group>
                                                    </PillsInput>
                                                }
                                            ></Skeleton>
                                        </Flex>
                                    </Flex>
                                </form>}
                        </Flex>
                    </Flex>
                    <Flex direction="column" gap="xs" className={classes.expansionActions}>
                        <Flex align="center" gap="xs">
                            <Text fz="sm" fw={500}>
                                Actions
                            </Text>
                        </Flex>
                        <Stack gap="xs">
                            <Divider variant="dashed" size="sm"/>
                            <Button
                                onClick={() => {
                                    if (scrapedData) {
                                        setFetchedProposal(scrapedData);
                                    } else {
                                        scrapeCourse();
                                    }
                                }}
                                loading={scraperIsLoading}
                                leftSection={<IconMasksTheater width={16}/>}
                            >
                                Scrape Course
                            </Button>

                            <Divider variant="dashed" size="sm"/>
                            <Button onClick={() => {
                                acceptProposal(fetchedProposal)
                            }}
                                    loading={acceptProposalPending || scraperIsLoading}
                                    color="green"
                                    leftSection={<IconMoodCheck width={16}/>}
                            >
                                Accept Proposal
                            </Button>
                            <Button
                                onClick={() => {
                                    removeProposal(courseProposalDetails.id);
                                }}
                                loading={acceptProposalPending || scraperIsLoading}
                                leftSection={<IconTrashX width={16}/>}
                                color="red"
                            >
                                Remove Proposal
                            </Button>
                        </Stack>
                    </Flex>
                </>
            )}
        </Flex>
    );
};

export {ProposalExpansion};
