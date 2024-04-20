import {ActionIcon, Badge, Box, Button, Flex, Group, Text} from "@mantine/core";
import {IconFilterX, IconRefresh} from "@tabler/icons-react";
import {DataTable, DataTableProps} from "mantine-datatable";
import {useMemo} from "react";

import {useCoursesColumns} from "./useCoursesColumns.tsx"
import classes from "../Shared/styles/TableStyles.module.css"

import {CourseExpansion} from "@/components/AdminTable/Courses/CourseExpansion.tsx";
import {usePaginatedCourses} from "@/courses/usePaginatedCourses.tsx";


const ExpandedRowContent = ({record, index}) => {
    // Consider this
    return useMemo(() => {
        return <CourseExpansion course={record} editing={false}/>
    }, [record, index]);
};

const AdminCoursesTable = () => {
    const {fetchNextPage, isFetching, refetch} = usePaginatedCourses();
    const {data: courses, columns, resetFilters, isAnyFilterActive} = useCoursesColumns();


    const loadMoreRecords = () => {
        fetchNextPage().then(() => {
        });
    };

    const rowExpansion: DataTableProps<any>['rowExpansion'] = {
        allowMultiple: true,
        collapseProps: {
            transitionDuration: 0,
            animateOpacity: false,
        },
        content: ({record, index}) => <ExpandedRowContent record={record} index={index}/>
    };

    return (
        <Box h="calc(100vh-110px)">
            <Flex justify="space-between" align="center" h={50} px="xs" bg="gray.1">
                <Flex gap="6" align="center">
                    <Badge radius="sm" fw={800} c="white" px={6}>
                        {courses.length}
                    </Badge>
                    <Text fw={600}>
                        Proposals
                    </Text>
                </Flex>
                <Group>
                    {isAnyFilterActive && (
                        <>
                            <Box hiddenFrom="xs">
                                <Button
                                    variant="light"
                                    size="xs"
                                    rightSection={<IconFilterX size={16}/>}
                                    onClick={() => resetFilters()}>
                                    Reset filters
                                </Button>
                            </Box>
                            <Box visibleFrom="xs">
                                <ActionIcon
                                    variant="light"
                                    size="xs"
                                    onClick={() => resetFilters()}>
                                    <IconFilterX size={16}/>
                                </ActionIcon>
                            </Box>
                        </>
                    )}
                    <Box hiddenFrom="xs">
                        <Button
                            variant="light"
                            size="xs"
                            rightSection={<IconRefresh size={16}/>}
                            onClick={() => refetch()}>
                            Refresh
                        </Button>
                    </Box>
                    <Box visibleFrom="xs">
                        <ActionIcon
                            variant="light"
                            size="xs"
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
                fetching={isFetching}
                records={courses}
                className={classes.table}
                onScrollToBottom={loadMoreRecords}
                rowExpansion={rowExpansion}
                columns={columns}
            />
        </Box>
    );
}

export {AdminCoursesTable};