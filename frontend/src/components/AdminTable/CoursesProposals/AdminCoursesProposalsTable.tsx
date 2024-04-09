import {ActionIcon, Affix, Badge, Box, Button, Card, Flex, Text, Transition} from "@mantine/core";
import {IconRefresh} from "@tabler/icons-react";
import sortBy from 'lodash/sortBy';
import {DataTable, DataTableProps, DataTableSortStatus} from "mantine-datatable";
import {useEffect, useState} from "react";

import {columns} from "./columns.tsx"

import {CourseProposal} from "@/admin/types.ts";
import {useAcceptProposal} from "@/admin/useAcceptProposal.ts";
import {useCoursesProposals} from "@/admin/useCoursesProposals.ts";
import {ProposalExpansion} from "@/components/AdminTable/CoursesProposals/ProposalExpansion.tsx";

const AdminCoursesProposalsTable = () => {
    const {data, isFetching, refetch} = useCoursesProposals();
    const {mutateAsync: acceptProposal, isPending, isPaused, isSuccess} = useAcceptProposal();
    const [coursesProposals, setCoursesProposals] = useState([]);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [proposalsColumns, setProposalsColumns] = useState([]);
    const [serverMutationProgressOpen, setServerMutationProgressOpen] = useState(false);
    
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus<CourseProposal>>(null);

    useEffect(() => {
        if(data && sortStatus){

            const sortedData = sortBy(data, item => {
                const value = item[sortStatus.columnAccessor];
                if (Array.isArray(value)) {
                    // Change this line to your preferred array comparison logic
                    return value.join('');
                }
                return value;
            }) as CourseProposal[];
            setCoursesProposals(sortStatus.direction === 'desc' ? sortedData.reverse() : sortedData);
        }
    }, [sortStatus]);

    useEffect(() => {
        setProposalsColumns(columns({
            onAccept: (id) => {
                acceptProposal(id);
            },
        }))
    }, []);

    useEffect(() => {
        if (data) {
            setCoursesProposals(data);
        }
    }, [data]);


    const rowExpansion: DataTableProps<any>['rowExpansion'] = {
        allowMultiple: true,
        content: ({record}) => <ProposalExpansion proposal={record} editing={false}/>
    }

    return (
        <Box h="calc(100vh - 240px)">
            <Text fw={600}>
                Courses Proposals
            </Text>
            <Flex justify="space-between" align="center" h={50} pr="xs">
                <Flex gap="xs">
                    <Text size="sm" fw={500}>
                        All Proposals:
                    </Text>
                    <Text size="sm" fw={800}>
                        {coursesProposals.length}
                    </Text>
                </Flex>
                <ActionIcon
                    variant="light"
                    size="xs"
                    onClick={() => refetch()}>
                    <IconRefresh size={16}/>
                </ActionIcon>
            </Flex>
            <DataTable
                withTableBorder
                borderRadius="sm"
                withColumnBorders
                idAccessor='_id'
                striped
                verticalAlign="top"
                pinLastColumn
                columns={proposalsColumns}
                fetching={isFetching}
                records={coursesProposals}
                selectedRecords={selectedRecords}
                onSelectedRecordsChange={setSelectedRecords}
                rowExpansion={rowExpansion}
                sortStatus={sortStatus}
                onSortStatusChange={setSortStatus}
            />
            <Affix position={{bottom: 20, right: "50%"}}>
                <Transition transition="slide-up" duration={0} mounted={selectedRecords.length > 0}>
                    {(transitionStyles) => (
                        <Card shadow="md" padding="xs" radius="md" withBorder
                              style={{...transitionStyles, transform: "translateX(50%)"}}>
                            <Flex gap="xs" align="center">
                                <Badge
                                    fw={900}
                                    variant="light"
                                    size="xl"
                                    radius="md"
                                >

                                    {selectedRecords.length}
                                </Badge>
                                <Button color="green" size="xs" onClick={()=>{
                                    setServerMutationProgressOpen(true)
                                    console.log(selectedRecords)
                                    selectedRecords.forEach((record) => {
                                        // acceptProposal(record._id)
                                    })
                                }}>
                                    Approve selected
                                </Button>
                                <Button size="xs" variant="danger">
                                    Remove selected
                                </Button>
                            </Flex>
                        </Card>
                    )}
                </Transition>
            </Affix>
        </Box>
    );
}

export {AdminCoursesProposalsTable};