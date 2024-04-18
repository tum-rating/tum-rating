import {Badge, Box, Button, Flex, Text} from "@mantine/core";
import {IconRefresh} from "@tabler/icons-react";
import {DataTable, DataTableProps} from "mantine-datatable";

import classes from "../Shared/styles/TableStyles.module.css"

import {useCoursesProposals} from "@/admin/useCoursesProposals.ts";
import {ProposalExpansion} from "@/components/AdminTable/CoursesProposals/ProposalExpansion.tsx";
import {useProposalsColumns} from "@/components/AdminTable/CoursesProposals/useProposalsColumns.tsx";

const AdminCoursesProposalsTable = () => {
    const {isFetching, refetch} = useCoursesProposals();
    const {data: coursesProposals, sortStatus, setSortStatus, columns} = useProposalsColumns()
    const rowExpansion: DataTableProps<any>['rowExpansion'] = {
        allowMultiple: true,
        content: ({record}) => <ProposalExpansion proposal={record} editing={false}/>
    }

    return (
        <Box>
            <Flex justify="space-between" align="center" h={50} px="xs" bg="gray.1">
                <Flex gap="4" align="center">
                    <Badge radius="sm" fw={800} c="white" px={6}>
                        {coursesProposals.length}
                    </Badge>
                    <Text fw={600}>
                        Active proposals
                    </Text>
                </Flex>
                <Button
                    variant="light"
                    size="xs"
                    rightSection={<IconRefresh size={16}/>}
                    onClick={() => refetch()}>
                    Refresh
                </Button>
            </Flex>
            <DataTable
                minHeight="calc(100vh-110px)"
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
            {/*temporary disabled*/}
            {/*<Affix position={{bottom: 20, right: "50%"}} style={{display: "none"}}>*/}
            {/*    <Transition transition="slide-up" duration={0} mounted={selectedRecords.length > 0}>*/}
            {/*        {(transitionStyles) => (*/}
            {/*            <Card shadow="md" padding="xs" radius="md" withBorder*/}
            {/*                  style={{...transitionStyles, transform: "translateX(50%)"}}>*/}
            {/*                <Flex gap="xs" align="center">*/}
            {/*                    <Badge*/}
            {/*                        fw={900}*/}
            {/*                        variant="light"*/}
            {/*                        size="xl"*/}
            {/*                        radius="md"*/}
            {/*                    >*/}

            {/*                        {selectedRecords.length}*/}
            {/*                    </Badge>*/}
            {/*                    <Button color="green" size="xs" onClick={async () => {*/}
            {/*                        setServerMutationProgressOpen(true)*/}
            {/*                        setActiveMutations(selectedRecords.map((record) => ({...record, mutationType: "accept-proposal"})))*/}
            {/*                        for (const record of selectedRecords) {*/}
            {/*                            await acceptProposal(record._id).then(()=>{*/}
            {/*                            })*/}
            {/*                        }*/}
            {/*                    }}>*/}
            {/*                        Approve selected*/}
            {/*                    </Button>*/}
            {/*                    <Button size="xs" variant="danger">*/}
            {/*                        Remove selected*/}
            {/*                    </Button>*/}
            {/*                </Flex>*/}
            {/*            </Card>*/}
            {/*        )}*/}
            {/*    </Transition>*/}
            {/*</Affix>*/}
        </Box>
    );
}

export {AdminCoursesProposalsTable};