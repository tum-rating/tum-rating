import {ActionIcon, Center, Flex, Group, Pill} from '@mantine/core';
import {IconCircleCheckFilled, IconClick, IconEdit, IconMessage} from "@tabler/icons-react";


export const columns = [
    {
        accessor: 'course',
        title: 'Course name',
        sortable: true,
    },
    {
        accessor: 'offeredInSemesters',
        title: 'Semester',
        sortable: true,
        render: (element) => {
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
        render: (element) => {
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
                <IconClick size={16} />
            </Center>
        ),
        width: '0%', // 👈 use minimal width
        render: ()=> (
            <Group gap={4} justify="right" wrap="nowrap">
                <ActionIcon
                    size="sm"
                    variant="transparent"
                    color="green"
                    onClick={(e) => {
                        e.stopPropagation(); // 👈 prevent triggering the row click function

                    }}
                >
                    <IconCircleCheckFilled size={16} />
                </ActionIcon>
                <ActionIcon
                    size="sm"
                    variant="transparent"
                    onClick={(e) => {
                        e.stopPropagation(); // 👈 prevent triggering the row click function
                    }}
                >
                    <IconEdit size={16} />
                </ActionIcon>
            </Group>
        ),
    },
];

