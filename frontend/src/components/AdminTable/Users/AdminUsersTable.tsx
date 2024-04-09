import {ActionIcon, Affix, Badge, Box, Button, Card,Flex, rem, Text, Transition} from "@mantine/core";
import {IconRefresh} from "@tabler/icons-react";
import {DataTable, DataTableProps} from "mantine-datatable";
import {useEffect, useMemo, useState} from "react";

import {columns} from "./columns.tsx"

import {useAllUsers} from "@/admin/useAllUsers.ts";

const AdminUsersTable = () => {
    const {data, isFetching, refetch, isFetched} = useAllUsers();
    const [users, setUsers] = useState([]);
    const [selectedRecords, setSelectedRecords] = useState([]);

    useEffect(() => {
        if (isFetched && data?.users){
            console.log(1)
            setUsers(data.users || []);
        }
    }, [data]);


    const rowExpansionContent = useMemo(() => {
        return (
            <Flex direction="column" p="xs" pl={rem(50)}>
                witem
            </Flex>
        );
    }, []);

    const rowExpansion: DataTableProps<any>['rowExpansion'] = {
        allowMultiple: true,
        content: () => rowExpansionContent,
    };

    return (
        <Box h="calc(100vh - 240px)">
            <Text fw={600}>
                Courses Proposals
            </Text>
            <Flex justify="space-between" align="center" h={50} pr="xs">
                <Flex gap="xs">
                    <Text size="sm" fw={500}>
                        All Users:
                    </Text>
                    <Text size="sm" fw={800}>
                        {users.length}
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
                height="100%"
                idAccessor='_id'
                striped
                verticalAlign="top"
                pinLastColumn
                columns={columns}
                fetching={isFetching}
                records={users}
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
                                <Button size="xs">
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

export {AdminUsersTable};