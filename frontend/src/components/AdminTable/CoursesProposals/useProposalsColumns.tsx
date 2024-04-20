import { ActionIcon, Center, Flex, Group, Pill } from '@mantine/core';
import { IconCircleCheck, IconClick, IconEdit, IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import { useTableColumns } from '../Shared/useTableColumns';

import { CourseProposal } from '@/admin/types.ts';
import { useAcceptProposal } from '@/admin/useAcceptProposal.tsx';
import { useCoursesProposals } from '@/admin/useCoursesProposals.ts';
import { ColumnFilterCombobox } from '@/components/AdminTable/Shared/ColumnFilterCombobox';

export const useProposalsColumns = () => {
    const { data } = useCoursesProposals();
    const { mutateAsync: acceptProposal } = useAcceptProposal();

    const [coursesProposals, setCoursesProposals] = useState<CourseProposal[]>([]);
    const [columns, setColumns] = useState([]);
    const filterableColumns = ['name', 'offeredInSemesters', 'otherLecturers'];

    const { sortState, setSortState, filterState, setFilter, resetFilters, resetSorting, isAnyFilterActive } = useTableColumns(data, filterableColumns, setCoursesProposals);

    useEffect(() => {
        if (data) {
            setCoursesProposals(data);
            setColumns(columnsTemplate());
        }
    }, [data]);

    useEffect(() => {
        setColumns(columnsTemplate());
    }, [filterState, sortState]);

    const columnsTemplate = () => [
        {
            accessor: 'name',
            title: 'Course name',
            noWrap: false,
            width: '50%',
            filtering: filterState?.name?.selected.length > 0,
            sortable: true,
            filter: (
                <ColumnFilterCombobox
                    label="Courses proposals"
                    description="Filter by course proposals names"
                    data={filterState?.name?.records || []}
                    value={filterState?.name?.selected || []}
                    placeholder="Search proposals…"
                    onChange={(value) => {
                        setFilter('name', value);
                    }}
                    clearable
                    searchable
                />
            ),
        },
        {
            accessor: 'offeredInSemesters',
            title: 'Semester',
            render: (element: CourseProposal) => {
                return (
                    <>
                        <Flex align="center" gap="xs">
                            {element.offeredInSemesters.map((x) => (
                                <Pill>{x}</Pill>
                            ))}
                        </Flex>
                    </>
                );
            },
            sortable: true,
            filtering: filterState?.offeredInSemesters?.selected.length > 0,
            filter: () => {
                return (
                    <ColumnFilterCombobox
                        label="Semesters"
                        description="Filter by semesters"
                        data={filterState?.offeredInSemesters?.records || []}
                        value={filterState?.offeredInSemesters?.selected || []}
                        placeholder="Search semesters…"
                        onChange={(value) => {
                            setFilter('offeredInSemesters', value);
                        }}
                        leftSection={<IconSearch size={16} />}
                        clearable
                        searchable
                    />
                );
            },
        },
        {
            title: 'Lecturer',
            accessor: 'otherLecturers',
            render: (element: CourseProposal) => {
                return (
                    <>
                        <Flex align="center" gap="xs">
                            {element.otherLecturers.map((x) => (
                                <Pill>{x}</Pill>
                            ))}
                        </Flex>
                    </>
                );
            },
            filtering: filterState?.otherLecturers?.selected.length > 0,
            sortable: true,
            filter: (
                <ColumnFilterCombobox
                    label="Lecturers"
                    description="Filter by lecturers names"
                    data={filterState?.otherLecturers?.records || []}
                    value={filterState?.otherLecturers?.selected || []}
                    placeholder="Search lecturers…"
                    onChange={(value) => {
                        setFilter('otherLecturers', value);
                    }}
                    leftSection={<IconSearch size={16} />}
                    clearable
                    searchable
                />
            ),
        },
        {
            accessor: 'actions',
            title: (
                <Center>
                    <IconClick size={16} />
                </Center>
            ),
            width: '0%',
            render: ({ _id }) => {
                return (
                    <Group gap={4} justify="right" wrap="nowrap">
                        <ActionIcon
                            size="sm"
                            color="green"
                            onClick={(e) => {
                                e.stopPropagation();
                                acceptProposal(_id);
                            }}
                        >
                            <IconCircleCheck size={16} />
                        </ActionIcon>
                        <ActionIcon size="sm">
                            <IconEdit size={16} />
                        </ActionIcon>
                    </Group>
                );
            },
        },
    ];

    return {
        data: coursesProposals,
        sortStatus: sortState,
        setSortStatus: setSortState,
        columns,
        filterState,
        resetFilters,
        resetSorting,
        isAnyFilterActive,
    };
};
