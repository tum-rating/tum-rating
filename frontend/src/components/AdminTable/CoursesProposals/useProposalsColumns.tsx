import {MRT_ColumnDef} from "mantine-react-table";

import {CourseProposal} from "@/admin/types.ts";

export const useProposalsColumns = () => {
    const columns: MRT_ColumnDef<CourseProposal>[] = [
        {
            accessorKey: 'userId',
            header: 'User Id',
        },
        {
            header: 'Created at',
            accessorKey: 'createdAt',
        },
    ];

    return {
        columns,
    };
};
