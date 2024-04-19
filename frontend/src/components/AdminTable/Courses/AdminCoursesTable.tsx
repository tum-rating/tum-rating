import {Badge, Box, Button, Flex, Group, Text} from "@mantine/core";
import {IconFilterX, IconRefresh} from "@tabler/icons-react";
import {DataTable, DataTableProps} from "mantine-datatable";

import {useCoursesColumns} from "./useCoursesColumns.tsx"
import classes from "../Shared/styles/TableStyles.module.css"

import {CourseExpansion} from "@/components/AdminTable/Courses/CourseExpansion.tsx";
import {usePaginatedCourses} from "@/courses/usePaginatedCourses.tsx";

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
        content: ({record}) => <CourseExpansion course={record} editing={false}/>
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
                        <Button
                            variant="light"
                            size="xs"
                            rightSection={<IconFilterX size={16}/>}
                            onClick={() => resetFilters()}>
                            Reset filters
                        </Button>
                    )}
                    <Button
                        variant="light"
                        size="xs"
                        rightSection={<IconRefresh size={16}/>}
                        onClick={() => refetch()}>
                        Refresh
                    </Button>
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