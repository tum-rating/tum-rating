import {ActionIcon, Center, Group} from '@mantine/core';
import {IconCircleCheckFilled, IconClick, IconEdit} from "@tabler/icons-react";
import {useEffect, useState} from "react";

import {useTableColumns} from '../Shared/useTableColumns';

import {Course} from "@/courses/types.ts";
import {usePaginatedCourses} from "@/courses/usePaginatedCourses.tsx";

export const useCoursesColumns = () => {
    const {data} = usePaginatedCourses();
    const [courses, setCourses] = useState<Course[]>([]);
    const [columns, setColumns] = useState([]);
    const filterableColumns = ['course', 'offeredInSemesters', 'otherLecturers']

    const {
        sortState,
        setSortState,
        filterState,
        resetFilters,
        resetSorting,
        isAnyFilterActive
    } = useTableColumns(courses, filterableColumns, setCourses);

    useEffect(() => {
        if (data) {
            const newRecords = data.pages.map((v) => v.courses.map((el) => el)).flat();
            setCourses([...newRecords]);
        }
    }, [data]);


    useEffect(() => {
        setColumns(columnsTemplate());
    }, [filterState, sortState])

    const columnsTemplate = () => [
        {
            accessor: 'name',
            title: 'Course name',
        },
        {
            accessor: 'offeredInSemesters',
            title: 'Semester',
        },
        {
            title: 'Professor',
            accessor: 'professor',
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

    return {
        data: courses,
        sortStatus: sortState,
        setSortStatus: setSortState,
        columns,
        resetFilters,
        resetSorting,
        isAnyFilterActive
    }
};