import { useEffect, useState } from 'react';

import { useTableColumns } from '../Shared/useTableColumns';

import { Course } from '@/courses/types.ts';
import { usePaginatedCourses } from '@/courses/usePaginatedCourses.tsx';

export const useCoursesColumns = () => {
    const { data } = usePaginatedCourses();
    const [courses, setCourses] = useState<Course[]>([]);
    const [columns, setColumns] = useState([]);
    const filterableColumns = ['course', 'offeredInSemesters', 'otherLecturers'];

    const { sortState, setSortState, filterState, resetFilters, resetSorting, isAnyFilterActive } = useTableColumns(courses, filterableColumns, setCourses);

    useEffect(() => {
        if (data) {
            const newRecords = data.pages.map((v) => v.courses.map((el) => el)).flat();
            setCourses([...newRecords]);
        }
    }, [data]);

    useEffect(() => {
        setColumns(columnsTemplate());
    }, [filterState, sortState]);

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
    ];

    return {
        data: courses,
        sortStatus: sortState,
        setSortStatus: setSortState,
        columns,
        resetFilters,
        resetSorting,
        isAnyFilterActive,
    };
};
