import {ActionIcon, Code, Flex, rem, Text, Box} from "@mantine/core";
import {useViewportSize} from "@mantine/hooks";
import {IconRefresh} from "@tabler/icons-react";
import {DataTable, DataTableProps} from "mantine-datatable";
import {useEffect, useState} from "react";

import {columns} from "./columns.tsx"

import {Review} from "@/reviews/types.ts";
import {usePaginatedReviews} from "@/reviews/usePaginatedReviews.tsx";


const AdminCoursesTable = () => {
    // const {data, isFetching, refetch} = useCoursesProposals();
    const { data, fetchNextPage, isFetching,refetch } = usePaginatedReviews();
    const { height } = useViewportSize();
    const [records, setRecords] = useState<Review[]>([]);

    useEffect(() => {
        if (data) {
            const newRecords = data.pages.map((v) => v.reviews.map((el) => el)).flat();
            setRecords([...newRecords]);
        }
    }, [data]);

    const loadMoreRecords = () => {
        fetchNextPage().then(() => {});
    };

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
        <Box h={height - 150}>
            <Text fw={600}>
                Courses
            </Text>
            <Flex justify="space-between" align="center" h={50} pr="xs">
                <Flex gap="xs">
                    <Text size="sm" fw={500}>
                        All Proposals:
                    </Text>
                    <Text size="sm" fw={800}>
                        {records.length}
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
                height="100%"
                borderRadius="sm"
                withColumnBorders
                idAccessor='_id'
                striped
                verticalAlign="top"
                pinLastColumn
                columns={columns}
                fetching={isFetching}
                records={records}
                onScrollToBottom={loadMoreRecords}
                rowExpansion={rowExpansion}
            />
        </Box>
    );
}

export {AdminCoursesTable};