import {ActionIcon, Affix, Badge, Box, Button, Card, Code, Flex, rem, Text, Transition} from "@mantine/core";
import {IconRefresh} from "@tabler/icons-react";
import {DataTable, DataTableProps} from "mantine-datatable";
import {useEffect, useState} from "react";

import {columns} from "./columns.tsx"

import {useCoursesProposals} from "@/admin/useCoursesProposals.ts";
import {useAcceptProposal} from "@/admin/useAcceptProposal.ts";

const AdminCoursesProposalsTable = () => {
    const {data, isFetching, refetch} = useCoursesProposals();
    const {mutate: acceptProposal} = useAcceptProposal();
    const [coursesProposals, setCoursesProposals] = useState([]);
    const [selectedRecords, setSelectedRecords] = useState([]);
    const [proposalsColumns, setProposalsColumns] = useState([]);


    useEffect(() => {
        setProposalsColumns(columns({
            onAccept: (id) => {
                acceptProposal(id);
            },
            onRemove: (id) => {
                console.log('remove', id);
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
        content: ({record}) => {
            return (
                <Flex direction="column" p="xs" pl={rem(50)}>
                    {Object.entries(record).map(([key, value]) => {
                        return (
                            <Flex key={key} align="center">
                                <Code>{key} :</Code>
                                <Code>{JSON.stringify(value)}</Code>
                            </Flex>
                        );
                    })}
                </Flex>
            )
        },
    };

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
                highlightOnHover
                borderRadius="sm"
                withColumnBorders
                idAccessor='_id'
                striped
                verticalAlign="top"
                pinLastColumn
                columns={proposalsColumns}
                fetching={isFetching}
                records={data}
                selectedRecords={selectedRecords}
                onSelectedRecordsChange={setSelectedRecords}
                rowExpansion={rowExpansion}
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
                                <Button color="green" size="xs">
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