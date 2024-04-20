import { Alert, Autocomplete, Button, Center, Divider, Flex, Pill, PillsInput, Stack, Text, TextInput } from '@mantine/core';
import { IconCircleCheck, IconDatabaseX, IconEditCircle, IconTrashX } from '@tabler/icons-react';
import { useState } from 'react';

import classes from '../Shared/styles/ExpansionStyles.module.css';

import { CourseProposal } from '@/admin/types.ts';
import { useAcceptProposal } from '@/admin/useAcceptProposal.tsx';
import { useCourseProposal } from '@/admin/useCourseProposal.tsx';
import { useRemoveProposal } from '@/admin/useRemoveProposal.tsx';
import { UserInfoAction } from '@/components/AdminTable/Shared/UserInfoAction';
import { Skeleton } from '@/components/Skeleton';

interface ProposalExpansionProps {
    proposal: CourseProposal;
    editing: boolean;
}

const ProposalExpansion = ({ proposal: IProposal, editing: IEditing }: ProposalExpansionProps) => {
    const { data: courseProposalDetails, isLoading, error, isError, refetch } = useCourseProposal(IProposal._id);
    const [proposal, setProposal] = useState(IProposal);
    const [editing, setEditing] = useState(IEditing);
    const [newLecturer, setNewLecturer] = useState('');
    const { mutate: acceptProposal } = useAcceptProposal();
    const { mutate: removeProposal } = useRemoveProposal();

    return (
        <Flex wrap={{ base: 'wrap', sm: 'nowrap' }} className={classes.expansionContainer} gap="md">
            {isError ? (
                <Center h={270}>
                    <Flex direction="column">
                        <Text fw={600}>Error occurred - {IProposal._id}</Text>
                        <Alert variant="light" color="red" title="Alert title" icon={<IconDatabaseX height={120} width={120} />}>
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
                                        Course ID:{' '}
                                    </Text>
                                    <Skeleton
                                        width={155}
                                        height={16}
                                        radius="sm"
                                        loading={isLoading}
                                        component={
                                            <Text truncate fz="xs" fw="600" c="dimmed">
                                                {courseProposalDetails?.courseId}
                                            </Text>
                                        }
                                    ></Skeleton>
                                </Flex>
                            </Flex>
                            <form>
                                <Flex wrap="wrap" gap="xs" direction="column">
                                    <Skeleton
                                        height={36}
                                        radius="sm"
                                        mt={22}
                                        loading={isLoading}
                                        component={
                                            <TextInput
                                                disabled={!editing}
                                                value={courseProposalDetails?.name}
                                                label="Course Name"
                                                placeholder="Enter course name"
                                                onChange={(event) =>
                                                    setProposal({
                                                        ...proposal,
                                                        name: event.currentTarget.value,
                                                    })
                                                }
                                            />
                                        }
                                    ></Skeleton>
                                    <Flex gap="xs" wrap={{ base: 'wrap', sm: 'nowrap' }}>
                                        <Flex direction="column" gap="xs" w={{ base: '100%', sm: '40%' }}>
                                            <Skeleton
                                                height={36}
                                                radius="sm"
                                                mt={22}
                                                loading={isLoading}
                                                component={
                                                    <Autocomplete
                                                        disabled={!editing}
                                                        label="Semester"
                                                        placeholder="Select semester"
                                                        data={['2023 S']}
                                                        value={courseProposalDetails?.offeredInSemesters[0]}
                                                        onChange={(value) =>
                                                            setProposal({
                                                                ...proposal,
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
                                                        disabled={!editing}
                                                        value={courseProposalDetails?.professor}
                                                        label="Main Professor"
                                                        placeholder="Enter professor name"
                                                        onChange={(event) =>
                                                            setProposal({
                                                                ...proposal,
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
                                                <PillsInput w={{ base: '100%', sm: '100%' }} disabled={!editing} multiline label="Other Professors">
                                                    <Pill.Group h={91} style={{ alignItems: 'flex-start' }}>
                                                        {courseProposalDetails?.otherLecturers.map((lecturer: string) => (
                                                            <Pill
                                                                disabled={!editing}
                                                                key={lecturer}
                                                                withRemoveButton
                                                                onRemove={() => {
                                                                    setProposal({
                                                                        ...proposal,
                                                                        otherLecturers: proposal.otherLecturers.filter((l) => l !== lecturer),
                                                                    });
                                                                }}
                                                            >
                                                                {lecturer}
                                                            </Pill>
                                                        ))}
                                                        <PillsInput.Field
                                                            disabled={!editing}
                                                            onChange={(event) => setNewLecturer(event.currentTarget.value)}
                                                            onKeyDown={(event) => {
                                                                if (event.key === 'Enter') {
                                                                    if (newLecturer.length <= 3) return;
                                                                    if (proposal.otherLecturers.includes(newLecturer)) return;
                                                                    setProposal({
                                                                        ...proposal,
                                                                        otherLecturers: [...proposal.otherLecturers, event.currentTarget.value],
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
                            </form>
                        </Flex>
                    </Flex>
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
                                    acceptProposal(proposal._id);
                                }}
                                leftSection={<IconCircleCheck width={16} />}
                                color="green"
                            >
                                Accept Proposal
                            </Button>
                            <Button
                                onClick={() => {
                                    removeProposal(proposal._id);
                                }}
                                leftSection={<IconTrashX width={16} />}
                                color="red"
                            >
                                Remove Proposal
                            </Button>
                            <Button
                                color="green"
                                disabled
                                leftSection={<IconEditCircle width={16} />}
                                onClick={() => {
                                    if (editing) {
                                        setEditing(false);
                                    } else {
                                        setEditing(true);
                                    }
                                }}
                                variant="default"
                            >
                                {!editing ? 'Edit Proposal' : 'Save Proposal'}
                            </Button>
                        </Stack>
                    </Flex>
                </>
            )}
        </Flex>
    );
};

export { ProposalExpansion };
