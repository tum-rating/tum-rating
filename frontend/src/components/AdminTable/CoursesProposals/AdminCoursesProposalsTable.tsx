import {Badge, Box, Button, Flex, Group, Text, ActionIcon} from "@mantine/core";
import {IconFilterX, IconRefresh} from "@tabler/icons-react";
import {DataTable, DataTableProps} from "mantine-datatable";

import classes from "../Shared/styles/TableStyles.module.css"

import {useCoursesProposals} from "@/admin/useCoursesProposals.ts";
import {ProposalExpansion} from "@/components/AdminTable/CoursesProposals/ProposalExpansion.tsx";
import {useProposalsColumns} from "@/components/AdminTable/CoursesProposals/useProposalsColumns.tsx";

const AdminCoursesProposalsTable = () => {
    const {isFetching, refetch} = useCoursesProposals();
    const rowExpansion: DataTableProps<any>['rowExpansion'] = {
        allowMultiple: true,
        collapseProps: {
            transitionDuration: 0,
            animateOpacity: false,
            transitionTimingFunction: 'ease-out',
        },
        content: ({record}) => <ProposalExpansion proposal={record} editing={false}/>
    }
    const {
        data: coursesProposals,
        sortStatus,
        setSortStatus,
        columns,
        resetFilters,
        isAnyFilterActive
    } = useProposalsColumns()
    return (
        <Box h="calc(100vh-110px)">
            <Flex justify="space-between" align="center" h={50} px="xs" bg="gray.1">
                <Flex gap="6" align="center">
                    <Badge radius="sm" fw={800} c="white" px={6}>
                        {coursesProposals.length}
                    </Badge>
                    <Text fw={600}>
                        Active proposals
                    </Text>
                </Flex>
                <Group>
                    {isAnyFilterActive && (
                        <>
                            <Box visibleFrom="xs">
                                <Button
                                    variant="light"
                                    size="xs"
                                    rightSection={<IconFilterX size={16}/>}
                                    onClick={() => resetFilters()}>
                                    Reset filters
                                </Button>
                            </Box>
                            <Box hiddenFrom="xs">
                                <ActionIcon
                                    variant="light"
                                    onClick={() => resetFilters()}>
                                    <IconFilterX size={16}/>
                                </ActionIcon>
                            </Box>
                        </>
                    )}
                    <Box visibleFrom="xs">
                        <Button
                            variant="light"
                            size="xs"
                            rightSection={<IconRefresh size={16}/>}
                            onClick={() => refetch()}>
                            Refresh
                        </Button>
                    </Box>
                    <Box hiddenFrom="xs">
                        <ActionIcon
                            variant="light"
                            onClick={() => refetch()}>
                            <IconRefresh size={16}/>
                        </ActionIcon>
                    </Box>
                </Group>
            </Flex>
            <DataTable
                height={100}
                withTableBorder
                withColumnBorders
                idAccessor='_id'
                striped
                pinLastColumn
                fetching={isFetching}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
                className={classes.table}
                rowExpansion={rowExpansion}
                records={coursesProposals}
                columns={columns}
            />
        </Box>
    );
}

export {AdminCoursesProposalsTable};