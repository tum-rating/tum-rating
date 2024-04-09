import {ActionIcon, Center, Flex, Group, Pill} from '@mantine/core';
import {IconCircleCheck, IconClick, IconEdit} from "@tabler/icons-react";

import {CourseProposal} from "@/admin/types.ts";


interface CoursesProposalsTableColumnsProps {
    onAccept?: (id: string) => void;
    onRemove?: (id: string) => void;
}

export const columns = ({onAccept}: CoursesProposalsTableColumnsProps) => [
    {
        accessor: 'course',
        title: 'Course name',
        sortable: true,

    },
    {
        accessor: 'offeredInSemesters',
        title: 'Semester',
        sortable: true,
        render: (element: CourseProposal) => {
            return (
                <>
                    <Flex align="center" gap="xs">
                        {element.offeredInSemesters.map((x) => <Pill>{x}</Pill>)}
                    </Flex>
                </>
            )
        },
    },
    {
        title: 'Lecturer',
        accessor: 'otherLecturers',
        sortable: true,
        render: (element: CourseProposal) => {
            return (
                <>
                    <Flex align="center" gap="xs">
                        {element.otherLecturers.map((x) => <Pill>{x}</Pill>)}
                    </Flex>
                </>
            )
        },
    },
    {
        accessor: 'actions',
        title: (
            <Center>
                <IconClick size={16}/>
            </Center>
        ),
        width: '0%',
        render: ({_id}) => {
            return (
                <Group gap={4} justify="right" wrap="nowrap">
                    <ActionIcon
                        size="sm"
                        variant="transparent"
                        color="green"
                        onClick={(e) => {
                            e.stopPropagation();
                            onAccept(_id);
                        }}
                    >
                        <IconCircleCheck size={16}/>
                    </ActionIcon>
                    <ActionIcon
                        size="sm"
                        variant="transparent"
                    >
                        <IconEdit size={16}/>
                    </ActionIcon>
                </Group>
            )
        },
    },
];

