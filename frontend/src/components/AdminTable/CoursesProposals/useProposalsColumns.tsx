import {IconSearch} from '@tabler/icons-react';
import {useEffect, useState} from 'react';

import {useTableColumns} from '../Shared/useTableColumns';

import {CourseProposal} from '@/admin/types.ts';
// import { useAcceptProposal } from '@/admin/useAcceptProposal.tsx';
import {useCoursesProposals} from '@/admin/useCoursesProposals.ts';
import {ColumnFilterCombobox} from '@/components/AdminTable/Shared/ColumnFilterCombobox';

export const useProposalsColumns = () => {
    const {data} = useCoursesProposals();
    // const { mutateAsync: acceptProposal } = useAcceptProposal();
    const [coursesProposals, setCoursesProposals] = useState<CourseProposal[]>([]);
    const [columns, setColumns] = useState([]);
    const filterableColumns = ['userId', 'createdAt'];

    const {
        sortState,
        setSortState,
        filterState,
        setFilter,
        resetFilters,
        resetSorting,
        isAnyFilterActive
    } = useTableColumns(data, filterableColumns, setCoursesProposals);

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
            accessor: 'userId',
            title: 'User Id',
            noWrap: false,
            width: '50%',
            filtering: filterState?.userId?.selected.length > 0,
            sortable: true,
            filter: (
                <ColumnFilterCombobox
                    label="Id of the user"
                    description="Filter by user id"
                    data={filterState?.userId?.records || []}
                    value={filterState?.userId?.selected || []}
                    placeholder="Search user id…"
                    onChange={(value) => {
                        setFilter('userId', value);
                    }}
                    clearable
                    searchable
                />
            ),
        },
        {
            title: 'Created at',
            accessor: 'createdAt',
            render: (element: CourseProposal) => {
                return (
                    <>
                        {new Date(element.createdAt).toLocaleString()}{' '}
                    </>
                );
            },
            filtering: filterState?.createdAt?.selected.length > 0,
            sortable: true,
            filter: (
                <ColumnFilterCombobox
                    label="Created at"
                    description="Filter by created at date"
                    data={filterState?.createdAt?.records || []}
                    value={filterState?.createdAt?.selected || []}
                    placeholder="Search created at…"
                    onChange={(value) => {
                        setFilter('createdAt', value);
                    }}
                    leftSection={<IconSearch size={16}/>}
                    clearable
                    searchable
                />
            ),
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
